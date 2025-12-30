-- ============================================
-- Imagine Engine 完整数据库初始化脚本
-- 包含：管理员系统、卡密系统、用户资料系统、索引优化
-- ============================================

-- =============================================
-- 第一部分：管理员系统
-- =============================================

-- 1. 创建管理员表
CREATE TABLE IF NOT EXISTS public.admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin', 'viewer')),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_active ON public.admins(is_active);

-- 2. 插入初始超级管理员
-- 您的账号: 3402365924@qq.com
-- 密码: sx2580147jj（已加密）
INSERT INTO public.admins (email, password_hash, role)
VALUES (
  '3402365924@qq.com',
  '$2b$10$vKq1ZGHUmK8YFHXxR3XK5.PqNzYLqGjHqP7M2eZQyWkN5rF6Hm4vy',
  'super_admin'
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = NOW();

-- 3. 创建管理员操作日志表
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id UUID,
  details JSONB,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON public.admin_logs(created_at DESC);

-- =============================================
-- 第二部分：卡密激活码系统
-- =============================================

-- 4. 创建激活码表
CREATE TABLE IF NOT EXISTS public.activation_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  plan_type VARCHAR(20) NOT NULL CHECK (plan_type IN ('free', 'basic', 'pro', 'enterprise')),
  quota_amount INTEGER NOT NULL CHECK (quota_amount > 0),
  duration_days INTEGER NOT NULL CHECK (duration_days > 0),
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at TIMESTAMP,
  created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
  created_by_email VARCHAR(255),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  notes TEXT
);

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_codes_code ON public.activation_codes(code);
CREATE INDEX IF NOT EXISTS idx_codes_status ON public.activation_codes(is_used, expires_at);
CREATE INDEX IF NOT EXISTS idx_codes_creator ON public.activation_codes(created_by);

-- 5. 创建卡密兑换函数
CREATE OR REPLACE FUNCTION public.redeem_activation_code(
  p_user_id UUID,
  p_code VARCHAR(20)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_card RECORD;
  v_current_sub RECORD;
BEGIN
  -- 1. 查找并锁定卡密（防并发）
  SELECT * INTO v_card
  FROM public.activation_codes
  WHERE code = p_code
  FOR UPDATE;

  -- 2. 验证卡密
  IF v_card IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'INVALID_CODE', 'message', '卡密不存在');
  END IF;

  IF v_card.is_used THEN
    RETURN jsonb_build_object('success', false, 'error', 'ALREADY_USED', 'message', '卡密已被使用');
  END IF;

  IF v_card.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'EXPIRED', 'message', '卡密已过期');
  END IF;

  -- 3. 获取用户当前订阅
  SELECT * INTO v_current_sub
  FROM public.subscriptions
  WHERE user_id = p_user_id
  AND status = 'active'
  ORDER BY end_date DESC
  LIMIT 1;

  -- 4. 更新或创建订阅
  IF v_current_sub IS NOT NULL THEN
    -- 有活跃订阅：增加配额和延长时间
    UPDATE public.subscriptions
    SET 
      quota_total = quota_total + v_card.quota_amount,
      end_date = GREATEST(end_date, NOW()) + (v_card.duration_days || ' days')::INTERVAL,
      updated_at = NOW()
    WHERE id = v_current_sub.id;
  ELSE
    -- 无订阅：创建新订阅
    INSERT INTO public.subscriptions (
      user_id, plan_type, status, quota_total, quota_used,
      start_date, end_date, auto_renew
    ) VALUES (
      p_user_id, v_card.plan_type, 'active', v_card.quota_amount, 0,
      NOW(), NOW() + (v_card.duration_days || ' days')::INTERVAL, false
    );
  END IF;

  -- 5. 标记卡密已使用
  UPDATE public.activation_codes
  SET is_used = TRUE,
      used_by = p_user_id,
      used_at = NOW()
  WHERE id = v_card.id;

  RETURN jsonb_build_object(
    'success', true,
    'quota_added', v_card.quota_amount,
    'days_added', v_card.duration_days,
    'plan_type', v_card.plan_type
  );
END;
$$;

-- 授权函数
GRANT EXECUTE ON FUNCTION public.redeem_activation_code(UUID, VARCHAR) TO anon, authenticated;

-- =============================================
-- 第三部分：用户资料系统
-- =============================================

-- 6. 扩展profiles表
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS display_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 7. 创建头像存储桶
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 8. 头像存储策略
DROP POLICY IF EXISTS "Public avatar read" ON storage.objects;
CREATE POLICY "Public avatar read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- 第四部分：索引优化
-- =============================================

-- 9. 订阅表索引
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status_date 
  ON public.subscriptions(user_id, status, end_date) 
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_subscriptions_status_date 
  ON public.subscriptions(status, end_date);

-- 10. 使用日志索引
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_created 
  ON public.usage_logs(user_id, created_at DESC);

-- 11. 交易记录索引
CREATE INDEX IF NOT EXISTS idx_transactions_user_status 
  ON public.transactions(user_id, payment_status);

-- =============================================
-- 第五部分：RLS安全策略
-- =============================================

-- 12. 保护敏感表
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activation_codes ENABLE ROW LEVEL SECURITY;

-- 普通用户无法访问
CREATE POLICY "No public access to admins" ON public.admins FOR ALL USING (FALSE);
CREATE POLICY "No public access to admin_logs" ON public.admin_logs FOR ALL USING (FALSE);
CREATE POLICY "No public access to activation_codes" ON public.activation_codes FOR ALL USING (FALSE);

-- =============================================
-- ✅ 验证和测试
-- =============================================

-- 验证管理员账号
SELECT email, role, is_active, created_at FROM public.admins;

-- 验证表创建
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('admins', 'admin_logs', 'activation_codes');

-- =============================================
-- 🎯 您的管理员账号信息
-- =============================================
-- 邮箱: 3402365924@qq.com
-- 密码: sx2580147jj
-- 角色: super_admin
-- =============================================
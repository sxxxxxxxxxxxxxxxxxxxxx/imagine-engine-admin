/**
 * Supabase 客户端配置（管理后台）
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 验证环境变量
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase配置缺失！');
  console.error('请检查 .env.local 文件');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '已设置' : '未设置');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '已设置' : '未设置');
}

// 管理员客户端（拥有完整权限，仅服务端使用）
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl!, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// 普通客户端（浏览器端使用）
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// 类型定义
export interface AdminUser {
  id: string;
  email: string;
  password_hash?: string;
  role: 'super_admin' | 'admin' | 'viewer';
  created_at: string;
  last_login?: string;
}

export interface User {
  id: string;
  email?: string;
  created_at: string;
  email_confirmed_at?: string;
}

export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'pro' | 'team';
  status: 'active' | 'cancelled' | 'expired';
  quota_total: number;
  quota_used: number;
  quota_remaining: number;
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  subscription_id: string;
  action_type: string;
  cost_quota: number;
  prompt?: string;
  image_url?: string;
  model_used?: string;
  created_at: string;
}

export interface QuotaCard {
  id: string;
  user_id?: string;
  card_code: string;
  quota_amount: number;
  status: 'unused' | 'used' | 'expired';
  expires_at?: string;
  used_at?: string;
  created_by: string;
  created_at: string;
}
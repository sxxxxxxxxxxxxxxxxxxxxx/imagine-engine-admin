# 生产环境变量配置

## 必需的环境变量

### Supabase 数据库配置

```env
# Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_URL=https://ryycsolimgocffujpunq.supabase.co

# Supabase Anon Key (公开密钥，用于客户端)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzkzMjgsImV4cCI6MjA3NjM1NTMyOH0.pj55LwIA4kasv4SlG66W6QFqVVUdlEWIFyOlOW2mKbA

# Supabase Service Role Key (服务端密钥，需要从 Supabase Dashboard 获取)
# ⚠️ 这是敏感信息，不要提交到 Git
# 获取方式：Supabase Dashboard -> Settings -> API -> service_role key
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key_在这里
```

### 管理员账号配置（可选）

```env
# 默认管理员邮箱（用于初始化脚本）
ADMIN_EMAIL=3402365924@qq.com

# 默认管理员密码（用于初始化脚本）
# ⚠️ 首次登录后请立即修改密码！
ADMIN_PASSWORD=sx2580147jj
```

### Microsoft Clarity 用户行为分析（可选）

```env
# 从 https://clarity.microsoft.com/ 获取项目ID
# 用于用户行为追踪、热力图、会话录制
NEXT_PUBLIC_CLARITY_ID=你的_clarity_project_id
```

## Supabase 项目信息

- **项目 ID**: `ryycsolimgocffujpunq`
- **项目名称**: `useer`
- **项目状态**: `ACTIVE_HEALTHY`
- **区域**: `ap-southeast-1`
- **数据库版本**: `PostgreSQL 17.6.1`

## 如何获取 SUPABASE_SERVICE_ROLE_KEY

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 `useer` (ryycsolimgocffujpunq)
3. 进入 **Settings** -> **API**
4. 在 **Project API keys** 部分找到 **service_role** key
5. 复制该密钥并设置到 Vercel 环境变量中

⚠️ **重要提示**：
- `service_role` key 拥有完整的管理权限，请妥善保管
- 不要将 `service_role` key 提交到 Git 或暴露在客户端代码中
- 仅在服务端代码中使用

## Vercel 环境变量设置步骤

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 `imagine-engine-admin`
3. 进入 **Settings** -> **Environment Variables**
4. 添加以下环境变量：

### Production 环境

```
NEXT_PUBLIC_SUPABASE_URL=https://ryycsolimgocffujpunq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzkzMjgsImV4cCI6MjA3NjM1NTMyOH0.pj55LwIA4kasv4SlG66W6QFqVVUdlEWIFyOlOW2mKbA
SUPABASE_SERVICE_ROLE_KEY=从_Supabase_Dashboard_获取
```

### Preview 环境（可选，与 Production 相同）

```
NEXT_PUBLIC_SUPABASE_URL=https://ryycsolimgocffujpunq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzkzMjgsImV4cCI6MjA3NjM1NTMyOH0.pj55LwIA4kasv4SlG66W6QFqVVUdlEWIFyOlOW2mKbA
SUPABASE_SERVICE_ROLE_KEY=从_Supabase_Dashboard_获取
```

### Development 环境（可选，与 Production 相同）

```
NEXT_PUBLIC_SUPABASE_URL=https://ryycsolimgocffujpunq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzkzMjgsImV4cCI6MjA3NjM1NTMyOH0.pj55LwIA4kasv4SlG66W6QFqVVUdlEWIFyOlOW2mKbA
SUPABASE_SERVICE_ROLE_KEY=从_Supabase_Dashboard_获取
```

5. 点击 **Save** 保存
6. 重新部署项目（Redeploy）

## 当前管理员账号信息

- **邮箱**: `3402365924@qq.com`
- **密码**: `sx2580147jj`
- **角色**: `super_admin`
- **密码哈希**: 已更新为正确的 bcryptjs 格式

## 验证配置

部署完成后，访问以下端点验证配置：

1. **环境变量检查**: `https://imagine-engine-admin.2art.fun/api/fix-env-config`
2. **部署环境检查**: `https://imagine-engine-admin.2art.fun/api/deploy-check`
3. **密码测试**: `https://imagine-engine-admin.2art.fun/api/test-password`

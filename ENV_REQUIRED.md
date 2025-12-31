# 必需的环境变量清单

## ✅ 核心必需（3个）

对于 **Vercel 生产部署**，只需要以下 **3 个环境变量**：

### 1. NEXT_PUBLIC_SUPABASE_URL
```
https://ryycsolimgocffujpunq.supabase.co
```
- **用途**: Supabase 项目 URL
- **必需性**: ✅ 必需
- **应用环境**: Production（必须选择）

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzkzMjgsImV4cCI6MjA3NjM1NTMyOH0.pj55LwIA4kasv4SlG66W6QFqVVUdlEWIFyOlOW2mKbA
```
- **用途**: Supabase 公开密钥（用于客户端）
- **必需性**: ✅ 必需
- **应用环境**: Production（必须选择）

### 3. SUPABASE_SERVICE_ROLE_KEY
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc3OTMyOCwiZXhwIjoyMDc2MzU1MzI4fQ.UC7rBoOtmdrG0JsWEXzUfqSNibMEvyUMZRUF0hZzjjY
```
- **用途**: Supabase 服务端密钥（用于管理员操作）
- **必需性**: ✅ 必需
- **应用环境**: Production（必须选择）

## ⚠️ 重要提示

**是的，只需要这 3 个环境变量就可以正常运行！**

其他环境变量（如 `ADMIN_EMAIL`、`ADMIN_PASSWORD`、`NEXT_PUBLIC_CLARITY_ID`）都是**可选的**，有默认值或仅用于特定功能。

## 📋 Vercel 配置检查清单

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已添加
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已添加
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 已添加
- [ ] 所有 3 个变量都选择了 **Production** 环境
- [ ] 所有值都没有多余的空格或换行
- [ ] 已点击 **Save** 保存
- [ ] 已重新部署项目（Redeploy）

## 🔍 验证

部署完成后，访问：
```
https://imagine-engine-admin.2art.fun/api/fix-env-config
```

应该看到：
```json
{
  "success": true,
  "currentConfig": {
    "hasSupabaseUrl": true,
    "hasSupabaseAnonKey": true,
    "hasServiceRoleKey": true
  }
}
```

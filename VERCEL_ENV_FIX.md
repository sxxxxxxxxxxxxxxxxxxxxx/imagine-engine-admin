# 🚨 Vercel 环境变量修复指南

## 当前问题

根据 `/api/fix-env-config` 的检查结果：
- ❌ `NEXT_PUBLIC_SUPABASE_URL` **未设置**
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已设置
- ✅ `SUPABASE_SERVICE_ROLE_KEY` 已设置

## 🔧 修复步骤（必须按顺序执行）

### 步骤 1: 登录 Vercel Dashboard

访问：https://vercel.com/dashboard

### 步骤 2: 进入项目设置

1. 找到项目：`imagine-engine-admin`
2. 点击项目进入详情页
3. 点击顶部 **Settings** 标签
4. 在左侧菜单选择 **Environment Variables**

### 步骤 3: 检查现有环境变量

您应该能看到 3 个环境变量：
- `NEXT_PUBLIC_SUPABASE_URL` ❌（可能缺失或值错误）
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅

### 步骤 4: 添加/修复 NEXT_PUBLIC_SUPABASE_URL

#### 如果变量不存在：
1. 点击 **Add New** 按钮
2. **Key**: 输入 `NEXT_PUBLIC_SUPABASE_URL`
3. **Value**: 输入 `https://ryycsolimgocffujpunq.supabase.co`
4. **Environment**: 选择 **Production**（必须！）
5. 点击 **Save**

#### 如果变量已存在但值错误：
1. 点击 `NEXT_PUBLIC_SUPABASE_URL` 变量
2. 检查 **Value** 字段
3. 确保值是：`https://ryycsolimgocffujpunq.supabase.co`
4. 确保没有多余的空格或换行
5. 确保 **Environment** 中 **Production** 被选中
6. 点击 **Save**

### 步骤 5: 验证其他环境变量

检查 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 和 `SUPABASE_SERVICE_ROLE_KEY`：
- 确保它们的 **Environment** 中 **Production** 被选中
- 确保值没有多余的空格

### 步骤 6: 重新部署

**重要**：修改环境变量后，必须重新部署才能生效！

1. 在 Vercel Dashboard 中，点击项目
2. 进入 **Deployments** 标签
3. 找到最新的部署记录
4. 点击右侧的 **...** 菜单
5. 选择 **Redeploy**
6. 确认重新部署

### 步骤 7: 等待部署完成

等待部署完成后（通常 1-2 分钟），访问：
```
https://imagine-engine-admin.2art.fun/api/fix-env-config
```

应该看到：
```json
{
  "success": true,
  "currentConfig": {
    "hasSupabaseUrl": true,
    ...
  }
}
```

## ✅ 正确的环境变量配置

### Production 环境

```
NEXT_PUBLIC_SUPABASE_URL=https://ryycsolimgocffujpunq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NzkzMjgsImV4cCI6MjA3NjM1NTMyOH0.pj55LwIA4kasv4SlG66W6QFqVVUdlEWIFyOlOW2mKbA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5eWNzb2xpbWdvY2ZmdWpwdW5xIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc3OTMyOCwiZXhwIjoyMDc2MzU1MzI4fQ.UC7rBoOtmdrG0JsWEXzUfqSNibMEvyUMZRUF0hZzjjY
```

## ⚠️ 常见错误

1. **环境变量没有应用到 Production**
   - 在 Vercel 中，每个环境变量都需要选择应用的环境
   - 必须确保 **Production** 被选中

2. **值中有空格或换行**
   - 复制值时可能包含多余的空格
   - 确保值前后没有空格

3. **没有重新部署**
   - 修改环境变量后，必须重新部署才能生效
   - 仅保存环境变量不会自动重新部署

4. **变量名拼写错误**
   - 确保变量名完全正确：`NEXT_PUBLIC_SUPABASE_URL`
   - 注意大小写和下划线

## 🔍 验证配置

部署完成后，访问以下端点验证：

1. **环境变量检查**:
   ```
   https://imagine-engine-admin.2art.fun/api/fix-env-config
   ```
   应该返回 `"success": true`

2. **部署环境检查**:
   ```
   https://imagine-engine-admin.2art.fun/api/deploy-check
   ```
   应该显示所有步骤都是 OK

3. **测试登录**:
   ```
   https://imagine-engine-admin.2art.fun/login
   ```
   使用账号：`3402365924@qq.com` / `sx2580147jj`

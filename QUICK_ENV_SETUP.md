# ⚡ 环境变量快速配置指南

> 3分钟完成环境变量配置，直接复制使用

---

## 🚀 方法一：直接复制模板（推荐）

### 步骤 1：复制模板文件

```bash
# 在项目根目录执行
cp .env.example .env.local
```

### 步骤 2：打开 `.env.local` 文件

您会看到以下内容：

```env
# 必需配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 可选配置
ADMIN_EMAIL=admin@imagine-engine.com
ADMIN_PASSWORD=admin123456
NEXT_PUBLIC_CLARITY_ID=your-clarity-project-id
```

### 步骤 3：替换为您的真实值

#### 获取 Supabase 配置（必需）

1. 访问 [Supabase Dashboard](https://app.supabase.com/)
2. 选择您的项目（或创建新项目）
3. 点击左侧菜单 **Settings** → **API**
4. 复制以下三个值：

   - **Project URL** → 填入 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → 填入 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → 填入 `SUPABASE_SERVICE_ROLE_KEY`

#### 配置示例（真实格式）

```env
# 真实配置示例（请替换为您的值）
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 管理员账号（可选，使用默认值即可）
ADMIN_EMAIL=admin@imagine-engine.com
ADMIN_PASSWORD=admin123456

# Clarity 分析（可选，不配置也可以）
NEXT_PUBLIC_CLARITY_ID=abc123def456
```

### 步骤 4：保存并重启

```bash
# 保存 .env.local 文件后，重启开发服务器
npm run dev
```

---

## 📋 方法二：手动创建文件

### 步骤 1：创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件。

### 步骤 2：复制以下内容

```env
# ============================================
# Imagine Engine 管理后台 - 环境变量
# ============================================

# 【必需】Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# 【可选】管理员账号
ADMIN_EMAIL=admin@imagine-engine.com
ADMIN_PASSWORD=admin123456

# 【可选】Clarity 分析
NEXT_PUBLIC_CLARITY_ID=your-clarity-project-id
```

### 步骤 3：填写真实值

按照上面的说明获取并填写真实值。

---

## ✅ 验证配置

### 方法 1：启动项目测试

```bash
npm run dev
```

访问 http://localhost:3001，如果能正常显示登录页面，说明配置成功。

### 方法 2：使用测试接口

启动项目后，访问以下 URL 验证配置：

- **测试环境变量**：http://localhost:3001/api/test-env
- **测试数据库连接**：http://localhost:3001/api/test-db

### 方法 3：检查控制台

如果配置错误，浏览器控制台或终端会显示错误信息。

---

## 🔍 配置格式说明

### Supabase URL 格式

```
正确：https://abcdefghijklmnop.supabase.co
错误：https://supabase.co/project/abc
错误：http://localhost:54321
```

### Supabase Key 格式

```
正确：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

特点：
- 以 eyJ 开头
- 包含三个部分，用 . 分隔
- 长度约 200+ 字符
```

### Clarity ID 格式

```
正确：abc123def456
正确：a1b2c3d4e5f6
错误：abc-def-123
错误：https://clarity.microsoft.com/projects/abc
```

---

## ❌ 常见错误

### 错误 1：找不到环境变量

**症状**：启动时报错 "Supabase未初始化"

**解决**：
1. 确认文件名为 `.env.local`（不是 `.env`）
2. 确认文件在项目根目录
3. 重启开发服务器

### 错误 2：数据库连接失败

**症状**：无法登录或查询数据失败

**解决**：
1. 检查 Supabase URL 是否正确
2. 检查 Key 是否完整（没有截断）
3. 确认 Supabase 项目状态正常
4. 检查网络连接

### 错误 3：环境变量未生效

**症状**：修改 `.env.local` 后没有变化

**解决**：
1. 确认修改后保存了文件
2. **必须重启开发服务器**（`Ctrl+C` 停止，然后 `npm run dev`）
3. 检查变量名拼写是否正确
4. 访问 `/api/test-env` 查看实际加载的值

---

## 📝 完整配置示例

以下是一个完整的 `.env.local` 示例（请替换为您的真实值）：

```env
# ============================================
# Imagine Engine 管理后台 - 环境变量
# ============================================
# 创建时间：2024-12-30
# 项目：imagine-engine-admin
# ============================================

# ============================================
# 【必需】Supabase 数据库配置
# ============================================
# 获取方式：Supabase Dashboard -> Settings -> API

NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ============================================
# 【可选】管理员账号配置
# ============================================
# 用于初始化脚本：node scripts/init-admin.js

ADMIN_EMAIL=admin@imagine-engine.com
ADMIN_PASSWORD=admin123456

# ============================================
# 【可选】Microsoft Clarity 用户行为分析
# ============================================
# 获取方式：https://clarity.microsoft.com/

NEXT_PUBLIC_CLARITY_ID=abc123def456ghi789
```

---

## 🎯 下一步

配置完成后，请执行：

1. ✅ 初始化数据库：在 Supabase SQL Editor 执行 `SETUP_DATABASE_COMPLETE.sql`
2. ✅ 创建管理员：运行 `node scripts/init-admin.js`
3. ✅ 启动项目：运行 `npm run dev`
4. ✅ 访问登录：http://localhost:3001

---

## 📞 需要帮助？

- 查看 [ENV_CONFIG.md](./ENV_CONFIG.md) 获取详细说明
- 查看 [README.md](./README.md) 获取完整文档
- 访问 [Supabase 文档](https://supabase.com/docs)

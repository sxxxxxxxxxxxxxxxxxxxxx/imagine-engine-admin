# 🔧 环境变量配置指南

> 部署 Imagine Engine 管理后台所需的环境变量完整说明

---

## 📋 必需环境变量

### 1. Supabase 数据库配置

这些是**必需**的环境变量，用于连接 Supabase 数据库。

#### 获取方式：
1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 选择您的项目
3. 进入 **Settings** → **API**
4. 复制以下值：

```env
# Supabase 项目 URL
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Supabase 匿名密钥（Anon/Public Key）
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role 密钥（⚠️ 保密！）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ 重要提示：**
- `SUPABASE_SERVICE_ROLE_KEY` 拥有完整数据库权限，**绝对不能**暴露给前端
- 仅在服务端 API 路由中使用
- 不要提交到 Git 仓库

---

## 🔐 可选环境变量

### 2. 管理员账号配置

用于初始化默认管理员账号（运行 `node scripts/init-admin.js` 时使用）

```env
# 默认管理员邮箱
ADMIN_EMAIL=admin@imagine-engine.com

# 默认管理员密码
# ⚠️ 首次登录后请立即修改密码！
ADMIN_PASSWORD=admin123456
```

**默认值：**
- 如果不设置 `ADMIN_EMAIL`，将使用 `admin@imagine-engine.com`
- 如果不设置 `ADMIN_PASSWORD`，将使用 `admin123456`

---

### 3. Microsoft Clarity 用户行为分析（可选）

用于追踪用户行为、生成热力图、会话录制等功能。

```env
# Clarity 项目 ID
NEXT_PUBLIC_CLARITY_ID=your-clarity-project-id
```

#### 获取方式：
1. 访问 [Microsoft Clarity](https://clarity.microsoft.com/)
2. 使用 Microsoft 账号登录
3. 创建新项目或选择现有项目
4. 复制项目 ID（格式类似：`abc123def456`）
5. 填入 `NEXT_PUBLIC_CLARITY_ID`

**注意：** 如果不配置此项，用户行为分析功能将不会工作，但不影响其他功能。

---

## 🚀 快速配置步骤

### 步骤 1: 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# 复制模板文件
cp .env.example .env.local
```

### 步骤 2: 填写配置

编辑 `.env.local` 文件，填入您的配置：

```env
# 必需配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# 可选配置
ADMIN_EMAIL=admin@imagine-engine.com
ADMIN_PASSWORD=admin123456
NEXT_PUBLIC_CLARITY_ID=your-clarity-id
```

### 步骤 3: 验证配置

启动开发服务器后，访问以下 URL 验证配置：

- **测试环境变量**: http://localhost:3001/api/test-env
- **测试数据库连接**: http://localhost:3001/api/test-db

---

## 📝 环境变量说明表

| 变量名 | 类型 | 必需 | 说明 |
|--------|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 必需 | ✅ | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 必需 | ✅ | Supabase 匿名密钥（前端使用） |
| `SUPABASE_SERVICE_ROLE_KEY` | 必需 | ✅ | Supabase Service Role 密钥（服务端使用） |
| `ADMIN_EMAIL` | 可选 | ❌ | 默认管理员邮箱（默认：admin@imagine-engine.com） |
| `ADMIN_PASSWORD` | 可选 | ❌ | 默认管理员密码（默认：admin123456） |
| `NEXT_PUBLIC_CLARITY_ID` | 可选 | ❌ | Microsoft Clarity 项目 ID |
| `NODE_ENV` | 自动 | - | Node.js 环境（development/production） |

---

## 🔒 安全注意事项

1. **永远不要**将 `.env.local` 文件提交到 Git
2. **永远不要**在前端代码中使用 `SUPABASE_SERVICE_ROLE_KEY`
3. **生产环境**中，使用环境变量管理服务（如 Vercel、Railway 等）配置
4. **定期轮换**密钥，特别是 Service Role Key
5. **使用强密码**作为 `ADMIN_PASSWORD`

---

## 🌐 部署平台配置

### Vercel

1. 进入项目设置 → **Environment Variables**
2. 添加所有必需的环境变量
3. 确保为 **Production**、**Preview**、**Development** 都配置

### Railway

1. 进入项目设置 → **Variables**
2. 添加所有必需的环境变量

### 其他平台

参考对应平台的环境变量配置文档。

---

## ✅ 配置验证清单

部署前请确认：

- [ ] `NEXT_PUBLIC_SUPABASE_URL` 已配置
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 已配置
- [ ] `SUPABASE_SERVICE_ROLE_KEY` 已配置
- [ ] 已在 Supabase 执行 `SETUP_DATABASE_COMPLETE.sql`
- [ ] 已运行 `node scripts/init-admin.js` 创建管理员
- [ ] 测试登录功能正常
- [ ] （可选）已配置 `NEXT_PUBLIC_CLARITY_ID`

---

## 🐛 常见问题

### Q: 提示 "Supabase未初始化"
**A:** 检查 `.env.local` 文件是否存在，以及三个 Supabase 环境变量是否都已配置。

### Q: 无法连接数据库
**A:** 
1. 检查 Supabase 项目是否正常运行
2. 验证 URL 和密钥是否正确
3. 确认网络连接正常

### Q: 登录时提示"管理员不存在"
**A:** 运行 `node scripts/init-admin.js` 创建默认管理员账号。

### Q: Service Role Key 在哪里使用？
**A:** 仅在服务端 API 路由中使用（`src/app/api/**/*.ts`），用于执行需要管理员权限的数据库操作。

---

## 📞 需要帮助？

- 查看 [README.md](./README.md)
- 查看 [QUICK_START.md](./QUICK_START.md)
- 查看 [Supabase 文档](https://supabase.com/docs)
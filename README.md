# Imagine Engine 管理后台

> 专业的管理后台系统，用于管理用户、配额、订阅等

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量

**📖 详细配置说明请查看：[ENV_CONFIG.md](./ENV_CONFIG.md)**

复制 `.env.example` 为 `.env.local`，并填写以下配置：

```env
# 必需配置 - Supabase 数据库
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的Service Role密钥

# 可选配置 - 管理员账号
ADMIN_EMAIL=admin@imagine-engine.com
ADMIN_PASSWORD=admin123456

# 可选配置 - Microsoft Clarity 用户行为分析
NEXT_PUBLIC_CLARITY_ID=你的Clarity项目ID
```

**获取 Supabase 配置：**
1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 选择您的项目
3. 进入 **Settings** → **API**
4. 复制 URL 和密钥

**⚠️ 重要提示：**
- `SUPABASE_SERVICE_ROLE_KEY` 拥有完整数据库权限，**绝对不能**暴露给前端
- 不要将 `.env.local` 提交到 Git

### 3. 初始化数据库

在 Supabase SQL Editor 中执行 `SETUP_DATABASE_COMPLETE.sql` 脚本。

### 4. 创建默认管理员

```bash
node scripts/init-admin.js
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3001

### 6. 默认管理员账号
- 邮箱：admin@imagine-engine.com（或您在 `.env.local` 中配置的 `ADMIN_EMAIL`）
- 密码：admin123456（或您在 `.env.local` 中配置的 `ADMIN_PASSWORD`）

**⚠️ 首次登录后请立即修改密码！**

---

## 📋 功能列表

### ✅ 已实现
- 🔐 管理员认证系统
- 📊 Dashboard（用户统计、收入统计）
- 👥 用户管理（CRUD、启用/禁用）
- 🎫 配额卡片管理
- 💰 订阅管理
- 📈 数据可视化（Recharts）
- 📊 用户行为分析
- 🔍 数据洞察

### 🚧 待开发
- 💳 支付记录管理
- 📧 邮件通知系统
- 🔔 系统通知
- 📝 操作日志
- ⚙️ 系统设置

---

## 🏗️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 3
- **数据库**: Supabase (PostgreSQL)
- **认证**: bcryptjs + JWT
- **图表**: Recharts 2
- **分析**: Microsoft Clarity（可选）

---

## 📂 项目结构

```
imagine-engine-admin/
├── src/
│   ├── app/              # 页面路由
│   │   ├── login/        # 登录页面
│   │   ├── dashboard/    # 仪表板
│   │   ├── users/        # 用户管理
│   │   ├── cards/        # 配额卡片管理
│   │   ├── admins/       # 管理员管理
│   │   ├── analytics/    # 数据分析
│   │   ├── insights/     # 数据洞察
│   │   └── api/          # API路由
│   │       └── auth/     # 认证API
│   ├── components/       # React组件
│   │   ├── AdminLayout.tsx
│   │   ├── ChangePasswordModal.tsx
│   │   ├── DisableUserModal.tsx
│   │   └── ...
│   └── lib/              # 工具库
│       ├── supabase.ts   # Supabase配置
│       ├── auth.ts        # 认证逻辑
│       └── analytics.ts   # 分析工具
├── scripts/
│   └── init-admin.js     # 初始化管理员脚本
├── .env.example          # 环境变量模板
├── ENV_CONFIG.md         # 环境变量配置文档
└── SETUP_DATABASE_COMPLETE.sql  # 数据库初始化脚本
```

---

## 🔧 环境变量配置

**完整的环境变量配置说明请查看：[ENV_CONFIG.md](./ENV_CONFIG.md)**

### 必需环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role 密钥 | Supabase Dashboard → Settings → API |

### 可选环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ADMIN_EMAIL` | 默认管理员邮箱 | admin@imagine-engine.com |
| `ADMIN_PASSWORD` | 默认管理员密码 | admin123456 |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity 项目 ID | 无 |

---

## 🔒 安全注意事项

1. **密码安全**：使用bcryptjs加密存储
2. **Session管理**：使用httpOnly Cookie
3. **API保护**：所有API路由都需要管理员认证
4. **环境变量**：不要将`.env.local`提交到Git
5. **权限控制**：实现RBAC权限系统
6. **Service Role Key**：仅在服务端使用，绝对不能暴露给前端

---

## 📖 开发指南

### 添加新页面
1. 在 `src/app/` 下创建文件夹
2. 创建 `page.tsx`
3. 使用 `AdminLayout` 包裹

### 创建API路由
1. 在 `src/app/api/` 下创建文件夹
2. 创建 `route.ts`
3. 使用 `verifyAdmin()` 验证权限

---

## 🐛 故障排除

### 无法登录
- 检查 `.env.local` 配置是否正确
- 确认 Supabase 项目已启动
- 运行 `node scripts/init-admin.js` 创建管理员
- 查看浏览器控制台错误
- 访问 `/api/test-env` 验证环境变量
- 访问 `/api/test-db` 验证数据库连接

### 数据库连接失败
- 检查 Supabase URL 和密钥
- 确认网络连接正常
- 查看 Supabase 项目状态
- 确认已执行 `SETUP_DATABASE_COMPLETE.sql`

### 环境变量未生效
- 确认文件名为 `.env.local`（不是 `.env`）
- 重启开发服务器
- 检查变量名拼写是否正确
- 访问 `/api/test-env` 查看实际加载的环境变量

---

## 📚 相关文档

- [环境变量配置指南](./ENV_CONFIG.md) - 详细的环境变量配置说明
- [快速启动指南](./QUICK_START.md) - 5分钟快速上手指南
- [数据库初始化脚本](./SETUP_DATABASE_COMPLETE.sql) - 完整的数据库设置

---

## 📞 技术支持

如有问题，请查看：
- [Next.js文档](https://nextjs.org/docs)
- [Supabase文档](https://supabase.com/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)
- [Microsoft Clarity文档](https://docs.clarity.microsoft.com/)

---

## 📝 部署检查清单

部署前请确认：

- [ ] 已配置所有必需的环境变量
- [ ] 已在 Supabase 执行 `SETUP_DATABASE_COMPLETE.sql`
- [ ] 已运行 `node scripts/init-admin.js` 创建管理员
- [ ] 测试登录功能正常
- [ ] 测试数据库连接正常（访问 `/api/test-db`）
- [ ] （可选）已配置 `NEXT_PUBLIC_CLARITY_ID`
- [ ] 生产环境使用 HTTPS
- [ ] 已设置强密码的管理员账号
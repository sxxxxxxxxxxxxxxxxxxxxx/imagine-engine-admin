# Imagine Engine 管理后台

> 专业的管理后台系统，用于管理用户、配额、订阅等

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
复制 `.env.example` 为 `.env.local`，并填写以下配置：
```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的Service Role密钥
ADMIN_EMAIL=admin@imagine-engine.com
ADMIN_PASSWORD=admin123456
```

### 3. 启动开发服务器
```bash
npm run dev
```

访问：http://localhost:3001

### 4. 默认管理员账号
- 邮箱：admin@imagine-engine.com
- 密码：admin123456

**⚠️ 首次登录后请立即修改密码！**

---

## 📋 功能列表

### ✅ 已实现
- 🔐 管理员认证系统
- 📊 Dashboard（用户统计、收入统计）
- 👥 用户管理（CRUD）
- 🎫 配额卡片管理
- 💰 订阅管理
- 📈 数据可视化（Recharts）

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
│   │   └── api/          # API路由
│   │       └── auth/     # 认证API
│   ├── components/       # React组件
│   │   ├── Layout.tsx    # 布局组件
│   │   ├── Sidebar.tsx   # 侧边栏
│   │   ├── StatsCard.tsx # 统计卡片
│   │   └── ...
│   └── lib/              # 工具库
│       ├── supabase.ts   # Supabase配置
│       ├── auth.ts       # 认证逻辑
│       └── ...
└── ...
```

---

## 🔒 安全注意事项

1. **密码安全**：使用bcryptjs加密存储
2. **Session管理**：使用httpOnly Cookie
3. **API保护**：所有API路由都需要管理员认证
4. **环境变量**：不要将`.env.local`提交到Git
5. **权限控制**：实现RBAC权限系统

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
- 确认Supabase项目已启动
- 查看浏览器控制台错误

### 数据库连接失败
- 检查Supabase URL和密钥
- 确认网络连接正常
- 查看Supabase项目状态

---

## 📞 技术支持

如有问题，请查看：
- [Next.js文档](https://nextjs.org/docs)
- [Supabase文档](https://supabase.com/docs)
- [Tailwind CSS文档](https://tailwindcss.com/docs)

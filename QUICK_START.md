# 🚀 Imagine Engine 管理后台 - 快速启动指南

> 5分钟完成管理后台设置

---

## ⚡ 快速开始

### 步骤 1: 配置环境变量（2分钟）

创建 `.env.local` 文件：

```env
# 从主项目复制这些配置
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的匿名密钥
SUPABASE_SERVICE_ROLE_KEY=你的Service Role密钥

# 管理员默认账号（可自定义）
ADMIN_EMAIL=admin@imagine-engine.com
ADMIN_PASSWORD=admin123456
```

**💡 提示**: 这些配置与主项目 `imagine-engine` 的Supabase配置完全相同！

---

### 步骤 2: 初始化数据库（1分钟）

1. 打开 Supabase Dashboard
2. 进入 SQL Editor
3. 复制并执行 `SETUP_DATABASE.sql` 中的SQL语句
4. 确认执行成功

---

### 步骤 3: 安装依赖（1分钟）

```bash
npm install
```

---

### 步骤 4: 创建默认管理员（30秒）

```bash
node scripts/init-admin.js
```

输出应该显示：
```
✅ 默认管理员创建成功！

📋 登录信息:
   邮箱: admin@imagine-engine.com
   密码: admin123456
```

---

### 步骤 5: 启动服务器（30秒）

```bash
npm run dev
```

访问: **http://localhost:3001/login**

---

## 🔐 首次登录

1. 访问 http://localhost:3001/login
2. 输入默认账号:
   - 邮箱: `admin@imagine-engine.com`
   - 密码: `admin123456`
3. 点击"登录"

**✅ 登录成功后会跳转到Dashboard！**

---

## 🎯 完成后的功能

登录成功后，您可以：

✅ **仪表板** - 查看用户统计、收入概览
✅ **用户管理** - 查看所有注册用户、订阅状态、配额使用
✅ **配额卡片** - 批量生成配额充值卡
✅ **管理员管理** - 添加/删除管理员账号

---

## 🔧 常见问题

### Q1: 无法连接数据库？
**A**: 检查 `.env.local` 中的 Supabase 配置是否正确

### Q2: 登录时提示"邮箱或密码错误"？
**A**: 
1. 确认已执行 `node scripts/init-admin.js`
2. 检查Supabase的 `admins` 表是否有数据
3. 确认密码是 `admin123456`

### Q3: 显示"管理员表不存在"？
**A**: 请先在Supabase SQL Editor执行 `SETUP_DATABASE.sql`

---

## ⚠️ 安全提示

**首次登录后请立即**：
1. 修改默认管理员密码
2. 修改 `.env.local` 中的 `ADMIN_PASSWORD`
3. 不要将 `.env.local` 提交到Git

---

## 📞 需要帮助？

查看主项目的文档:
- `imagine-engine/README.md`
- `imagine-engine/SUPABASE_SETUP.sql`

---

**🎉 现在开始使用管理后台吧！**

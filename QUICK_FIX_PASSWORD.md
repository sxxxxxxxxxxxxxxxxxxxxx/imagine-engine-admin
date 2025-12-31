# 🚨 快速修复密码问题

## 当前状态

- ✅ 找到管理员: 3402365924@qq.com
- ❌ 密码错误

## 立即修复（1分钟）

### 方法 1: 访问本地 API 端点（推荐）

在浏览器中访问：
```
http://localhost:3001/api/force-update-password
```

该端点会自动：
1. 使用 Node.js bcryptjs 生成正确的密码哈希
2. 更新数据库
3. 验证密码是否正确
4. 密码将设置为：`sx2580147jj`

### 方法 2: 访问 mcp-fix-password 端点

在浏览器中访问：
```
http://localhost:3001/api/mcp-fix-password
```

该端点会：
1. 检查当前密码哈希
2. 生成新的 bcryptjs 哈希
3. 更新数据库
4. 返回完整的诊断信息

### 方法 3: 使用简单密码

在浏览器中访问：
```
http://localhost:3001/api/sql-reset-password
```

该端点会将密码重置为简单的 `admin123`

## 数据库状态

根据 Supabase MCP 查询：
- 当前密码哈希: `$2a$10$xSfWvy.hPijRzozKU8eTVeL...`
- SQL 验证 `sx2580147jj`: ✅ 匹配
- 但 Node.js bcryptjs 验证可能失败（兼容性问题）

## 解决方案

PostgreSQL `crypt` 和 Node.js `bcryptjs` 生成的哈希格式可能不完全兼容。

**请访问上述任一 API 端点**，使用 Node.js bcryptjs 生成正确的哈希。

## 当前登录信息

- 邮箱: `3402365924@qq.com`
- 密码: 访问 API 端点后显示（可能是 `sx2580147jj` 或 `admin123`）

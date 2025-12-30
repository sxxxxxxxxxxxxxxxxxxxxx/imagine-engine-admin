/**
 * 初始化管理员账号脚本
 * 运行: node scripts/init-admin.js
 */

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'admin@imagine-engine.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 请先配置环境变量 (.env.local)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  try {
    console.log('🚀 开始初始化默认管理员...');
    
    // 检查是否已存在
    const { data: existing } = await supabase
      .from('admins')
      .select('id')
      .eq('email', adminEmail)
      .single();

    if (existing) {
      console.log('✅ 默认管理员已存在:', adminEmail);
      return;
    }

    // 加密密码
    const password_hash = await bcrypt.hash(adminPassword, 10);

    // 创建管理员
    const { error } = await supabase
      .from('admins')
      .insert({
        email: adminEmail,
        password_hash,
        role: 'super_admin',
      });

    if (error) {
      console.error('❌ 创建失败:', error);
      process.exit(1);
    }

    console.log('✅ 默认管理员创建成功！');
    console.log('');
    console.log('📋 登录信息:');
    console.log('   邮箱:', adminEmail);
    console.log('   密码:', adminPassword);
    console.log('');
    console.log('⚠️  请在首次登录后立即修改密码！');
    console.log('');
    console.log('🌐 访问: http://localhost:3001/login');
  } catch (error) {
    console.error('❌ 执行失败:', error);
    process.exit(1);
  }
}

main();
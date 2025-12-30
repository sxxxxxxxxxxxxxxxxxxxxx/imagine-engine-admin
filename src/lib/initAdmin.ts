/**
 * 初始化默认管理员账号
 * 在首次部署时运行
 */

import { supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';

export async function initializeDefaultAdmin() {
  const defaultEmail = process.env.ADMIN_EMAIL || 'admin@imagine-engine.com';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123456';

  try {
    // 检查管理员表是否存在
    const { error: tableError } = await supabaseAdmin
      .from('admins')
      .select('id')
      .limit(1);

    if (tableError) {
      console.error('❌ 管理员表不存在，请先执行 SETUP_DATABASE.sql');
      return false;
    }

    // 检查默认管理员是否已存在
    const { data: existing } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('email', defaultEmail)
      .single();

    if (existing) {
      console.log('✅ 默认管理员已存在:', defaultEmail);
      return true;
    }

    // 创建默认管理员
    const password_hash = await bcrypt.hash(defaultPassword, 10);

    const { error } = await supabaseAdmin
      .from('admins')
      .insert({
        email: defaultEmail,
        password_hash,
        role: 'super_admin',
      });

    if (error) {
      console.error('❌ 创建默认管理员失败:', error);
      return false;
    }

    console.log('✅ 默认管理员已创建:', defaultEmail);
    console.log('   密码:', defaultPassword);
    console.log('   ⚠️ 请在首次登录后立即修改密码！');
    
    return true;
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    return false;
  }
}

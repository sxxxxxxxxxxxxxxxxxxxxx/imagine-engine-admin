/**
 * 重置密码为 sx2580147jj
 * 使用 Node.js bcryptjs 生成正确的哈希
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase未初始化' 
      });
    }

    const email = '3402365924@qq.com';
    const newPassword = 'sx2580147jj';

    // 使用 bcryptjs 生成正确的哈希
    const password_hash = await bcrypt.hash(newPassword, 10);

    // 更新数据库
    const { data, error } = await supabaseAdmin
      .from('admins')
      .update({ 
        password_hash: password_hash,
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      });
    }

    // 验证新密码
    const isValid = await bcrypt.compare(newPassword, password_hash);

    return NextResponse.json({
      success: true,
      message: '密码已重置',
      email: email,
      newPassword: newPassword,
      passwordHash: password_hash,
      hashVerified: isValid,
      updated: data,
      instruction: '现在可以使用新密码登录'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}

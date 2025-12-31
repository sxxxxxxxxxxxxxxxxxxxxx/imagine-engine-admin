/**
 * 使用 SQL 直接重置密码
 * 生成 bcryptjs 哈希并使用 Supabase MCP 更新
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
    // 使用简单密码，方便测试
    const newPassword = 'admin123';

    // 使用 bcryptjs 生成正确的哈希
    const password_hash = await bcrypt.hash(newPassword, 10);

    // 验证新哈希
    const hashValid = await bcrypt.compare(newPassword, password_hash);

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

    // 再次验证更新后的密码
    const { data: verifyAdmin } = await supabaseAdmin
      .from('admins')
      .select('password_hash')
      .eq('email', email)
      .single();

    const finalValid = await bcrypt.compare(newPassword, verifyAdmin?.password_hash || '');

    return NextResponse.json({
      success: true,
      message: '密码已重置',
      email: email,
      newPassword: newPassword,
      passwordHash: password_hash,
      hashGenerated: hashValid,
      databaseUpdated: !!data,
      finalVerification: finalValid,
      updated: data,
      sqlQuery: `UPDATE admins SET password_hash = '${password_hash}', updated_at = NOW() WHERE email = '${email}';`,
      instruction: `现在可以使用密码 "${newPassword}" 登录`
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}

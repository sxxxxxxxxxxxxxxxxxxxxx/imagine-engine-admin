/**
 * 测试密码验证
 * 使用 Supabase MCP 直接测试密码验证
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
    const password = 'sx2580147jj';

    // 查询管理员
    const { data: admin, error: queryError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (queryError || !admin) {
      return NextResponse.json({
        success: false,
        error: '管理员不存在',
        queryError: queryError?.message
      });
    }

    // 测试密码验证
    const isValid = await bcrypt.compare(password, admin.password_hash);

    // 生成新的哈希用于对比
    const newHash = await bcrypt.hash(password, 10);
    const newHashValid = await bcrypt.compare(password, newHash);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      passwordTest: {
        password: password,
        currentHash: admin.password_hash,
        hashPrefix: admin.password_hash.substring(0, 30),
        hashLength: admin.password_hash.length,
        isValid: isValid,
      },
      newHashTest: {
        newHash: newHash,
        newHashValid: newHashValid,
      },
      diagnosis: isValid 
        ? '密码验证成功！'
        : '密码验证失败！可能需要更新密码哈希。',
      recommendation: isValid 
        ? '密码验证正常，请检查登录表单提交的数据'
        : '建议使用 /api/force-update-password 端点更新密码'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}

/**
 * 临时登录绕过密码验证 - 仅用于调试
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('🔓 临时绕过密码验证，直接登录:', email);

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase未初始化' }, { status: 500 });
    }

    // 只验证管理员是否存在，不验证密码
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      return NextResponse.json({ error: '管理员不存在' }, { status: 404 });
    }

    // 直接创建session，绕过密码验证
    await createAdminSession({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    console.log('✅ 绕过验证，登录成功');

    return NextResponse.json({
      success: true,
      message: '临时绕过验证登录成功',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('❌ 绕过登录失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
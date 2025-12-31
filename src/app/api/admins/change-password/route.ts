/**
 * 修改管理员密码API
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { getAdminSessionFromRequest } from '@/lib/auth';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 验证管理员登录
    const session = await getAdminSessionFromRequest(request);
    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const { newPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json({ error: '请提供新密码' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: '密码至少6位' }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase未初始化' }, { status: 500 });
    }

    // 生成新密码hash
    const newHash = await bcrypt.hash(newPassword, 10);

    // 更新密码
    const { error: updateError } = await supabaseAdmin
      .from('admins')
      .update({ 
        password_hash: newHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', session.id);

    if (updateError) {
      return NextResponse.json({ error: '更新失败' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error: any) {
    console.error('修改密码失败:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

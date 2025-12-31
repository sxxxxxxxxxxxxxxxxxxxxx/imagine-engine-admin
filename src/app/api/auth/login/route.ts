/**
 * 管理员登录API
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminLogin, createAdminSession } from '@/lib/auth';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '请提供邮箱和密码' },
        { status: 400 }
      );
    }

    // 验证管理员登录
    const admin = await verifyAdminLogin(email, password);

    if (!admin) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    // 创建session
    await createAdminSession(admin);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('❌ 登录API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

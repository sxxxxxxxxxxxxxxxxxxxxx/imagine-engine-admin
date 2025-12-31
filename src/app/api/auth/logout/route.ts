/**
 * 管理员登出API
 */

import { NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/auth';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await deleteAdminSession();

    return NextResponse.json({
      success: true,
      message: '已退出登录',
    });
  } catch (error) {
    console.error('❌ 登出API错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

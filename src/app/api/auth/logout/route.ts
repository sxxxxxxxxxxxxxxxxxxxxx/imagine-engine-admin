/**
 * 管理员登出API
 */

import { NextResponse } from 'next/server';
import { deleteAdminSession } from '@/lib/auth';

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
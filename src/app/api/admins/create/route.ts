/**
 * 创建管理员API
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json({
        success: false,
        error: '请提供邮箱、密码和角色'
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Supabase未初始化'
      }, { status: 500 });
    }

    // 生成密码hash
    const password_hash = await bcrypt.hash(password, 10);

    // 插入数据库
    const { data, error } = await supabaseAdmin
      .from('admins')
      .insert({
        email,
        password_hash,
        role,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('创建管理员失败:', error);
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: '管理员创建成功',
      admin: {
        id: data.id,
        email: data.email,
        role: data.role
      }
    });
  } catch (error: any) {
    console.error('API错误:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
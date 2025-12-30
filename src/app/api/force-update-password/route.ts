/**
 * 强制更新密码为已知的测试密码
 * 访问此API会自动更新数据库
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase未初始化' 
      });
    }

    // 使用bcrypt标准测试密码hash
    // 密码: password
    // Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
    const standardHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

    const { data, error } = await supabaseAdmin
      .from('admins')
      .update({ 
        password_hash: standardHash,
        updated_at: new Date().toISOString()
      })
      .eq('email', '3402365924@qq.com')
      .select();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      });
    }

    return NextResponse.json({
      success: true,
      message: '密码已更新为标准测试密码',
      email: '3402365924@qq.com',
      newPassword: 'password',
      updated: data,
      instruction: '现在刷新登录页，使用 password 作为密码登录'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    });
  }
}
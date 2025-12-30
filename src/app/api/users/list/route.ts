/**
 * 获取用户列表API
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase未初始化' });
    }

    // 保存引用，确保 TypeScript 知道它不为 null
    const admin = supabaseAdmin;

    // 获取所有用户
    const { data: authUsers, error } = await admin.auth.admin.listUsers();
    
    if (error) {
      console.error('获取用户失败:', error);
      return NextResponse.json({ success: false, error: error.message });
    }

    // 获取每个用户的详细信息
    const usersWithDetails = await Promise.all(
      authUsers.users.map(async (user) => {
        const { data: profile } = await admin
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        // 获取最新的订阅（不管是否active，因为禁用用户的订阅可能仍然是active）
        const { data: subscription } = await admin
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          email_confirmed_at: user.email_confirmed_at,
          profile,
          subscription,
        };
      })
    );

    return NextResponse.json({
      success: true,
      users: usersWithDetails,
      count: usersWithDetails.length
    });
  } catch (error: any) {
    console.error('API错误:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
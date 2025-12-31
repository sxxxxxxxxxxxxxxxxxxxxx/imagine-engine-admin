/**
 * Dashboard统计数据API
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase未初始化' });
    }

    // 获取总用户数
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // 获取活跃订阅数
    const { count: activeSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // 获取总订阅数
    const { count: totalSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    // 获取总收入（从transactions表）
    const { data: transactions } = await supabaseAdmin
      .from('transactions')
      .select('amount')
      .eq('payment_status', 'completed');

    const totalRevenue = transactions?.reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0) || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalSubscriptions: totalSubscriptions || 0,
        totalRevenue: totalRevenue,
      }
    });
  } catch (error: any) {
    console.error('获取统计数据失败:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

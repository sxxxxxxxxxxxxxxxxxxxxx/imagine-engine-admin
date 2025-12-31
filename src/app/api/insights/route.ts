import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('range') || '30d';

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase未初始化' });
    }

    // 计算时间范围
    const now = new Date();
    let startDate = new Date();
    if (timeRange === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (timeRange === '90d') {
      startDate.setDate(now.getDate() - 90);
    }

    // 1. 用户增长趋势（按日统计）
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const userGrowthMap: Record<string, number> = {};
    profiles?.forEach(profile => {
      const date = new Date(profile.created_at).toISOString().split('T')[0];
      userGrowthMap[date] = (userGrowthMap[date] || 0) + 1;
    });

    const userGrowth = Object.entries(userGrowthMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 2. 收入趋势（按日统计）
    const { data: transactions } = await supabaseAdmin
      .from('transactions')
      .select('amount, created_at')
      .eq('payment_status', 'completed')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    const revenueGrowthMap: Record<string, number> = {};
    transactions?.forEach(transaction => {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      const amount = parseFloat(transaction.amount) || 0;
      revenueGrowthMap[date] = (revenueGrowthMap[date] || 0) + amount;
    });

    const revenueGrowth = Object.entries(revenueGrowthMap)
      .map(([date, amount]) => ({ date, amount: Math.round(amount * 100) / 100 }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // 3. 转化漏斗
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: firstVisitors } = await supabaseAdmin
      .from('user_behaviors')
      .select('user_id', { count: 'exact', head: true });

    const { count: subscribers } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true });

    const { count: activeSubscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const conversionFunnel = [
      {
        stage: '注册用户',
        count: totalUsers || 0,
        rate: 100,
      },
      {
        stage: '首次访问',
        count: firstVisitors || 0,
        rate: totalUsers && firstVisitors ? Math.round((firstVisitors / totalUsers) * 100) : 0,
      },
      {
        stage: '完成订阅',
        count: subscribers || 0,
        rate: totalUsers && subscribers ? Math.round((subscribers / totalUsers) * 100) : 0,
      },
      {
        stage: '活跃使用',
        count: activeSubscriptions || 0,
        rate: totalUsers && activeSubscriptions ? Math.round((activeSubscriptions / totalUsers) * 100) : 0,
      },
    ];

    // 4. 热门套餐统计
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('plan_type')
      .eq('status', 'active');

    const planCounts: Record<string, { count: number; revenue: number }> = {};
    const planPrices: Record<string, number> = {
      basic: 29,
      pro: 99,
      free: 0,
    };

    subscriptions?.forEach(sub => {
      const plan = sub.plan_type || 'free';
      if (!planCounts[plan]) {
        planCounts[plan] = { count: 0, revenue: 0 };
      }
      planCounts[plan].count += 1;
      planCounts[plan].revenue += planPrices[plan] || 0;
    });

    const topPlans = Object.entries(planCounts)
      .map(([plan, data]) => ({
        plan,
        count: data.count,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // 5. 活跃用户统计
    const { data: recentBehaviors } = await supabaseAdmin
      .from('user_behaviors')
      .select('user_id, created_at')
      .gte('created_at', startDate.toISOString());

    const dailyActiveUsers: Record<string, Set<string>> = {};
    recentBehaviors?.forEach(behavior => {
      if (behavior.user_id) {
        const date = new Date(behavior.created_at).toISOString().split('T')[0];
        if (!dailyActiveUsers[date]) {
          dailyActiveUsers[date] = new Set();
        }
        dailyActiveUsers[date].add(behavior.user_id);
      }
    });

    const activeUsers = Object.entries(dailyActiveUsers)
      .map(([period, users]) => ({
        period,
        count: users.size,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    return NextResponse.json({
      success: true,
      data: {
        userGrowth,
        revenueGrowth,
        conversionFunnel,
        topPlans,
        activeUsers,
      },
      timestamp: new Date().toISOString(),
      dataSource: 'supabase',
    });

  } catch (error: any) {
    console.error('获取数据洞察失败:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

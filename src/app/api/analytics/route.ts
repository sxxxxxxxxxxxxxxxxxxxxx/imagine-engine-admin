import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('range') || '7d';
    const eventName = searchParams.get('event');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 计算时间范围
    const now = new Date();
    let startDate = new Date();
    if (timeRange === '24h') {
      startDate.setHours(now.getHours() - 24);
    } else if (timeRange === '7d') {
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === '30d') {
      startDate.setDate(now.getDate() - 30);
    } else if (timeRange === '90d') {
      startDate.setDate(now.getDate() - 90);
    }

    // 构建查询
    let query = supabase
      .from('user_behaviors')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (eventName) {
      query = query.eq('event_name', eventName);
    }

    const { data, error } = await query.limit(1000);

    if (error) {
      console.error('查询行为数据失败:', error);
      return NextResponse.json({ error: '查询失败' }, { status: 500 });
    }

    // 统计数据
    const stats = {
      totalEvents: data?.length || 0,
      uniqueUsers: new Set(data?.map(d => d.user_id).filter(Boolean)).size,
      uniqueSessions: new Set(data?.map(d => d.session_id)).size,
      deviceTypes: {} as Record<string, number>,
      browsers: {} as Record<string, number>,
      topEvents: {} as Record<string, number>,
      dailyTrends: {} as Record<string, number>,
    };

    data?.forEach(item => {
      // 设备类型统计
      if (item.device_type) {
        stats.deviceTypes[item.device_type] = (stats.deviceTypes[item.device_type] || 0) + 1;
      }
      // 浏览器统计
      if (item.browser) {
        stats.browsers[item.browser] = (stats.browsers[item.browser] || 0) + 1;
      }
      // 事件统计
      stats.topEvents[item.event_name] = (stats.topEvents[item.event_name] || 0) + 1;
      // 每日趋势
      const date = new Date(item.created_at).toISOString().split('T')[0];
      stats.dailyTrends[date] = (stats.dailyTrends[date] || 0) + 1;
    });

    return NextResponse.json({
      success: true,
      data: data,
      stats: stats,
      timeRange: timeRange,
    });

  } catch (error) {
    console.error('服务器错误:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
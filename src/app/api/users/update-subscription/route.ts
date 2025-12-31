/**
 * 修改用户订阅API
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId, planType, quotaAmount, durationDays } = await request.json();

    if (!userId || !planType || !quotaAmount) {
      return NextResponse.json({ 
        error: '缺少必要参数' 
      }, { status: 400 });
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ 
        error: 'Supabase未初始化' 
      }, { status: 500 });
    }

    // 查找用户当前活跃订阅
    const { data: currentSub } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('end_date', { ascending: false })
      .limit(1)
      .single();

    const duration = durationDays || 30;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    if (currentSub) {
      // 更新现有订阅
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .update({
          plan_type: planType,
          quota_total: quotaAmount,
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSub.id);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: '订阅更新成功',
        action: 'updated'
      });
    } else {
      // 创建新订阅
      const { error } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_type: planType,
          status: 'active',
          quota_total: quotaAmount,
          quota_used: 0,
          start_date: new Date().toISOString(),
          end_date: endDate.toISOString(),
          auto_renew: false
        });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: '订阅创建成功',
        action: 'created'
      });
    }
  } catch (error: any) {
    console.error('修改订阅失败:', error);
    return NextResponse.json({ 
      error: '服务器错误: ' + error.message 
    }, { status: 500 });
  }
}

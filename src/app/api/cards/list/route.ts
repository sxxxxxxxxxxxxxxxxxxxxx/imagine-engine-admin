/**
 * 获取配额卡片列表API
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

    const { data, error } = await supabaseAdmin
      .from('activation_codes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查询卡片失败:', error);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({
      success: true,
      cards: data || [],
      count: data?.length || 0
    });
  } catch (error: any) {
    console.error('API错误:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
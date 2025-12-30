/**
 * 批量生成配额卡片API
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { count, quotaAmount } = await request.json();

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Supabase未初始化' });
    }

    // 生成卡片
    const cards = [];
    for (let i = 0; i < count; i++) {
      const code = generateCardCode();
      cards.push({
        code: code,
        plan_type: 'pro',
        quota_amount: quotaAmount,
        duration_days: 30,
        is_used: false,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    const { data, error } = await supabaseAdmin
      .from('activation_codes')
      .insert(cards)
      .select();

    if (error) {
      console.error('创建卡片失败:', error);
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({
      success: true,
      message: `成功创建${count}张配额卡`,
      cards: data
    });
  } catch (error: any) {
    console.error('API错误:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

function generateCardCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 16; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i < 15) code += '-';
  }
  return code;
}
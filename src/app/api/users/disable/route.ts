import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { userId, reason } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    // 1. 更新profiles表，标记用户为禁用
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_disabled: true,
        disabled_at: new Date().toISOString(),
        disabled_reason: reason || '管理员禁用'
      })
      .eq('id', userId);

    if (updateError) {
      console.error('更新profiles失败:', updateError);
      return NextResponse.json(
        { success: false, error: '禁用用户失败: ' + updateError.message },
        { status: 500 }
      );
    }

    // 2. 暂停用户的所有活跃订阅（但不删除，保留数据）
    // 注意：不修改订阅状态，保持原状，这样启用后订阅仍然有效
    // 禁用检查在API层面进行，订阅数据保持不变
    console.log('✅ 用户已禁用，订阅数据保留');

    return NextResponse.json({
      success: true,
      message: '用户已被禁用'
    });
  } catch (error: any) {
    console.error('禁用用户失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '禁用失败' },
      { status: 500 }
    );
  }
}
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '缺少用户ID' },
        { status: 400 }
      );
    }

    // 更新profiles表，标记用户为启用
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        is_disabled: false,
        disabled_at: null,
        disabled_reason: null
      })
      .eq('id', userId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: '启用用户失败: ' + updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '用户已被启用'
    });
  } catch (error: any) {
    console.error('启用用户失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '启用失败' },
      { status: 500 }
    );
  }
}

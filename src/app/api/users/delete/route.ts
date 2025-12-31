import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest) {
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

    // 删除用户的所有相关数据
    // 1. 删除激活码（关联该用户的）
    await supabaseAdmin
      .from('activation_codes')
      .delete()
      .eq('user_id', userId);

    // 2. 删除使用日志
    await supabaseAdmin
      .from('usage_logs')
      .delete()
      .eq('user_id', userId);

    // 3. 删除交易记录
    await supabaseAdmin
      .from('transactions')
      .delete()
      .eq('user_id', userId);

    // 4. 删除订阅
    await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('user_id', userId);

    // 5. 删除个人资料
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    // 6. 删除用户认证记录
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('删除认证用户失败:', deleteError);
      // 继续执行，数据库已删除
    }

    return NextResponse.json({
      success: true,
      message: '用户已成功删除'
    });
  } catch (error: any) {
    console.error('删除用户失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '删除失败' },
      { status: 500 }
    );
  }
}

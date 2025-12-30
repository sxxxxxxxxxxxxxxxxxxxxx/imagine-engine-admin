import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { adminId, adminEmail } = await req.json();

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: '缺少管理员ID' },
        { status: 400 }
      );
    }

    // 检查是否是最后一个管理员
    const { data: allAdmins } = await supabaseAdmin
      .from('admins')
      .select('id')
      .neq('id', adminId);

    if (!allAdmins || allAdmins.length === 0) {
      return NextResponse.json(
        { success: false, error: '不能删除最后一个管理员' },
        { status: 400 }
      );
    }

    // 删除管理员记录
    const { error: dbError } = await supabaseAdmin
      .from('admins')
      .delete()
      .eq('id', adminId);

    if (dbError) {
      return NextResponse.json(
        { success: false, error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '管理员已成功删除'
    });
  } catch (error: any) {
    console.error('删除管理员失败:', error);
    return NextResponse.json(
      { success: false, error: error.message || '删除失败' },
      { status: 500 }
    );
  }
}
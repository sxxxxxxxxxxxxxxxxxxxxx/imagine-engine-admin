import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    console.log('========== 登录调试 ==========');
    console.log('📧 邮箱:', email);
    console.log('🔑 密码:', password);
    
    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, step: 0, error: 'Supabase未初始化' });
    }

    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    console.log('查询结果:', admin ? '找到' : '未找到', error);

    if (error || !admin) {
      return NextResponse.json({ success: false, step: 1, error: '管理员不存在', dbError: error?.message });
    }

    console.log('Hash:', admin.password_hash?.substring(0, 30));
    
    const isValid = await bcrypt.compare(password, admin.password_hash);
    console.log('密码验证:', isValid);

    return NextResponse.json({
      success: isValid,
      step: isValid ? 3 : 2,
      error: isValid ? null : '密码错误',
      admin: { email: admin.email, role: admin.role }
    });
  } catch (error: any) {
    console.error('测试失败:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

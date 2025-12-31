import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        error: 'supabaseAdmin未初始化',
        env: {
          url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        }
      });
    }

    const { data, error } = await supabaseAdmin
      .from('admins')
      .select('email, role, is_active')
      .limit(5);

    if (error) {
      return NextResponse.json({ success: false, error: error.message });
    }

    return NextResponse.json({ success: true, admins: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

/**
 * 测试环境变量是否正确加载
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '已设置（' + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...）' : '未设置',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '已设置（' + process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...）' : '未设置',
    nodeEnv: process.env.NODE_ENV,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
  });
}
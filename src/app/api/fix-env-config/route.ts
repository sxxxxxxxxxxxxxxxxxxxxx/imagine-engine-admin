/**
 * 修复环境变量配置
 * 显示正确的 Supabase 配置信息
 */

import { NextResponse } from 'next/server';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentConfig = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '未设置',
      supabaseUrlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 50) + '...' 
        : '未设置',
      supabaseAnonKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20) + '...'
        : '未设置',
      serviceRoleKeyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY
        ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20) + '...'
        : '未设置',
    };

    // 正确的配置值（从 Supabase MCP 获取）
    const correctConfig = {
      supabaseUrl: 'https://ryycsolimgocffujpunq.supabase.co',
      projectId: 'ryycsolimgocffujpunq',
      projectName: 'useer',
      status: 'ACTIVE_HEALTHY',
      region: 'ap-southeast-1',
    };

    const issues: string[] = [];
    const recommendations: string[] = [];

    // 检查配置问题
    if (!currentConfig.hasSupabaseUrl) {
      issues.push('NEXT_PUBLIC_SUPABASE_URL 未设置');
      recommendations.push(`在 Vercel 环境变量中设置 NEXT_PUBLIC_SUPABASE_URL = ${correctConfig.supabaseUrl}`);
    } else if (currentConfig.supabaseUrl.includes('your-project') || currentConfig.supabaseUrl.includes('placeholder')) {
      issues.push('NEXT_PUBLIC_SUPABASE_URL 是占位符值');
      recommendations.push(`在 Vercel 环境变量中更新 NEXT_PUBLIC_SUPABASE_URL = ${correctConfig.supabaseUrl}`);
    }

    if (!currentConfig.hasSupabaseAnonKey) {
      issues.push('NEXT_PUBLIC_SUPABASE_ANON_KEY 未设置');
      recommendations.push('在 Vercel 环境变量中设置 NEXT_PUBLIC_SUPABASE_ANON_KEY（从 Supabase Dashboard -> Settings -> API 获取）');
    }

    if (!currentConfig.hasServiceRoleKey) {
      issues.push('SUPABASE_SERVICE_ROLE_KEY 未设置');
      recommendations.push('在 Vercel 环境变量中设置 SUPABASE_SERVICE_ROLE_KEY（从 Supabase Dashboard -> Settings -> API 获取）');
    }

    return NextResponse.json({
      success: issues.length === 0,
      currentConfig,
      correctConfig,
      issues,
      recommendations,
      instructions: [
        '1. 登录 Vercel Dashboard',
        '2. 进入项目设置 -> Environment Variables',
        `3. 设置 NEXT_PUBLIC_SUPABASE_URL = ${correctConfig.supabaseUrl}`,
        '4. 从 Supabase Dashboard -> Settings -> API 获取并设置：',
        '   - NEXT_PUBLIC_SUPABASE_ANON_KEY',
        '   - SUPABASE_SERVICE_ROLE_KEY',
        '5. 重新部署项目',
      ],
      note: '环境变量配置错误会导致 "TypeError: fetch failed" 错误'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}

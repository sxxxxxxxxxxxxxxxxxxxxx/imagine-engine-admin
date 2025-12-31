/**
 * 部署环境检查
 * 检查部署环境的具体配置和密码验证状态
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const email = '3402365924@qq.com';
    const password = 'sx2580147jj';

    const checkResults: any = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 
          process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30) + '...' : '未设置',
      },
      steps: []
    };

    // 步骤 1: 检查 Supabase 连接
    checkResults.steps.push({
      step: 1,
      name: '检查 Supabase 连接',
      status: supabaseAdmin ? 'OK' : 'FAIL',
      message: supabaseAdmin ? 'Supabase Admin 已初始化' : 'Supabase Admin 未初始化'
    });

    if (!supabaseAdmin) {
      return NextResponse.json({
        ...checkResults,
        error: 'Supabase 未初始化，请检查环境变量',
        recommendation: '请在 Vercel 环境变量中配置 SUPABASE_SERVICE_ROLE_KEY'
      });
    }

    // 步骤 2: 查询管理员
    const { data: admin, error: queryError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    checkResults.steps.push({
      step: 2,
      name: '查询管理员',
      status: admin ? 'OK' : 'FAIL',
      found: !!admin,
      error: queryError?.message,
      adminId: admin?.id
    });

    if (!admin) {
      return NextResponse.json({
        ...checkResults,
        error: '管理员不存在',
        queryError: queryError?.message
      });
    }

    // 步骤 3: 检查密码哈希
    const hashInfo = {
      hash: admin.password_hash,
      hashLength: admin.password_hash?.length,
      hashPrefix: admin.password_hash?.substring(0, 30),
      isBcrypt: admin.password_hash?.startsWith('$2a$') || admin.password_hash?.startsWith('$2b$'),
      hashType: admin.password_hash?.startsWith('$2a$') ? 'bcrypt-2a' : 
                admin.password_hash?.startsWith('$2b$') ? 'bcrypt-2b' : 'unknown',
      expectedHash: '$2a$10$saAyXliST8J3aj4VwRSPEutbOecVE2Vq01C5rpW/VVplwUKyBLnBi',
      hashMatches: admin.password_hash === '$2a$10$saAyXliST8J3aj4VwRSPEutbOecVE2Vq01C5rpW/VVplwUKyBLnBi'
    };

    checkResults.steps.push({
      step: 3,
      name: '检查密码哈希',
      ...hashInfo
    });

    // 步骤 4: 测试密码验证
    const isValid = await bcrypt.compare(password, admin.password_hash);

    checkResults.steps.push({
      step: 4,
      name: '测试密码验证',
      password: password,
      passwordLength: password.length,
      isValid: isValid,
      currentHash: admin.password_hash
    });

    // 步骤 5: 生成新哈希并测试
    const newHash = await bcrypt.hash(password, 10);
    const newHashValid = await bcrypt.compare(password, newHash);

    checkResults.steps.push({
      step: 5,
      name: '生成新哈希测试',
      newHash: newHash,
      newHashValid: newHashValid
    });

    // 步骤 6: 如果验证失败，尝试更新密码
    if (!isValid) {
      const { data: updatedAdmin, error: updateError } = await supabaseAdmin
        .from('admins')
        .update({ 
          password_hash: newHash,
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .select()
        .single();

      checkResults.steps.push({
        step: 6,
        name: '自动更新密码哈希',
        status: updatedAdmin ? 'OK' : 'FAIL',
        error: updateError?.message,
        updated: !!updatedAdmin
      });

      if (updatedAdmin) {
        // 再次验证
        const finalValid = await bcrypt.compare(password, updatedAdmin.password_hash);
        checkResults.steps.push({
          step: 7,
          name: '验证更新后的密码',
          isValid: finalValid
        });
      }
    }

    checkResults.finalResult = {
      success: isValid,
      message: isValid 
        ? '✅ 密码验证成功！'
        : '❌ 密码验证失败，已尝试自动更新',
      recommendation: isValid
        ? '密码验证正常，如果登录仍然失败，请检查前端提交的数据'
        : '已自动更新密码哈希，请重试登录'
    };

    return NextResponse.json(checkResults);
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}

/**
 * 使用 Supabase MCP 调试密码验证
 * 直接测试密码验证逻辑
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

    // 步骤 1: 检查 Supabase 连接
    if (!supabaseAdmin) {
      return NextResponse.json({
        success: false,
        step: 1,
        error: 'Supabase Admin 未初始化',
        check: '请检查环境变量 NEXT_PUBLIC_SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY'
      });
    }

    // 步骤 2: 查询管理员
    const { data: admin, error: queryError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (queryError || !admin) {
      return NextResponse.json({
        success: false,
        step: 2,
        error: '管理员不存在',
        queryError: queryError?.message,
        email: email
      });
    }

    // 步骤 3: 检查密码哈希格式
    const hashInfo = {
      hash: admin.password_hash,
      hashLength: admin.password_hash?.length,
      hashPrefix: admin.password_hash?.substring(0, 30),
      isBcrypt: admin.password_hash?.startsWith('$2a$') || admin.password_hash?.startsWith('$2b$'),
      hashType: admin.password_hash?.startsWith('$2a$') ? 'bcrypt-2a' : 
                admin.password_hash?.startsWith('$2b$') ? 'bcrypt-2b' : 'unknown'
    };

    // 步骤 4: 测试密码验证
    const passwordTest = password;
    const isValid = await bcrypt.compare(passwordTest, admin.password_hash);

    // 步骤 5: 生成新的哈希用于对比
    const newHash = await bcrypt.hash(password, 10);
    const newHashValid = await bcrypt.compare(password, newHash);

    // 步骤 6: 测试不同的密码变体（可能有空格或编码问题）
    const passwordVariants = [
      password,
      password.trim(),
      password + ' ',
      ' ' + password,
    ];

    const variantTests = await Promise.all(
      passwordVariants.map(async (variant) => ({
        variant: JSON.stringify(variant),
        length: variant.length,
        isValid: await bcrypt.compare(variant, admin.password_hash)
      }))
    );

    return NextResponse.json({
      success: true,
      steps: {
        step1_supabase: 'OK',
        step2_query: admin ? 'OK' : 'FAIL',
        step3_hash_format: hashInfo,
        step4_password_test: {
          password: passwordTest,
          passwordLength: passwordTest.length,
          isValid: isValid,
          currentHash: admin.password_hash
        },
        step5_new_hash_test: {
          newHash: newHash,
          newHashValid: newHashValid
        },
        step6_variant_tests: variantTests
      },
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      },
      diagnosis: isValid 
        ? '✅ 密码验证成功！如果登录仍然失败，可能是前端提交的数据有问题'
        : '❌ 密码验证失败！需要更新密码哈希',
      recommendations: isValid 
        ? [
            '密码验证正常，请检查：',
            '1. 前端表单是否正确提交密码',
            '2. 是否有空格或特殊字符',
            '3. 浏览器控制台的网络请求详情',
            '4. 访问 /api/test-password 查看详细测试结果'
          ]
        : [
            '密码验证失败，建议：',
            '1. 访问 /api/force-update-password 端点更新密码',
            '2. 或使用脚本生成新的哈希值'
          ]
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}

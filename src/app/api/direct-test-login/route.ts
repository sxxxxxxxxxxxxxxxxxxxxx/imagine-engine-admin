/**
 * 直接测试登录逻辑
 * 模拟完整的登录流程，找出问题所在
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: '请提供邮箱和密码'
      });
    }

    const testResults: any = {
      step: 0,
      email: email,
      password: password,
      passwordLength: password.length,
      passwordBytes: Buffer.from(password).length,
      passwordHex: Buffer.from(password).toString('hex'),
      steps: []
    };

    // 步骤 1: 检查 Supabase 连接
    testResults.steps.push({
      step: 1,
      name: '检查 Supabase 连接',
      status: supabaseAdmin ? 'OK' : 'FAIL',
      message: supabaseAdmin ? 'Supabase 已初始化' : 'Supabase 未初始化'
    });

    if (!supabaseAdmin) {
      return NextResponse.json(testResults);
    }

    // 步骤 2: 查询管理员
    const { data: admin, error: queryError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    testResults.steps.push({
      step: 2,
      name: '查询管理员',
      status: admin ? 'OK' : 'FAIL',
      found: !!admin,
      error: queryError?.message,
      adminId: admin?.id
    });

    if (!admin) {
      return NextResponse.json(testResults);
    }

    // 步骤 3: 检查密码哈希
    const hashInfo = {
      hash: admin.password_hash,
      hashLength: admin.password_hash?.length,
      hashPrefix: admin.password_hash?.substring(0, 30),
      isBcrypt: admin.password_hash?.startsWith('$2a$') || admin.password_hash?.startsWith('$2b$'),
      hashType: admin.password_hash?.startsWith('$2a$') ? 'bcrypt-2a' : 
                admin.password_hash?.startsWith('$2b$') ? 'bcrypt-2b' : 'unknown'
    };

    testResults.steps.push({
      step: 3,
      name: '检查密码哈希',
      ...hashInfo
    });

    // 步骤 4: 测试不同的密码变体
    const passwordVariants = [
      { name: '原始密码', value: password },
      { name: '去除首尾空格', value: password.trim() },
      { name: '去除所有空格', value: password.replace(/\s/g, '') },
      { name: '添加前导空格', value: ' ' + password },
      { name: '添加尾随空格', value: password + ' ' },
    ];

    const variantTests = await Promise.all(
      passwordVariants.map(async (variant) => {
        const isValid = await bcrypt.compare(variant.value, admin.password_hash);
        return {
          ...variant,
          valueLength: variant.value.length,
          valueHex: Buffer.from(variant.value).toString('hex'),
          isValid: isValid
        };
      })
    );

    testResults.steps.push({
      step: 4,
      name: '测试密码变体',
      variants: variantTests
    });

    // 步骤 5: 生成新哈希并测试
    const newHash = await bcrypt.hash(password, 10);
    const newHashValid = await bcrypt.compare(password, newHash);

    testResults.steps.push({
      step: 5,
      name: '生成新哈希',
      newHash: newHash,
      newHashValid: newHashValid
    });

    // 步骤 6: 检查是否有匹配的变体
    const matchingVariant = variantTests.find(v => v.isValid);
    
    testResults.finalResult = matchingVariant
      ? {
          success: true,
          message: `密码验证成功！匹配的变体: ${matchingVariant.name}`,
          matchingVariant: matchingVariant.name,
          recommendation: matchingVariant.name !== '原始密码' 
            ? `前端提交的密码可能有问题，建议检查前端代码`
            : `密码验证正常，请检查其他问题`
        }
      : {
          success: false,
          message: '所有密码变体都验证失败',
          recommendation: '需要重新生成密码哈希'
        };

    return NextResponse.json(testResults);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
}

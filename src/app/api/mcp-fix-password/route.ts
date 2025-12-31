/**
 * 使用 Supabase MCP 直接修复密码
 * 生成正确的 bcryptjs 哈希并更新数据库
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

// 强制动态渲染，防止静态生成时出错
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase未初始化' 
      });
    }

    const email = '3402365924@qq.com';
    const password = 'sx2580147jj';

    // 步骤 1: 查询当前管理员
    const { data: currentAdmin, error: queryError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (queryError || !currentAdmin) {
      return NextResponse.json({
        success: false,
        error: '管理员不存在',
        queryError: queryError?.message
      });
    }

    // 步骤 2: 测试当前哈希
    const currentHash = currentAdmin.password_hash;
    const currentHashValid = await bcrypt.compare(password, currentHash);

    // 步骤 3: 生成新的哈希
    const newHash = await bcrypt.hash(password, 10);
    const newHashValid = await bcrypt.compare(password, newHash);

    // 步骤 4: 更新数据库（使用新哈希）
    const { data: updatedAdmin, error: updateError } = await supabaseAdmin
      .from('admins')
      .update({ 
        password_hash: newHash.trim(), // 确保没有空格
        updated_at: new Date().toISOString()
      })
      .eq('email', email)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({
        success: false,
        error: '更新失败',
        updateError: updateError.message
      });
    }

    // 步骤 5: 验证更新后的哈希
    const { data: verifyAdmin } = await supabaseAdmin
      .from('admins')
      .select('password_hash')
      .eq('email', email)
      .single();

    const finalHash = verifyAdmin?.password_hash;
    const finalHashValid = await bcrypt.compare(password, finalHash || '');

    return NextResponse.json({
      success: true,
      steps: {
        step1_query: currentAdmin ? 'OK' : 'FAIL',
        step2_current_hash_test: {
          hash: currentHash,
          hashLength: currentHash.length,
          isValid: currentHashValid
        },
        step3_new_hash_generated: {
          hash: newHash,
          hashLength: newHash.length,
          isValid: newHashValid
        },
        step4_database_updated: updatedAdmin ? 'OK' : 'FAIL',
        step5_final_verification: {
          hash: finalHash,
          hashLength: finalHash?.length,
          isValid: finalHashValid
        }
      },
      admin: {
        id: updatedAdmin?.id,
        email: updatedAdmin?.email,
        role: updatedAdmin?.role
      },
      password: password,
      diagnosis: finalHashValid 
        ? '✅ 密码哈希已更新并验证成功！现在可以使用密码登录'
        : '❌ 密码哈希更新后验证失败，可能需要检查数据库或环境变量',
      instruction: finalHashValid 
        ? '请刷新登录页面，使用密码 "sx2580147jj" 登录'
        : '请检查 Supabase 连接和环境变量配置'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
}

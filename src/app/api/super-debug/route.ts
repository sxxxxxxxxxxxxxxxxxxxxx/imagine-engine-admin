/**
 * 超级调试 - 逐步验证
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function GET() {
  const results: any = {
    steps: []
  };

  try {
    // Step 1: 检查Supabase连接
    results.steps.push({ step: 1, name: 'Supabase连接', status: supabaseAdmin ? 'OK' : 'FAIL' });
    if (!supabaseAdmin) {
      return NextResponse.json(results);
    }

    // Step 2: 查询管理员
    const { data: admin, error: queryError } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', '3402365924@qq.com')
      .single();

    results.steps.push({ 
      step: 2, 
      name: '查询管理员', 
      status: admin ? 'OK' : 'FAIL',
      error: queryError?.message,
      found: !!admin
    });

    if (!admin) {
      return NextResponse.json(results);
    }

    // Step 3: 检查hash格式
    const currentHash = admin.password_hash;
    results.steps.push({
      step: 3,
      name: '检查hash',
      hashLength: currentHash?.length,
      hashPrefix: currentHash?.substring(0, 20),
      hashType: currentHash?.startsWith('$2a$') ? 'bcrypt-a' : currentHash?.startsWith('$2b$') ? 'bcrypt-b' : 'unknown'
    });

    // Step 4: 测试密码 "password"
    const testPassword1 = 'password';
    const isValid1 = await bcrypt.compare(testPassword1, currentHash);
    results.steps.push({
      step: 4,
      name: '测试密码 "password"',
      password: testPassword1,
      result: isValid1 ? 'MATCH' : 'NO MATCH'
    });

    // Step 5: 测试密码 "sx2580147jj"  
    const testPassword2 = 'sx2580147jj';
    const isValid2 = await bcrypt.compare(testPassword2, currentHash);
    results.steps.push({
      step: 5,
      name: '测试密码 "sx2580147jj"',
      password: testPassword2,
      result: isValid2 ? 'MATCH' : 'NO MATCH'
    });

    // Step 6: 生成正确的hash（用于对比）
    const newHash1 = await bcrypt.hash('password', 10);
    const newHash2 = await bcrypt.hash('sx2580147jj', 10);

    results.steps.push({
      step: 6,
      name: '生成新hash',
      passwordHash: newHash1.substring(0, 30) + '...',
      sx2580147jjHash: newHash2.substring(0, 30) + '...'
    });

    // Step 7: 建议
    if (isValid1) {
      results.solution = '✅ 密码"password"匹配！请使用password登录';
    } else if (isValid2) {
      results.solution = '✅ 密码"sx2580147jj"匹配！请使用sx2580147jj登录';
    } else {
      results.solution = '❌ 两个密码都不匹配！需要重新生成hash';
      results.correctHashForPassword = newHash1;
      results.correctHashForSx2580147jj = newHash2;
    }

    return NextResponse.json(results);
  } catch (error: any) {
    results.error = error.message;
    return NextResponse.json(results);
  }
}
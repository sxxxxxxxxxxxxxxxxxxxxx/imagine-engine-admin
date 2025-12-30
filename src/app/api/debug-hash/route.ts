/**
 * 调试密码hash
 */

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase未初始化' });
    }

    // 查询数据库中的hash
    const { data: admin } = await supabaseAdmin
      .from('admins')
      .select('email, password_hash')
      .eq('email', '3402365924@qq.com')
      .single();

    if (!admin) {
      return NextResponse.json({ error: '管理员不存在' });
    }

    // 测试密码
    const password = 'sx2580147jj';
    const isValid = await bcrypt.compare(password, admin.password_hash);

    // 生成新的hash
    const newHash = await bcrypt.hash(password, 10);

    return NextResponse.json({
      email: admin.email,
      currentHash: admin.password_hash,
      currentHashPrefix: admin.password_hash.substring(0, 30),
      testPassword: password,
      isValid: isValid,
      newGeneratedHash: newHash,
      suggestion: isValid 
        ? '密码验证成功，hash正确'
        : '密码验证失败，需要更新hash为: ' + newHash
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
/**
 * 管理员认证逻辑
 */

import { supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export interface AdminSession {
  id: string;
  email: string;
  role: string;
}

/**
 * 验证管理员登录
 */
export async function verifyAdminLogin(email: string, password: string): Promise<AdminSession | null> {
  try {
    console.log('🔐 验证登录:', email);
    
    // 检查supabaseAdmin是否初始化
    if (!supabaseAdmin) {
      console.error('❌ Supabase Admin未初始化！请检查环境变量');
      return null;
    }

    // 从管理员表查询
    const { data: admin, error } = await supabaseAdmin
      .from('admins')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !admin) {
      console.log('❌ 管理员不存在:', email, error);
      return null;
    }

    console.log('✅ 找到管理员:', email);

    // 验证密码
    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      console.log('❌ 密码错误');
      return null;
    }

    console.log('✅ 密码正确');

    // 更新最后登录时间
    await supabaseAdmin
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    console.log('✅ 管理员登录成功:', email);

    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };
  } catch (error) {
    console.error('❌ 登录验证失败:', error);
    return null;
  }
}

/**
 * 创建管理员session（设置Cookie）
 */
export async function createAdminSession(admin: AdminSession) {
  const cookieStore = await cookies();
  const sessionData = JSON.stringify(admin);
  
  // 设置httpOnly cookie
  cookieStore.set('admin-session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7天
    path: '/',
  });
}

/**
 * 获取当前管理员session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin-session');
    
    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);
    return session;
  } catch (error) {
    return null;
  }
}

/**
 * 删除管理员session
 */
export async function deleteAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-session');
}

/**
 * 从请求头获取session（用于API路由）
 */
export async function getAdminSessionFromRequest(request: NextRequest): Promise<AdminSession | null> {
  try {
    const sessionCookie = request.cookies.get('admin-session');
    
    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);
    return session;
  } catch (error) {
    return null;
  }
}

/**
 * 创建管理员账号
 */
export async function createAdmin(email: string, password: string, role: 'super_admin' | 'admin' | 'viewer' = 'admin') {
  try {
    if (!supabaseAdmin) {
      console.error('❌ Supabase Admin未初始化');
      return null;
    }

    // 加密密码
    const password_hash = await bcrypt.hash(password, 10);

    // 插入数据库
    const { data, error } = await supabaseAdmin
      .from('admins')
      .insert({
        email,
        password_hash,
        role,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ 创建管理员失败:', error);
      return null;
    }

    console.log('✅ 管理员创建成功:', email);
    return data;
  } catch (error) {
    console.error('❌ 创建管理员失败:', error);
    return null;
  }
}

/**
 * 初始化默认管理员（如果不存在）
 */
export async function initializeDefaultAdmin() {
  const defaultEmail = process.env.ADMIN_EMAIL || '3402365924@qq.com';
  const defaultPassword = process.env.ADMIN_PASSWORD || 'sx2580147jj';

  try {
    if (!supabaseAdmin) {
      console.error('❌ Supabase Admin未初始化');
      return false;
    }

    // 检查是否已存在
    const { data: existing } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('email', defaultEmail)
      .single();

    if (existing) {
      console.log('✅ 默认管理员已存在');
      return true;
    }

    // 创建默认管理员
    await createAdmin(defaultEmail, defaultPassword, 'super_admin');
    console.log('✅ 默认管理员已创建:', defaultEmail);
    return true;
  } catch (error) {
    console.error('❌ 初始化默认管理员失败:', error);
    return false;
  }
}
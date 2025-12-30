'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BypassLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState('准备登录...');

  useEffect(() => {
    // 页面加载后自动执行绕过登录
    autoBypassLogin();
  }, []);

  const autoBypassLogin = async () => {
    try {
      setStatus('正在连接...');
      
      const response = await fetch('/api/auth/login-bypass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: '3402365924@qq.com'
        }),
      });

      const data = await response.json();
      console.log('绕过登录结果:', data);

      if (data.success) {
        setStatus('✅ 登录成功！正在跳转...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        setStatus('❌ 失败: ' + (data.error || '未知错误'));
      }
    } catch (error: any) {
      setStatus('❌ 错误: ' + error.message);
      console.error('绕过登录失败:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-dark-900 mb-2">
          🚀 Imagine Engine
        </h1>
        <h2 className="text-lg text-dark-600 mb-8">
          管理后台 - 临时绕过登录
        </h2>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-medium">
            ⚠️ 临时绕过密码验证
          </p>
          <p className="text-yellow-700 text-sm mt-1">
            直接创建管理员session
          </p>
        </div>

        <div className="text-lg font-semibold text-dark-900 mb-4">
          {status}
        </div>

        <button
          onClick={autoBypassLogin}
          className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
        >
          🔓 重新尝试登录
        </button>

        <div className="mt-6 p-3 bg-dark-50 rounded-lg">
          <p className="text-xs text-dark-600">
            账号: 3402365924@qq.com
          </p>
          <p className="text-xs text-dark-600">
            绕过密码验证，直接进入Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
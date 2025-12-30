'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { identifyUser, trackEvent } from '@/lib/analytics';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 记录登录尝试（不上传完整邮箱）
    try { trackEvent('admin_login_attempt', { emailDomain: email.split('@')[1] || 'unknown' }); } catch {}

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '登录失败');
      }

      try {
        identifyUser(email, { role: 'admin' });
        trackEvent('admin_login_success');
      } catch {}

      router.push('/dashboard');
    } catch (err: any) {
      try { trackEvent('admin_login_failed', { message: err?.message || 'unknown' }); } catch {}
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-dark-950 dark:via-dark-900 dark:to-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 dark:bg-cyan-900/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Imagine Engine
          </h1>
          <p className="text-dark-600 dark:text-dark-400 font-medium">管理后台</p>
        </div>

        {/* 登录卡片 */}
        <div className="bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-dark-200/50 dark:border-dark-800/50 p-8">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50 mb-6">
            管理员登录
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 错误提示 */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
              </div>
            )}

            {/* 邮箱输入 */}
            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                邮箱地址
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-dark-50 dark:bg-dark-800 border-2 border-dark-200 dark:border-dark-700 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all outline-none text-dark-900 dark:text-dark-50"
                  placeholder="请输入邮箱地址"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div>
              <label className="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                密码
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-dark-50 dark:bg-dark-800 border-2 border-dark-200 dark:border-dark-700 rounded-xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 transition-all outline-none text-dark-900 dark:text-dark-50"
                  placeholder="请输入密码"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-cyan-600 hover:from-primary-600 hover:to-cyan-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  立即登录
                </>
              )}
            </button>
          </form>
        </div>

        {/* 版权信息 */}
        <p className="text-center text-dark-500 dark:text-dark-400 text-sm mt-8">
          © 2025 Imagine Engine. All rights reserved.
        </p>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  Settings as SettingsIcon, CheckCircle2, XCircle, ExternalLink, 
  Copy, Eye, EyeOff, AlertTriangle, Info
} from 'lucide-react';

export default function SettingsPage() {
  const [clarityConfigured, setClarityConfigured] = useState(false);
  const [mainSiteClarityId, setMainSiteClarityId] = useState('');
  const [adminClarityId, setAdminClarityId] = useState('');
  const [showMainId, setShowMainId] = useState(false);
  const [showAdminId, setShowAdminId] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    checkClarityStatus();
  }, []);

  const checkClarityStatus = () => {
    // 检查环境变量是否配置
    const hasMainSite = !!process.env.NEXT_PUBLIC_CLARITY_ID;
    const hasAdmin = !!process.env.NEXT_PUBLIC_CLARITY_ID;
    setClarityConfigured(hasMainSite);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: 'success', text: '已复制到剪贴板' });
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
            系统设置
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-1">
            配置Microsoft Clarity和系统参数
          </p>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' :
            message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300' :
            'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
          }`}>
            {message.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {message.type === 'error' && <XCircle className="w-5 h-5" />}
            {message.type === 'info' && <Info className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Microsoft Clarity 配置 */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                Microsoft Clarity 配置
              </h2>
              <p className="text-dark-600 dark:text-dark-400 text-sm">
                用户行为分析、热力图、会话录制
              </p>
            </div>
          </div>

          {/* 配置状态 */}
          <div className="mb-8 p-4 rounded-xl border-2 border-dark-200 dark:border-dark-800 bg-dark-50 dark:bg-dark-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {clarityConfigured ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                )}
                <div>
                  <p className="font-semibold text-dark-900 dark:text-dark-50">
                    {clarityConfigured ? 'Clarity 已配置' : 'Clarity 未配置'}
                  </p>
                  <p className="text-sm text-dark-600 dark:text-dark-400">
                    {clarityConfigured ? '数据正在收集中' : '请按照下方步骤配置'}
                  </p>
                </div>
              </div>
              <a
                href="https://clarity.microsoft.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-4 py-2 flex items-center gap-2"
              >
                打开 Clarity 控制台
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 配置步骤 */}
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                配置步骤
              </h3>
              <ol className="space-y-4 text-dark-700 dark:text-dark-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-semibold mb-1">访问 Clarity 官网</p>
                    <p className="text-sm">
                      打开 <a href="https://clarity.microsoft.com/" target="_blank" className="text-blue-600 hover:underline">
                        https://clarity.microsoft.com/
                      </a> 并使用 Microsoft 账号登录
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-semibold mb-1">创建项目</p>
                    <p className="text-sm mb-2">
                      点击 "New project" 创建两个项目：
                    </p>
                    <div className="bg-white dark:bg-dark-900 p-3 rounded-lg space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">项目1:</span> Imagine Engine 主站
                        <br />
                        <span className="text-xs text-dark-500">用于追踪主网站用户行为</span>
                      </div>
                      <div>
                        <span className="font-semibold">项目2:</span> Imagine Engine 管理后台（可选）
                        <br />
                        <span className="text-xs text-dark-500">用于追踪管理员操作行为</span>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-semibold mb-1">获取项目 ID</p>
                    <p className="text-sm mb-2">
                      创建项目后，复制显示的项目 ID（格式类似：abc123def456）
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <div>
                    <p className="font-semibold mb-1">配置环境变量</p>
                    <p className="text-sm mb-3">
                      在对应项目的 <code className="px-2 py-1 bg-dark-200 dark:bg-dark-800 rounded text-xs">
                        .env.local
                      </code> 文件中添加：
                    </p>
                    
                    {/* 主站配置 */}
                    <div className="bg-dark-900 dark:bg-black p-4 rounded-lg mb-3">
                      <p className="text-xs text-dark-400 mb-2">主站 (.env.local):</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-green-400 font-mono text-sm">
                          NEXT_PUBLIC_CLARITY_ID=你的主站项目ID
                        </code>
                        <button
                          onClick={() => copyToClipboard('NEXT_PUBLIC_CLARITY_ID=你的主站项目ID')}
                          className="px-3 py-1 bg-dark-700 hover:bg-dark-600 rounded text-white text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          复制
                        </button>
                      </div>
                    </div>

                    {/* 管理后台配置 */}
                    <div className="bg-dark-900 dark:bg-black p-4 rounded-lg">
                      <p className="text-xs text-dark-400 mb-2">管理后台 (.env.local) - 可选:</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-green-400 font-mono text-sm">
                          NEXT_PUBLIC_CLARITY_ID=你的管理后台项目ID
                        </code>
                        <button
                          onClick={() => copyToClipboard('NEXT_PUBLIC_CLARITY_ID=你的管理后台项目ID')}
                          className="px-3 py-1 bg-dark-700 hover:bg-dark-600 rounded text-white text-xs flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          复制
                        </button>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <div>
                    <p className="font-semibold mb-1">重启服务</p>
                    <p className="text-sm mb-2">
                      配置完成后，重启对应的开发服务器：
                    </p>
                    <div className="bg-dark-900 dark:bg-black p-3 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="flex-1 text-yellow-400 font-mono text-sm">
                          npm run dev
                        </code>
                        <span className="text-xs text-dark-400">（在对应项目目录）</span>
                      </div>
                    </div>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold mb-1">验证配置</p>
                    <p className="text-sm">
                      访问网站并进行一些操作，等待几分钟后在 Clarity 控制台查看数据
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Clarity 功能介绍 */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2 border-dark-200 dark:border-dark-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <h4 className="font-bold text-dark-900 dark:text-dark-50 mb-2">🖱️ 热力图</h4>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  查看用户点击最多的区域，优化页面布局
                </p>
              </div>
              <div className="p-4 rounded-lg border-2 border-dark-200 dark:border-dark-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <h4 className="font-bold text-dark-900 dark:text-dark-50 mb-2">🎥 会话录制</h4>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  回放用户操作过程，发现体验问题
                </p>
              </div>
              <div className="p-4 rounded-lg border-2 border-dark-200 dark:border-dark-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <h4 className="font-bold text-dark-900 dark:text-dark-50 mb-2">📊 数据分析</h4>
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  深度分析用户行为，数据驱动决策
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 数据库配置提示 */}
        <div className="card p-8 bg-gradient-to-br from-primary-50 to-cyan-50 dark:from-primary-900/20 dark:to-cyan-900/20 border-2 border-primary-200 dark:border-primary-800">
          <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            📊 数据库行为追踪配置
          </h3>
          <p className="text-dark-700 dark:text-dark-300 mb-4">
            除了 Clarity，系统还会将用户行为数据存储到 Supabase 数据库。
          </p>
          <div className="bg-white dark:bg-dark-900 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
            <p className="text-sm text-dark-600 dark:text-dark-400 mb-3">
              <strong>确保已执行 SQL 脚本：</strong>
            </p>
            <code className="block text-xs bg-dark-900 dark:bg-black text-green-400 p-3 rounded font-mono overflow-x-auto">
              c:\Users\34023\Desktop\开发\用户行为分析表.sql
            </code>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-3">
              💡 该脚本会创建 user_behaviors 表及相关索引，用于存储和分析用户行为数据
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
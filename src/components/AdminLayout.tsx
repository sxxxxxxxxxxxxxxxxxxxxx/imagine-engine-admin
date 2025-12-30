'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X,
  Zap,
  Key,
  BarChart3
} from 'lucide-react';
import dynamic from 'next/dynamic';

const ChangePasswordModal = dynamic(() => import('./ChangePasswordModal'), { ssr: false });

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const menuItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: '仪表板' },
    { href: '/user-analytics', icon: BarChart3, label: '用户行为分析' },
    { href: '/users', icon: Users, label: '用户管理' },
    { href: '/cards', icon: CreditCard, label: '配额卡片' },
    { href: '/admins', icon: Settings, label: '管理员' },
  ];

  return (
    <div className="min-h-screen bg-dark-50 dark:bg-dark-950">
      {/* 侧边栏 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-900 border-r border-dark-200 dark:border-dark-800 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-dark-200 dark:border-dark-800">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary-500" />
            <span className="font-bold text-lg text-dark-900 dark:text-dark-50">
              管理后台
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-dark-500 hover:text-dark-900 dark:hover:text-dark-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 导航菜单 */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 底部按钮 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-200 dark:border-dark-800 space-y-2">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
          >
            <Key className="w-5 h-5" />
            <span className="font-medium">修改密码</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className={`transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* 顶部导航栏 */}
        <header className="h-16 bg-white dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-dark-500 hover:text-dark-900 dark:hover:text-dark-50"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-600 dark:text-dark-400">
              Imagine Engine 管理后台
            </span>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* 修改密码模态框 */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          handleLogout(); // 修改密码后自动登出
        }}
      />
    </div>
  );
}
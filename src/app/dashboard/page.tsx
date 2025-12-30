'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Users, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';
import { trackEvent } from '@/lib/analytics';

interface Stats {
  totalUsers: number;
  totalSubscriptions: number;
  totalRevenue: number;
  activeUsers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalSubscriptions: 0,
    totalRevenue: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try { trackEvent('admin_dashboard_loaded'); } catch {}
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 使用API获取统计数据
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('获取失败');
      
      const result = await response.json();
      if (result.success) {
        setStats({
          totalUsers: result.stats.totalUsers,
          totalSubscriptions: result.stats.totalSubscriptions,
          totalRevenue: result.stats.totalRevenue,
          activeUsers: result.stats.activeSubscriptions,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: '总用户数',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: '活跃订阅',
      value: stats.activeUsers,
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: '总订阅数',
      value: stats.totalSubscriptions,
      icon: CreditCard,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: '总收入',
      value: `¥${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
            仪表板
          </h1>
          <p className="text-dark-600 dark:text-dark-400 mt-1">
            欢迎回来！这是您的管理概览
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${card.bg}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
                <h3 className="text-dark-600 dark:text-dark-400 text-sm font-medium mb-1">
                  {card.title}
                </h3>
                <p className="text-2xl font-bold text-dark-900 dark:text-dark-50">
                  {loading ? '...' : card.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* 最近活动 */}
        <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
          <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4">
            最近活动
          </h2>
          <p className="text-dark-500 dark:text-dark-400 text-center py-8">
            暂无活动记录
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
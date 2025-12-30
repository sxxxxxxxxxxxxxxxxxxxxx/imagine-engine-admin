'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { 
  TrendingUp, Users, MousePointer, Eye, BarChart3, 
  RefreshCw
} from 'lucide-react';

interface BehaviorStats {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  deviceTypes: Record<string, number>;
  browsers: Record<string, number>;
  topEvents: Record<string, number>;
  dailyTrends: Record<string, number>;
}

interface BehaviorData {
  id: number;
  event_name: string;
  page_url: string;
  device_type: string;
  browser: string;
  created_at: string;
}

export default function UserAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState<BehaviorStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<BehaviorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      const result = await response.json();
      
      if (result.success) {
        setStats(result.stats);
        setRecentEvents(result.data.slice(0, 50));
      }
    } catch (error) {
      console.error('获取分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: '24小时' },
    { value: '7d', label: '7天' },
    { value: '30d', label: '30天' },
    { value: '90d', label: '90天' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* 页面标题与筛选 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
              用户行为分析
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">
              实时追踪用户行为，优化产品体验
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border-2 border-dark-300 dark:border-dark-700 rounded-lg"
            >
              {timeRangeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button onClick={fetchAnalytics} className="btn-outline px-4 py-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />刷新
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-dark-600 dark:text-dark-400 mt-4">加载中...</p>
          </div>
        ) : (
          <>
            {/* 关键指标卡片 */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="card p-6">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white mb-3">
                  <MousePointer className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-1">
                  {stats?.totalEvents.toLocaleString() || 0}
                </p>
                <p className="text-sm text-dark-600 dark:text-dark-400">总事件数</p>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-1">
                  {stats?.uniqueUsers || 0}
                </p>
                <p className="text-sm text-dark-600 dark:text-dark-400">独立用户</p>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white mb-3">
                  <Eye className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-1">
                  {stats?.uniqueSessions || 0}
                </p>
                <p className="text-sm text-dark-600 dark:text-dark-400">会话数</p>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white mb-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-3xl font-bold text-dark-900 dark:text-dark-50 mb-1">
                  {stats?.totalEvents && stats?.uniqueSessions 
                    ? (stats.totalEvents / stats.uniqueSessions).toFixed(1) 
                    : '0'}
                </p>
                <p className="text-sm text-dark-600 dark:text-dark-400">平均事件/会话</p>
              </div>
            </div>

            {/* 热门事件 */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                热门事件 TOP 10
              </h3>
              <div className="space-y-2">
                {Object.entries(stats?.topEvents || {})
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([event, count], idx) => (
                    <div key={event} className="flex items-center gap-3 p-3 bg-dark-50 dark:bg-dark-800 rounded-lg">
                      <div className="text-lg font-bold text-primary-600 w-8">
                        #{idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-dark-900 dark:text-dark-50">{event}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-dark-900 dark:text-dark-50">{count}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 最近事件表格 */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4">
                最近50条事件
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-dark-200 dark:border-dark-800">
                      <th className="text-left py-3 px-4 text-sm font-semibold">时间</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">事件</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">页面</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">设备</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold">浏览器</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((event) => (
                      <tr key={event.id} className="border-b border-dark-100 dark:border-dark-800 hover:bg-dark-50 dark:hover:bg-dark-900">
                        <td className="py-3 px-4 text-sm">{new Date(event.created_at).toLocaleString('zh-CN')}</td>
                        <td className="py-3 px-4 text-sm font-medium">{event.event_name}</td>
                        <td className="py-3 px-4 text-sm">{event.page_url?.replace(/^https?:\/\/[^/]+/, '') || '/'}</td>
                        <td className="py-3 px-4 text-sm capitalize">{event.device_type}</td>
                        <td className="py-3 px-4 text-sm capitalize">{event.browser}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
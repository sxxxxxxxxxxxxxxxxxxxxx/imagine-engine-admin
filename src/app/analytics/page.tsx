'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { TrendingUp, Users, MousePointer2, Target, BarChart3, Clock, Activity } from 'lucide-react';

type AnalyticsStats = {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  deviceTypes: Record<string, number>;
  browsers: Record<string, number>;
  topEvents: Record<string, number>;
  dailyTrends: Record<string, number>;
};

type Behavior = {
  id?: string;
  user_id?: string;
  session_id?: string;
  event_name: string;
  device_type?: string;
  browser?: string;
  created_at: string;
  path?: string;
};

const rangeOptions = [
  { label: '24小时', value: '24h' },
  { label: '7天', value: '7d' },
  { label: '30天', value: '30d' },
  { label: '90天', value: '90d' },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState('7d');
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [events, setEvents] = useState<Behavior[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics(range);
  }, [range]);

  const fetchAnalytics = async (r: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics?range=${r}`);
      if (!res.ok) throw new Error('获取失败');
      const json = await res.json();
      if (!json.success) throw new Error(json.error || '获取失败');
      setStats(json.stats);
      setEvents(json.data.slice(0, 100)); // 只展示最新100条
    } catch (err: any) {
      console.error('获取分析数据失败:', err);
      setError(err?.message || '获取失败');
    } finally {
      setLoading(false);
    }
  };

  const dailyTrendList = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.dailyTrends || {})
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, value }));
  }, [stats]);

  const topEventList = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.topEvents || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8);
  }, [stats]);

  const deviceList = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.deviceTypes || {}).sort((a, b) => b[1] - a[1]);
  }, [stats]);

  const browserList = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.browsers || {}).sort((a, b) => b[1] - a[1]);
  }, [stats]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">数据分析</h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">用户行为数据统计</p>
          </div>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-4 py-2 border-2 border-dark-300 dark:border-dark-700 rounded-lg"
          >
            {rangeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-dark-600 dark:text-dark-400 mt-4">加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">总事件数</p>
                <p className="text-3xl font-bold text-dark-900 dark:text-dark-50">{stats?.totalEvents || 0}</p>
              </div>
              <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">独立用户</p>
                <p className="text-3xl font-bold text-dark-900 dark:text-dark-50">{stats?.uniqueUsers || 0}</p>
              </div>
              <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">会话数</p>
                <p className="text-3xl font-bold text-dark-900 dark:text-dark-50">{stats?.uniqueSessions || 0}</p>
              </div>
              <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
                <p className="text-sm text-dark-600 dark:text-dark-400 mb-2">平均事件/会话</p>
                <p className="text-3xl font-bold text-dark-900 dark:text-dark-50">
                  {stats?.totalEvents && stats?.uniqueSessions 
                    ? (stats.totalEvents / stats.uniqueSessions).toFixed(1) 
                    : '0'}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4">热门事件</h3>
              <div className="space-y-2">
                {topEventList.map(([event, count], idx) => (
                  <div key={event} className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-800 rounded-lg">
                    <span className="font-medium text-dark-900 dark:text-dark-50">#{idx + 1} {event}</span>
                    <span className="text-lg font-bold text-primary-600">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
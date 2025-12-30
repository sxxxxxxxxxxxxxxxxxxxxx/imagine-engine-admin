'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  TrendingUp, Users, DollarSign, Target, Calendar,
  ArrowUpRight, ArrowDownRight, RefreshCw, Download
} from 'lucide-react';

interface InsightsData {
  userGrowth: { date: string; count: number }[];
  revenueGrowth: { date: string; amount: number }[];
  conversionFunnel: { stage: string; count: number; rate: number }[];
  activeUsers: { period: string; count: number }[];
  topPlans: { plan: string; count: number; revenue: number }[];
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchInsights();
  }, [timeRange]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/insights?range=${timeRange}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('获取数据洞察失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const timeRangeOptions = [
    { value: '7d', label: '7天' },
    { value: '30d', label: '30天' },
    { value: '90d', label: '90天' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
              数据洞察
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">
              深度分析业务数据，发现增长机会
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
            <button
              onClick={fetchInsights}
              className="btn-outline px-4 py-2 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              刷新
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
            {/* 用户增长趋势 */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                用户增长趋势
              </h3>
              {data?.userGrowth && data.userGrowth.length > 0 ? (
                <div className="space-y-2">
                  {data.userGrowth.map((item, idx) => {
                    const maxCount = Math.max(...data.userGrowth.map(i => i.count));
                    const percentage = (item.count / maxCount) * 100;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-20 text-sm text-dark-600 dark:text-dark-400">
                          {item.date}
                        </span>
                        <div className="flex-1 h-8 bg-dark-200 dark:bg-dark-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-cyan-600 flex items-center px-3 text-white text-sm font-semibold"
                            style={{ width: `${percentage}%` }}
                          >
                            {item.count > 0 && item.count}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-3" />
                  <p className="text-dark-500 dark:text-dark-400">暂无增长数据</p>
                </div>
              )}
            </div>

            {/* 收入趋势 */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                收入趋势
              </h3>
              {data?.revenueGrowth && data.revenueGrowth.length > 0 ? (
                <div className="space-y-2">
                  {data.revenueGrowth.map((item, idx) => {
                    const maxAmount = Math.max(...data.revenueGrowth.map(i => i.amount));
                    const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0;
                    return (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="w-20 text-sm text-dark-600 dark:text-dark-400">
                          {item.date}
                        </span>
                        <div className="flex-1 h-8 bg-dark-200 dark:bg-dark-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center px-3 text-white text-sm font-semibold"
                            style={{ width: `${percentage}%` }}
                          >
                            {item.amount > 0 && `¥${item.amount}`}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <DollarSign className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-3" />
                  <p className="text-dark-500 dark:text-dark-400">暂无收入数据</p>
                </div>
              )}
            </div>

            {/* 转化漏斗 */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                转化漏斗
              </h3>
              {data?.conversionFunnel && data.conversionFunnel.length > 0 ? (
                <div className="space-y-3">
                  {data.conversionFunnel.map((stage, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-dark-700 dark:text-dark-300">
                          {stage.stage}
                        </span>
                        <span className="text-sm font-semibold text-dark-900 dark:text-dark-50">
                          {stage.count} ({stage.rate}%)
                        </span>
                      </div>
                      <div className="h-10 bg-dark-200 dark:bg-dark-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full flex items-center px-4 text-white text-sm font-semibold ${
                            idx === 0 ? 'bg-blue-500' :
                            idx === 1 ? 'bg-cyan-500' :
                            idx === 2 ? 'bg-purple-500' :
                            idx === 3 ? 'bg-pink-500' :
                            'bg-primary-500'
                          }`}
                          style={{ width: `${stage.rate}%` }}
                        >
                          {stage.count > 0 && stage.count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-3" />
                  <p className="text-dark-500 dark:text-dark-400">暂无漏斗数据</p>
                </div>
              )}
            </div>

            {/* 热门套餐 */}
            <div className="card p-6">
              <h3 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4">
                热门套餐
              </h3>
              {data?.topPlans && data.topPlans.length > 0 ? (
                <div className="space-y-3">
                  {data.topPlans.map((plan, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-dark-50 dark:bg-dark-800 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-primary-600 w-8">
                        #{idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-dark-900 dark:text-dark-50 capitalize">
                          {plan.plan} 套餐
                        </p>
                        <p className="text-sm text-dark-600 dark:text-dark-400">
                          {plan.count} 个订阅
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          ¥{plan.revenue}
                        </p>
                        <p className="text-xs text-dark-500">总收入</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-dark-300 dark:text-dark-700 mx-auto mb-3" />
                  <p className="text-dark-500 dark:text-dark-400">暂无套餐数据</p>
                </div>
              )}
            </div>

            {/* 数据说明 */}
            <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50 mb-3">
                💡 数据来源说明
              </h3>
              <p className="text-dark-700 dark:text-dark-300 text-sm mb-3">
                所有数据均来自 Supabase 数据库的真实记录：
              </p>
              <ul className="space-y-2 text-sm text-dark-600 dark:text-dark-400">
                <li>• <strong>用户增长</strong>: profiles 表按日期统计</li>
                <li>• <strong>收入趋势</strong>: transactions 表按日期汇总</li>
                <li>• <strong>转化漏斗</strong>: 注册→首次访问→订阅→活跃使用</li>
                <li>• <strong>热门套餐</strong>: subscriptions 表按套餐类型统计</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
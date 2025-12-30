'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Zap, Loader2 } from 'lucide-react';

interface EditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: any;
}

export default function EditSubscriptionModal({ isOpen, onClose, onSuccess, user }: EditSubscriptionModalProps) {
  const [planType, setPlanType] = useState('free');
  const [quotaAmount, setQuotaAmount] = useState(10);
  const [durationDays, setDurationDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.subscription) {
      setPlanType(user.subscription.plan_type || 'free');
      setQuotaAmount(user.subscription.quota_total || 10);
    }
  }, [user]);

  // 套餐改变时自动调整配额
  const handlePlanTypeChange = (newPlanType: string) => {
    setPlanType(newPlanType);
    
    // 根据套餐类型自动设置推荐配额
    const quotaMap: Record<string, number> = {
      'free': 10,
      'basic': 100,
      'pro': 500,
      'enterprise': 10000
    };
    
    setQuotaAmount(quotaMap[newPlanType] || 10);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/users/update-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          planType,
          quotaAmount,
          durationDays
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || '更新失败');
      }

      alert(`✅ ${data.action === 'updated' ? '订阅已更新' : '订阅已创建'}！`);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50">
            编辑订阅 - {user?.email}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              套餐类型
            </label>
            <select
              value={planType}
              onChange={(e) => handlePlanTypeChange(e.target.value)}
              className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg"
              disabled={loading}
            >
              <option value="free">Free - 免费（10张）</option>
              <option value="basic">Basic - 基础版（100张）</option>
              <option value="pro">Pro - 专业版（500张）</option>
              <option value="enterprise">Enterprise - 企业版（10000张）</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              配额数量（张）
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="number"
                value={quotaAmount}
                onChange={(e) => setQuotaAmount(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg"
                min="1"
                required
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-dark-500">
              Free: 10张 | Basic: 100张 | Pro: 500张 | Enterprise: 无限
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              有效期（天）
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg"
                min="1"
                required
                disabled={loading}
              />
            </div>
            <p className="mt-1 text-xs text-dark-500">
              从今天起计算有效期
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  保存中...
                </>
              ) : (
                '保存修改'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
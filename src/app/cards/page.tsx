'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, Copy } from 'lucide-react';

interface QuotaCard {
  id: string;
  code: string;
  quota_amount: number;
  is_used: boolean;
  user_id?: string;
  created_at: string;
  used_at?: string;
  expires_at?: string;
}

export default function CardsPage() {
  const [cards, setCards] = useState<QuotaCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [batchCount, setBatchCount] = useState(10);
  const [quotaAmount, setQuotaAmount] = useState(100);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards/list');
      if (!response.ok) throw new Error('获取失败');

      const result = await response.json();
      if (result.success) {
        setCards(result.cards || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('获取卡片列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCards = async () => {
    try {
      const response = await fetch('/api/cards/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count: batchCount,
          quotaAmount: quotaAmount
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      alert(`成功创建 ${batchCount} 张配额卡！`);
      setShowCreateModal(false);
      fetchCards();
    } catch (error: any) {
      console.error('创建卡片失败:', error);
      alert('创建失败: ' + error.message);
    }
  };

  const generateCardCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
      if ((i + 1) % 4 === 0 && i < 15) code += '-';
    }
    return code;
  };

  const copyCardCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert('卡号已复制！');
  };

  const isExpired = (card: QuotaCard) => !!card.expires_at && new Date(card.expires_at) < new Date();
  const isUsed = (card: QuotaCard) => card.is_used;
  const isUnused = (card: QuotaCard) => !card.is_used && !isExpired(card);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题和操作 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
              配额卡片管理
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">
              创建和管理配额充值卡
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            批量生成
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
            <p className="text-dark-600 dark:text-dark-400 text-sm mb-2">未使用</p>
            <p className="text-2xl font-bold text-green-600">
              {cards.filter(isUnused).length}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
            <p className="text-dark-600 dark:text-dark-400 text-sm mb-2">已使用</p>
            <p className="text-2xl font-bold text-blue-600">
              {cards.filter(isUsed).length}
            </p>
          </div>
          <div className="bg-white dark:bg-dark-900 rounded-xl p-6 border border-dark-200 dark:border-dark-800">
            <p className="text-dark-600 dark:text-dark-400 text-sm mb-2">已过期</p>
            <p className="text-2xl font-bold text-red-600">
              {cards.filter(card => !card.is_used && isExpired(card)).length}
            </p>
          </div>
        </div>

        {/* 卡片列表 */}
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">卡号</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">配额</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">创建时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">使用时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200 dark:divide-dark-800">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-dark-500">加载中...</td></tr>
                ) : cards.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-dark-500">暂无卡片</td></tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id} className="hover:bg-dark-50 dark:hover:bg-dark-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono">{card.code || '未知'}</code>
                          <button
                            onClick={() => copyCardCode(card.code)}
                            className="p-1 hover:bg-dark-100 dark:hover:bg-dark-700 rounded"
                            title="复制卡号"
                          >
                            <Copy className="w-4 h-4 text-dark-400" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900 dark:text-dark-50">
                        {card.quota_amount} 张
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          isUsed(card) ? 'bg-blue-100 text-blue-800' :
                          isExpired(card) ? 'bg-red-100 text-red-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {isUsed(card) ? '已使用' : isExpired(card) ? '已过期' : '未使用'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                        {new Date(card.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                        {card.used_at ? new Date(card.used_at).toLocaleDateString('zh-CN') : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 创建卡片模态框 */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-900 rounded-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50 mb-4">
                批量生成配额卡
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    生成数量
                  </label>
                  <input
                    type="number"
                    value={batchCount}
                    onChange={(e) => setBatchCount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg"
                    min="1"
                    max="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                    每卡配额（张）
                  </label>
                  <input
                    type="number"
                    value={quotaAmount}
                    onChange={(e) => setQuotaAmount(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg"
                    min="1"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreateCards}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    生成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

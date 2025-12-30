'use client';

import { useState } from 'react';
import { AlertCircle, Lock, X, Loader2 } from 'lucide-react';

interface DisableUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  user: { email?: string; username?: string } | null;
  isLoading?: boolean;
}

export default function DisableUserModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false
}: DisableUserModalProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !user) return null;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await onConfirm(reason);
      setReason('');
    } finally {
      setSubmitting(false);
    }
  };

  const reasonPresets = [
    { label: '违规行为', value: '违规行为' },
    { label: '垃圾账号', value: '垃圾账号' },
    { label: '恶意使用', value: '恶意使用' },
    { label: '欠费停用', value: '欠费停用' },
    { label: '临时禁用', value: '临时禁用' },
    { label: '其他原因', value: '其他原因' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-900 rounded-xl p-6 w-full max-w-md shadow-2xl">
        {/* 标题 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50">
              禁用用户账户？
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
          >
            <X className="w-5 h-5 text-dark-500" />
          </button>
        </div>

        {/* 用户信息 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 rounded-lg p-4 mb-4">
          <p className="text-dark-600 dark:text-dark-300">
            您将禁用用户：
            <span className="font-semibold text-dark-900 dark:text-dark-50 block mt-1">
              {user.email || user.username}
            </span>
          </p>
        </div>

        {/* 警告信息 */}
        <div className="flex gap-2 mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300">
            禁用后，该用户将无法登录，但数据会被保留。您可以稍后重新启用。
          </p>
        </div>

        {/* 禁用原因预设 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            禁用原因（可选）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {reasonPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setReason(preset.value)}
                disabled={submitting}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  reason === preset.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                } disabled:opacity-50`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* 自定义原因 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
            自定义原因
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
            placeholder="输入禁用原因（可选）"
            rows={3}
          />
          <p className="text-xs text-dark-500 mt-1">
            {reason.length} / 200 字符
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors disabled:opacity-50 text-dark-700 dark:text-dark-300"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                禁用中...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                确认禁用
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Search, Filter, Download, Trash2, Eye, Edit, AlertCircle, CheckCircle2, Lock, Unlock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { trackEvent } from '@/lib/analytics';

const EditSubscriptionModal = dynamic(() => import('@/components/EditSubscriptionModal'), { ssr: false });
const DisableUserModal = dynamic(() => import('@/components/DisableUserModal'), { ssr: false });

interface UserData {
  id: string;
  email?: string;
  created_at: string;
  email_confirmed_at?: string;
  profile?: {
    display_name?: string;
    username?: string;
    avatar_url?: string;
    is_disabled?: boolean;
    disabled_reason?: string;
  };
  subscription?: {
    plan_type: string;
    status: string;
    quota_remaining: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEnableConfirm, setShowEnableConfirm] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disableConfirmUser, setDisableConfirmUser] = useState<any>(null);
  const [disabledCount, setDisabledCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  // 隐藏消息提示
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/list');
      if (!response.ok) throw new Error('获取失败');
      
      const result = await response.json();
      if (result.success) {
        setUsers(result.users || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      setMessage({ type: 'error', text: '获取用户列表失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserData) => {
    setDeleteConfirmUser(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmUser) return;

    setDeleting(true);
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: deleteConfirmUser.id })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setMessage({ type: 'success', text: `用户 ${deleteConfirmUser.email} 已删除` });
      setShowDeleteConfirm(false);
      setDeleteConfirmUser(null);
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setDeleting(false);
    }
  };

  const handleDisableUser = (user: UserData) => {
    setDisableConfirmUser(user);
    setShowDisableModal(true);
  };

  const confirmDisable = async (reason: string) => {
    if (!disableConfirmUser) return;

    try {
      const response = await fetch('/api/users/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: disableConfirmUser.id,
          reason: reason
        })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setMessage({ type: 'success', text: `用户 ${disableConfirmUser.email} 已禁用` });
      setShowDisableModal(false);
      setDisableConfirmUser(null);
      fetchUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleEnableUser = async (user: UserData) => {
    setSelectedUser(user);
    setShowEnableConfirm(true);
  };

  const confirmEnableUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/users/enable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser.id })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setMessage({ type: 'success', text: `✅ 用户 ${selectedUser.email} 已成功启用，可以正常使用所有功能` });
      setShowEnableConfirm(false);
      setSelectedUser(null);
      
      // 延迟刷新，确保数据库更新完成
      setTimeout(() => {
        fetchUsers();
      }, 500);
    } catch (error: any) {
      setMessage({ type: 'error', text: `❌ ${error.message}` });
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 消息提示 */}
        {message && (
          <div className={`flex items-center gap-3 p-4 rounded-lg animate-fade-in ${
            message.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
            <span className={message.type === 'success' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}>
              {message.text}
            </span>
          </div>
        )}

        {/* 页面标题和操作 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">
              用户管理
            </h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">
              共 {filteredUsers.length} 个用户 • 管理和查看所有注册用户
            </p>
          </div>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出用户
          </button>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white dark:bg-dark-900 rounded-xl p-4 border border-dark-200 dark:border-dark-800">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索用户邮箱或用户名..."
                className="w-full pl-10 pr-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-800"
              />
            </div>
            <button className="px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              筛选
            </button>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-50 dark:bg-dark-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    用户
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    邮箱
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    套餐
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    配额
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    注册时间
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200 dark:divide-dark-800">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-dark-500">
                      加载中...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-dark-500">
                      暂无用户数据
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {user.profile?.avatar_url ? (
                            <img
                              src={user.profile.avatar_url}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-cyan-600 flex items-center justify-center text-white font-semibold shadow-sm">
                              {(user.profile?.display_name || user.profile?.username || user.email)?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          )}
                          <div>
                            <div className="font-medium text-dark-900 dark:text-dark-50">
                              {user.profile?.display_name || user.profile?.username || user.email?.split('@')[0] || '未设置'}
                            </div>
                            {user.profile?.username && user.profile?.display_name && (
                              <div className="text-xs text-dark-500">@{user.profile.username}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-dark-900 dark:text-dark-50">
                          {user.email}
                        </div>
                        {user.profile?.is_disabled ? (
                          <span className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                            🔒 已禁用
                          </span>
                        ) : user.email_confirmed_at ? (
                          <span className="text-xs text-green-600 dark:text-green-400">✓ 已验证</span>
                        ) : (
                          <span className="text-xs text-yellow-600 dark:text-yellow-400">⚠ 未验证</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          user.subscription?.plan_type === 'pro'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                            : user.subscription?.plan_type === 'team'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                            : 'bg-dark-100 dark:bg-dark-800 text-dark-800 dark:text-dark-300'
                        }`}>
                          {user.subscription?.plan_type?.toUpperCase() || 'FREE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900 dark:text-dark-50">
                        {user.subscription?.quota_remaining || 0} 张
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => {
                              setSelectedUser(user);
                              setShowEditModal(true);
                            }}
                            className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                            title="编辑订阅"
                          >
                            <Edit className="w-4 h-4 text-primary-500" />
                          </button>
                          <button className="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-dark-500" />
                          </button>
                          {user.profile?.is_disabled ? (
                            <button 
                              onClick={() => handleEnableUser(user)}
                              className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="启用用户"
                            >
                              <Unlock className="w-4 h-4 text-green-500" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleDisableUser(user)}
                              className="p-2 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                              title="禁用用户"
                            >
                              <Lock className="w-4 h-4 text-yellow-500" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="删除用户"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 分页 */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-dark-600 dark:text-dark-400">
            共 {filteredUsers.length} 个用户
          </p>
        </div>
      </div>

      {/* 编辑订阅模态框 */}
      <EditSubscriptionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUser(null);
        }}
        onSuccess={() => {
          fetchUsers();
        }}
        user={selectedUser}
      />

      {/* 删除确认对话框 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50">
                  确认删除用户？
                </h3>
              </div>
            </div>

            <p className="text-dark-600 dark:text-dark-400 mb-2">
              您即将删除用户：<span className="font-semibold text-dark-900 dark:text-dark-50">{deleteConfirmUser?.email}</span>
            </p>
            
            <p className="text-sm text-red-600 dark:text-red-400 mb-6">
              ⚠️ 此操作将删除用户的所有数据，包括订阅、配额卡、使用日志等，且无法恢复！
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmUser(null);
                }}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    删除中...
                  </>
                ) : (
                  '确认删除'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 禁用用户模态框 */}
      <DisableUserModal
        isOpen={showDisableModal}
        onClose={() => setShowDisableModal(false)}
        onConfirm={confirmDisable}
        user={disableConfirmUser}
      />

      {/* 启用确认对话框 */}
      {showEnableConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Unlock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark-900 dark:text-dark-50">启用用户账户？</h3>
                <p className="text-sm text-dark-600 dark:text-dark-400">该操作将恢复用户的正常访问权限</p>
              </div>
            </div>

            <div className="bg-dark-50 dark:bg-dark-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-dark-700 dark:text-dark-300 mb-2">
                <strong>用户邮箱：</strong>{selectedUser.email}
              </p>
              {selectedUser.profile?.disabled_reason && (
                <p className="text-sm text-dark-600 dark:text-dark-400">
                  <strong>禁用原因：</strong>{selectedUser.profile.disabled_reason}
                </p>
              )}
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  启用后，用户可以正常登录和使用所有服务
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEnableConfirm(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmEnableUser}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" />
                确认启用
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
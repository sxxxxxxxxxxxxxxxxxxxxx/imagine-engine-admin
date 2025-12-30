'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Plus, Trash2, Shield, Key, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface Admin {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string;
}

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmAdmin, setDeleteConfirmAdmin] = useState<Admin | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  // 隐藏消息提示
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins/list');
      if (!response.ok) throw new Error('获取失败');
      
      const result = await response.json();
      if (result.success) {
        setAdmins(result.admins || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('获取管理员列表失败:', error);
      setMessage({ type: 'error', text: '获取管理员列表失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newEmail || !newPassword) {
      setMessage({ type: 'error', text: '请填写邮箱和密码' });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/admins/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          role: newRole
        })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      setMessage({ type: 'success', text: `✅ 管理员 ${newEmail} 创建成功！` });
      setShowCreateModal(false);
      setNewEmail('');
      setNewPassword('');
      setNewRole('admin');
      fetchAdmins();
    } catch (error: any) {
      console.error('创建管理员失败:', error);
      setMessage({ type: 'error', text: `❌ 创建失败: ${error.message}` });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAdmin = (admin: Admin) => {
    setDeleteConfirmAdmin(admin);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmAdmin) return;

    setDeleting(true);
    try {
      const response = await fetch('/api/admins/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adminId: deleteConfirmAdmin.id,
          adminEmail: deleteConfirmAdmin.email
        })
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.error);

      setMessage({ type: 'success', text: `管理员 ${deleteConfirmAdmin.email} 已删除` });
      setShowDeleteConfirm(false);
      setDeleteConfirmAdmin(null);
      fetchAdmins();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setDeleting(false);
    }
  };

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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-dark-50">管理员管理</h1>
            <p className="text-dark-600 dark:text-dark-400 mt-1">共 {admins.length} 个管理员 • 管理后台管理员账号</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            添加管理员
          </button>
        </div>

        <div className="bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">创建时间</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">最后登录</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-dark-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-200 dark:divide-dark-800">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-dark-500">加载中...</td></tr>
              ) : admins.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-dark-500">暂无管理员</td></tr>
              ) : (
                admins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-medium text-dark-900 dark:text-dark-50">
                          {admin.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        admin.role === 'super_admin' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                        admin.role === 'admin' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                        'bg-dark-100 dark:bg-dark-800 text-dark-800 dark:text-dark-300'
                      }`}>
                        {admin.role === 'super_admin' ? '超级管理员' : admin.role === 'admin' ? '管理员' : '查看者'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                      {new Date(admin.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500">
                      {admin.last_login ? new Date(admin.last_login).toLocaleDateString('zh-CN') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button 
                        onClick={() => handleDeleteAdmin(admin)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="删除管理员"
                      >
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

      {/* 创建管理员模态框 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-900 dark:text-dark-50">添加管理员</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg"
              >
                <X className="w-5 h-5 text-dark-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">邮箱</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="admin@example.com"
                  disabled={creating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">密码</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="••••••••"
                  disabled={creating}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">角色</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg dark:bg-dark-800 focus:ring-2 focus:ring-primary-500 outline-none"
                  disabled={creating}
                >
                  <option value="viewer">查看者</option>
                  <option value="admin">管理员</option>
                  <option value="super_admin">超级管理员</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-800 disabled:opacity-50"
                  disabled={creating}
                >
                  取消
                </button>
                <button
                  onClick={handleCreateAdmin}
                  className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      创建中...
                    </>
                  ) : (
                    '创建'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  确认删除管理员？
                </h3>
              </div>
            </div>

            <p className="text-dark-600 dark:text-dark-400 mb-2">
              您即将删除管理员：<span className="font-semibold text-dark-900 dark:text-dark-50">{deleteConfirmAdmin?.email}</span>
            </p>
            
            <p className="text-sm text-red-600 dark:text-red-400 mb-6">
              ⚠️ 此操作将永久删除该管理员账号！
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmAdmin(null);
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
    </AdminLayout>
  );
}
import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit2, ShieldCheck, User as UserIcon } from 'lucide-react';
import api from '../api';
import { Button } from './common/Button';
import { useAuth } from '../contexts/AuthContext';

interface UserData {
  id: number;
  employee_id: string;
  username: string;
  email: string;
  role_name: string;
  role_id: number;
  created_at: string;
}

export const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    username: '',
    email: '',
    password: '',
    role_id: 1, // 1=Level 1, 2=Level 2
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
      setError('');
    } catch (err) {
      setError('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ employee_id: '', username: '', email: '', password: '', role_id: 1 });
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      employee_id: user.employee_id,
      username: user.username,
      email: user.email || '',
      password: '', // blank unless changing
      role_id: user.role_id,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('คุณต้องการลบผู้ใช้งานนี้ใช่หรือไม่?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการลบผู้ใช้');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, formData);
      } else {
        await api.post('/users', formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  if (isLoading && users.length === 0) return <div className="p-8 text-center text-slate-500">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center bg-white p-4 sm:p-6 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">User Management</h2>
          <p className="text-sm text-slate-500 mt-1">จัดการผู้ใช้งานและสิทธิ์การเข้าถึงระบบ</p>
        </div>
        <Button variant="primary" icon={<PlusCircle className="w-4 h-4" />} onClick={openAddModal}>
          Add User
        </Button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">{error}</div>}

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 flex items-center space-x-2">
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>{user.employee_id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    <div>{user.username}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role_id === 2 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {user.role_id === 2 ? <ShieldCheck className="w-3 h-3 mr-1" /> : null}
                      {user.role_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(user.created_at).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-sky-600 hover:text-sky-900 mr-4"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.employee_id !== 'admin' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {editingUser ? 'แก้ไขผู้ใช้งาน' : 'เพิ่มผู้ใช้งานใหม่'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">รหัสพนักงาน (Employee ID)</label>
                <input
                  type="text"
                  required
                  disabled={!!editingUser}
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  รหัสผ่าน {editingUser && '(กรอกเฉพาะต้องการเปลี่ยนรหัส)'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ระดับสิทธิ์ (Role)</label>
                <select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md"
                >
                  <option value={1}>Level 1 (Owner)</option>
                  <option value={2}>Level 2 (Admin / CAL)</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>ยกเลิก</Button>
                <Button variant="primary" type="submit">บันทึกข้อมูล</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

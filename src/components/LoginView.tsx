import React, { useState } from 'react';
import { Database, Lock, User, Loader2 } from 'lucide-react';
import api from '../api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './common/Button';

export const LoginView: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { employee_id: employeeId, password });
      const { token, user } = response.data;
      login(token, user);
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#006194] px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">QM Asset Control</h1>
          <p className="text-sky-200 text-sm">Hana Microelectronics (Lamphun)</p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">เข้าสู่ระบบ (Login)</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                รหัสพนักงาน (Employee ID)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-colors bg-slate-50 focus:bg-white"
                  placeholder="กรอกรหัสพนักงาน"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-sm transition-colors bg-slate-50 focus:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-2.5 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  กำลังเข้าสู่ระบบ...
                </>
              ) : (
                'เข้าสู่ระบบ (Sign In)'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-500">
            หากลืมรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ (Admin)
          </div>
        </div>
      </div>
    </div>
  );
};

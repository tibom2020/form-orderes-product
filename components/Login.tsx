
import React, { useState } from 'react';
import type { Employee } from '../types';

interface LoginProps {
  employees: Employee[];
  onLoginSuccess: (employee: Employee) => void;
}

const Login: React.FC<LoginProps> = ({ employees, onLoginSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
        const foundEmployee = employees.find(emp => emp.code === code.trim());
        if (foundEmployee) {
          onLoginSuccess(foundEmployee);
        } else {
          setError('Mã nhân viên không hợp lệ. Vui lòng thử lại.');
        }
        setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-sans">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-xl border border-slate-200">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-sky-600">Đăng Nhập</h1>
            <p className="mt-2 text-slate-500">Vui lòng nhập mã nhân viên của bạn</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="employeeCode" className="block text-sm font-medium text-slate-700">
              Mã nhân viên
            </label>
            <div className="mt-1">
              <input
                id="employeeCode"
                name="employeeCode"
                type="text"
                autoComplete="off"
                required
                value={code}
                onChange={(e) => {
                    setCode(e.target.value);
                    setError('');
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                placeholder="e.g., 20045852"
              />
            </div>
          </div>

          {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-sky-300 disabled:cursor-wait transition-colors"
            >
              {isLoading ? 'Đang kiểm tra...' : 'Đăng Nhập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

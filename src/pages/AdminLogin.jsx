import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useDispatch } from 'react-redux';
import Navbar from "../components/Navbar";
import { setCredentials } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext'; // ✅ theme context

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme } = useTheme(); // ✅ theme hook

  const email = 'superadmin@example.com'; // Fixed super admin email

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password.trim()) {
      setErrorMsg('Password is required');
      return;
    }

    try {
      const response = await API.post('/admin/login', { email, password }, { withCredentials: true });
      const admin = response.data.admin;

      if (!admin || admin.role !== 'superadmin') {
        setErrorMsg('Unauthorized access');
        return;
      }

      dispatch(setCredentials(admin));
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("❌ Login failed:", error);
      setErrorMsg(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <>
      <div style={{
        backgroundColor: theme === 'dark' ? '#111' : '#f8f9fa',
        color: theme === 'dark' ? '#fff' : '#000',
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        <Navbar />
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <div className={`card p-4 shadow ${theme === 'dark' ? 'bg-dark text-light' : 'bg-white'}`} style={{ maxWidth: '400px', width: '100%' }}>
            <h4 className="text-center mb-3">🔒 Super Admin Verification</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Re-enter Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password again"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    backgroundColor: theme === 'dark' ? '#333' : '#fff',
                    color: theme === 'dark' ? '#fff' : '#000',
                    border: theme === 'dark' ? '1px solid #555' : undefined
                  }}
                />
              </div>

              {errorMsg && (
                <div className="alert alert-danger py-2 small" role="alert">
                  {errorMsg}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100 mt-2">
                Verify & Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;

// src/pages/AdminLogin.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'; // Make sure this is your axios instance
import { useDispatch } from 'react-redux';
import Navbar from "../components/Navbar";
import { setCredentials } from '../features/auth/authSlice';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const email = 'superadmin@example.com'; // Hardcoded or fetched from previous login state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!password) {
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

      dispatch(setCredentials(admin)); // Store in Redux
      navigate('/admin/dashboard');
    } catch (error) {
      setErrorMsg(error.response?.data?.error || 'Login failed');
    }
  };

  return (<>
  <div style={{ backgroundColor: "black", minHeight: '100vh' }}>
    <Navbar />
    <div className="container d-flex justify-content-center  align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow-light" style={{ maxWidth: '400px', width: '100%' }}>
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
            />
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-1" role="alert">
              {errorMsg}
            </div>
          )}

          <button type="submit" className="btn btn-dark w-100">Verify & Login</button>
        </form>
      </div>
    </div>
    </div>
    
</>
  );
};

export default AdminLogin;

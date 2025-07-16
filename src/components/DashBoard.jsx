import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { Link, useNavigate } from 'react-router-dom';
import API from "../api/axios";
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { setCartItems } from '../features/auth/cartSlice';
import Footer from "../components/Footer";
import './Dashboard.css';
import { useTheme } from "../context/ThemeContext"; // ✅ theme hook

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItemCount = useSelector((state) => state.cart.totalItems || 0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { theme } = useTheme(); // ✅

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      let loginUrl = '/user/login';
      if (email.trim().toLowerCase() === 'superadmin@example.com') {
        loginUrl = '/admin/login';
      }

      const response = await API.post(loginUrl, { email, password }, { withCredentials: true });
      const data = response.data;
      const user = data.user || data.seller || data.admin;

      if (!user) return setErrorMsg('Invalid response: No user data');

      dispatch(setCredentials(user));

      try {
        const cartRes = await API.get('/cart', { withCredentials: true });
        const cartItems = cartRes.data?.cart?.cartItems || [];
        dispatch(setCartItems(cartItems));
      } catch (cartErr) {
        console.error('⚠️ Failed to load cart:', cartErr);
      }

      switch (user.role) {
        case 'seller': navigate('/seller/dashboard'); break;
        case 'user': navigate('/user/dashboard'); break;
        case 'superadmin': navigate('/admin/login'); break;
        default: setErrorMsg('Unknown user role');
      }

    } catch (error) {
      console.error("🔥 Login error:", error);
      setErrorMsg(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <>
      <Navbar cartItemCount={cartItemCount} />

      <div
        className={`container my-4 mt-5 rounded shadow`}
        style={{
          backgroundColor: theme === "dark" ? "#222" : "#f8f9fa",
          color: theme === "dark" ? "#fff" : "#000",
          transition: "all 0.3s ease"
        }}
      >
        <div className={`row p-4 ${theme === "dark" ? "bg-dark text-light" : "bg-light"}`}>
          {/* Left - Login Form */}
          <div className="col-md-6 border-end">
            <h4 className="mb-4">Login with Email and Password</h4>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    backgroundColor: theme === "dark" ? "#333" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined
                  }}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    backgroundColor: theme === "dark" ? "#333" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined
                  }}
                />
              </div>

              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="remember" />
                <label className="form-check-label" htmlFor="remember">Remember me</label>
              </div>

              {errorMsg && <p className="text-danger fw-semibold">{errorMsg}</p>}

              <button type="submit" className="btn btn-primary w-100">LOGIN</button>

              <div className="mt-2 text-end">
                <Link to="/reset-password" className="text-decoration-none small">Forgot password?</Link>
              </div>
            </form>
          </div>

          {/* Right - Register Info */}
          <div className="col-md-6 ps-4">
            <h5>New User? Create An Account</h5>
            <p className="text-muted">
              Sign up and explore our exclusive Diamond Collection
            </p>
            <ul className="text-muted small">
              <li>✔ Seamless and secure login</li>
              <li>✔ Manage your profile & track orders</li>
              <li>✔ Access to personalized offers</li>
            </ul>
            <div>
              <Link to="/user/register" className="btn btn-primary mt-3 me-3">Create as User</Link>
              <Link to="/seller/register" className="btn btn-outline-primary mt-3">Create as Seller</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import Navbar from "../components/Navbar";
import { Link, useNavigate } from 'react-router-dom';
import API from "../api/axios";
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import './Dashboard.css';
import Footer from "../components/Footer";
import { setCartItems } from '../features/auth/cartSlice'; // ✅ import


const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 👉 Get cart item count from Redux
  const cartItemCount = useSelector((state) => state.cart.totalItems || 0);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      console.log("📨 Email being sent:", email);
      console.log("🔐 Password being sent:", password);

      // Dynamically choose login URL
      let loginUrl = '/user/login'; // default
      if (email.trim().toLowerCase() === 'superadmin@example.com') {
        loginUrl = '/admin/login';
      }

      const response = await API.post(loginUrl, { email, password }, { withCredentials: true });

      const data = response.data;
      const user = data.user || data.seller || data.admin;

      console.log("✅ Logged in user:", user);

      if (!user) {
        setErrorMsg('Invalid response: No user data');
        return;
      }

      dispatch(setCredentials(user));
      // Fetch cart and set in Redux
try {
  const cartRes = await API.get('/cart', { withCredentials: true });
  const cartItems = cartRes.data?.cart?.cartItems || [];
  dispatch(setCartItems(cartItems)); // ✅ update Redux cart
} catch (cartErr) {
  console.error('⚠️ Failed to load cart:', cartErr);
}


      switch (user.role) {
        case 'seller':
          navigate('/seller/dashboard');
          break;
        case 'user':
          navigate('/user/dashboard');
          break;
        case 'superadmin':
          navigate('/admin/login');
          break;
        default:
          setErrorMsg('Unknown user role');
      }

    } catch (error) {
      console.error("🔥 Login error:", error);
      setErrorMsg(error.response?.data?.error || 'Login failed');
    }
  };

  return (
    <>
      {/* ✅ Pass cart count to Navbar */}
      <Navbar cartItemCount={cartItemCount} />

      <div className="container bg-dark my-4 mt-5">
        <div className="row shadow p-4 rounded bg-light">
          {/* Left Side: Login */}
          <div className="col-md-6 border-end">
            <h4 className="mb-4">Login with Email and Password</h4>
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" id="email" className="form-control" placeholder="Enter your Email"
                  value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" id="password" className="form-control" placeholder="Enter your password"
                  value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="remember" />
                <label className="form-check-label" htmlFor="remember">Remember me</label>
              </div>

              {errorMsg && <p className="text-danger">{errorMsg}</p>}

              <button type="submit" className="btn btn-primary w-100">LOGIN</button>

              <div className="mt-2 text-end">
                <Link to="/reset-password" className="text-decoration-none small">Forgot password?</Link>
              </div>
            </form>
          </div>

          {/* Right Side: Create Account */}
          <div className="col-md-6 ps-4">
            <h5>New User? Create An Account</h5>
            <p className="text-muted">
              Sign up and know more about our perfect world of Diamond Collection
            </p>
            <ul className="text-muted small">
              <li>✔ Seamless and secure login experience</li>
              <li>✔ Manage your profile and buy items easily</li>
              <li>✔ Quick access to support and account settings</li>
            </ul>
            <div>
              <Link to="/user/register" className="btn btn-primary mt-3 me-3">Create account as User</Link>
              <Link to="/seller/register" className="btn btn-primary mt-3">Create account as Seller</Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;

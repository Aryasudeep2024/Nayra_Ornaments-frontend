import React, { useState, useContext } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext"; // ✅ import theme context

const SellerResetPassword = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // 🎯 get current theme

  const [formData, setFormData] = useState({
    email: "",
    mobileNumber: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await API.post("/seller/reset-password", formData);
      setMessage(res.data.message);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className={`container py-5 ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <div className="row justify-content-center">
        <div className={`col-md-6 p-4 rounded shadow ${theme === 'dark' ? 'bg-secondary' : 'bg-white'}`}>
          <h4 className="mb-4 text-center">🔒 Seller Reset Password</h4>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Mobile Number</label>
              <input
                type="text"
                className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>New Password</label>
              <input
                type="password"
                className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                className={`form-control ${theme === 'dark' ? 'bg-dark text-light border-secondary' : ''}`}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={`btn w-100 mt-2 ${theme === 'dark' ? 'btn-light' : 'btn-dark'}`}>
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerResetPassword;

import React, { useState } from "react";
import API from "../../api/axios"; // ✅ use your custom axios instance
import { useNavigate } from "react-router-dom";
 // (Optional for custom styling)

const SellerResetPassword = () => {
  const navigate = useNavigate();

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
      setTimeout(() => navigate("/dashboard"), 2000); // redirect to login after 3s
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (<>
    <div className="container py-5">
      <div className="  ">
        
        {/* Right Side Form */}
        <div className="col-md-6 bg-white ms-5 justify-content-center p-6">
          <h4 className="mb-4 justify-content-center text-center">🔒 Seller Reset Password</h4>

          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100 mt-2">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default SellerResetPassword;

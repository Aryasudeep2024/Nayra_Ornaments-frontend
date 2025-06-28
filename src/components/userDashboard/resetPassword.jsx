import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
    role: "user", // default role
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const response = await axios.post("/user/reset-password", formData); // backend will check role too
      setSuccessMsg(response.data.message);

      setFormData({ email: "", newPassword: "", confirmPassword: "", role: "user" });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("❌ Reset failed:", error);
      setErrorMsg(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="container mt-4">
      <h3>🔒 Reset Your Password</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label>Email (used at registration)</label>
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
          <label>Select Role</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>
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
          <label>Confirm New Password</label>
          <input
            type="password"
            className="form-control"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Reset Password
        </button>
      </form>

      {successMsg && (
        <div className="alert alert-success mt-3">
          {successMsg} Redirecting to dashboard...
        </div>
      )}
      {errorMsg && (
        <div className="alert alert-danger mt-3">{errorMsg}</div>
      )}
    </div>
  );
};

export default ResetPassword;

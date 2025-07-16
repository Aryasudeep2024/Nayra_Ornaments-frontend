import React, { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../api/axios";
import { setCredentials } from "../../features/auth/authSlice";
import { ThemeContext } from "../../context/ThemeContext"; // ✅ Theme context

const UpdateUser = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { theme } = useContext(ThemeContext); // 🎯 Get current theme

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    profilePic: user?.profilePic || ""
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.put("/user/update", formData, {
        withCredentials: true
      });

      dispatch(setCredentials(res.data.data));
      setSuccessMsg("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      setErrorMsg(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className={`container py-4 ${theme === "dark" ? "text-light bg-dark" : "text-dark bg-light"}`}>
      <h3 className="mb-4">✏️ Update Profile</h3>

      <form
        className={`card p-4 shadow-sm ${theme === "dark" ? "bg-secondary text-light" : "bg-white text-dark"}`}
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* You can enable password or profilePic field later if needed */}

        {errorMsg && <p className="text-danger">{errorMsg}</p>}
        {successMsg && <p className="text-success">{successMsg}</p>}

        <button
          type="submit"
          className={`btn ${theme === "dark" ? "btn-light" : "btn-primary"} w-100`}
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateUser;

import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../api/axios"; // ✅ Your configured Axios instance

const UpdateSeller = () => {
  const { _id, name, email, shopName, contactNumber, profilePic } = useSelector(
    (state) => state.auth.user
  );

  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    shopName: shopName || "",
    contactNumber: contactNumber || "",
    profilePic: profilePic || "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
      const response = await axios.put(
        "/seller/update-profile", // ✅ IMPORTANT: Match backend route
        formData,
        { withCredentials: true }
      );

      setSuccessMsg(response.data.message || "Profile updated successfully");
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="container">
      <h3 className="mb-4">✏️ Update Seller Profile</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Shop Name</label>
            <input
              type="text"
              className="form-control"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label>Contact Number</label>
            <input
              type="text"
              className="form-control"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 mb-3">
            <label>Profile Picture URL</label>
            <input
              type="text"
              className="form-control"
              name="profilePic"
              value={formData.profilePic}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary">Update Profile</button>
          </div>
        </div>
      </form>

      {/* ✅ Success or Error Messages */}
      {successMsg && (
        <div className="alert alert-success mt-3">{successMsg}</div>
      )}
      {errorMsg && (
        <div className="alert alert-danger mt-3">{errorMsg}</div>
      )}
    </div>
  );
};

export default UpdateSeller;

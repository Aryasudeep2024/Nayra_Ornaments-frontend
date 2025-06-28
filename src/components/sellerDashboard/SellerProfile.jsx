import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";

const SellerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const res = await API.get("/seller/profile"); // 👈 correct path
       // console.log("👀 Seller profile:", res.data);
        setProfile(res.data);
        dispatch(setCredentials(res.data)); // store in redux
      } catch (err) {
        console.error("❌ Error fetching seller profile:", err);
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    };

    fetchSellerProfile();
  }, []);

  

  if (error) return <p className="text-danger">{error}</p>;
  if (!profile) return <p>Loading seller profile...</p>;

  return (
    <div className="p-4 shadow rounded bg-white">
      <h4 className="mb-3">👤 Seller Profile</h4>
      <div className="row">
        <div className="col-md-4 text-center">
          <img
            src={profile.profilePic || "/images/userpic.png"}
            alt="Seller"
            className="img-fluid rounded-circle"
            style={{ maxWidth: "150px" }}
          />
        </div>
        <div className="col-md-8">
          <table className="table table-borderless">
            <tbody>
              <tr><th>Name:</th><td>{profile.name}</td></tr>
              <tr><th>Email:</th><td>{profile.email}</td></tr>
              <tr><th>Shop Name:</th><td>{profile.shopName || "N/A"}</td></tr>
              <tr><th>Contact Number:</th><td>{profile.contactNumber || "N/A"}</td></tr>
              <tr><th>Status:</th><td>{profile.isApproved ? "✅ Approved" : "⏳ Pending Approval"}</td></tr>
              <tr><th>Joined:</th><td>{new Date(profile.createdAt).toLocaleDateString()}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;

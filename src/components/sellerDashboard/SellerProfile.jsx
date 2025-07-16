import React, { useEffect, useState, useContext } from "react";
import API from "../../api/axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { ThemeContext } from "../../context/ThemeContext"; // ✅ Import ThemeContext

const SellerProfile = () => {
  const { theme } = useContext(ThemeContext); // 🎯 Get theme from context
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        const res = await API.get("/seller/profile");
        setProfile(res.data);
        dispatch(setCredentials(res.data));
      } catch (err) {
        console.error("❌ Error fetching seller profile:", err);
        setError(err.response?.data?.message || "Failed to fetch profile");
      }
    };

    fetchSellerProfile();
  }, [dispatch]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!profile) return <p className={theme === "dark" ? "text-light" : "text-dark"}>Loading seller profile...</p>;

  return (
    <div className={`p-4 shadow rounded ${theme === "dark" ? "bg-dark text-light" : "bg-white text-dark"}`}>
      <h4 className="mb-3">👤 Seller Profile</h4>
      <div className="row">
        <div className="col-md-4 text-center">
          <img
            src={profile.profilePic || "/images/userpic.png"}
            alt="Seller"
            className="img-fluid rounded-circle border"
            style={{ maxWidth: "150px", borderColor: theme === "dark" ? "#666" : "#ccc" }}
          />
        </div>
        <div className="col-md-8">
          <table className={`table ${theme === "dark" ? "table-dark table-borderless" : "table-borderless"}`}>
            <tbody>
              <tr><th>Name:</th><td>{profile.name}</td></tr>
              <tr><th>Email:</th><td>{profile.email}</td></tr>
              <tr><th>Shop Name:</th><td>{profile.shopName || "N/A"}</td></tr>
              <tr><th>Contact Number:</th><td>{profile.contactNumber || "N/A"}</td></tr>
              <tr>
                <th>Status:</th>
                <td>
                  {profile.isApproved ? (
                    <span className="text-success">✅ Approved</span>
                  ) : (
                    <span className="text-warning">⏳ Pending Approval</span>
                  )}
                </td>
              </tr>
              <tr><th>Joined:</th><td>{new Date(profile.createdAt).toLocaleDateString()}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;

import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction, setCredentials } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

// Seller components (create these separately like user ones)
import SellerProfile from "../components/sellerDashboard/SellerProfile";
import UpdateSeller from "../components/sellerDashboard/UpdateSeller";
import ResetSellerPassword from "../components/sellerDashboard/ResetSellerPassword";
import ProductManagement from "../components/sellerDashboard/ProductManagement"; // Conditionally rendered

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const seller = useSelector((state) => state.auth.user); // Same slice for sellers
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/seller/profile", { withCredentials: true });
      dispatch(setCredentials(res.data.data)); // Save to Redux
    } catch (err) {
      console.error("❌ Error fetching seller profile:", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!seller) {
      fetchSellerData();
    }
  }, [seller]);

  const handleLogout = async () => {
    try {
      await axios.post("/seller/logout", {}, { withCredentials: true });
      dispatch(logoutAction());
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Logout failed", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.delete("/seller/delete-account", { withCredentials: true });
        dispatch(logoutAction());
        navigate("/register-seller");
      } catch (error) {
        console.error("❌ Error deleting seller account", error);
      }
    }
  };

  if (loading || !seller) {
    return <p className="mt-5 text-center">Loading seller profile...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
          <div className="text-center mb-4">
            <img
              src={seller?.profilePic || "/images/userpic.png"}
              alt="Seller"
              className="rounded-circle mb-2"
              width={80}
              height={80}
            />
            <h5>{seller?.name || "Seller Name"}</h5>
          </div>

          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "profile" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("profile")}
              >
                👤 My Profile
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "update" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("update")}
              >
                ✏️ Update Profile
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "reset" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("reset")}
              >
                🔒 Reset Password
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "products" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("products")}
              >
                📦 Manage Products
              </button>
            </li>
            <li className="nav-item mb-2">
              <button className="btn w-100 btn-outline-light" onClick={handleDelete}>
                ❌ Delete Account
              </button>
            </li>
            <li className="nav-item">
              <button className="btn w-100 btn-outline-light" onClick={handleLogout}>
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="p-4 flex-grow-1 bg-light">
          {activeSection === "profile" && <SellerProfile />}
          {activeSection === "update" && <UpdateSeller />}
          {activeSection === "reset" && <ResetSellerPassword />}
          {activeSection === "products" && (
            seller?.isApproved ? (
              <ProductManagement />
            ) : (
              <div className="alert alert-warning">
                🛑 Your account is not yet approved by the Super Admin. Product management will be available once approved.
              </div>
            )
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default SellerDashboard;

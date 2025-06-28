import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction, setCredentials } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import user-specific components
import CartUser from "../components/userDashboard/cartUser";
import UserProfile from "../components/userDashboard/userProfile";
import UpdateUser from "../components/userDashboard/updateUser";
import ResetPassword from "../components/userDashboard/resetPassword";

const UserDashboard = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // ✅ for checking if redirected with cart open

  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("cart"); // Default section

  // ✅ Fetch user if not already in Redux
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/user/profile", { withCredentials: true });
      dispatch(setCredentials(res.data.data));
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Run only once on mount to handle openCart state
  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
    // Handle redirection from "Add to Cart" to open Cart directly
    if (location.state?.openCart) {
      setActiveSection("cart");
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get("/user/logout", { withCredentials: true });
      dispatch(logoutAction());
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Logout failed", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      try {
        await axios.delete("/user/delete", { withCredentials: true });
        dispatch(logoutAction());
        navigate("/register-user");
      } catch (error) {
        console.error("❌ Error deleting account", error);
      }
    }
  };

  if (loading || !user) {
    return <p className="mt-5 text-center">Loading user profile...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
          <div className="text-center mb-4">
            <img
              src={user?.profilePic || "/images/userpic.png"}
              alt="User"
              className="rounded-circle mb-2"
              width={80}
              height={80}
            />
            <h5>{user?.name || "User Name"}</h5>
          </div>

          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 mt-4 ${activeSection === "cart" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("cart")}
              >
                🛒 My Cart
              </button>
            </li>
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

        {/* Right Content */}
        <div className="p-4 flex-grow-1 bg-light">
          {activeSection === "cart" && <CartUser />}
          {activeSection === "profile" && <UserProfile />}
          {activeSection === "update" && <UpdateUser />}
          {activeSection === "reset" && <ResetPassword />}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserDashboard;

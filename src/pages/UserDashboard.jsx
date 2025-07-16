import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction, setCredentials } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrdersModal from "../components/OrdersModal";
import CartUser from "../components/userDashboard/cartUser";
import UserProfile from "../components/userDashboard/userProfile";
import UpdateUser from "../components/userDashboard/updateUser";
import ResetPassword from "../components/userDashboard/resetPassword";
import { useTheme } from "../context/ThemeContext";
import { Modal, Button } from "react-bootstrap"; // ✅ Add Bootstrap Modal

const UserDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("cart");
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // ✅ modal state

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

  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
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
    try {
      await axios.delete("/user/delete", { withCredentials: true });
      dispatch(logoutAction());
      navigate("/register-user");
    } catch (error) {
      console.error("❌ Error deleting account", error);
    }
  };

  if (loading || !user) {
    return <p className="mt-5 text-center">Loading user profile...</p>;
  }

  const isDark = theme === "dark";

  return (
    <>
      <Navbar />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div
          className={`p-3 ${isDark ? "bg-dark text-white" : "bg-light text-dark"}`}
          style={{ width: "250px", transition: "background 0.3s, color 0.3s" }}
        >
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
            {[
              { key: "cart", label: "🛒 My Cart" },
              { key: "profile", label: "👤 My Profile" },
              { key: "update", label: "✏️ Update Profile" },
              { key: "reset", label: "🔒 Reset Password" },
              { key: "orders", label: "🧾 My Orders", isModal: true },
            ].map(({ key, label, isModal }) => (
              <li key={key} className="nav-item mb-2">
                <button
                  className={`btn w-100 ${
                    activeSection === key ? "btn-warning" : isDark ? "btn-outline-light" : "btn-outline-dark"
                  }`}
                  onClick={() => {
                    setActiveSection(key);
                    if (isModal) setShowOrdersModal(true);
                  }}
                >
                  {label}
                </button>
              </li>
            ))}

            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${isDark ? "btn-outline-light" : "btn-outline-danger"}`}
                onClick={() => setShowDeleteModal(true)} // ✅ Open modal
              >
                ❌ Delete Account
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn w-100 ${isDark ? "btn-outline-light" : "btn-outline-secondary"}`}
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Right content */}
        <div className={`p-4 flex-grow-1 ${isDark ? "bg-black text-light" : "bg-light text-dark"}`}>
          {activeSection === "cart" && <CartUser />}
          {activeSection === "profile" && <UserProfile />}
          {activeSection === "update" && <UpdateUser />}
          {activeSection === "reset" && <ResetPassword />}
        </div>
      </div>

      {/* Orders Modal */}
      <OrdersModal
        show={showOrdersModal}
        handleClose={() => {
          setShowOrdersModal(false);
          setActiveSection("profile");
        }}
      />

      {/* ✅ Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className={isDark ? "bg-dark text-white" : ""}>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? "bg-dark text-white" : ""}>
          Are you sure you want to delete your account? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer className={isDark ? "bg-dark" : ""}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete My Account
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default UserDashboard;

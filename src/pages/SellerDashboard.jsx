import React, { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction, setCredentials } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeContext } from "../context/ThemeContext";
import SellerProfile from "../components/sellerDashboard/SellerProfile";
import UpdateSeller from "../components/sellerDashboard/UpdateSeller";
import ResetSellerPassword from "../components/sellerDashboard/ResetSellerPassword";
import ProductManagement from "../components/sellerDashboard/ProductManagement";
import SellerOrders from "../components/sellerDashboard/SellerOrders";
import { Modal, Button } from "react-bootstrap";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const seller = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/seller/profile", { withCredentials: true });
      dispatch(setCredentials(res.data.data));
    } catch (err) {
      console.error("❌ Error fetching seller profile:", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!seller) fetchSellerData();
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

  const confirmDelete = async () => {
    try {
      setShowDeleteModal(false);
      await axios.delete("/seller/delete-account", { withCredentials: true });
      dispatch(logoutAction());
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Error deleting seller account", error);
    }
  };

  if (loading || !seller) {
    return (
      <p className={`mt-5 text-center ${isDark ? "text-light" : "text-dark"}`}>
        Loading seller profile...
      </p>
    );
  }

  return (
    <>
      <Navbar />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div className={`p-3 ${isDark ? "bg-dark text-light" : "bg-light text-dark"}`} style={{ width: "250px" }}>
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
            {[
              ["profile", "👤 My Profile"],
              ["update", "✏️ Update Profile"],
              ["reset", "🔒 Reset Password"],
              ["products", "📦 Manage Products"],
              ["confirmOrders", "📬 Confirm Orders"],
            ].map(([key, label]) => (
              <li className="nav-item mb-2" key={key}>
                <button
                  className={`btn w-100 ${activeSection === key ? "btn-warning" : isDark ? "btn-outline-light" : "btn-outline-dark"}`}
                  onClick={() => setActiveSection(key)}
                >
                  {label}
                </button>
              </li>
            ))}
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${isDark ? "btn-outline-light" : "btn-outline-danger"}`}
                onClick={() => setShowDeleteModal(true)}
              >
                ❌ Delete Account
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`btn w-100 ${isDark ? "btn-outline-light" : "btn-outline-dark"}`}
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className={`p-4 flex-grow-1 ${isDark ? "bg-dark text-light" : "bg-light text-dark"}`}>
          {activeSection === "profile" && <SellerProfile />}
          {activeSection === "update" && <UpdateSeller />}
          {activeSection === "reset" && <ResetSellerPassword />}
          {activeSection === "products" &&
            (seller?.isApproved ? (
              <ProductManagement />
            ) : (
              <div className="alert alert-warning">
                🛑 Your account is not yet approved by the Super Admin.
              </div>
            ))}
          {activeSection === "confirmOrders" &&
            (seller?.isApproved ? (
              <SellerOrders />
            ) : (
              <div className="alert alert-warning">
                🛑 Your account is not yet approved by the Super Admin.
              </div>
            ))}
        </div>
      </div>
      <Footer />

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Account Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your seller account? This action is <strong>irreversible</strong>.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SellerDashboard;

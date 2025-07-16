import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AdminOrders from "../components/adminDashboard/AdminOrders";
import { logout as logoutAction, setCredentials } from "../features/auth/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

// Admin components (create these separately)
import ViewUsers from "../components/adminDashboard/ViewUsers";
import AddUser from "../components/adminDashboard/AddUser";
import AddProduct from "../components/adminDashboard/AddProduct";
import ViewProducts from "../components/adminDashboard/ViewProducts";
import SellerApproval from "../components/adminDashboard/SellerApproval";


const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("users");

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/profile", { withCredentials: true });
      dispatch(setCredentials(res.data.data));
    } catch (err) {
      console.error("❌ Error fetching admin profile:", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!admin) {
      fetchAdminData();
    }
  }, [admin]);

  const handleLogout = async () => {
    try {
      await axios.post("/admin/logout", {}, { withCredentials: true });
      dispatch(logoutAction());
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Logout failed", err);
    }
  };

  if (loading || !admin) {
    return <p className="mt-5 text-center">Loading admin profile...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: "250px" }}>
          <div className="text-center mb-4">
            <img
              src={admin?.profilePic || "/images/Admin-Profile-PNG-Photo.png"}
              alt="Admin"
              className="rounded-circle mb-2"
              width={80}
              height={80}
            />
            <h5>{admin?.name || "Admin Name"}</h5>
          </div>
<div className="mt-5">
          <ul className="nav flex-column ">
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "users" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("users")}
              >
                👥 View Users
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "addUser" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("addUser")}
              >
                ➕ Add Seller
              </button>
            </li>
            <li className="nav-item mb-2">
  <button
    className={`btn w-100 ${activeSection === "confirmOrders" ? "btn-warning" : "btn-outline-light"}`}
    onClick={() => setActiveSection("confirmOrders")}
  >
    📬 Confirm Orders
  </button>
</li>
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "sellerApproval" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("sellerApproval")}
              >
                ➕ Sellers Approval
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "addProduct" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("addProduct")}
              >
                🛒 Add Product
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`btn w-100 ${activeSection === "viewProducts" ? "btn-warning" : "btn-outline-light"}`}
                onClick={() => setActiveSection("viewProducts")}
              >
                📦 View Products
              </button>
            </li>
            <li className="nav-item">
              <button className="btn w-100 btn-outline-light" onClick={handleLogout}>
                🚪 Logout
              </button>
            </li>
          </ul>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-4 flex-grow-1 bg-light">
          {activeSection === "users" && <ViewUsers />}
          {activeSection === "addUser" && <AddUser />}
          {activeSection === "addProduct" && <AddProduct />}
          {activeSection === "viewProducts" && <ViewProducts />}
          {activeSection === "sellerApproval" && <SellerApproval />}
          {activeSection === "confirmOrders" && <AdminOrders />}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default AdminDashboard;

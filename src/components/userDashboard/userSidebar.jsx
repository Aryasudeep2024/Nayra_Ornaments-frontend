import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import OrdersModal from '../OrdersModal'; // Adjust the path if needed

const UserSidebar = ({ activeSection, setActiveSection, user }) => {
  const [showOrdersModal, setShowOrdersModal] = useState(false); // ✅ Add this state

  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
      <div className="text-center mb-4">
        <img
          src={user?.profilePic || "/default-avatar.png"}
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
            className={`btn w-100 ${activeSection === 'cart' ? 'btn-warning' : 'btn-outline-light'}`}
            onClick={() => setActiveSection("cart")}
          >
            🛒 My Cart
          </button>
        </li>
        <li className="nav-item mb-2">
          <button
            className={`btn w-100 ${activeSection === 'profile' ? 'btn-warning' : 'btn-outline-light'}`}
            onClick={() => setActiveSection("profile")}
          >
            👤 My Profile
          </button>
        </li>

        {/* ✅ My Orders Modal Trigger */}
        <li className="nav-item mb-2">
          <Button
            variant="outline-primary"
            className="w-100"
            onClick={() => setShowOrdersModal(true)}
          >
            🧾 My Orders
          </Button>
        </li>

        <li className="nav-item mb-2">
          <button
            className={`btn w-100 ${activeSection === 'update' ? 'btn-warning' : 'btn-outline-light'}`}
            onClick={() => setActiveSection("update")}
          >
            ✏️ Update Profile
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn w-100 ${activeSection === 'delete' ? 'btn-danger' : 'btn-outline-light'}`}
            onClick={() => setActiveSection("delete")}
          >
            ❌ Delete Account
          </button>
        </li>
      </ul>

      {/* ✅ Orders Modal Component */}
      <OrdersModal
        show={showOrdersModal}
        handleClose={() => setShowOrdersModal(false)}
      />
    </div>
  );
};

export default UserSidebar;

import React, { useState } from "react";
import axios from "../../api/axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useTheme } from "../../context/ThemeContext"; // ✅ Theme hook

const ViewUsers = () => {
  const [userId, setUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Confirmation & Feedback modals
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { theme } = useTheme();

  const fetchUserProfile = async () => {
    if (!userId.trim()) {
      setError("Please enter a valid user ID");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/admin/user/${userId}`, { withCredentials: true });
      const user = response.data.data;
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        mobileNumber: user.contactNumber || "",
        role: user.role,
      });
      setShowModal(true);
      setError("");
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/user/${selectedUser._id}`, formData, {
        withCredentials: true,
      });
      setSuccessMessage("User updated successfully");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Update failed:", err);
      setSuccessMessage("Failed to update user");
      setShowSuccessModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/admin/user/${selectedUser._id}`, {
        withCredentials: true,
      });
      setShowDeleteConfirm(false);
      setShowModal(false);
      setSuccessMessage("User deleted successfully");
      setShowSuccessModal(true);
    } catch (err) {
      console.error("Delete failed:", err);
      setShowDeleteConfirm(false);
      setSuccessMessage("Failed to delete user");
      setShowSuccessModal(true);
    }
  };

  return (
    <div
      className="p-4 rounded shadow-sm"
      style={{
        backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
        transition: "all 0.3s ease",
      }}
    >
      <h2 className="mb-4">🔍 View & Manage User by ID</h2>

      <Form
        className="d-flex mb-1"
        onSubmit={(e) => {
          e.preventDefault();
          fetchUserProfile();
        }}
      >
        <Form.Control
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            border: theme === "dark" ? "1px solid #666" : "",
          }}
        />
        <Button variant="primary" className="ms-1" onClick={fetchUserProfile} disabled={loading}>
          {loading ? "Loading..." : "View Profile"}
        </Button>
      </Form>

      {error && (
        <p style={{ color: theme === "dark" ? "#ff6b6b" : "#dc3545" }} className="fw-semibold">
          {error}
        </p>
      )}

      {/* Main User Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        contentClassName={theme === "dark" ? "bg-dark text-light" : ""}
      >
        <Modal.Header closeButton closeVariant={theme === "dark" ? "white" : undefined}>
          <Modal.Title>Manage User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined,
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined,
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined,
                  }}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined,
                  }}
                >
                  <option value="user">User</option>
                  <option value="seller">Seller</option>
                </Form.Select>
              </Form.Group>
            </Form>
          ) : (
            <p>No user data found.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleUpdate}>Update</Button>
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>Delete</Button>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton className={theme === "dark" ? "bg-dark text-light" : ""}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === "dark" ? "bg-dark text-light" : ""}>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer className={theme === "dark" ? "bg-dark" : ""}>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Success/Error Feedback Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton className={theme === "dark" ? "bg-dark text-light" : ""}>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === "dark" ? "bg-dark text-light" : ""}>
          {successMessage}
        </Modal.Body>
        <Modal.Footer className={theme === "dark" ? "bg-dark" : ""}>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewUsers;

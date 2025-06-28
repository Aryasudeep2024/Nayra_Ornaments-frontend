// components/adminDashboard/ViewUsers.jsx
import React, { useState } from "react";
import axios from "../../api/axios";
import { Modal, Button, Form } from "react-bootstrap";

const ViewUsers = () => {
  const [userId, setUserId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setError("User not found ");
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
      const response = await axios.put(`/admin/user/${selectedUser._id}`, formData, {
        withCredentials: true,
      });
      alert("User updated successfully");
      handleCloseModal();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`/admin/user/${selectedUser._id}`, {
        withCredentials: true,
      });
      alert("User deleted successfully");
      handleCloseModal();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user");
    }
  };

  return (
    <div>
      <h2 className="mb-4">🔍 View & Manage User by ID</h2>

      <Form className="d-flex mb-1 " onSubmit={(e) => { e.preventDefault(); fetchUserProfile(); }}>
        <Form.Control
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button variant="primary" className="ms-1" onClick={fetchUserProfile} disabled={loading}>
          {loading ? "Loading..." : "View Profile"}
        </Button>
      </Form>

      {error && <p className="text-danger">{error}</p>}

      {/* Modal for view/update/delete */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
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
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Role</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
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
          <Button variant="success" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewUsers;

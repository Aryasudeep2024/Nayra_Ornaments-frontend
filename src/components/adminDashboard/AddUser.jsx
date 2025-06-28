import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from '../../api/axios'; // Update path if needed

const AddSeller = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePic: '',
    shopName: '',
    contactNumber: '',
    isApproved: true // Optional toggle
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const {
        name,
        email,
        password,
        profilePic,
        shopName,
        contactNumber,
        isApproved
      } = formData;

      const { data } = await axios.post(
        '/admin/register',
        {
          name,
          email,
          password,
          profilePic,
          role: 'seller',
          shopName,
          contactNumber,
          isApproved
        },
        { withCredentials: true }
      );

      setMessage(data.message || 'Seller added successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        profilePic: '',
        shopName: '',
        contactNumber: '',
        isApproved: true
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add seller');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h3 className="mb-4">Add New Seller</h3>

      {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Seller Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter seller's email"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a secure password"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Picture URL</Form.Label>
          <Form.Control
            type="text"
            name="profilePic"
            value={formData.profilePic}
            onChange={handleChange}
            placeholder="Paste profile image URL (optional)"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Shop Name</Form.Label>
          <Form.Control
            type="text"
            name="shopName"
            value={formData.shopName}
            onChange={handleChange}
            placeholder="Enter shop name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contact Number</Form.Label>
          <Form.Control
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter mobile or phone number"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Approve seller immediately"
            name="isApproved"
            checked={formData.isApproved}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : 'Add Seller'}
        </Button>
      </Form>
    </div>
  );
};

export default AddSeller;

import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from '../../api/axios';
import { useTheme } from '../../context/ThemeContext'; // ✅ import theme context

const AddSeller = () => {
  const { theme } = useTheme(); // ✅ get current theme

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profilePic: '',
    shopName: '',
    contactNumber: '',
    isApproved: true
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
    <div
      className="p-4 rounded shadow-sm"
      style={{
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f8f9fa',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        transition: 'all 0.3s ease'
      }}
    >
      <h3 className="mb-4">Add New Seller</h3>

      {message && (
        <Alert
          variant={theme === 'dark' ? 'success' : 'success'}
          onClose={() => setMessage('')}
          dismissible
        >
          {message}
        </Alert>
      )}

      {error && (
        <Alert
          variant={theme === 'dark' ? 'danger' : 'danger'}
          onClose={() => setError('')}
          dismissible
        >
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {[
          { label: 'Seller Name', name: 'name', type: 'text', placeholder: 'Enter full name' },
          { label: 'Email Address', name: 'email', type: 'email', placeholder: "Enter seller's email" },
          { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter a secure password' },
          { label: 'Profile Picture URL', name: 'profilePic', type: 'text', placeholder: 'Paste profile image URL (optional)' },
          { label: 'Shop Name', name: 'shopName', type: 'text', placeholder: 'Enter shop name' },
          { label: 'Contact Number', name: 'contactNumber', type: 'text', placeholder: 'Enter mobile or phone number' }
        ].map(({ label, name, type, placeholder }) => (
          <Form.Group key={name} className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={placeholder}
              style={{
                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                borderColor: theme === 'dark' ? '#555' : '#ced4da'
              }}
              required={name !== 'profilePic'}
            />
          </Form.Group>
        ))}

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Approve seller immediately"
            name="isApproved"
            checked={formData.isApproved}
            onChange={handleChange}
            style={{ color: theme === 'dark' ? '#fff' : '#000' }}
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

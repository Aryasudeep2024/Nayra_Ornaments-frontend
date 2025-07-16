import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import API from '../../api/axios';
import { useTheme } from '../../context/ThemeContext'; // ✅ Theme hook

const AddProductForm = ({ onProductAdded }) => {
  const { theme } = useTheme(); // ✅ Access theme
  const isDark = theme === 'dark';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !description || !price || !quantity || !image || !category) {
      setError('All fields are required including image.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('image', image);

    try {
      setLoading(true);

      const res = await API.post('/seller/addProducts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Product added successfully!');
      onProductAdded(res.data.product);

      // Reset form
      setTitle('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setImage(null);
      e.target.reset();
    } catch (err) {
      console.error('Add product error:', err);
      setError(err.response?.data?.message || 'Something went wrong while adding the product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className={`mb-4 p-3 border rounded ${isDark ? 'bg-dark text-white border-secondary' : 'bg-light'}`}
      style={{ transition: 'background-color 0.3s ease, color 0.3s ease' }}
    >
      <h5 className="mb-3">Add New Product</h5>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form.Group controlId="productTitle" className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={isDark ? 'bg-secondary text-white' : ''}
        />
      </Form.Group>

      <Form.Group controlId="productCategory" className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={isDark ? 'bg-secondary text-white' : ''}
        >
          <option value="">-- Select Category --</option>
          <option value="Ring">Rings</option>
          <option value="Necklace">Necklace</option>
          <option value="Bangles">Bangles</option>
          <option value="Pendant">Pendants</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="productDescription" className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={isDark ? 'bg-secondary text-white' : ''}
        />
      </Form.Group>

      <Form.Group controlId="productPrice" className="mb-3">
        <Form.Label>Price</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter product price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={isDark ? 'bg-secondary text-white' : ''}
        />
      </Form.Group>

      <Form.Group controlId="productQuantity" className="mb-3">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className={isDark ? 'bg-secondary text-white' : ''}
        />
      </Form.Group>

      <Form.Group controlId="productImage" className="mb-3">
        <Form.Label>Product Image</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          className={isDark ? 'bg-secondary text-white' : ''}
        />
      </Form.Group>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : 'Add Product'}
      </Button>
    </Form>
  );
};

export default AddProductForm;

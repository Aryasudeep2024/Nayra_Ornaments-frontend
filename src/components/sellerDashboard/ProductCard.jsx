import React, { useState } from 'react';
import { Card, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import API from '../../api/axios'; // Adjust the path if needed

const ProductCard = ({ product, onDelete, onUpdate }) => {
  const [showModal, setShowModal] = useState(false);
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(product.quantity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      await API.delete(`/seller/delete/${product._id}`);
      onDelete(product._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    const updatedFields = {
      price,
      quantity,
    };

    try {
      setLoading(true);
      const res = await API.put(`/seller/update/${product._id}`, updatedFields, {
        headers: { 'Content-Type': 'application/json' },
      });
      onUpdate(res.data.product); // Update state in parent component
      setShowModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

   return (
    <>
      <Card 
        className="m-3 shadow-sm border-2" 
        style={{ 
          width: '18rem', 
          borderRadius: '1rem', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Card.Img 
          variant="top" 
          src={product.image} 
          height="200" 
          style={{ 
            objectFit: 'cover', 
            borderTopLeftRadius: '1rem', 
            borderTopRightRadius: '1rem' 
          }} 
        />
        <Card.Body>
          <Card.Title className="fw-bold text-primary">{product.name}</Card.Title>
          <Card.Text className="text-muted">
            <strong>Category:</strong> {product.category}<br />
            <strong>Price:</strong> ₹{product.price}<br />
            <strong>Stock:</strong> {product.quantity}
          </Card.Text>
          <div className="d-flex justify-content-between mt-3">
            <Button variant="outline-primary" onClick={() => setShowModal(true)}>Edit</Button>
            <Button variant="outline-danger" onClick={handleDelete} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Delete'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );

};

export default ProductCard;

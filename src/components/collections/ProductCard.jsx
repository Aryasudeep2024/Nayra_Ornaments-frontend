import React, { useState } from 'react';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import StarRating from '../StarRating';
import { useTheme } from '../../context/ThemeContext';

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const userInfo = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { theme } = useTheme();

  if (!product || typeof product !== 'object' || !product.image || !product.name) {
    console.warn('❌ Skipping ProductCard - invalid product:', product);
    return null;
  }

  const handleAddToCart = async () => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }

    try {
      const res = await api.post(
        '/cart/addtocart',
        { productId: product._id, quantity: qty },
        { withCredentials: true }
      );
      console.log("✅ Added to cart:", res.data);
      navigate('/user/dashboard', { state: { openCart: true } });
    } catch (error) {
      console.error('❌ Error adding to cart:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <Card
        className="m-3 shadow-sm h-100 d-flex flex-column justify-content-between"
        style={{
          borderRadius: '1.25rem',
          backgroundColor: theme === 'dark' ? '#1c1c1c' : '#fff',
          color: theme === 'dark' ? '#f0f0f0' : '#000',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '220px', overflow: 'hidden' }}>
          <Card.Img
            variant="top"
            src={product.image || 'https://via.placeholder.com/300x250?text=No+Image'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <Card.Body className="d-flex flex-column justify-content-between text-center">
          <div>
            <Card.Title className="fw-bold" style={{ fontSize: '1.1rem' }}>
              {product.name}
            </Card.Title>

            <div
              onClick={() => navigate(`/review/${product._id}`)}
              style={{ cursor: 'pointer', display: 'inline-block', marginBottom: '0.25rem' }}
            >
              <StarRating rating={product.averageRating || 0} size={18} />
              <div style={{ fontSize: '0.75rem', color: theme === 'dark' ? '#ccc' : '#666' }}>
                ({product.reviewCount || 0} reviews)
              </div>
            </div>

            <Card.Text style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              ₹{product.price} <br />
              Available: {product.quantity}
            </Card.Text>
          </div>

          <Form.Group controlId={`quantity-${product._id}`} className="mb-2">
            <Form.Label style={{ fontSize: '0.9rem' }}>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={qty}
              min={1}
              max={product.quantity}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{
                width: '70px',
                margin: '0 auto',
                backgroundColor: theme === 'dark' ? '#333' : '#fff',
                color: theme === 'dark' ? '#fff' : '#000',
                borderColor: theme === 'dark' ? '#555' : '#ccc',
              }}
            />
          </Form.Group>

          <Button
            variant={theme === 'dark' ? 'light' : 'dark'}
            size="sm"
            onClick={handleAddToCart}
            disabled={qty < 1 || qty > product.quantity}
            style={{
              borderRadius: '0.5rem',
              transition: 'transform 0.2s ease',
              fontWeight: 'bold',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Add to Cart
          </Button>
        </Card.Body>
      </Card>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please log in to add items to your cart.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>Go to Login</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;

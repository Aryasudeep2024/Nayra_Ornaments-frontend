import React, { useState } from 'react';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const userInfo = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  // 🛡️ Defensive check
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
        { productId: product._id, quantity: qty }, // 🔁 quantity included
        { withCredentials: true }
      );

      console.log("✅ Added to cart:", res.data);

      // ✅ Redirect to User Dashboard with cart open
      navigate('/user/dashboard', { state: { openCart: true } });

    } catch (error) {
      console.error('❌ Error adding to cart:', error.response?.data || error.message);
    }
  };

  return (
    <>
      <Card className="m-3 shadow-sm h-100" style={{ borderRadius: '1.25rem', overflow: 'hidden' }}>
        <div style={{ height: '250px', overflow: 'hidden' }}>
          <Card.Img
            variant="top"
            src={product.image || 'https://via.placeholder.com/300x250?text=No+Image'}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <Card.Body className="text-center d-flex flex-column justify-content-between">
          <div>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>
              ₹{product.price}<br />
              Available: {product.quantity}
            </Card.Text>
          </div>

          <Form.Group controlId={`quantity-${product._id}`} className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              value={qty}
              min={1}
              max={product.quantity}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{ width: '70px', margin: '0 auto' }}
            />
          </Form.Group>

          <Button
            variant="dark"
            size="sm"
            onClick={handleAddToCart}
            disabled={qty < 1 || qty > product.quantity}
            style={{ borderRadius: '0.5rem', transition: 'transform 0.2s ease' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            Add to Cart
          </Button>
        </Card.Body>
      </Card>

      {/* 🚨 Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Login Required</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please log in to add items to your cart.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            Go to Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductCard;

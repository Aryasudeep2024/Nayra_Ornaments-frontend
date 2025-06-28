import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
//import './ProductCard.css'; // make sure this includes your zoom-hover CSS class

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    console.log(`Added ${qty} of ${product.name} to cart.`);
  };

  return (
    <Card 
      className="m-3 shadow-sm h-100"
      style={{ 
        width: '100%',
        minHeight: '420px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: '1.25rem',
        overflow: 'hidden'
      }}
    >
      {/* Product Image */}
      <div style={{ height: '250px', overflow: 'hidden' }}>
        <Card.Img
          variant="top"
          src={product.image}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Product Info and Action */}
      <Card.Body className="text-center d-flex flex-column justify-content-between">
        <div>
          <Card.Title
            style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {product.name}
          </Card.Title>

          <Card.Text style={{ fontSize: '0.9rem' }}>
            ₹{product.price}
            <br />
            Available: {product.quantity}
          </Card.Text>
        </div>

        {/* Quantity Input */}
        <Form.Group controlId={`quantity-${product._id}`} className="mb-2">
          <Form.Label style={{ fontSize: '0.75rem' }}>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={qty}
            min={1}
            max={product.quantity}
            onChange={(e) => setQty(Number(e.target.value))}
            style={{
              fontSize: '0.75rem',
              padding: '4px 8px',
              width: '70px',
              margin: '0 auto',
            }}
          />
        </Form.Group>

        {/* Add to Cart Button */}
        <Button
          variant="dark"
          size="sm"
          onClick={handleAddToCart}
          disabled={qty < 1 || qty > product.quantity}
          className="w-100 zoom-hover"
          style={{ borderRadius: '0.5rem' }}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;

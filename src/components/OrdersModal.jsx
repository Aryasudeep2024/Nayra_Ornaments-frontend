// components/OrdersModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import api from '../api/axios';

const OrdersModal = ({ show, handleClose }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      fetchOrders();
    }
  }, [show]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/myorders'); // Adjust if route is different
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders.');
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>🧾 My Orders</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center"><Spinner animation="border" /></div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : orders.length === 0 ? (
          <Alert variant="info">You have no orders yet.</Alert>
        ) : (
          <ListGroup>
            {orders.map((order) => (
              <ListGroup.Item key={order._id}>
                <strong>Order ID:</strong> {order._id} <br />
                <strong>Total:</strong> ₹{order.totalAmount} <br />
                <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()} <br />
                <strong>Status:</strong> {order.status || 'Confirmed'} <br />
                <hr />
                {order.products.map((p, i) => (
                  <div key={i}>
                    📦 <strong>{p.name}</strong> — ₹{p.price} × {p.quantity}
                  </div>
                ))}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrdersModal;

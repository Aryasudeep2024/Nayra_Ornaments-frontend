import React, { useEffect, useState, useRef, useContext } from 'react';
import api from '../api/axios';
import { Container, Alert, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrdersModal from '../components/OrdersModal';
import { ThemeContext } from '../context/ThemeContext'; // ✅ Theme context

const PaymentSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const navigate = useNavigate();
  const hasOrdered = useRef(false);

  const { theme } = useContext(ThemeContext); // ✅ Get theme

  useEffect(() => {
    const saveOrder = async () => {
      if (hasOrdered.current) return;
      hasOrdered.current = true;

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        const res = await api.post(
          '/orders/create',
          { paymentId: sessionId || 'test_payment' },
          { withCredentials: true }
        );

        console.log('✅ Order created:', res.data);
        setOrderStatus('success');
      } catch (error) {
        console.error('❌ Failed to create order:', error.response?.data || error.message);
        setOrderStatus('fail');
      } finally {
        setLoading(false);
      }
    };

    saveOrder();
  }, []);

  const isDark = theme === 'dark';

  const containerStyle = {
    backgroundColor: isDark ? '#121212' : '#f8f9fa',
    color: isDark ? '#f1f1f1' : '#212529',
    minHeight: '70vh',
    paddingTop: '40px',
  };

  const boxStyle = {
    backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
    color: isDark ? '#e4e4e4' : '#000',
    borderColor: '#198754',
    borderWidth: '2px',
    borderStyle: 'solid',
    maxWidth: '600px',
    width: '100%',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 0 20px rgba(0,0,0,0.2)',
    textAlign: 'center'
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="success" />
        <p style={{ color: isDark ? "#ccc" : "#000" }}>Finalizing your order...</p>
      </div>
    );
  }

  if (orderStatus === 'fail') {
    return (
      <div className="text-center mt-5">
        <Alert variant="danger">
          <h4>Something went wrong 😓</h4>
          <p>Your payment was successful, but we couldn't save your order.</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="warning" onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="outline-primary" onClick={() => navigate('/user/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Container fluid style={containerStyle} className="d-flex justify-content-center align-items-center">
        <div style={boxStyle}>
          <Alert variant="success" className="mb-4">
            <h4 className="fw-bold">🎉 Payment Successful!</h4>
            <p className="mb-4">Your order has been placed successfully.</p>
            <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
              <Button variant="success" onClick={() => setShowOrdersModal(true)}>
                View My Orders
              </Button>
              <Button variant="outline-primary" onClick={() => navigate('/user/dashboard')}>
                🔙 Go to Dashboard
              </Button>
            </div>
          </Alert>
        </div>
      </Container>
      <OrdersModal show={showOrdersModal} handleClose={() => setShowOrdersModal(false)} />
      <Footer />
    </>
  );
};

export default PaymentSuccess;

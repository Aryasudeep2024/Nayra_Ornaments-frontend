import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Button, Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useTheme } from "../../context/ThemeContext"; // ✅ Theme hook

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [error, setError] = useState(null);

  const { theme } = useTheme(); // ✅ Access current theme

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("orders/adminorders", { withCredentials: true });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("❌ Failed to fetch admin orders", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId) => {
    try {
      setConfirming(orderId);
      await api.put(`orders/adminorders/confirm/${orderId}`, {}, { withCredentials: true });

      const updatedOrders = orders.map(order =>
        order._id === orderId ? { ...order, orderStatus: "confirmed" } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      console.error("❌ Error confirming order", err);
      alert("Failed to confirm order");
    } finally {
      setConfirming(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-4" style={{ color: theme === 'dark' ? '#fff' : '#000' }}>
        <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'primary'} />
        <p>Loading orders for your products...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant={theme === 'dark' ? 'danger' : 'danger'}>{error}</Alert>;
  }

  if (orders.length === 0) {
    return <Alert variant={theme === 'dark' ? 'info' : 'info'}>No orders for Super Admin's products found yet.</Alert>;
  }

  return (
    <div
      style={{
        color: theme === 'dark' ? '#ffffff' : '#000000',
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f8f9fa',
        padding: '1rem',
        borderRadius: '0.5rem',
        transition: 'all 0.3s ease'
      }}
    >
      <h3 className="mb-4">📦 Orders for Super Admin's Products</h3>

      {orders.map((order) => (
        <Card
          key={order._id}
          className="mb-4 shadow-sm"
          style={{
            backgroundColor: theme === 'dark' ? '#2c2c2c' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#000000'
          }}
        >
          <Card.Header>
            <strong>Order ID:</strong> {order._id} <br />
            <strong>Placed by:</strong> {order.user} <br />
            <strong>Status:</strong>{" "}
            <span
              className="badge"
              style={{
                backgroundColor: order.orderStatus === "confirmed" ? "#28a745" : "#e25c0e",
                fontSize: "1rem",
                padding: "6px 12px",
                borderRadius: "8px",
                color: "#fff"
              }}
            >
              {order.orderStatus}
            </span>
          </Card.Header>

          <Card.Body>
            <Row>
              {order.products.map((product) => (
                <Col md={6} lg={4} key={product.productId} className="mb-3">
                  <Card
                    className="h-100"
                    style={{
                      backgroundColor: theme === 'dark' ? '#343a40' : '#f8f9fa',
                      color: theme === 'dark' ? '#fff' : '#000'
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={product.image}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>{product.name}</Card.Title>
                      <Card.Text>
                        Price: ₹{product.price} <br />
                        Quantity: {product.quantity}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {order.orderStatus !== "confirmed" && (
              <div className="text-end mt-3">
                <Button
                  variant="success"
                  onClick={() => handleConfirm(order._id)}
                  disabled={confirming === order._id}
                >
                  {confirming === order._id ? "Confirming..." : "✅ Confirm Order"}
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default AdminOrders;

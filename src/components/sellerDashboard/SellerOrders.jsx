import React, { useEffect, useState, useContext } from "react";
import api from "../../api/axios";
import { Button, Card, Spinner, Alert, Row, Col } from "react-bootstrap";
import { ThemeContext } from "../../context/ThemeContext"; // ✅ Import ThemeContext

const SellerOrders = () => {
  const { theme } = useContext(ThemeContext); // 🎯 Get current theme from context

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/seller", { withCredentials: true });
      setOrders(res.data.orders);
    } catch (err) {
      console.error("❌ Failed to fetch seller orders", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId) => {
    try {
      setConfirming(orderId);
      const res = await api.put(`/orders/seller/confirm/${orderId}`, {}, { withCredentials: true });

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
      <div className={`text-center mt-4 ${theme === "dark" ? "text-light" : "text-dark"}`}>
        <Spinner animation="border" variant={theme === "dark" ? "light" : "primary"} />
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (orders.length === 0) {
    return <Alert variant={theme === "dark" ? "secondary" : "info"}>No orders found for your products yet.</Alert>;
  }

  return (
    <div className={`${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"} p-3 rounded`}>
      <h3 className="mb-4">📬 Orders for Your Products</h3>
      {orders.map((order) => (
        <Card
          key={order._id}
          className={`mb-4 shadow-sm ${theme === "dark" ? "bg-secondary text-light" : "bg-white text-dark"}`}
        >
          <Card.Header>
            <strong>Order ID:</strong> {order._id} <br />
            <strong>Placed by:</strong> {order.user} <br />
            <strong>Status:</strong>{" "}
            <span className={`badge ${order.orderStatus === "confirmed" ? "bg-success" : "bg-secondary"}`}>
              {order.orderStatus}
            </span>
          </Card.Header>
          <Card.Body>
            <Row>
              {order.products.map((product) => (
                <Col md={6} lg={4} key={product.productId} className="mb-3">
                  <Card className={`h-100 ${theme === "dark" ? "bg-dark text-light border-secondary" : ""}`}>
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
              <div className="text-end">
                <Button
                  variant={theme === "dark" ? "light" : "success"}
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

export default SellerOrders;

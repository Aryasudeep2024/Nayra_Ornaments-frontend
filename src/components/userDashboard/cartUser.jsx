// ... (keep all existing imports)
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '../../features/auth/cartSlice';
import API from '../../api/axios';
import { Spinner, Alert, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { ThemeContext } from '../../context/ThemeContext';

const CartUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const user = useSelector((state) => state.auth.user);
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

  const [cart, setCart] = useState({ cartItems: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);

  // ❗️Delete Confirmation Modal States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await API.get("/cart", { withCredentials: true });
        const cartData = res?.data?.cart;
        const items = Array.isArray(cartData?.cartItems) ? cartData.cartItems : [];

        dispatch(setCartItems(items));
        setCart({ ...cartData, cartItems: items });
      } catch (error) {
        console.error('❌ Failed to load cart:', error);
        if (error.response?.status === 401) {
          navigate('/dashboard');
        }
        setCart({ cartItems: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, dispatch, navigate]);

  const handleContinueShopping = () => navigate('/');
  
  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      const products = cart.cartItems.map(item => ({
        title: item.productId.name,
        price: item.productId.price,
        image: item.productId.image,
        quantity: item.quantity
      }));

      const res = await API.post('/payment/create-checkout-session', { products }, {
        withCredentials: true,
      });

      const { sessionId } = res.data;
      const result = await stripe.redirectToCheckout({ sessionId });

      if (result.error) alert(result.error.message);
    } catch (error) {
      console.error("❌ Checkout error:", error);
      alert("Payment initialization failed.");
    }
  };

  const confirmClearCart = async () => {
    try {
      await API.delete('/cart/clear', { withCredentials: true });
      const res = await API.get("/cart", { withCredentials: true });
      const cartData = res?.data?.cart;
      const items = Array.isArray(cartData?.cartItems) ? cartData.cartItems : [];
      dispatch(setCartItems(items));
      setCart({ ...cartData, cartItems: items });
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      alert("Failed to clear cart.");
    } finally {
      setShowClearConfirm(false);
    }
  };

  const handleUpdate = (productId, currentQty) => {
    setSelectedProductId(productId);
    setNewQuantity(currentQty);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProductId(null);
    setNewQuantity(1);
  };

  const handleModalSubmit = async () => {
    try {
      const res = await API.put(
        '/cart/update',
        { productId: selectedProductId, quantity: newQuantity },
        { withCredentials: true }
      );
      const updatedCart = res.data.cart;
      const items = Array.isArray(updatedCart?.cartItems) ? updatedCart.cartItems : [];
      dispatch(setCartItems(items));
      setCart({ ...updatedCart, cartItems: items });
      handleModalClose();
    } catch (error) {
      console.error('❌ Error updating cart item:', error);
      alert('Failed to update item.');
    }
  };

  const confirmDeleteItem = async () => {
    try {
      await API.delete(`/cart/remove/${productToDelete}`, { withCredentials: true });
      const res = await API.get("/cart", { withCredentials: true });
      const cartData = res?.data?.cart;
      const items = Array.isArray(cartData?.cartItems) ? cartData.cartItems : [];
      dispatch(setCartItems(items));
      setCart({ ...cartData, cartItems: items });
    } catch (error) {
      console.error("❌ Error removing item:", error);
      alert("Failed to remove item.");
    } finally {
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={`text-center mt-4 ${isDark ? "text-light" : "text-dark"}`}>
        <Spinner animation="border" variant={isDark ? "light" : "primary"} />
        <p>Loading your cart...</p>
      </div>
    );
  }

  if (!cart || !Array.isArray(cart.cartItems)) {
    return (
      <div className="text-center mt-4">
        <Alert variant="danger">
          <h5>Something went wrong 🛠️</h5>
          <p>We couldn’t load your cart. Try again later.</p>
        </Alert>
      </div>
    );
  }

  if (cart.cartItems.length === 0) {
    return (
      <div className="text-center mt-4">
        <Alert variant={isDark ? "secondary" : "info"}>
          <h5>Your cart is empty 🛒</h5>
          <p>Add items to your cart to see them here.</p>
          <Button variant="primary" onClick={handleContinueShopping}>
            Continue Shopping
          </Button>
        </Alert>
      </div>
    );
  }

  const totalAmount = cart.cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity,
    0
  );

  return (
    <div className={`${isDark ? 'bg-dark text-light' : 'bg-light text-dark'} p-3 rounded`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Button variant="danger" onClick={() => setShowClearConfirm(true)}>🗑️ Clear Cart</Button>
        <h4 className="text-center flex-grow-1 mb-0">🛒 My Cart</h4>
        <Button variant="primary" onClick={handleContinueShopping}>🛍️ Continue Shopping</Button>
      </div>

      <div className="row">
        {cart.cartItems.map((item, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <Card className={`shadow-sm h-100 ${isDark ? "bg-secondary text-light" : ""}`}>
              {item.productId.image && (
                <Card.Img
                  variant="top"
                  src={item.productId.image}
                  height="200"
                  style={{ objectFit: "cover" }}
                />
              )}
              <Card.Body>
                <Card.Title>{item.productId.name}</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> ₹{item.productId.price}<br />
                  <strong>Quantity:</strong> {item.quantity}<br />
                  <strong>Subtotal:</strong> ₹{item.productId.price * item.quantity}
                </Card.Text>
                <div className="d-flex justify-content-between mt-3">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleUpdate(item.productId._id, item.quantity)}
                  >
                    Update Item
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => {
                      setProductToDelete(item.productId._id);
                      setShowDeleteConfirm(true);
                    }}
                  >
                    Delete Item
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <h5>Total: ₹{totalAmount}</h5>
        <Button variant="success" onClick={handleCheckout} className="mt-3">
          Proceed to Checkout
        </Button>
      </div>

      {/* Quantity Update Modal */}
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton className={isDark ? 'bg-dark text-light' : ''}>
          <Modal.Title>Update Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? 'bg-dark text-light' : ''}>
          <Form.Group>
            <Form.Label>Enter new quantity:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              className={isDark ? 'bg-dark text-light border-secondary' : ''}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className={isDark ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button variant="success" onClick={handleModalSubmit}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton className={isDark ? 'bg-dark text-light' : ''}>
          <Modal.Title>Remove Item</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? 'bg-dark text-light' : ''}>
          Are you sure you want to remove this item from your cart?
        </Modal.Body>
        <Modal.Footer className={isDark ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDeleteItem}>Remove</Button>
        </Modal.Footer>
      </Modal>

      {/* Clear Cart Confirmation Modal */}
      <Modal show={showClearConfirm} onHide={() => setShowClearConfirm(false)} centered>
        <Modal.Header closeButton className={isDark ? 'bg-dark text-light' : ''}>
          <Modal.Title>Clear Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? 'bg-dark text-light' : ''}>
          Are you sure you want to clear your entire cart?
        </Modal.Body>
        <Modal.Footer className={isDark ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmClearCart}>Clear Cart</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CartUser;

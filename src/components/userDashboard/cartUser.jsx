import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItems } from '../../features/auth/cartSlice';
import API from '../../api/axios';
import { Spinner, Alert, Card, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CartUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);
  console.log(user);

  const [cart, setCart] = useState({ cartItems: [] });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(1);

  useEffect(() => {
    if (!user) return;

    const fetchCart = async () => {
      try {
        setLoading(true);
        const res = await API.get("/cart", { withCredentials: true });
        console.log("📦 res.data:", res.data);
        const cartData = res?.data?.cart;
        const items = Array.isArray(cartData?.cartItems) ? cartData.cartItems : [];

        dispatch(setCartItems(items));
        setCart({ ...cartData, cartItems: items });
      } catch (error) {
        console.error('❌ Failed to load cart:', error);
        if (error.response?.status === 401) {
          console.warn("🔐 Not logged in. Redirecting...");
          navigate('/dashboard');
        }
        setCart({ cartItems: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const handleContinueShopping = () => navigate('/');
  const handleCheckout = () => navigate('/checkout');
  const handleClearCart = async () => {
  if (!window.confirm("Are you sure you want to clear your cart?")) return;

  try {
    await API.delete('/cart/clear', { withCredentials: true });

    // Refetch cart to reset everything
    const res = await API.get("/cart", { withCredentials: true });

    const cartData = res?.data?.cart;
    const items = Array.isArray(cartData?.cartItems) ? cartData.cartItems : [];

    dispatch(setCartItems(items));
    setCart({ ...cartData, cartItems: items });

  } catch (error) {
    console.error("❌ Error clearing cart:", error);
    alert("Something went wrong while clearing your cart.");
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
      {
        productId: selectedProductId,
        quantity: newQuantity,
      },
      { withCredentials: true }
    );

    console.log('✅ Cart item updated:', res.data);

    // 🟢 Use updated cart from backend response
    const updatedCart = res.data.cart;
    const items = Array.isArray(updatedCart?.cartItems) ? updatedCart.cartItems : [];

    dispatch(setCartItems(items)); // update Redux too
    setCart({ ...updatedCart, cartItems: items }); // also sets new total if your backend includes it

    handleModalClose();
  } catch (error) {
    console.error('❌ Error updating cart item:', error);
    alert('Failed to update item quantity');
  }
};



  const handleDelete = async (productId) => {
  if (!window.confirm("Are you sure you want to remove this item from your cart?")) return;

  try {
    // ✅ 1. Remove item
    await API.delete(`/cart/remove/${productId}`, {
      withCredentials: true,
    });

    // ✅ 2. Fetch latest cart (with populated productId)
    const res = await API.get("/cart", { withCredentials: true });

    const cartData = res?.data?.cart;
    const items = Array.isArray(cartData?.cartItems) ? cartData.cartItems : [];

    // ✅ 3. Update Redux and local state
    dispatch(setCartItems(items));
    setCart({ ...cartData, cartItems: items });

  } catch (error) {
    console.error("❌ Error removing cart item:", error);
    alert("Failed to remove item from cart");
  }
};


  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
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
        <Alert variant="info">
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
  <Button variant="danger" onClick={handleClearCart}>
    🗑️ Clear Cart
  </Button>
  <h4 className="text-center flex-grow-1 mb-0">🛒 My Cart</h4>
  <Button variant="primary" onClick={handleContinueShopping}>
    🛍️ Continue Shopping
  </Button>
</div>
      <div className="row">
        {cart.cartItems.map((item, index) => (
          <div key={index} className="col-md-6 col-lg-4 mb-4">
            <Card className="shadow-sm h-100">
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
                    onClick={() => handleDelete(item.productId._id)}
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
        <Modal.Header closeButton>
          <Modal.Title>Update Quantity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter new quantity:</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleModalSubmit}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CartUser;

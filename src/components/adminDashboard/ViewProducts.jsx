import React, { useState } from "react";
import API from "../../api/axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useTheme } from "../../context/ThemeContext"; // ✅ Theme support

const ViewProducts = () => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    image: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const { theme } = useTheme(); // ✅

  const fetchProduct = async () => {
    if (!productId.trim()) return setError("Enter a valid product ID");
    try {
      setLoading(true);
      const response = await API.get(`/admin/product/${productId}`, {
        withCredentials: true,
      });

      const data = response.data.product;

      setProduct(data);
      setFormData({
        title: data.name || "",
        description: data.description || "",
        price: data.price || 0,
        quantity: data.quantity || 0,
        image: data.image || "",
      });

      setShowModal(true);
      setError("");
    } catch (err) {
      console.error("Fetch product failed:", err);
      setError("Product not found or unauthorized");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    const form = new FormData();
    form.append("name", formData.title);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("quantity", formData.quantity);
    if (formData.image) {
      form.append("image", formData.image);
    }

    try {
      await API.post(`/admin/updateproducts/${product._id}`, form, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResultMessage("✅ Product updated successfully");
      setShowResultModal(true);
    } catch (err) {
      console.error("Update failed:", err);
      setResultMessage("❌ Failed to update product");
      setShowResultModal(true);
    }
  };

  const handleDelete = async () => {
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/admin/delete/${product._id}`, {
        withCredentials: true,
      });
      setShowConfirmDelete(false);
      setShowModal(false);
      setResultMessage("🗑️ Product deleted successfully");
      setShowResultModal(true);
    } catch (err) {
      console.error("Delete failed:", err);
      setShowConfirmDelete(false);
      setResultMessage("❌ Failed to delete product");
      setShowResultModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProduct(null);
    setFormData({
      title: "",
      description: "",
      price: "",
      quantity: "",
      image: null,
    });
  };

  return (
    <div
      className="p-4 rounded shadow-sm"
      style={{
        backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
        color: theme === "dark" ? "#ffffff" : "#000000",
        transition: "all 0.3s ease",
      }}
    >
      <h3 className="mb-4">📦 View & Manage Product by ID</h3>

      <Form
        className="d-flex mb-3"
        onSubmit={(e) => {
          e.preventDefault();
          fetchProduct();
        }}
      >
        <Form.Control
          type="text"
          placeholder="Enter Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          style={{
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#000",
            border: theme === "dark" ? "1px solid #666" : "",
          }}
        />
        <Button variant="primary" className="ms-2" onClick={fetchProduct} disabled={loading}>
          {loading ? "Loading..." : "View Product"}
        </Button>
      </Form>

      {error && (
        <p style={{ color: theme === "dark" ? "#ff6b6b" : "#dc3545" }} className="fw-semibold">
          {error}
        </p>
      )}

      {/* Product Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        contentClassName={theme === "dark" ? "bg-dark text-light" : ""}
      >
        <Modal.Header closeButton closeVariant={theme === "dark" ? "white" : undefined}>
          <Modal.Title>Manage Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined,
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined,
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined,
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  style={{
                    backgroundColor: theme === "dark" ? "#2a2a2a" : "#fff",
                    color: theme === "dark" ? "#fff" : "#000",
                    border: theme === "dark" ? "1px solid #555" : undefined,
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="image" onChange={handleInputChange} />
                <img
                  src={product.image}
                  alt="Product"
                  className="img-thumbnail mt-2"
                  style={{ maxHeight: "100px", objectFit: "contain" }}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)} centered>
        <Modal.Header closeButton className={theme === "dark" ? "bg-dark text-light" : ""}>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === "dark" ? "bg-dark text-light" : ""}>
          Are you sure you want to delete this product?
        </Modal.Body>
        <Modal.Footer className={theme === "dark" ? "bg-dark" : ""}>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success / Failure Feedback Modal */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered>
        <Modal.Header closeButton className={theme === "dark" ? "bg-dark text-light" : ""}>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body className={theme === "dark" ? "bg-dark text-light" : ""}>
          {resultMessage}
        </Modal.Body>
        <Modal.Footer className={theme === "dark" ? "bg-dark" : ""}>
          <Button variant="primary" onClick={() => setShowResultModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewProducts;

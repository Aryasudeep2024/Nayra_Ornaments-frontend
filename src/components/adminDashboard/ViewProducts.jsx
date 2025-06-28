import React, { useState } from "react";
import API from "../../api/axios";
import { Modal, Button, Form } from "react-bootstrap";

const ViewProducts = () => {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        title: data.name || "", // <== use name from backend
        description: data.description || "",
        price: data.price || 0,
        quantity: data.quantity || 0,
        image: null,
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
    form.append("name", formData.title); // ✅ send `title` as `name` to match backend
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
      alert("✅ Product updated successfully");
      handleCloseModal();
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update product");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/admin/delete/${product._id}`, {
        withCredentials: true,
      });
      alert("🗑️ Product deleted successfully");
      handleCloseModal();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("❌ Failed to delete product");
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
    <div>
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
        />
        <Button variant="primary" className="ms-2" onClick={fetchProduct} disabled={loading}>
          {loading ? "Loading..." : "View Product"}
        </Button>
      </Form>
      {error && <p className="text-danger">{error}</p>}

      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Manage Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {product && (
            <>
              <Form.Group className="mb-2">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title" // ✅ matches formData.title
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" name="image" onChange={handleInputChange} />
                <img
                  src={product.imageUrl}
                  alt="Current"
                  className="img-thumbnail mt-2"
                  style={{ maxHeight: "100px" }}
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
    </div>
  );
};

export default ViewProducts;

import React, { useState } from "react";
import API from "../../api/axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useTheme } from '../../context/ThemeContext'; // ✅ added

const AddProduct = () => {
  const { theme } = useTheme(); // ✅ using theme
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({});

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("category", formData.category);
    form.append("price", formData.price);
    form.append("quantity", formData.quantity);
    form.append("image", formData.image);

    try {
      const res = await API.post("/admin/addproducts", form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage({ type: "success", text: res.data.message });
      setFormData({
        title: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        image: null,
      });
    } catch (err) {
      console.error("Add product error:", err);
      const msg = err?.response?.data?.message || "Failed to add product";
      setMessage({ type: "danger", text: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#1c1c1c" : "#f8f9fa",
        color: theme === "dark" ? "#ffffff" : "#000000",
        padding: "2rem",
        borderRadius: "12px",
        transition: "all 0.3s ease",
      }}
    >
      <h3 className="mb-4">➕ Add New Product</h3>

      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme === 'dark' ? '#ccc' : '#000' }}>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter product title"
            required
            style={{
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              borderColor: theme === 'dark' ? '#555' : undefined,
            }}
          />
        </Form.Group>

        <Form.Group controlId="productCategory" className="mb-3">
          <Form.Label style={{ color: theme === 'dark' ? '#ccc' : '#000' }}>Category</Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            style={{
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              borderColor: theme === 'dark' ? '#555' : undefined,
            }}
          >
            <option value="">-- Select Category --</option>
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
            <option value="Bangles">Bangles</option>
            <option value="Pendant">Pendant</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme === 'dark' ? '#ccc' : '#000' }}>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            required
            style={{
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              borderColor: theme === 'dark' ? '#555' : undefined,
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme === 'dark' ? '#ccc' : '#000' }}>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter product price"
            min="0"
            required
            style={{
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              borderColor: theme === 'dark' ? '#555' : undefined,
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label style={{ color: theme === 'dark' ? '#ccc' : '#000' }}>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Enter product quantity"
            min="1"
            required
            style={{
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              borderColor: theme === 'dark' ? '#555' : undefined,
            }}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label style={{ color: theme === 'dark' ? '#ccc' : '#000' }}>Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleInputChange}
            required
            style={{
              backgroundColor: theme === 'dark' ? '#333' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              borderColor: theme === 'dark' ? '#555' : undefined,
            }}
          />
        </Form.Group>

        <Button type="submit" variant={theme === 'dark' ? 'light' : 'primary'} disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Add Product"}
        </Button>
      </Form>
    </div>
  );
};

export default AddProduct;

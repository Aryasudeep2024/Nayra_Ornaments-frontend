import React, { useState } from "react";
import API from "../../api/axios";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
  category:"",
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
    form.append('category', formData.category);

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
        category:"",
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
    <div>
      <h3 className="mb-4">➕ Add New Product</h3>
      {message.text && <Alert variant={message.type}>{message.text}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter product title"
            required
          />
        </Form.Group>
        <Form.Group controlId="productCategory" className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select
  name="category"
  value={formData.category}
  onChange={handleInputChange}
  required
>

            <option value="">-- Select Category --</option>
            <option value="Ring">Ring</option>
            <option value="Necklace">Necklace</option>
            <option value="Bangles">Bangles</option>
            <option value="Pendant">Pendant</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Enter product price"
            min="0"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Enter product quantity"
            min="1"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" name="image" onChange={handleInputChange} required />
        </Form.Group>

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? <Spinner size="sm" animation="border" /> : "Add Product"}
        </Button>
      </Form>
    </div>
  );
};

export default AddProduct;

import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const SearchModal = ({ show, onHide }) => {
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!category) {
      setError('Please select a category');
      return;
    }

    try {
      const res = await api.get(`/seller/search-products?category=${category}`);
      onHide(); // Close modal
      navigate('/search-results', {
        state: {
          products: res.data.products,
          keyword: category
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>🔍 Search by Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="categorySelect">
          <Form.Label>Select a Category</Form.Label>
          <Form.Select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setError('');
            }}
          >
            <option value="">-- Select --</option>
            <option value="Ring">Rings</option>
            <option value="Pendant">Pendants</option>
            <option value="Necklace">Necklaces</option>
            <option value="Bangle">Bangles</option>
          </Form.Select>
        </Form.Group>
        {error && <div className="text-danger mt-2">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="dark" onClick={handleSearch}>Search</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SearchModal;

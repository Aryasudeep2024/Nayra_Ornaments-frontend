// src/components/NewArrivals.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import api from '../api/axios';
import ProductCard from '.collections/ProductCard';

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await api.get('/collection/new-arrivals');
        setProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load new arrivals');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <section className="py-5 bg-white">
      <Container>
        <h2 className="text-center mb-4">🆕 New Arrivals</h2>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="dark" />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : products.length === 0 ? (
          <Alert variant="info" className="text-center">No new arrivals yet.</Alert>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default NewArrivals;

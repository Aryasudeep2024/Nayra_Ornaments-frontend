// src/components/MostLovedSection.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import api from '../api/axios';
import ProductCard from './collections/ProductCard';
import { useTheme } from '../context/ThemeContext'; // ✅ Import theme context

const MostLovedSection = () => {
  const [lovedProducts, setLovedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme(); // ✅ Access current theme

  useEffect(() => {
    const fetchMostLoved = async () => {
      try {
        const response = await api.get('/collection/most-loved');
        setLovedProducts(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchMostLoved();
  }, []);

  return (
    <section
      className="py-5"
      style={{
        backgroundColor: theme === 'dark' ? '#121212' : '#f8f9fa',
        color: theme === 'dark' ? '#f1f1f1' : '#000',
        transition: 'all 0.3s ease',
      }}
    >
      <Container>
        <h2
          className="text-center mb-4"
          style={{
            fontFamily: 'serif',
            fontWeight: 'bold',
            color: theme === 'dark' ? '#f1f1f1' : '#212121',
            transition: 'all 0.3s ease',
          }}
        >
          ❤️ Most Loved Pieces
        </h2>

        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'dark'} />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        ) : lovedProducts.length === 0 ? (
          <Alert variant="info" className="text-center">
            No products found.
          </Alert>
        ) : (
          <Row>
            {lovedProducts.map((product) => (
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

export default MostLovedSection;

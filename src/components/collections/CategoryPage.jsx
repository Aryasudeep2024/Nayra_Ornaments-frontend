import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductCard from './ProductCard';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from '../../context/ThemeContext';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/collection/${categoryName}`);
        const fetchedProducts = response.data;

        if (!Array.isArray(fetchedProducts)) {
          console.warn("⚠️ Response is not an array:", fetchedProducts);
        } else {
          fetchedProducts.forEach((p, i) => {
            if (!p || !p.image || !p.name || !p.price) {
              console.warn(`⚠️ Product at index ${i} is missing fields:`, p);
            }
          });
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error("🚨 Error fetching products:", err);
        setError(
          err.response?.data?.message || "Error fetching products. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <>
      <Navbar />
      <div
        style={{
          minHeight: '100vh',
          paddingTop: '4rem',
          paddingBottom: '2rem',
          backgroundColor: theme === 'dark' ? '#121212' : '#f8f9fa',
          transition: 'background-color 0.3s ease'
        }}
      >
        <Container>
          <h2
            className="text-center mb-4"
            style={{
              fontFamily: 'serif',
              fontWeight: 'bold',
              color: theme === 'dark' ? '#ffffff' : '#212121',
              transition: 'color 0.3s ease'
            }}
          >
            {categoryName} Collection
          </h2>

          {loading ? (
            <div className="text-center"><Spinner animation="border" variant={theme === 'dark' ? 'light' : 'dark'} /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : products.length === 0 ? (
            <Alert variant="info">No products found in this category.</Alert>
          ) : (
            <Row className="justify-content-center">
              {products.map((product, i) => (
                <Col key={product._id || i} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <ProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;

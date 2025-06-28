import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api/axios'; // your preconfigured Axios instance
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import ProductCard from './ProductCard'; // your product card
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 useEffect(() => {
  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
     

      const response = await API.get(`/collection/${categoryName}`);
      const fetchedProducts = response.data;

     
      // 🔎 Check if data is an array
      if (!Array.isArray(fetchedProducts)) {
       
      } else if (fetchedProducts.length === 0) {
        
      } else {
        // Check each product for expected fields
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
        err.response?.data?.message || "Error fetching product. Please try again later."
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
      <div style={{ minHeight: '100vh', paddingTop: '4rem', paddingBottom: '2rem' }}>
        <Container>
          <h2 className="text-center mb-4" style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
            {categoryName} Collection
          </h2>

          {loading ? (
            <div className="text-center"><Spinner animation="border" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : products.length === 0 ? (
            <Alert variant="info">No products found in this category.</Alert>
          ) : (
            <Row className="justify-content-center">
  {Array.isArray(products) &&
    products.map((product, i) =>
      product && typeof product === 'object' ? (
        <Col key={product._id || i} xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={product} />
        </Col>
      ) : (
        console.warn('❌ Skipping invalid product at index', i, product) || null
      )
    )}
</Row>

          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;

import React, { useEffect, useState } from 'react';
import api from '../../api/axios'; // ✅ Using pre-configured Axios
import ProductCard from './ProductCard';
import AddProductForm from './AddProductForm';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seller/my');
      setProducts(res.data?.products || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'seller') {
      fetchProducts();
    }
  }, [user, location.pathname]);

  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setShowAddForm(false);
  };

  const handleProductDeleted = (productId) => {
    setProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Manage Your Products</h4>
        <div className="d-flex gap-2">
          <Button onClick={() => setShowAddForm((prev) => !prev)}>
            {showAddForm ? 'Cancel' : 'Add Product'}
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowCategoryMenu((prev) => !prev)}>
            🔍 Search
          </Button>
        </div>
      </div>

      {/* Category Filter Panel */}
      {showCategoryMenu && (
        <div className="mb-3 p-3 bg-light rounded shadow-sm" style={{ maxWidth: '400px' }}>
          <strong>Select Category:</strong>
          <div className="d-flex flex-wrap mt-2 gap-2">
            {['Ring', 'Bangles', 'Pendant', 'Necklace'].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Add Product Form */}
      {showAddForm && <AddProductForm onProductAdded={handleProductAdded} />}

      {/* Products Display */}
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (products.filter(p => selectedCategory ? p.category === selectedCategory : true).length === 0) ? (
        <Alert variant="info">No products found{selectedCategory && ` for ${selectedCategory}`}.</Alert>
      ) : (
        <div className="row">
          {products
            .filter((product) =>
              selectedCategory ? product.category === selectedCategory : true
            )
            .map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <ProductCard
                  product={product}
                  onDelete={handleProductDeleted}
                  onUpdate={handleProductUpdated}
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;

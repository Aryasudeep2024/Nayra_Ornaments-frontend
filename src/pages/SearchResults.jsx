import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from '../components/collections/ProductCard';
import { ThemeContext } from '../context/ThemeContext'; // ✅ Theme support

const SearchResults = () => {
  const location = useLocation();
  const { products, keyword } = location.state || {};
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  if (!products || products.length === 0) {
    return (
      <>
        <Navbar />
        <div className={`container mt-4 ${isDark ? 'text-light bg-dark' : 'text-dark bg-light'}`}>
          ❌ No products found for "<strong>{keyword}</strong>"
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={`container mt-4 py-3 rounded ${isDark ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
        <h4 className="text-center">
          Results for category: <strong>{keyword}</strong>
        </h4>

        <div className="row row-cols-1 row-cols-md-3 g-4 mt-3">
          {products.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SearchResults;

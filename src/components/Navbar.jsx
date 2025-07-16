import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import './NavbarStyles.css';
import { useSelector } from 'react-redux';
import SearchModal from "./SearchModal";
import { useTheme } from '../context/ThemeContext';

const CustomNavbar = ({ cartItemCount }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const { theme, toggleTheme } = useTheme(); // ✅ Access theme context

  const handleUserIconClick = () => {
    if (!user) {
      navigate("/dashboard");
    } else if (user.role === 'user') {
      navigate("/user/dashboard");
    } else if (user.role === 'seller') {
      navigate("/seller/dashboard");
    } else if (user.role === 'superadmin') {
      navigate("/admin/dashboard");
    }
  };

  const handleCartIconClick = () => {
    if (!user) {
      navigate("/dashboard");
    } else if (user.role === 'user') {
      navigate("/user/dashboard");
    } else if (user.role === 'seller') {
      alert("You don't have any cart items because your role is Seller.");
    } else if (user.role === 'superadmin') {
      alert("You don't have any cart items because your role is Super Admin.");
    }
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: theme === 'dark' ? "#111" : "#fff",
        transition: "all 0.3s ease"
      }}
    >
      <Navbar
        bg={theme === 'dark' ? "dark" : "light"}
        expand="lg"
        className="shadow-sm px-4 w-100"
      />

      <div
        style={{
          width: "100%",
          backgroundColor: theme === 'dark' ? "#1a1a1a" : "white",
          borderRadius: "15px",
          color: theme === 'dark' ? "#fff" : "#000",
          transition: "all 0.3s ease"
        }}
      >
        <Container fluid className="d-flex align-items-center justify-content-between px-4 py-3">

          {/* Left Navigation Links */}
          <Nav className="d-flex gap-4 ms-3">
            <Nav.Link as={Link} to="/" className={`nav-pill-link ${theme === 'dark' ? 'text-light' : 'text-black'}`}>Home</Nav.Link>
            <Nav.Link as={Link} to="/collection/Ring" className={`nav-pill-link ${theme === 'dark' ? 'text-light' : 'text-black'}`}>Rings</Nav.Link>
            <Nav.Link as={Link} to="/collections" className={`nav-pill-link ${theme === 'dark' ? 'text-light' : 'text-black'}`}>Collection</Nav.Link>
            <Nav.Link as={Link} to="/collection/new-arrivals" className={`nav-pill-link ${theme === 'dark' ? 'text-light' : 'text-black'}`}>New Arrivals</Nav.Link>
          </Nav>

          {/* Brand in Center */}
          <Navbar.Brand className="position-absolute start-50 translate-middle-x text-center" style={{ zIndex: 2 }}>
            <div
              className="position-absolute start-50 translate-middle text-center"
              style={{ top: "50%" }}
            >
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                color: theme === 'dark' ? '#B2DFDB' : '#003D33',
                position: 'relative'
              }}>
                Naira
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  &nbsp;💎
                </span>
                Diamonds
              </span>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                letterSpacing: '6px',
                color: theme === 'dark' ? '#aaa' : '#555',
                textAlign: 'left',
                paddingLeft: '60px'
              }}>By Arya</div>
            </div>
          </Navbar.Brand>

          {/* Right Side Icons */}
          <div className="d-flex align-items-center gap-4 me-3">

            {/* Search Icon */}
            <FaSearch
              style={{ cursor: 'pointer', color: theme === 'dark' ? '#fff' : '#000' }}
              onClick={() => setShowSearchModal(true)}
            />
            <SearchModal show={showSearchModal} onHide={() => setShowSearchModal(false)} />

            {/* User Icon */}
            <span
              onClick={handleUserIconClick}
              style={{ cursor: 'pointer', color: theme === 'dark' ? '#fff' : '#000' }}
            >
              <FaUser />
            </span>

            {/* Cart Icon */}
            <span
              onClick={handleCartIconClick}
              className="position-relative"
              style={{ cursor: 'pointer', color: theme === 'dark' ? '#fff' : '#000' }}
            >
              <FaShoppingCart style={{ fontSize: '1.3rem' }} />
              {cartItemCount > 0 && user?.role === 'user' && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem' }}
                >
                  {cartItemCount}
                </span>
              )}
            </span>

            {/* Theme Toggle Button */}
            <Button
              variant={theme === 'dark' ? 'light' : 'dark'}
              onClick={toggleTheme}
              size="sm"
            >
              {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
            </Button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default CustomNavbar;

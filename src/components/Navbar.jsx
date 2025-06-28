import { Navbar, Nav, Container } from "react-bootstrap";
import { FaUser, FaSearch, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import './NavbarStyles.css';
import { useSelector } from 'react-redux';


const CustomNavbar = ({ cartItemCount }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
 console.log("userinfo:",userInfo)
  const handleUserIconClick = () => {
    if (!userInfo) {
      navigate("/dashboard");
    } else if (userInfo.role === 'user') {
      navigate("/user/dashboard");
    } else if (userInfo.role === 'seller') {
      navigate("/seller/dashboard");
    } else if (userInfo.role === 'superadmin') {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div style={{ width: "100%", backgroundColor: "#000" }}>
      {/* Main Navbar - Black (if needed) */}
      <Navbar bg="black" expand="lg" className="shadow-sm px-4 w-100">
        {/* Optional top bar content here */}
      </Navbar>

      {/* White Navbar with Full Width and Left-Aligned Links */}
      <div
        style={{
          width: "100%",
          backgroundColor: "white",
          borderRadius: "15px 15px 15px 15px",
        }}
      >
        <Container fluid className="d-flex align-items-center justify-content-between px-4 py-3">
          
          {/* Left Navigation Links */}
          <Nav className="d-flex gap-4 ms-3">
            <Nav.Link as={Link} to="/" className="nav-pill-link text-black">Rings</Nav.Link>
            <Nav.Link as={Link} to="/collections" className="nav-pill-link text-black">Collection</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="nav-pill-link text-black">New Arrivals</Nav.Link>
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
                color: '#003D33',
                position: 'relative'
              }}>
                Naira
                <span style={{ position: 'relative', display: 'inline-block' }}>
                  &nbsp;💎
                  <span style={{
                    position: 'absolute',
                    top: '-0.6em',
                    left: '0.1em',
                    fontSize: '0.6em',
                  }}>
                  </span>
                </span>
                Diamonds
              </span>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '10px',
                letterSpacing: '6px',
                color: '#555',
                textAlign: 'left',
                paddingLeft: '60px'
              }}>By Arya</div>
            </div>
          </Navbar.Brand>

          {/* Right Side Icons */}
          <div className="d-flex align-items-center gap-4 me-3">
            <FaSearch style={{ cursor: 'pointer' }} />

            {/* Updated User Icon with role-based navigation */}
            <span onClick={handleUserIconClick} style={{ color: 'inherit', cursor: 'pointer' }}>
              <FaUser />
            </span>

            {/* Cart Icon with Count */}
            <Link to="/user/cart" className="position-relative" style={{ color: 'inherit' }}>
              <FaShoppingCart style={{ cursor: 'pointer', fontSize: '1.3rem' }} />
              {cartItemCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: '0.6rem' }}
                >
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>

        </Container>
      </div>
    </div>
  );
};

export default CustomNavbar;

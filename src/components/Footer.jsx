import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FaInstagram, FaYoutube, FaPinterest, FaLinkedin } from 'react-icons/fa';
import certificate1 from '../assets/source.PNG'; // Replace with your actual certificate images
import certificate2 from '../assets/shipping.PNG';
import certificate3 from '../assets/maintenance.PNG';
import certificate4 from '../assets/hallmark.PNG';
import certificate5 from '../assets/freeinsu.PNG';
import certificate6 from '../assets/cashback.PNG';

//import '../components/Footer.css'; // Optional: for custom styling

const Footer = () => {
  return (
    <>
      {/* Certificate Bar */}
      <div style={{ backgroundColor: '#fdf8f6', padding: '30px 0' }}>
        <Container fluid className="text-center">
          <Row className="justify-content-center g-4">
            <Col xs={6} sm={4} md={2}>
              <img src={certificate1} alt="Direct From Source" className="img-fluid mb-2" />
              <div>Direct From Source</div>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <img src={certificate2} alt="Insured Shipping" className="img-fluid mb-2" />
              <div>Insured Shipping</div>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <img src={certificate3} alt="Free Maintenance" className="img-fluid mb-2" />
              <div>Free Maintenance</div>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <img src={certificate4} alt="Hallmarked Gold" className="img-fluid mb-2" />
              <div>Hallmarked Gold</div>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <img src={certificate5} alt="Free Insurance" className="img-fluid mb-2" />
              <div>Free Insurance</div>
            </Col>
            <Col xs={6} sm={4} md={2}>
              <img src={certificate6} alt="80% Buyback" className="img-fluid mb-2" />
              <div>80% Buyback</div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Main Footer */}
      <div style={{ backgroundColor: '#121212', color: 'white', padding: '40px 0' }}>
        <Container>
          <Row className="mb-4">
            <Col md={4}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#EAC6C1' }}>Naira <br />Diamonds®</h2>
              <p className="mt-3" style={{ fontFamily: 'Georgia, serif' }}>
                Stay in the loop with our weekly newsletter
              </p>
              <InputGroup className="mt-3" style={{ maxWidth: '300px' }}>
                <Form.Control placeholder="Enter your email" />
                <Button variant="light">&#10148;</Button>
              </InputGroup>
              <div className="mt-4 d-flex gap-3">
                <FaInstagram />
                <FaYoutube />
                <FaPinterest />
                <FaLinkedin />
              </div>
            </Col>

            <Col md={2}>
              <h6>Useful Links</h6>
              <ul className="list-unstyled">
                <li>Book A Video Call 📞</li>
                <li>Buy Back / Cancellation Policy</li>
                <li>Privacy Policy</li>
                <li>Terms and Condition</li>
                <li>Shipping & Delivery</li>
                <li>Payment Methods</li>
                <li>FAQ</li>
                <li>Blogs</li>
              </ul>
            </Col>

            <Col md={3}>
              <h6>Know Your Jewellery</h6>
              <ul className="list-unstyled">
                <li>Ring Size Chart</li>
                <li>Bracelet Size Chart</li>
                <li>Growing Diamonds</li>
                <li>The 4Cs</li>
              </ul>
            </Col>

            <Col md={3}>
              <h6>About Naira</h6>
              <ul className="list-unstyled">
                <li>About Us</li>
                <li>Mystique Stone</li>
                <li>Custom Jewellery Design</li>
                <li>The Founder Story</li>
              </ul>
              <p className="mt-4">
                <strong>📞</strong> +91 93212 94329 <br />
                <strong>✉️</strong> hello@nairadiamonds.co <br />
                702, Magic Square, Off Poddar Road,<br />
                Malad East, Mumbai 400097, MH, INDIA
              </p>
            </Col>
          </Row>

          <hr style={{ borderColor: '#444' }} />
          <p className="text-center mb-0" style={{ fontSize: '14px', color: '#aaa' }}>
            © 2025 <strong>Naira Diamonds</strong>. All Rights Reserved.
          </p>
        </Container>
      </div>
    </>
  );
};

export default Footer;

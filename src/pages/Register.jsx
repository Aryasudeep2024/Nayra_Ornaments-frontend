import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ThemeContext } from "../context/ThemeContext"; // ✅ Theme context

const Register = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext); // ✅ Get theme
  const isDark = theme === "dark";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: ""
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.password !== formData.confirmPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    try {
      const { name, email, password, profilePic } = formData;
      await axios.post("/user/register", {
        name, email, password, profilePic
      });

      navigate("/user/dashboard");
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <Container fluid className={isDark ? "bg-dark text-light" : "bg-white text-dark"}>
        <Row className="justify-content-center align-items-center min-vh-90">
          {/* Left Image Section */}
          <Col md={6} className="d-none d-md-block p-1">
            <img
              src="/images/luxury-shine-diamonds-digital-art (1).jpg"
              alt="Rare Radiance Collection"
              className="img-fluid h-100 w-100 object-fit-cover"
              style={{ borderRadius: "10px" }}
            />
          </Col>

          {/* Right Form Section */}
          <Col md={5} sm={12} className="px-5">
            <h3 className={`mb-4 mt-4 text-center ${isDark ? "text-light" : "text-dark"}`}>
              Sign Up With <strong>Naira Diamonds</strong>
            </h3>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className={isDark ? "text-light" : "text-dark"}>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className={isDark ? "text-light" : "text-dark"}>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className={isDark ? "text-light" : "text-dark"}>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className={isDark ? "text-light" : "text-dark"}>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className={isDark ? "text-light" : "text-dark"}>Profile Picture URL (optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Paste profile image URL"
                  name="profilePic"
                  value={formData.profilePic}
                  onChange={handleChange}
                />
              </Form.Group>

              {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

              <Button variant="primary" type="submit" className="w-100">
                Create Account
              </Button>

              <div className={`text-center mt-3 ${isDark ? "text-light" : "text-dark"}`}>
                Already a member?{" "}
                <a href="/dashboard" className="text-primary fw-semibold">
                  Login
                </a>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default Register;

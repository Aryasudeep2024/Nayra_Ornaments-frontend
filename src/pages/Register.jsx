import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // adjust if needed
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

const Register = () => {
  const navigate = useNavigate();
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
      const response = await axios.post("/user/register", {
        name, email, password, profilePic
      });

      navigate("/user/dashboard"); // redirect after auto login
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Something went wrong");
    }
  };

  return (<>
  <Navbar />
    <Container fluid className=" bg-black">
      <Row className="justify-content-center  align-items-center min-vh-90">
        {/* Left Image Section */}
        <Col md={6} className="d-none d-md-block p-1">
          <img
            src="/images/luxury-shine-diamonds-digital-art (1).jpg" // Replace with your image path
            alt="Rare Radiance Collection"
            className="img-fluid h-100 w-100 object-fit-cover" 
            style={{ borderRadius: "10px" }}></img>
        </Col>

        {/* Right Form Section */}
        <Col md={5} sm={12} className="px-5">
          <h3 className="mb-4 mt-4 text-center text-light">Sign Up With <strong>Naira Diamonds</strong></h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 text-light">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 text-light">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 text-light">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 text-light">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3 text-light">
              <Form.Label>Profile Picture URL (optional)</Form.Label>
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

            <div className="text-center mt-3 text-light">
              Already a member?{" "}
              <a href="/dashboard" className="text-primary fw-semibold">
                Login
              </a>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
    <Footer/>
    </>
  );
};

export default Register;

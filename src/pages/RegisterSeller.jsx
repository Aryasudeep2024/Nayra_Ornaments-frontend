// src/pages/SellerRegister.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"

const SellerRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        shopName: "",
        contactNumber: "",
        profilePic: "",
    });

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (formData.password !== formData.confirmPassword) {
            return setErrorMsg("Passwords do not match.");
        }

        try {
            const { name, email, password, shopName, contactNumber, profilePic } = formData;

            const response = await axios.post("/seller/register", {
                name,
                email,
                password,
                shopName,
                contactNumber,
                profilePic,
            });

            setSuccessMsg(response.data.message);
            navigate("/user/dashboard");
            // You may redirect to login or dashboard later
            // navigate("/seller/login");
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <>
            <Navbar />
            <Container fluid className="bg-black">
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={6} className="d-none d-md-block p-0 position-relative">
  <img
    src="/images/sellerregister.jpg"
    alt="Seller Registration"
    className="img-fluid w-100"
    style={{ height: "100vh", objectFit: "cover", borderRadius: "10px" }}
  />

  {/* Slogan overlay - aligned left */}
  <div
    className="position-absolute top-50 start-0 translate-middle-y text-start ps-4"
    style={{ color: "#fff", textShadow: "2px 2px 6px rgba(212, 209, 209, 0.7)" }}
  >
    <h2 className="fw-bold display-5 text-dark">Join the Radiance</h2>
    <p className="lead  fw-bold text-dark">Showcase your jewels to the world</p>
  </div>
</Col>


                    <Col md={5} sm={12} className="px-5">
                        <h3 className="mb-4 mt-4 text-center text-light">
                            Become a <strong>Seller</strong> on Naira Diamonds
                        </h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3 text-light">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 text-light">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 text-light">
                                <Form.Label>Shop Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="shopName"
                                    placeholder="Enter your shop name"
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 text-light">
                                <Form.Label>Contact Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="contactNumber"
                                    placeholder="Enter your contact number"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 text-light">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 text-light">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 text-light">
                                <Form.Label>Profile Picture URL (optional)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="profilePic"
                                    placeholder="Paste profile image URL"
                                    value={formData.profilePic}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
                            {successMsg && <Alert variant="success">{successMsg}</Alert>}

                            <Button type="submit" className="w-100" variant="primary">
                                Register as Seller
                            </Button>

                            <div className="text-center mt-3 text-light">
                                Already registered?{" "}
                                <a href="/dashboard" className="text-primary fw-semibold">
                                    Login here
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

export default SellerRegister;

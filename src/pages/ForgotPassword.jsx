import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../api/axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // Optional theme context

const ResetPassword = () => {
  const [step, setStep] = useState(1); // Step 1: Select Role
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme(); // Optional theme hook

  const [userData, setUserData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [sellerData, setSellerData] = useState({
    email: "",
    mobileNumber: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      alert("Please select your role.");
      return;
    }
    setStep(2);
  };

  const handleUserReset = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (userData.newPassword !== userData.confirmPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await API.post("/user/reset-password", { ...userData, role: "user" });
      setSuccessMsg(res.data.message);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSellerReset = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    if (sellerData.newPassword !== sellerData.confirmPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await API.post("/seller/reset-password", sellerData);
      setSuccessMsg(res.data.message);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep(1);
    setSuccessMsg("");
    setErrorMsg("");
  };

  return (
    <>
      <Navbar />
      <Container className="my-5 d-flex justify-content-center">
        <div
          className={`p-4 rounded shadow w-100`}
          style={{
            maxWidth: "500px",
            backgroundColor: theme === "dark" ? "#222" : "#f8f9fa",
            color: theme === "dark" ? "#fff" : "#000",
          }}
        >
          <h4 className="mb-4 text-center">🔒 Forgot Password</h4>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <Form onSubmit={handleRoleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select your role</Form.Label>
                <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">-- Choose --</option>
                  <option value="user">I am a User</option>
                  <option value="seller">I am a Seller</option>
                </Form.Select>
              </Form.Group>
              <Button variant="dark" type="submit" className="w-100">
                Continue
              </Button>
            </Form>
          )}

          {/* Step 2: User Form */}
          {step === 2 && role === "user" && (
            <Form onSubmit={handleUserReset}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={userData.newPassword}
                  onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleBack}>
                  ⬅ Back
                </Button>
                <Button type="submit" variant="dark" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Reset Password"}
                </Button>
              </div>
            </Form>
          )}

          {/* Step 2: Seller Form */}
          {step === 2 && role === "seller" && (
            <Form onSubmit={handleSellerReset}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={sellerData.email}
                  onChange={(e) => setSellerData({ ...sellerData, email: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control
                  type="text"
                  value={sellerData.mobileNumber}
                  onChange={(e) => setSellerData({ ...sellerData, mobileNumber: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={sellerData.newPassword}
                  onChange={(e) => setSellerData({ ...sellerData, newPassword: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={sellerData.confirmPassword}
                  onChange={(e) => setSellerData({ ...sellerData, confirmPassword: e.target.value })}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleBack}>
                  ⬅ Back
                </Button>
                <Button type="submit" variant="dark" disabled={loading}>
                  {loading ? <Spinner size="sm" animation="border" /> : "Reset Password"}
                </Button>
              </div>
            </Form>
          )}

          {/* Alerts */}
          {successMsg && <Alert variant="success" className="mt-3">{successMsg}</Alert>}
          {errorMsg && <Alert variant="danger" className="mt-3">{errorMsg}</Alert>}
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default ResetPassword;

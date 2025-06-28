import React, { useEffect, useState } from 'react';
import axios from '../../api/axios'; // Adjust path as needed
import { Button, Table, Alert, Spinner } from 'react-bootstrap';

const SellerApproval = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Fetch pending sellers
  const fetchPendingSellers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/admin/pending-sellers', { withCredentials: true });
      setSellers(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching sellers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers();
  }, []);

  // Approve Seller
  const handleApprove = async (sellerId) => {
    try {
      const { data } = await axios.put(
        `/admin/approve-seller/${sellerId}`,
        {},
        { withCredentials: true }
      );
      setMessage(data.message);
      // Remove the approved seller from the list
      setSellers((prev) => prev.filter((s) => s._id !== sellerId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error approving seller');
    }
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm">
      <h3 className="mb-4">Pending Seller Approvals</h3>

      {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : sellers.length === 0 ? (
        <p className="text-muted">No pending seller approvals.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller, index) => (
              <tr key={seller._id}>
                <td>{index + 1}</td>
                <td>{seller.name}</td>
                <td>{seller.email}</td>
                <td>{seller.contactNumber}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleApprove(seller._id)}
                  >
                    Approve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SellerApproval;

import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Button, Table, Alert, Spinner } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext'; // ✅ Theme hook

const SellerApproval = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { theme } = useTheme(); // ✅ access theme

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

  const handleApprove = async (sellerId) => {
    try {
      const { data } = await axios.put(
        `/admin/approve-seller/${sellerId}`,
        {},
        { withCredentials: true }
      );
      setMessage(data.message);
      setSellers((prev) => prev.filter((s) => s._id !== sellerId));
    } catch (err) {
      setError(err.response?.data?.message || 'Error approving seller');
    }
  };

  return (
    <div
      className="p-4 rounded shadow-sm"
      style={{
        backgroundColor: theme === 'dark' ? '#1e1e1e' : '#f8f9fa',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        transition: 'all 0.3s ease'
      }}
    >
      <h3 className="mb-4">Pending Seller Approvals</h3>

      {message && (
        <Alert
          variant="success"
          onClose={() => setMessage('')}
          dismissible
          className={theme === 'dark' ? 'bg-success text-light' : ''}
        >
          {message}
        </Alert>
      )}

      {error && (
        <Alert
          variant="danger"
          onClose={() => setError('')}
          dismissible
          className={theme === 'dark' ? 'bg-danger text-light' : ''}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant={theme === 'dark' ? 'light' : 'primary'} />
        </div>
      ) : sellers.length === 0 ? (
        <p className="text-muted">No pending seller approvals.</p>
      ) : (
        <div className="table-responsive">
          <Table
            striped
            bordered
            hover
            variant={theme === 'dark' ? 'dark' : 'light'}
            className="mt-3"
          >
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
        </div>
      )}
    </div>
  );
};

export default SellerApproval;

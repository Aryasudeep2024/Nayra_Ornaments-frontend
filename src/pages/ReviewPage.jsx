import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { Spinner, Alert, Card, Container, Button, Modal, Form } from 'react-bootstrap';
import StarRating from '../components/StarRating';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';

const ReviewPage = () => {
  const { productId } = useParams();
  const userInfo = useSelector(state => state.auth.user);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/review/${productId}`);
      setReviews(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRole = async () => {
    try {
      const res = await api.get('/user/profile', { withCredentials: true });
      setUserRole(res.data.user?.role || '');
    } catch (err) {
      console.error('Failed to get user role');
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchUserRole();
  }, [productId]);

  const handleSubmitReview = async () => {
    if (!newRating || !newComment.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/review', {
        productId,
        rating: newRating,
        comment: newComment.trim(),
      }, { withCredentials: true });

      setNewRating(0);
      setNewComment('');
      setShowModal(false);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteModal(true);
  };

  const confirmDeleteReview = async () => {
    try {
      await api.delete(`/review/${reviewToDelete}`, { withCredentials: true });
      setReviews(reviews.filter(r => r._id !== reviewToDelete));
      setShowDeleteModal(false);
      setReviewToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete review');
    }
  };

  return (
    <>
      <Navbar />
      <Container className={`mt-4 mb-5 ${isDark ? 'text-light' : 'text-dark'}`}>
        <h4 className="text-center mb-4">📝 Product Reviews</h4>

        {userInfo && (
          <div className="text-center mb-3">
            <Button variant={isDark ? 'light' : 'primary'} onClick={() => setShowModal(true)}>
              Write a Review
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant={isDark ? "light" : "dark"} />
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : reviews.length === 0 ? (
          <Alert variant={isDark ? "secondary" : "info"} className="text-center">No reviews for this product yet.</Alert>
        ) : (
          reviews.map((review) => (
            <Card
              key={review._id}
              className={`mb-3 shadow-sm ${isDark ? 'bg-secondary text-light' : ''}`}
            >
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{review.userId?.name || 'Anonymous'}</strong>
                  <small className="text-muted">{new Date(review.createdAt).toLocaleDateString()}</small>
                </div>
                <StarRating rating={review.rating} />
                <Card.Text className="mt-2">{review.comment}</Card.Text>

                {userInfo?.role === 'superadmin' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleConfirmDelete(review._id)}
                  >
                    Delete
                  </Button>
                )}
              </Card.Body>
            </Card>
          ))
        )}
      </Container>
      <Footer />

      {/* Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton className={isDark ? 'bg-dark text-light' : ''}>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? 'bg-dark text-light' : ''}>
          <Form>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <div className="mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      color: star <= newRating ? '#ffc107' : '#ccc'
                    }}
                    onClick={() => setNewRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </Form.Group>

            <Form.Group>
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className={isDark ? 'bg-secondary text-light' : ''}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={isDark ? 'bg-dark text-light' : ''}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant={isDark ? 'light' : 'primary'}
            onClick={handleSubmitReview}
            disabled={submitting || !newRating || !newComment.trim()}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className={isDark ? 'bg-dark text-light' : ''}>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDark ? 'bg-dark text-light' : ''}>
          Are you sure you want to delete this review?
        </Modal.Body>
        <Modal.Footer className={isDark ? 'bg-dark text-light' : ''}>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDeleteReview}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReviewPage;

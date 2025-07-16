import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CollectionCard = ({ title, image, count, link }) => {
  return (
    <Link to={link} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card 
        className="m-1 shadow-sm border-2" 
        style={{ 
          backgroundColor: '#fff',
    color: '#000',
          borderRadius: '1rem', 
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', 
          transition: 'transform 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Card.Img variant="top" src={image} style={{ height: '180px', objectFit: 'cover' }} />
        <Card.Body>
          <Card.Title style={{ fontSize: '1rem' }}>{title}</Card.Title>
          {count !== undefined && <small className="text-muted">{count} Items</small>}
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CollectionCard;

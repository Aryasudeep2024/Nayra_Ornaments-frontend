import React from 'react';
import CollectionCard from './CollectionCard';
import { Container, Row, Col } from 'react-bootstrap';
import { useTheme } from '../../context/ThemeContext';

const collections = [
  { title: "Rings", image: "/assets/ring.jpg", link: "/collection/Ring" },
  { title: "Pendants", image: "/assets/pendant2.jpeg", link: "/collection/Pendant" },
  { title: "Necklace", image: "/assets/necklace.jpg", link: "/collection/Necklace" },
  { title: "Bangles", image: "/assets/bangles.jpg", link: "/collection/Bangles" },
];

const CollectionPage = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        minHeight: '75vh',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        backgroundColor: isDark ? '#121212' : '#ffffff',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Container className="mt-5">
        <h1
          className={`text-center mb-4 ${isDark ? 'text-light' : 'text-dark'}`}
          style={{
            fontFamily: 'serif',
            fontWeight: 'bold',
            color: isDark ? '#ffffff' : '#212121',
            transition: 'color 0.3s ease',
          }}
        >
          Collections
        </h1>
        <Row className="justify-content-center">
          {collections.map((col, index) => (
            <Col xs={12} sm={6} md={4} lg={3} key={index}>
              <CollectionCard {...col} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default CollectionPage;

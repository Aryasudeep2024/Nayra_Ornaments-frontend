import React from 'react';
import CollectionCard from './CollectionCard';
import { Container, Row, Col } from 'react-bootstrap';
import Navbar from "../../components/Navbar";
import Footer from '../Footer';

const collections = [
  { title: "Rings", image: "/assets/ring.jpg", link: "/collection/Ring" },
  { title: "Pendants", image: "/assets/pendant2.jpeg", link: "/collection/Pendant" },
  { title: "Necklace", image: "/assets/necklace.jpg", link: "/collection/Necklace" },
  { title: "Bangles", image: "/assets/bangles.jpg", link: "/collection/Bangles" },
];

const CollectionPage = () => {
  return (<>
  <Navbar/>
  <div style={{ minHeight: '100vh', paddingTop: '4rem', paddingBottom: '2rem' }}>
    <Container className="mt-5">
      <h2 className="text-center mb-4" style={{ fontFamily: 'serif', fontWeight: 'bold' ,color: 'black' }}>
        Collections
      </h2>
      <Row className="justify-content-center">
        {collections.map((col, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={index}>
            <CollectionCard {...col} />
          </Col>
        ))}
      </Row>
    </Container>
    </div>
    <Footer/>
    </>
  );
};

export default CollectionPage;

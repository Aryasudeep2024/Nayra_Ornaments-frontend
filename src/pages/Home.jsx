import Navbar from "../components/Navbar";
import HeroCarousel from "../components/HeroCarousel";
import Footer from "../components/Footer"
import CollectionPage from '../components/collections/CollectionPageHome';
import MostLovedSection from "../components/MostLovedSection"; 



const Home = () => {
  return (
    <>
    
       <Navbar />
      <HeroCarousel />
      <MostLovedSection /> 
      <CollectionPage />
      <Footer/>
      
    
    </>
  );
};

export default Home;

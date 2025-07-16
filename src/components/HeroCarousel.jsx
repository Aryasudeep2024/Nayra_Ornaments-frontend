// src/components/HeroCarousel.jsx

const HeroCarousel = () => {
  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">

        {/* Slide 1 - Video */}
        <div className="carousel-item active position-relative" style={{ height: '90vh', overflow: 'hidden' }}>
  <video
    className="d-block w-100 h-100"
    autoPlay
    muted
    loop
    playsInline
    style={{
      objectFit: 'cover',
      objectPosition: 'center',
    }}
  >
    <source src="/videos/3125-166335844_small.mp4" type="video/mp4" />
  </video>
  <div className="carousel-caption d-none d-md-block fade-text">
    <h2 className="text-light">Shine Like Never Before</h2>
    <p className="text-light">Unveil the elegance</p>
  </div>
</div>

        {/* Slide 2 - Image */}
        <div className="carousel-item  position-relative" style={{ height: '90vh', overflow: 'hidden' }}>
  <img
    src="/images/diamonds-arrangement-pink-background.jpg"
    className="d-block w-100 h-100"
    style={{ objectFit: 'cover', objectPosition: 'center' }}
    alt="Slide 2"
  />
  <div className="carousel-caption d-none d-md-block fade-text">
    <h2 className="text-light">Delicate Diamond Designs</h2>
    <p className="text-light">Crafted for your brilliance</p>
  </div>
</div>

        {/* Slide 3 - Image */}
        <div className="carousel-item position-relative">
          <img
            src="/images/high-angle-christmas-globes-with-copy-space.jpg"
            className="d-block w-100"
            style={{ objectFit: 'cover', maxHeight: '90vh' }}
            alt="Slide 3"
          />
          <div className="carousel-caption d-none d-md-block fade-text">
            <h2 className="text-light">Celebrate with Sparkle</h2>
          </div>
        </div>

        {/* Slide 4 - Image */}
        <div className="carousel-item position-relative" style={{ height: '90vh', overflow: 'hidden' }}>
  <img
    src="/images/luxury-shine-diamonds-digital-art (2).jpg"
    className="d-block w-100 h-100"
    style={{ objectFit: 'cover', objectPosition: 'center' }}
    alt="Slide 4"
  />

  <div
    className="carousel-caption d-none d-md-block text-end pe-5"
    style={{
      position: 'absolute',
      top: '50%',
      right: '5%',
      transform: 'translateY(-50%)',
      animation: 'fadeInUp 1.5s ease-out',
    }}
  >
    <h2 className="text-light display-5 fw-bold" style={{ textShadow: '2px 2px 4px #000' }}>
      Timeless Elegance
    </h2>
    <p className="text-light fs-5" style={{ textShadow: '1px 1px 3px #000' }}>
      Unwrap a sparkle. Wear a story.
    </p>
    <p className="text-light fs-6 fst-italic" style={{ textShadow: '1px 1px 2px #000' }}>
      Only at Naira Jewels.
    </p>
  </div>
</div>

      </div>

      {/* Carousel Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default HeroCarousel;

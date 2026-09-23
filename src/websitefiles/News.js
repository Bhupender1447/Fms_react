import { Link } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

const News = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure video plays and handles autoplay restrictions
    const video = videoRef.current;
    
    const handlePlay = () => {
      if (video) {
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video autoplay started successfully');
            })
            .catch(error => {
              console.log('Autoplay failed, trying with muted:', error);
              // If autoplay fails, try with user interaction
              video.muted = true;
              video.play().catch(e => {
                console.log('Video play failed:', e);
              });
            });
        }
      }
    };

    // Try to play immediately
    handlePlay();

    // Add event listeners for user interaction to unlock audio
    const handleUserInteraction = () => {
      if (video && video.muted) {
        video.muted = false;
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Latest Logistics News & Insights | Isovia</title>
        <meta name="description" content="Stay updated with the latest news, trends, and innovations in the logistics and freight industry from Isovia." />
      </Helmet>
      <section className="news-banner position-relative d-flex align-items-center justify-content-center text-center text-white">
        {/* Background Video */}
        <video 
          ref={videoRef}
          className="bg-video"
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
        >
          <source src="images/news-bg.mp4" type="video/mp4" />
          <source src="images/news-bg.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay for gradient and readability */}
        <div className="overlay" />
        
        {/* Text Content */}
        <div className="content position-relative">
          <h1 className="fw-bold display-5">LATEST NEWS</h1>
          <p className="lead mt-3">
            Discover updates, insights, and innovations driving the logistics and
            freight industry forward.
          </p>
          <div className="scroll-down-button">
            <Link to="#news-content">
              <span> Scroll Down </span>
              <i className="fa-solid fa-angles-down" />
            </Link>
          </div>
        </div>
      </section>

      <section id="news-content" className="blog-sections" style={{ backgroundColor: '#f1f1f1', padding: '80px 0' }}>
        <div className="container">
          <div className="row blogs-section">
            {/* Article 1 */}
            <div className="col-md-4 blog-sec-responsive mb-5">
              <div className="blog-1-img">
                <img src="/images/blog-1.png" alt="Real-time Monitoring" style={{ width: '100%', borderRadius: '10px' }} />
              </div>
              <div className="blog-article">
                <h4 className="blog-article-title mt-3">Real-time Monitoring</h4>
                <p className="blog-article-excerpt">
                  The current logistics situation requires delivery services to provide both accuracy and speed...
                </p>
                <Link to="/Article1" className="read-more">
                  Read More →
                </Link>
              </div>
            </div>

            {/* Article 2 */}
            <div className="col-md-4 blog-sec-responsive mb-5">
              <div className="blog-1-img">
                <img src="/images/blog-2.png" alt="The Meaning of IFM" style={{ width: '100%', borderRadius: '10px' }} />
              </div>
              <div className="blog-article">
                <h4 className="blog-article-title mt-3">The Meaning of IFM</h4>
                <p className="blog-article-excerpt">
                  Logistics is a fundamental sector of the global economy, connecting companies, suppliers and consumers...
                </p>
                <Link to="/Article2" className="read-more">
                  Read More →
                </Link>
              </div>
            </div>

            {/* Article 3 */}
            <div className="col-md-4 blog-sec-responsive mb-5">
              <div className="blog-1-img">
                <img src="/images/blog-3.png" alt="Sustainability in transportation" style={{ width: '100%', borderRadius: '10px' }} />
              </div>
              <div className="blog-article">
                <h4 className="blog-article-title mt-3">Sustainability in transportation</h4>
                <p className="blog-article-excerpt">
                  Freight transportation serves as a crucial component for the worldwide economy since it enables...
                </p>
                <Link to="/Article3" className="read-more">
                  Read More →
                </Link>
              </div>
            </div>

            {/* Article 4 */}
            <div className="col-md-4 blog-sec-responsive mb-5">
              <div className="blog-1-img">
                <img src="/images/blog-4.png" alt="Automation in logistics" style={{ width: '100%', borderRadius: '10px' }} />
              </div>
              <div className="blog-article">
                <h4 className="blog-article-title mt-3">Automation in logistics with AI</h4>
                <p className="blog-article-excerpt">
                  Automation is one of the most widely used ways by companies to optimize logistics processes...
                </p>
                <Link to="/Article4" className="read-more">
                  Read More →
                </Link>
              </div>
            </div>

            {/* Article 5 */}
            <div className="col-md-4 blog-sec-responsive mb-5">
              <div className="blog-1-img">
                <img src="/images/blog-5.png" alt="Transport and Technology" style={{ width: '100%', borderRadius: '10px' }} />
              </div>
              <div className="blog-article">
                <h4 className="blog-article-title mt-3">Transport and Technology</h4>
                <p className="blog-article-excerpt">
                  Transportation functions as a primary economic system that enables human and business connections...
                </p>
                <Link to="/Article5" className="read-more">
                  Read More →
                </Link>
              </div>
            </div>

            {/* Article 6 */}
            <div className="col-md-4 blog-sec-responsive mb-5">
              <div className="blog-1-img">
                <img src="/images/blog-6.png" alt="Impact of AI" style={{ width: '100%', borderRadius: '10px' }} />
              </div>
              <div className="blog-article">
                <h4 className="blog-article-title mt-3">Impact of AI on Transportation</h4>
                <p className="blog-article-excerpt">
                  The field of artificial intelligence has brought technological advancements that benefit multiple sectors...
                </p>
                <Link to="/Article6" className="read-more">
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default News;
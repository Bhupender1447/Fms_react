import {Link } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';


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
  );
};

export default News;
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from "react-helmet-async";


const Contactus = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Handle video autoplay
    const video = videoRef.current;
    if (video) {
      const playVideo = async () => {
        try {
          video.muted = true;
          await video.play();
        } catch (error) {
          console.log('Video autoplay failed:', error);
        }
      };
      playVideo();
    }

    // Add event listeners for modal
    const handleEscape = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [modalOpen]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
    closeModal();
  };

  return (
    <>
      <Helmet>
        <title>Contact Isovia | Book Your Freight & Fleet Software</title>
        <meta name="description" content="Contact Isovia to request a demo of our freight and fleet management software or speak to our software experts about your needs." />
      </Helmet>
      <section className="contact-banner position-relative text-center text-white d-flex align-items-center justify-content-center">
        <video 
          ref={videoRef}
          className="bg-video" 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
        >
          <source src="images/contact.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay for better text readability */}
        <div className="overlay"></div>

        <div className="container position-relative">
          <h1 className="fw-bold display-4 mb-3">CONTACT&nbsp;US</h1>
          <p className="lead mb-0">
            Let's connect! Our team is here to answer your questions and provide the best logistics solutions.
          </p>
        </div>
      </section>

      <section className="get-in-touch-section">
        <section className="get-in-touch">
          <div className="get-in-touch-left">
            <h2><span>Get in Touch</span></h2>
            <p>We'd love to hear from you. Fill out the form to start a conversation.</p>
          </div>
          <div className="circle-container">
            <div className="outer-border"></div>
            <div className="rays">
              {/* Generate 24 rays using map */}
              {Array.from({ length: 24 }).map((_, index) => (
                <div key={index} className="ray" style={{ transform: `rotate(${index * 15}deg)` }}></div>
              ))}
            </div>
            <div className="circle-border"></div>
            <button 
              id="circleBtn" 
              className="circle-btn"
              onClick={openModal}
            >
              Click Here
            </button>
          </div>
        </section>
        
        <section className="maps-link">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4558.806568275673!2d-79.828052!3d43.710764!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b1407a332ea77%3A0x2c6bf2883e944c9a!2s33%20Sir%20Jacobs%20Crescent%2C%20Brampton%2C%20ON%20L7A%203V2%2C%20Canada!5e1!3m2!1sen!2sin!4v1760336164605!5m2!1sen!2sin" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Isovia Inc. Location"
          ></iframe>
        </section>

        {/* Modal Popup */}
        <div 
          id="contactModal" 
          className={`modal ${modalOpen ? 'active' : ''}`}
          onClick={handleBackdropClick}
        >
          <div className="modal-content">
            <button 
              id="closeModal" 
              className="close-btn"
              onClick={closeModal}
            >
              ×
            </button>
            <h3>Get in Touch</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Email" required />
              <input type="tel" placeholder="Phone" required />
              <input type="text" placeholder="Company Name" />
              <textarea rows="4" placeholder="Your Message"></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contactus;
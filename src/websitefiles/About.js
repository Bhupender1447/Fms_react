import React, { useEffect } from 'react'
import {Link } from 'react-router-dom';


const About = () => {
  // Bubble animation function
  useEffect(() => {
    const bubbles = document.querySelectorAll('.bubbles span');
    bubbles.forEach((bubble, index) => {
      bubble.style.width = `${20 + (index * 5)}px`;
      bubble.style.height = `${20 + (index * 5)}px`;
      bubble.style.left = `${10 + (index * 8)}%`;
      bubble.style.animationDelay = `${index * 2}s`;
    });
  }, []);

  // Scroll animation function
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

    return () => {
      hiddenElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  // Smooth scroll function
  const handleScrollClick = (e) => {
    e.preventDefault();
    const ourStorySection = document.querySelector('.our-story');
    if (ourStorySection) {
      ourStorySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Image error handling function
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/600x400/667eea/ffffff?text=Isovia+Shop';
  };

  return (
    <>
      <section className="about-banner">
        <div className="bubbles">
          {/* Create multiple bubble elements */}
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="overlay">
          <div className="banner-content">
            <h1>About Us</h1>
            <p>
              We deliver excellence on every mile. Learn more about who we are and
              what drives us forward.
            </p>
            <div className="scrol-down-button">
              <Link to="#our-story" onClick={handleScrollClick}>
                <span> Scroll Down </span>
                <i className="fa-solid fa-angles-down" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* About Us Banner */}
      {/* 🌟 Our Story Section */}
      <section className="our-story" id="our-story">
        <div className="story-content">
          <h2>Our Story</h2>
          <p>
            <strong>Arshdeep Singh Chatha – CEO and Founder of Isovia Inc.</strong>
            <br />
            <br />
            Arshdeep Singh Chatha, the visionary CEO of Isovia Inc., embarked on a
            journey in 2015 to transform the logistics and freight industry through
            high-tech solutions. His early experience as a dispatcher and freight
            broker for numerous companies provided him with a deep understanding of
            logistics challenges and inspired the development of a one-stop,
            AI-powered Freight Management System (FMS) designed to elevate
            businesses of all sizes. Isovia's TMS (Transportation Management System)
            software is the first step in realizing this vision, offering a scalable
            platform that enhances operational efficiency and profitability.
          </p>
        </div>
      </section>
      {/* 🌟 Who We Are Section */}
      <section className="who-we-are">
        <div className="who-content hidden">
          <h2>Who We Are</h2>
          <p>
            Under Arshdeep's leadership, Isovia Inc. aims to revolutionize the
            logistics industry with advanced, accessible technology. Beyond TMS,
            Isovia is developing an AI Safety Assist tool for real-time guidance on
            compliance and safety practices to promote secure operations across
            partner companies. Future plans also include launching an integrated
            Load Board platform, which will foster a robust local network of trusted
            logistics partners and facilitate secure, economical transactions.
          </p>
          <p>
            With a unique blend of industry experience and technical expertise,
            Arshdeep leads Isovia's mission to support a seamless, profitable
            workflow for the logistics sector, empowering companies with
            cutting-edge, tailored solutions to meet today's challenges and
            tomorrow's opportunities.
          </p>
        </div>
      </section>
      <section className="about-banner-shop">
        <div className="container shop-section">
          <div className="row container-content">
            <div className="col-lg-6">
              <div className="banner-content-SHOP">
                <h1>Our Shop</h1>
                <div className="content-shop-h">
                  <h4>Everything You Need</h4>
                  <p>
                    Check Driver speed, halts for monetring driver behaviour while
                    driving Narrow down your tracking process with Geo fencing
                    Secure your documents with our system by encrypting it
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="img-shop">
                <img 
                  src="images/shop.jpg" 
                  alt="Isovia Shop" 
                  onError={handleImageError}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="maps-link"
        style={{ width: "99%", height: 450, margin: "0 auto" }}
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4558.806568275673!2d-79.828052!3d43.710764!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b1407a332ea77%3A0x2c6bf2883e944c9a!2s33%20Sir%20Jacobs%20Crescent%2C%20Brampton%2C%20ON%20L7A%203V2%2C%20Canada!5e1!3m2!1sen!2sin!4v1760336164605!5m2!1sen!2sin"
          width="100%"
          height={450}
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Isovia Office Location"
        />
      </section>
    </>
  )
}

export default About
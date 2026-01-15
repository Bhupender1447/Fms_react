import React from 'react'
import { Link } from 'react-router-dom';

const Partners = () => {
  return (
<section className="partners-section py-5 position-relative">
  <div className="container position-relative">
    <div className="text-center mb-5">
      <h2 className="fw-bold text-white">Our Partners</h2>
      <p className="text-light fs-5">
        We Form Partnerships for Greatness — together, we enable our clients to
        achieve global success.
      </p>
    </div>
    <div className="row g-4">
      {/* Samsara */}
      <div className="col-md-6 partners-section-cols">
        <div className="partner-card h-100">
          <div className="partners-info">
            <h4 className="fw-semibold text-white mb-3">Samsara</h4>
            <img src="images/samsara.png" alt="" className="partners-logo" />
          </div>
          <p className="text-light mb-4">
            Samsara's portfolio of complete Internet of Things ("IoT") solutions
            combine hardware, software, and cloud to bring real-time visibility,
            analytics, and AI to operations. We serve over 20,000 customers
            across diverse sizes and industries, from transportation and
            logistics to field services, food production, energy, construction,
            local governments, and manufacturing.
          </p>
          <Link to="#" className="btn btn-outline-light px-4">
            Visit Our Partner
          </Link>
        </div>
      </div>
      {/* Motive */}
      <div className="col-md-6  partners-section-cols">
        <div className="partner-card h-100">
          <div className="partners-info">
            <h4 className="fw-semibold text-white mb-3">Motive</h4>
            <img
              src="images/KeepTrucking.png"
              alt=""
              className="partners-logo"
            />
          </div>
          <p className="text-light mb-4">
            Motive is on a mission to modernize the trucking industry. With the
            leading fleet management platform, we are bringing trucks online and
            fundamentally changing the way freight is moved on our roads.
          </p>
          <Link to="#" className="btn btn-outline-light px-4">
            Visit Our Partner
          </Link>
        </div>
      </div>
      {/* Trimble */}
      <div className="col-md-6  partners-section-cols">
        <div className="partner-card h-100">
          <div className="partners-info">
            <h4 className="fw-semibold text-white mb-3">Trimble</h4>
            <img
              src="images/trimbleconnect.png"
              alt=""
              className="partners-logo"
            />
          </div>
          <p className="text-light mb-4">
            Provides advanced GPS tracking and fleet management
            solutions.Enables Isovia to deliver real-time vehicle and asset
            tracking.
          </p>
          <Link to="#" className="btn btn-outline-light px-4">
            Visit Our Partner
          </Link>
        </div>
      </div>
      {/* Google */}
      <div className="col-md-6  partners-section-cols">
        <div className="partner-card h-100">
          {" "}
          <div className="partners-info">
            <h4 className="fw-semibold text-white mb-3">Google</h4>
            <img src="images/google.png" alt="" className="partners-logo" />
          </div>
          <p className="text-light mb-4">
            Provides advanced GPS tracking and fleet management
            solutions.Enables Isovia to deliver real-time vehicle and asset
            tracking.
          </p>
          <Link to="#" className="btn btn-outline-light px-4">
            Visit Our Partner
          </Link>
        </div>
      </div>
    </div>
    <div className="text-bottom">
      <p>
        {" "}
        Provides data integration to ensure compliance with transportation laws
        and regulations. Helps Isovia customers maintain regulatory adherence
        effortlessly. These partnerships reflect Isovia Inc.'s commitment to
        delivering seamless, intelligent, and reliable freight management
        solutions tailored to the modern logistics industry.{" "}
      </p>
    </div>
  </div>
  {/* Glowing Connection Background */}
  <div className="lines-bg" />
</section>

  )
}

export default Partners
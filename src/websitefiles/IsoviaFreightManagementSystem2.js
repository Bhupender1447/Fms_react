import React from 'react'
import { Link } from 'react-router-dom';

const IsoviaFreightManagementSystem2 = () => {
  return (
<>
  <section className="software-bg-banner">
    <div className="software-bg-container">
      <div className="container">
        <div className="software-1-text">
          <h2>Isovia Fleet Management System</h2>
        </div>
        <div className="scrol-down-button">
          <Link to="#">
            <span> Scroll Down </span>
            <i className="fa-solid fa-angles-down" />
          </Link>
        </div>
      </div>
    </div>
  </section>
  <section className="software-1-description-section">
    <div className="container">
      <div className="software-1-description-section-textarea">
        <div className="software-1-description-section-textarea-title">
          <h4>Isovia Fleet Management System (IFMS)</h4>
        </div>
        <div className="target-audience-section">
          <div className="target-audience-section-textarea">
            <div className="target-audience-section-textarea-title">
              <h5>Target Audience:</h5>
              <p>
                Fleet managers, transportation companies, and businesses with
                vehicle-dependent operations.
              </p>
            </div>
          </div>
        </div>
        <div className="key-points-section">
          <div className="key-points-section-textarea">
            <div className="key-points-section-textarea-title">
              <ul className="list-keypoints-software">
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Enhanced Fleet Oversight:</span>
                    Promote real-time GPS tracking and monitoring features.
                  </li>
                </Link>
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Driver Safety Focus:</span>
                    Emphasize driver performance tracking and safety warnings.
                  </li>
                </Link>
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Cost Control:</span>Highlight fuel tracking,
                    maintenance scheduling, and payroll automation for reduced
                    operational costs.
                  </li>
                </Link>
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Proactive Maintenance:</span>Stress the importance of
                    reduced downtime with predictive servicing.
                  </li>
                </Link>
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Regulatory Adherence:</span> Simplify compliance with
                    FMCSA and other industry regulations.
                  </li>
                </Link>
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Customizable Dashboards:</span>Showcase the ease of
                    generating actionable insights through analytics.
                  </li>
                </Link>
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Accounts and Payroll:</span>
                    Integrate financial tools to reduce administrative overhead.
                  </li>
                </Link>
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Partnership Ecosystem:</span>Underscore compatibility
                    with industry-standard platforms like Samsara and GoMotive.
                  </li>
                </Link>
                <Link to="#">
                  <li className="list-software-item-1">
                    <span>Scalable for Growth:</span>Market the product’s
                    ability to grow with businesses of any size.
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
        <button className="demo-btn" id="openPopup">
          Get Free Demo
        </button>
        {/* Popup Overlay */}
        <div className="overlay" id="popupOverlay">
          <div className="popup">
            <button className="close-btn" id="closePopup">
              Close
            </button>
            <h2>Get Free Demo</h2>
            <h3>Or Call Us At +1 647-241-5999</h3>
            <form>
              <input type="text" placeholder="Company" required="" />
              <input type="text" placeholder="Your Name" required="" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "4%"
                }}
              >
                <input
                  type="email"
                  placeholder="Email"
                  className="half"
                  required=""
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  className="half"
                  required=""
                />
              </div>
              <textarea rows={3} placeholder="Your Message" defaultValue={""} />
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</>

  )
}

export default IsoviaFreightManagementSystem2
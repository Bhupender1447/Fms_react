import React from 'react'

const Partner = () => {
  return (
    <>
    <section className="main_banner">
      <div className="overlay" />
      <div className="container">
        <h2 className="drop-in">Partners</h2>
        <h3 className="drop-left">We Form Partnerships for greatness. </h3>
        <p className="drop-right">
          Together we enable our clients to achieve global success.
        </p>
      </div>
    </section>
    <section className="partners">
      <div className="container">
        <h2 className="drop-in">
          We partner with the world's leading technology providers to accelerate
          your ambition
        </h2>
        <div className="row">
          <div className="col-md-12">
            <div className="col-md-6 col-xs-12 about_partner drop-left">
              <img src="img/samsara.png" />
              <h2>Samsara</h2>
              <p>
                Samsara's portfolio of complete Internet of Things ("IoT")
                solutions combine hardware, software, and cloud to bring real-time
                visibility, analytics, and AI to operations. We serve over 20,000
                customers across diverse sizes and industries, from transportation
                and logistics to field services, food production, energy,
                construction, local governments, and manufacturing.
              </p>
              <Link to="#" className="partner_btn">
                Visit Our Partner
              </Link>
            </div>
            <div className="col-md-6 col-xs-12 about_partner drop-right">
              <img src="img/KeepTrucking.png" />
              <h2>Motive</h2>
              <p>
                Motive is on a mission to modernize the trucking industry. With
                the leading fleet management platform, we are bringing trucks
                online and fundamentally changing the way freight is moved on our
                roads.
              </p>
              <Link to="#" className="partner_btn">
                Visit Our Partner
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="col-md-6 col-xs-12 about_partner drop-left">
              <img src="img/download.png" />
              <h2>Trimble</h2>
              <p>
                Provides advanced GPS tracking and fleet management
                solutions.Enables Isovia to deliver real-time vehicle and asset
                tracking.
              </p>
              <Link to="#" className="partner_btn">
                Visit Our Partner
              </Link>
            </div>
            <div className="col-md-6 col-xs-12 about_partner drop-right">
              <img src="img/downloadg.png" />
              <h2>Google</h2>
              <p>
                Utilizes Google Maps for precise navigation and location
                intelligence. Enhances routing and mapping features within
                Isovia’s platform. FMCSA (Federal Motor Carrier Safety
                Administration)
              </p>
              <Link to="#" className="partner_btn">
                Visit Our Partner
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <p>
              Provides data integration to ensure compliance with transportation
              laws and regulations. Helps Isovia customers maintain regulatory
              adherence effortlessly. These partnerships reflect Isovia Inc.'s
              commitment to delivering seamless, intelligent, and reliable freight
              management solutions tailored to the modern logistics industry.
            </p>
          </div>
        </div>
      </div>
    </section>
  </>
  
  )
}

export default Partner
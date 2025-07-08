import React from "react";

const Contactus = () => {
  return (
    <>
     <>
  <section className="main_banner">
    <div className="overlay" />
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <h2 className="drop-in">Contact Us</h2>
        </div>
      </div>
    </div>
  </section>
  <section className="contact_Page">
    <div className="container">
      <div className="row">
        <div className="col-md-6 c ol-xs-12">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4558.805351256277!2d-79.828052!3d43.71078!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b1407a332ea77%3A0x2c6bf2883e944c9a!2s33%20Sir%20Jacobs%20Crescent%2C%20Brampton%2C%20ON%20L7A%203V2%2C%20Canada!5e1!3m2!1sen!2sin!4v1736830459334!5m2!1sen!2sin"
            width="100%"
            height={450}
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="col-md-6 col-xs-12 contact_Page_form">
          <form className="action">
            <h2>Get In Touch</h2>
            <div>
              <input type="text" name="yourname" placeholder="Your Name" />
            </div>
            <div>
              <input type="email" name="Email" placeholder="Your Email" />
            </div>
            <div>
              <input type="number" name="phone" placeholder="Your Phone" />
            </div>
            <div>
              <textarea
                type="text"
                name="yourmessage"
                placeholder="Your Message"
                defaultValue={""}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="Submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</>

    </>
  );
};

export default Contactus;

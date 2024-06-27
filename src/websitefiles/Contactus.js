import React from "react";

const Contactus = () => {
  return (
    <>
      <section className="contact_section layout_padding">
        <div className="d-flex justify-content-center">
          <h2 className="heading_style">Contact us</h2>
        </div>
        <div className="container layout_padding2-top">
          <div className="row">
            <div className="col-md-6">
            <iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2883.987103940619!2d-79.83063792399456!3d43.710817071099505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b1407a332ea77%3A0x2c6bf2883e944c9a!2s33%20Sir%20Jacobs%20Crescent%2C%20Brampton%2C%20ON%20L7A%203V2%2C%20Canada!5e0!3m2!1sen!2sin!4v1711268425694!5m2!1sen!2sin"
  width={600}
  height={450}
  style={{ border: 0 }}
  allowFullScreen=""
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
/>

            </div>
            <div className="col-md-6">
              <div className="contact_form-container">
                <form action="">
                  <div>
                    <input type="text" placeholder="Your Name" />
                  </div>
                  <div>
                    <input type="email" placeholder="Your Email" />
                  </div>
                  <div>
                    <input type="text" placeholder="Your Phone" />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="message_input"
                      placeholder="Message"
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button type="submit " className="">
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contactus;

import React from "react";

const Company = () => {
  return (
    <>
      <div classname=" layout_padding">
        <section classname="company_section layout_padding2">
          <div classname="container">
            <div classname="row">
              <div classname="col-md-6">
                <div classname="d-flex align-items-center h-100">
                  <div classname="company-detail">
                    <h3>Company</h3>
                    <p>
                      Contrary to popular belief, Lorem Ipsum is not simply
                      random text. It has roots in a piece of classical Latin
                      literature from 45 BC, making it over 2000 yearsContrary
                      to popular belief, Lorem Ipsum is not simply random text.
                      It has roots in a piece of classical Latin literature from
                      45 BC, making it over 2000 years
                    </p>
                  </div>
                </div>
              </div>
              <div classname="col-md-6">
                <div classname="company_img-box">
                  <img src="images/company.jpg" alt="" classname="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Company;

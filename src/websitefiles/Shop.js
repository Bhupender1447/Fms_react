import React from "react";

const Shop = () => {
  return (
    <>
      <section className="shop_section layout_padding">
        <div className="container">
          <div className="d-flex justify-content-center">
            <h2 className="heading_style">Our Shop</h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex align-items-center h-100">
                <div className="shop-detail">
                  <h5>Everything You Need</h5>
                  <p>
                    ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="shop_img-box">
                <img src="images/gift.jpg" alt="" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;

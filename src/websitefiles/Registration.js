import React from 'react'

const RegistrationForm = () => {
  return (
    <>
<section className="p-3 p-md-4 p-xl-5">
    <div className="container">
      <div className="card border-light-subtle shadow-sm">
        <div className="row g-0">
          <div className="col-12 col-md-6 text-bg-primary">
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="col-10 col-xl-8 py-3">
                <img
                  className="img-fluid rounded mb-4"
                  loading="lazy"
                  src="images/download.png"
                  width={245}
                  height={80}
                  alt="BootstrapBrain Logo"
                />
                <hr className="border-primary-subtle mb-4" />
                <h2 className="h1 mb-4">
                  We make digital products that drive you to stand out.
                </h2>
                <p className="lead m-0">
                  We write words, take photos, make videos, and interact with
                  artificial intelligence.
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card-body p-3 p-md-4 p-xl-5">
              <div className="row">
                <div className="col-12">
                  <div className="mb-5">
                    <h2 className="h3">Registration</h2>
                    <h3 className="fs-6 fw-normal text-secondary m-0">
                      Enter your details to register
                    </h3>
                  </div>
                </div>
              </div>
              <form action="#!">
                <div className="row gy-3 gy-md-4 overflow-hidden">
                  <div className="col-12">
                    <label htmlFor="firstName" className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="firstName"
                      id="firstName"
                      placeholder="First Name"
                      required=""
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="lastName" className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="lastName"
                      id="lastName"
                      placeholder="Last Name"
                      required=""
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="email"
                      placeholder="name@example.com"
                      required=""
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      id="password"
                      defaultValue=""
                      required=""
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        defaultValue=""
                        name="iAgree"
                        id="iAgree"
                        required=""
                      />
                      <label
                        className="form-check-label text-secondary"
                        htmlFor="iAgree"
                      >
                        I agree to the{" "}
                        <a
                          href="#!"
                          className="link-primary text-decoration-none"
                        >
                          terms and conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <button
                        className="btn bsb-btn-xl btn-primary"
                        type="submit"
                      >
                        Sign up
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="row">
                <div className="col-12">
                  <hr className="mt-5 mb-4 border-secondary-subtle" />
                  <p className="m-0 text-secondary text-center">
                    Already have an account?{" "}
                    <a href="#!" className="link-primary text-decoration-none">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  </>
  )
}

export default RegistrationForm
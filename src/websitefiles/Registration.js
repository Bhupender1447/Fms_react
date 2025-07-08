import axios from 'axios';
import React, { useState } from 'react'

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    gender: '',
    store_id: '',
    fcm_token: 'test_fcm_token', // Setting the fcm_token value here
    role: 'user'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://isovia.ca/fms_api/api/register', formData)
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        console.error('There was an error submitting the form!', error);
      });
  };
  return (
    <>
   {/* <section className="p-3 p-md-4 p-xl-5">
      <div className="container">
        <div className="card border-light-subtle shadow-sm">
          <div className="row g-0">
            <div className="col-12 col-md-6 text-bg-primary">
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="col-10 col-xl-8 py-3">
                  <img
                    className="img-fluid rounded mb-4"
                    loading="lazy"
                   src="/images/logo2.png"
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
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3 gy-md-4 overflow-hidden">
                    <div className="col-12">
                      <label htmlFor="username" className="form-label">
                        Username <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        id="username"
                        placeholder="Username"
                        required
                        value={formData.username}
                        onChange={handleChange}
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
                        required
                        value={formData.password}
                        onChange={handleChange}
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
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="firstname" className="form-label">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstname"
                        id="firstname"
                        placeholder="First Name"
                        required
                        value={formData.firstname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="lastname" className="form-label">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastname"
                        id="lastname"
                        placeholder="Last Name"
                        required
                        value={formData.lastname}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="phone" className="form-label">
                        Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="phone"
                        id="phone"
                        placeholder="Phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="gender" className="form-label">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        name="gender"
                        id="gender"
                        required
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="1">Male</option>
                        <option value="2">Female</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label htmlFor="store_id" className="form-label">
                        Store ID <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="store_id"
                        id="store_id"
                        placeholder="Store ID"
                        required
                        value={formData.store_id}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12">
                      <label htmlFor="role" className="form-label">
                        Role <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-control"
                        name="role"
                        id="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="user">User</option>
                        <option value="agent">Agent</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <input
                        type="hidden"
                        name="fcm_token"
                        value={formData.fcm_token}
                      />
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
    </section> */}
    <section className="register_form">
  <div className="container">
    <div className="row">
      <section className="p-3 p-md-4 p-xl-5">
        <div className="container">
          <div className="card border-light-subtle shadow-sm">
            <div className="row g-0">
              <div className="col-12 col-md-6 text-bg-primary">
                <div className="d-flex align-items-top justify-content-center h-100">
                  <div className="col-10 col-xl-8 py-3">
                    <img src="img/logo2.png" />
                    <hr className="border-primary-subtle mb-4" />
                    <h2 className="h1 mb-4">
                      We make digital products that drive you to stand out.
                    </h2>
                    <p className="lead m-0">
                      We write words, take photos, make videos, and interact
                      with artificial intelligence.
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
                  <form onSubmit={handleSubmit}>
                    <div className="row gy-3 gy-md-4 overflow-hidden">
                      <div className="col-12">
                        <label htmlFor="username" className="form-label">
                          Username <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="username"
                          id="username"
                          placeholder="Username"
                          required=""
                          defaultValue="admin@admin.com"
                          value={formData.username}
                          onChange={handleChange}
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
                          required=""
                          defaultValue="admin"
                          value={formData.password}
                          onChange={handleChange}
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
                          defaultValue=""
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="firstname" className="form-label">
                          First Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstname"
                          id="firstname"
                          placeholder="First Name"
                          required=""
                          defaultValue=""
                          value={formData.firstname}
                        onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="lastname" className="form-label">
                          Last Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastname"
                          id="lastname"
                          placeholder="Last Name"
                          required=""
                          defaultValue=""
                          value={formData.lastname}
                        onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="phone" className="form-label">
                          Phone <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="phone"
                          id="phone"
                          placeholder="Phone"
                          required=""
                          defaultValue=""
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="gender" className="form-label">
                          Gender <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="gender"
                          id="gender"
                          required=""
                          value={formData.gender}
                        onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value={1}>Male</option>
                          <option value={2}>Female</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label htmlFor="store_id" className="form-label">
                          Store ID <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="store_id"
                          id="store_id"
                          placeholder="Store ID"
                          required=""
                          defaultValue=""
                          value={formData.store_id}
                        onChange={handleChange}
                        />
                      </div>
                      <div className="col-12">
                        <label htmlFor="role" className="form-label">
                          Role <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          name="role"
                          id="role"
                          required=""
                          value={formData.role}
                        onChange={handleChange}
                        >
                          <option value="user">User</option>
                          <option value="agent">Agent</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <input
                          type="hidden"
                          name="fcm_token"
                          defaultValue="test_fcm_token"
                          value={formData.fcm_token}
                        />
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
                        <a
                          href="#!"
                          className="link-primary text-decoration-none"
                        >
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
    </div>
  </div>
</section>

  </>
  )
}

export default RegistrationForm
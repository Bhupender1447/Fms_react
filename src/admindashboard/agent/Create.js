import axios from 'axios';
import React, { useState } from 'react'
import {Link } from 'react-router-dom';

const Createagent = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    firstname: '',
    lastname: '',
    phone: '',
    gender: '',
    store_id: '',
    percentage:'',
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
        setFormData({
          username: '',
          password: '',
          email: '',
          firstname: '',
          lastname: '',
          phone: '',
          gender: '',
          store_id: '',
          percentage:'',
          fcm_token: 'test_fcm_token', // Setting the fcm_token value here
          role: 'user'
        })
      })
      .catch(error => {
        console.error('There was an error submitting the form!', error);
      });
  };
  return (
    <div className="content-wrapper p-4" style={{ minHeight: 440 }}>
    <div className="row">
      <div className="col-8">
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
        <div className="col-8">
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
        <div className="col-8">
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
        <div className="col-8">
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
        <div className="col-8">
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
        <div className="col-8">
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
        <div className="col-8">
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
        <div className="col-8">
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
        <div className="col-8">
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
        <div className="col-8">
          <label htmlFor="store_id" className="form-label">
            Percentage <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className="form-control"
            name="percentage"
            id="percentage"
            placeholder="Percentage %"
            required
            value={formData.percentage}
            onChange={handleChange}
          />
        </div>
        <div className="col-8">
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
        <div className="col-8">
          <input
            type="hidden"
            name="fcm_token"
            value={formData.fcm_token}
          />
        </div>
        <div className="col-8">
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
      <div className="col-8">
        <hr className="mt-5 mb-4 border-secondary-subtle" />
        <p className="m-0 text-secondary text-center">
          Already have an account?{" "}
          <Link to="#!" className="link-primary text-decoration-none">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default Createagent
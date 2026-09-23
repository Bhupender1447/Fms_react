import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';

const Registerpage = () => {

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
    axios.post(`${BASE_URL}api/register`, formData)
      .then(response => {
        alert(response.data.message);
      })
      .catch(error => {
        console.error('There was an error submitting the form!', error);
      });
  };

  const sectionRef = useRef(null);

  // Bubble effect on mouse move
  useEffect(() => {
    const section = sectionRef.current;

    const handleMouseMove = (e) => {
      if (e.target.closest('.login-card')) return;

      const bubblelogin = document.createElement('div');
      bubblelogin.classList.add('bubblelogin');
      bubblelogin.style.left = e.clientX + 'px';
      bubblelogin.style.top = e.clientY + 'px';
      section.appendChild(bubblelogin);

      setTimeout(() => {
        if (bubblelogin.parentNode === section) {
          section.removeChild(bubblelogin);
        }
      }, 800);
    };

    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (section) {
        section.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Create floating bubbles
  useEffect(() => {
    const createFloatingBubbles = () => {
      const container = document.getElementById('login-bg');
      if (!container) return;

      // Clear existing bubbles
      const existingBubbles = container.querySelectorAll('.floating-bubble');
      existingBubbles.forEach(bubble => bubble.remove());

      for (let i = 0; i < 20; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('floating-bubble');

        const size = Math.random() * 60 + 20; // 20px - 80px
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.animationDuration = `${8 + Math.random() * 10}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(bubble);
      }
    };

    createFloatingBubbles();
  }, []);
  return (
    <section className="register-section" id="bg" ref={sectionRef}>
      <div className="container">
        <div className="register-card">
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username *</label>
              <input type="text" name="username"
                id="username" placeholder="Username" required="" value={formData.username}
                onChange={handleChange} />
            </div>
            <div className="password-sec-form">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required=""
                value={formData.password}
                onChange={handleChange}
              />
              <span className="toggle-password" id="togglePassword">
                👁️
              </span>
            </div>
            <div>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="name@example.com"
                required=""
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"


                minLength={8}
                pattern="[0-9]{8,}"
                name="phone"
                id="phone"
                placeholder="Phone"
                required=""
                defaultValue=""
                value={formData.phone}
                onChange={handleChange}
              />
              <small id="phoneError" style={{ color: "#c5c5c5", display: "none" }}>
                {" "}
                Phone number must be at least 8 digits.{" "}
              </small>
            </div>
            <div>
              <label htmlFor="fname">First Name *</label>
              <input type="text" id="firstname" placeholder="First Name" name='firstname' required="" value={formData.firstname}
                onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="lname">Last Name *</label>
              <input type="text" name="lastname"
                id="lastname" placeholder="Last Name" required="" value={formData.lastname}
                onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="gender">Gender *</label>
              <select id="gender" required="">
                <option name="gender"
                  id="gender"
                  required=""
                  value={formData.gender}
                  onChange={handleChange}>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="store">Store ID *</label>
              <input type="text" name="store_id"
                id="store_id"
                placeholder="Store ID"
                required=""
                defaultValue=""
                value={formData.store_id}
                onChange={handleChange} />
            </div>
            {/* <div>
          <label htmlFor="role">Role *</label>
          <select id="role" required="">
            <option value="user" selected="">
              User
            </option>
            <option value="admin">Admin</option>
          </select>
        </div> */}
            <button type="submit">Register</button>
            <div className="signin">
              Already have an account? <Link to={"/loginmain"}>Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </section>

  )
}

export default Registerpage
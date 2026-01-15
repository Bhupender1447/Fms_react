import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';
const Driverlogin = () => {
      const sectionRef = useRef(null);
       const [Email, setEmail] = useState('');
        const [Password, setPassword] = useState('');
        const [error, setError] = useState('');
      
        let navigate = useNavigate();
        const handleOnSubmit = (e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.append("email", Email);
          formData.append("password", Password);
      
          axios.post('https://isovia.ca/fms_api/api/driver_login', formData)
            .then(res => {
              let loginRes = res.data;
              console.log(loginRes);
              if (loginRes.status === "success") {
                let data = {
                  name: loginRes.username,
                  id: loginRes.user_id,
                  email: loginRes.email,
                  gomotive_id:loginRes.gomotive_id,
                  role: loginRes.role // Assuming the response contains a 'role' field
                };
                localStorage.setItem("logindetail", JSON.stringify(data));
                
                // Navigate based on user role
                if (loginRes.role === "driver") {
                  navigate('/logs');
                }
              } else if (loginRes.status === "error") {
                setError(loginRes.message);
              }
            })
            .catch(err => setError(err.message));
        };

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
<section className="login-card-section" id="login-bg" ref={sectionRef}>
  <h1 className="login-title">Login Drivers</h1>
  <div className="login-card text-center">
    <h3>Sign in to start your session</h3>
    <form onSubmit={handleOnSubmit}>
      <input type="email" placeholder="Email" required=""   value={Email}
              onChange={(e) => setEmail(e.target.value)} />
      <div className="password-holder">
        <input
          type="password"
          placeholder="Password"
          id="password"
          required=""
           value={Password}
              onChange={(e) => setPassword(e.target.value)}
          
        />
        <span className="toggle-pass-login" id="togglePassLogin">
          👁️
        </span>
      </div>
      <div className="check-box-login">
        <div className="checkbox-wrapper">
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>
        <Link to="#" className="checkbox-wrapper">
          Forgot Password?
        </Link>
        <p>{error&&error}</p>
      </div>
      <button type="submit" className="btn-login">
        Login
      </button>
    </form>
  </div>
</section>

  )
}

export default Driverlogin
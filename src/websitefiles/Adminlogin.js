import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom';

const Adminlogin = () => {
    
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
    const[Email,setEmail]=useState('');
    const[Password,setPassword]=useState('');
    const[,seterror]=useState('');
    
    let navigate = useNavigate();
    const handleonSubmit = (e) => {
      e.preventDefault();
      const formdata = new FormData();
      formdata.append("email", Email);
      formdata.append("password", Password);
    
      axios.post('https://isovia.ca/fms_api/api/login', formdata)
        .then(res => {
          let loginres = res.data;
          console.log(loginres);
          if (loginres.status === "success") {
            let data = {
              name: loginres.username,
              id: loginres.user_id,
              email: loginres.email,
              role: loginres.role // Assuming the response contains a 'role' field
            };
            localStorage.setItem("logindetail", JSON.stringify(data));
            localStorage.setItem('hasJustLoggedIn', 'true');
    
            
            // Navigate based on user role
            if (loginres.role === "admin") {
              navigate('/accounting');
            } else if (loginres.role === "user") {
              navigate('/user'); // Change '/user' to the appropriate route for regular users
            }
          } else if (loginres.status === "error") {
            seterror(loginres.message);
          }
        })
        .catch(err => seterror(err.message));
    };
    
  return (
  <section className="login-card-section" id="login-bg" ref={sectionRef}>
  <h1 className="login-title">Login</h1>
  <div className="login-card text-center">
    <h3>Sign in to start your session</h3>
    <form onSubmit={handleonSubmit}>
      <input type="email" placeholder="Email" required=""  value={Email}
                onChange={(e)=>setEmail(e.target.value)}/>
      <div className="password-holder">
        <input
          type="password"
          placeholder="Password"
          id="password"
          required=""
          value={Password}
                onChange={(e)=>setPassword(e.target.value)}
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
      </div>
      <button type="submit" className="btn-login">
        Login
      </button>
    </form>
  </div>
</section>

  )
}

export default Adminlogin
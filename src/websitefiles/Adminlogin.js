import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';

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
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error, seterror] = useState('');
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submitting = useRef(false);

  let navigate = useNavigate();
  const handleonSubmit = async (e) => {
    e.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    seterror('');
    localStorage.removeItem('logindetail');
    localStorage.removeItem('hasJustLoggedIn');
    const formdata = new FormData();
    formdata.append("email", Email.trim());
    formdata.append("password", Password);
    try {
      const { data: login } = await axios.post(`${BASE_URL}api/login`, formdata, { withCredentials: true });
      if (login?.status !== 'success') throw new Error(login?.message || 'Sign-in returned an invalid response.');
      const { data: session } = await axios.get(`${BASE_URL}api/staff-session`, { withCredentials: true });
      if (session?.status !== 'success' || !/^[1-9][0-9]*$/.test(String(session.user_id))
          || typeof session.username !== 'string' || typeof session.email !== 'string'
          || !['admin', 'user'].includes(session.role)
          || String(session.user_id) !== String(login.user_id) || session.role !== login.role) {
        throw new Error('The server session could not be verified. Please sign in again.');
      }
      if (session.role !== 'admin') {
        throw new Error('Your user role is recognized, but a staff workspace for this role is not connected. No administrator access has been granted.');
      }
      localStorage.setItem('logindetail', JSON.stringify({
        name: session.username, id: session.user_id, email: session.email, role: session.role,
      }));
      localStorage.setItem('hasJustLoggedIn', 'true');
      setPassword('');
      navigate('/accounting');
    } catch (err) {
      localStorage.removeItem('logindetail');
      localStorage.removeItem('hasJustLoggedIn');
      seterror(err.response?.data?.message || err.message || 'Sign-in failed. Please try again.');
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };

  return (
    <section className="login-card-section" id="login-bg" ref={sectionRef}>
      <h1 className="login-title">Login</h1>
      <div className="login-card text-center">
        <h3>Sign in to start your session</h3>
        {error && <p role="alert" className="text-danger">{error}</p>}
        <form onSubmit={handleonSubmit} aria-label="Staff sign-in" aria-busy={pending}>
          <input type="email" aria-label="Email" autoComplete="username" placeholder="Email" required disabled={pending} value={Email}
            onChange={(e) => setEmail(e.target.value)} />
          <div className="password-holder">
            <input
              type={showPassword ? 'text' : 'password'}
              aria-label="Password"
              autoComplete="current-password"
              placeholder="Password"
              id="password"
              required
              disabled={pending}
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" className="toggle-pass-login" aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="check-box-login">
            <p>Access uses a server session. Contact your administrator for password recovery or role approval.</p>
          </div>
          <button type="submit" className="btn-login" disabled={pending}>
            {pending ? 'Verifying session...' : 'Login'}
          </button>
        </form>
      </div>
    </section>

  )
}

export default Adminlogin
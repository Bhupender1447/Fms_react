import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AgentLogin = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [error, setError] = useState('');

  let navigate = useNavigate();
  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", Email);
    formData.append("password", Password);

    axios.post('https://isovia.ca/fms_api/api/agent_login', formData)
      .then(res => {
        let loginRes = res.data;
      
        if (loginRes.status === "success") {
          let data = {
            name: loginRes.username,
            id: loginRes.user_id,
            email: loginRes.email,
            role: loginRes.role // Assuming the response contains a 'role' field
          };
          localStorage.setItem("logindetail", JSON.stringify(data));
          localStorage.setItem('hasJustLoggedIn', 'true');

          
          // Navigate based on user role
          if (loginRes.role === "agent") {
            navigate('/agentdashboard');
          }
        } else if (loginRes.status === "error") {
          setError(loginRes.message);
        }
      })
      .catch(err => setError(err.message));
  };

  return (
    <>
    <section className="login_form">
  <div className="container">
    <div className="row">
      <div className="col-md-6 col-xs-12 login-box">
        <div className="login-logo">
          <Link to="">
            <b>Login Agent</b>
          </Link>
        </div>
        <div className="login-box-body">
          <p className="login-box-msg">Sign in to start your session</p>
          {error && <div className="alert alert-danger" role="alert">
          {error}
        </div>}
          <form onSubmit={handleOnSubmit} >
            <div className="form-group has-feedback">
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                placeholder="Email"
                autoComplete="off"
                defaultValue="admin@admin.com"
                value={Email}
              onChange={(e) => setEmail(e.target.value)}
              />
              <span className="glyphicon glyphicon-envelope form-control-feedback" />
            </div>
            <div className="form-group has-feedback">
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                placeholder="Password"
                autoComplete="off"
                defaultValue="admin"
                value={Password}
              onChange={(e) => setPassword(e.target.value)}
              />
              <span className="glyphicon glyphicon-lock form-control-feedback" />
            </div>
            <div className="row">
              <div className="col-xs-8">
                <div className="checkbox icheck">
                  <label>
                    <input type="checkbox" /> Remember Me
                  </label>
                </div>
              </div>
              <div className="col-xs-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-flat"
                >
                  Sign In
                </button>
                <Link to="">Forgot Password</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>

    {/* <div className="login-box">
      <div className="login-logo">
        <Link to="">
          <b>Agent Login</b>
        </Link>
      </div>

      <div className="login-box-body">
        <p className="login-box-msg">Sign in to start your session</p>
        {error && <div className="alert alert-danger" role="alert">
          {error}
        </div>}
        
        <form onSubmit={handleOnSubmit} >
          <div className="form-group has-feedback">
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
              placeholder="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
            <span className="glyphicon glyphicon-envelope form-control-feedback" />
          </div>
          <div className="form-group has-feedback">
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              placeholder="Password"
              autoComplete="off"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="glyphicon glyphicon-lock form-control-feedback" />
          </div>
          <div className="row">
            <div className="col-xs-8">
              <div className="checkbox icheck">
                <label>
                  <input type="checkbox" /> Remember Me
                </label>
              </div>
            </div>
           
            <div className="col-xs-4">
              <button type="submit" className="btn btn-primary btn-block btn-flat">
                Sign In
              </button>
            </div>
            
          </div>
        </form>
      </div>
      
    </div> */}
    </>
  )
}

export default AgentLogin;

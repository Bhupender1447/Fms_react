import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {

const[Email,setEmail]=useState('');
const[Password,setPassword]=useState('');
const[error,seterror]=useState('');

let navigate = useNavigate();
let handleonSubmit=(e)=>{
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("email", Email);
    formdata.append("password",Password);
    axios.post('https://isovia.ca/fms_api/api/login',formdata)
    .then(res=>{
      let loginres = res.data;
      if(loginres.status=="success"){
        let data ={name:loginres.username,id:loginres.user_id,email:loginres.email}
        localStorage.setItem("logindetail",JSON.stringify(data))
        navigate('/admin')
      }else if(loginres.status=="error"){
        seterror(loginres.message)
      }
    })
    .catch(err=>seterror(err))
}

  return (
    <><div className="login-box">
    <div className="login-logo">
      <a href="">
        <b>Login</b>
      </a>
    </div>

    <div className="login-box-body">
      <p className="login-box-msg">Sign in to start your session</p>
      {error&&<div class="alert alert-danger" role="alert">
  {error}
</div>}
    
      <form onSubmit={handleonSubmit} >
        <div className="form-group has-feedback">
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            placeholder="Email"
            value={Email}
            onChange={(e)=>setEmail(e.target.value)}
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
            onChange={(e)=>setPassword(e.target.value)}
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
          {/* /.col */}
          <div className="col-xs-4">
            <button type="submit" className="btn btn-primary btn-block btn-flat">
              Sign In
            </button>
          </div>
          {/* /.col */}
        </div>
      </form>
    </div>
    {/* /.login-box-body */}
  </div>
  </>
  )
}

export default Login
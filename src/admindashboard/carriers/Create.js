import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Distance from '../Distance';

const Createcarriers = () => {
    const [name, setName] = useState('');

    const handleChange = (e) => {
      setName(e.target.value);
    };
  let navigate= useNavigate();
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('name', name);
  
      try {
        const response = await axios.post('https://isovia.ca/fms_api/api/createcarriers', formData);
        navigate('/carriers')
      } catch (error) {
        console.error(error);
      }
    };
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>Carriers</small>
      </h1>
    </section>
    {/* Main content */}
    <section className="content">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div id="messages" />
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Add Carriers</h3>
            </div>
            {/* /.box-header */}
            <form
              role="form"
              onSubmit={handleSubmit}
              method="post"
              encType="multipart/form-data"
            >
              <div className="box-body">
                <div className="col-md-6 col-xs-12 pull pull-left">
                  {/*
           <div class="col-md-06 col-xs-12 pull pull-left">
                    
        <label for="formFileSm" class="form-label">Upload Image</label>
        <input class="form-control form-control-sm" name="product_image" id="product_image" type="file" />
  
                    
                    </div> */}
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Enter USDOT #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder="Enter USDOT Number"
                        autoComplete="off"
                        value={name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
           
              {/* /.box-body */}
              <div className="box-footer">
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
                <a
                  href="/carriers/"
                  className="btn btn-warning"
                >
                  Back
                </a>
              </div>
            </form>
            <Distance/>
            {/* /.box-body */}
          </div>
          {/* /.box */}
        </div>
        {/* col-md-12 */}
      </div>
      {/* /.row */}
    </section>
    {/* /.content */}
  </div>
  
  )
}

export default Createcarriers
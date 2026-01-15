/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams,Link } from 'react-router-dom';

const Updateterms = () => {
    const {id} = useParams();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
  });

      
  const [file] = useState(null);

  useEffect(() => {
    const fetchTrailerData = async () => {
      try {
        const response = await axios.get(`https://isovia.ca/fms_api/api/updateterms/${id}`);
        setFormData(response.data.product_data);
      } catch (error) {
        console.error('Error fetching terms data:', error);
      }
    };

    fetchTrailerData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    if (file) {
      formDataToSend.append('product_image', file);
    }

    try {
      const response = await axios.post(`https://isovia.ca/fms_api/api/updateterms/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      alert('terms updated successfully!');
    } catch (error) {
      console.error('Error updating terms data:', error);
      alert('Error updating terms data.');
    }
  };
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
  {/* Content Header (Page header) */}
  <section className="content-header">
    <h1>
      Manage
      <small>Terms</small>
    </h1>
    <ol className="breadcrumb">
      <li>
        <Link to="#">
          <i className="fa fa-dashboard" /> Home
        </Link>
      </li>
      <li className="active">Terms</li>
    </ol>
  </section>
  {/* Main content */}
  <section className="content">
    {/* Small boxes (Stat box) */}
    <div className="row">
      <div className="col-md-12 col-xs-12">
        <div id="messages" />
        <div className="box">
          <div className="box-header">
            <h3 className="box-title">Add Charges</h3>
          </div>
          {/* /.box-header */}
          <form
            role="form"
            action=""
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}>
            <div className="box-body">
              <div className="col-md-6 col-xs-12 pull pull-left">
                <br />
                <br />
                <br />
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter Name"
                      autoComplete="off"
                      value={formData.name} onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Company</label>
                    <select
                      className="form-control"
                      id="company"
                      name="company"
                      value={formData.company} onChange={handleChange}
                    >
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
                {/*
               <div class="col-md-3 col-xs-12 pull pull-left">
              <div class="form-group">
              <label for="store">Charge Type</label>
              <select class="form-control" id="chargetype" name="chargetype">
              <option value="Flat">Flat</option>
               <option value="Percentage">Percentage</option>
                 <option value="Miles Rate">Miles Rate</option>
              </select>
              </div>
          </div> */}
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">No. of Days</label>
                    <input
                      type="text"
                      className="form-control"
                      id="value"
                      name="value"
                      placeholder="Enter Values"
                      autoComplete="off"
                      value={formData.value} onChange={handleChange}
                    />
                  </div>
                </div>
                {/*
              <div class="col-md-4 col-xs-12 pull pull-left">
              <label for="store">Pickup Date</label>   
                  <div class="input-group date" data-provide="datepicker">
                  
                  <input type="text" class="form-control">
                      <div class="input-group-addon">
                      <span class="glyphicon glyphicon-th"></span>
                      </div>
                  </div>
              </div>
        */}
                {/*
           <div class="col-md-12 col-xs-12 pull pull-left">
          
          <div class="form-group">
            <label for="description">Remarks</label>
            <textarea type="text" class="form-control" id="remarks" name="remarks" placeholder="Enter  Remarks" autocomplete="off">
                              </textarea>
          </div> 
          </div>
          */}
              </div>
              {/*
              <div class="col-md-4 col-xs-12 pull pull-left">
              <label for="store">Pickup Date</label>   
                  <div class="input-group date" data-provide="datepicker">
                  
                  <input type="text" class="form-control">
                      <div class="input-group-addon">
                      <span class="glyphicon glyphicon-th"></span>
                      </div>
                  </div>
              </div>
        */}
            </div>
            {/* /.box-body */}
            <div className="box-footer">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <Link
                to="/customers/"
                className="btn btn-warning"
              >
                Back
              </Link>
            </div>
          </form>
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

export default Updateterms
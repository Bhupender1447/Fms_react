import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Distance from '../Distance';

const Updatecarriers = () => {
    const {id} = useParams();
    const[message,setmessage]=useState();
    const [formData, setFormData] = useState({
        name: ''
      });
    
      
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTrailerData = async () => {
      try {
        const response = await axios.get(`https://isovia.ca/fms_api/api/updatecarriers/${id}`);
        setFormData(response.data.product_data);
      } catch (error) {
        console.error('Error fetching vendors data:', error);
      }
    };

    fetchTrailerData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
      const response = await axios.post(`https://isovia.ca/fms_api/api/updatecarriers/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(response.data);
      alert('vendors updated successfully!');
    } catch (error) {
      console.error('Error updating vendors data:', error);
      alert('Error updating vendors data.');
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
                        value={formData.name}
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

export default Updatecarriers
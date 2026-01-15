import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import Distance from '../Distance';
import CarrierDataPopup from './CarrierDataPopup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Createcarriers = () => {
  const [name, setName] = useState('');
  const [popup, setpopup] = useState(false);
  const [data, setdata] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setName(e.target.value);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', name);

  try {
    const response = await axios.post(
      'https://isovia.ca/fms_api/api/getCarrierData',
      formData
    );

    if (response.data.status === 'success') {
      setdata(response.data.data);
      setpopup(true);
      toast.success('Carrier data fetched successfully!');
    } else {
      // If backend returned a nested JSON in `response`
      let errorMessage = response.data.message;

      // Try to parse nested `response` string if it exists
      if (response.data.response) {
        try {
          const nested = JSON.parse(response.data.response);
          if (nested.message) {
            errorMessage = nested.message;
          }
          
        } catch (err) {
          // ignore parse errors
        }
      }

      toast.error(errorMessage || 'Failed to fetch carrier data.');
    }
  } catch (error) {
    console.error(error);
    toast.error('Error fetching carrier data.');
  }
};


  return (
    <>
      <div className="content-wrapper" style={{ minHeight: 440 }}>
        {popup && (
          <CarrierDataPopup
            brokerData={data}
            popup={popup}
            setpopup={setpopup}
          />
        )}

        {/* Content Header */}
        <section className="content-header">
          <h1>
            Manage
            <small>Carriers</small>
          </h1>
        </section>

        {/* Main Content */}
        <section className="content">
          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div className="box">
                <div className="box-header">
                  <h3 className="box-title">Add Carriers</h3>
                </div>

                <form
                  role="form"
                  onSubmit={handleSubmit}
                  method="post"
                  encType="multipart/form-data"
                >
                  <div className="box-body">
                    <div className="col-md-6 col-xs-12 pull pull-left">
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

                  <div className="box-footer">
                    <button type="submit" className="btn btn-primary">
                      Search
                    </button>
                    <Link to="/carriers/" className="btn btn-warning">
                      Back
                    </Link>
                  </div>
                </form>

                <Distance />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Createcarriers;

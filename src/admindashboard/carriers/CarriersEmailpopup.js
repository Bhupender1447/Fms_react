import axios from 'axios';
import React, { useState } from 'react';

const CarriersEmailpopup = ({ pdfLink, carrierId, onClose }) => {
  const [email, setEmail] = useState('');
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append('email', email);
    formData.append('carrierid', carrierId);
    formData.append('carrierpdf', pdfLink);

    try {
        
      const response = await axios.post('https://isovia.ca/fms_api/api/sendcarriermail', formData);

    //   navigate('/carriers')
    } catch (error) {
      console.error(error);
    }
    handleClose();
  };

  return (
    show && (
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Enter Your Email</h5>
              <button type="button" className="close" onClick={handleClose}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary w-100">
                  Send Agreement
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CarriersEmailpopup;
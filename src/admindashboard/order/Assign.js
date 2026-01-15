/* eslint-disable jsx-a11y/no-redundant-roles */
import  { useState } from 'react';
import axios from 'axios';
import { useParams ,Link} from 'react-router-dom';

const Assignorder = () => {
  // Initial state for the form
  const { id } = useParams();
  const [formData, setFormData] = useState({
    mode: '',
    carriers: '',
    remarks: 'na',
    msg: 'na',
    rate: 5200,
    cur: 'USD',
    scaleticketno: 'ISV-ORD1042',
    pickupLocation: '8008 Herb Kelleher Way, Dallas, TX 75235, USA',
    deliveryLocation: '815 Gana Ct, Mississauga, ON L5S 1P2, Canada',
    pickupDate: '07/25/2023',
    deliveryDate: '07/28/2023',
  });

  const [carriersList, setCarriersList] = useState([]);
  const [showCarriers, setShowCarriers] = useState(false);

  // Handle change function for form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // If 'CARRIER' is selected as transport mode, fetch carriers
    if (name === 'mode' && value === 'CARRIER') {
      setShowCarriers(true);
      fetchCarriers(); // Fetch carriers when "CARRIER" mode is selected
    } else if (name === 'mode') {
      setShowCarriers(false);
    }
  };

  // Function to fetch carriers from API
  const fetchCarriers = async () => {
    try {
      const response = await axios.get('https://isovia.ca/fms_api/api/getOrderData');
      const carriersData = response.data; // Assuming the API returns the list of carriers
     
      setCarriersList(carriersData.carriers);
    } catch (error) {
      console.error('Error fetching carriers:', error);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the form data to send via axios
    const dataToSend = new FormData();
    dataToSend.append('mode', formData.mode);
    dataToSend.append('carriers', formData.carriers);
    dataToSend.append('remarks', formData.remarks);
    dataToSend.append('msg', formData.msg);
    dataToSend.append('rate', formData.rate);
    dataToSend.append('cur', formData.cur);

    axios.post(`https://isovia.ca/fms_api/api/assign/${id}`, dataToSend)
      .then((response) => {
        console.log('Order successfully submitted:', response.data);
      })
      .catch((error) => {
        console.error('Error submitting the order:', error);
      });
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Assign <small>Carriers</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#"><i className="fa fa-dashboard" /> Home</Link>
          </li>
          <li className="active">Carriers</li>
        </ol>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div className="box">
              <form role="form" onSubmit={handleSubmit}>
                <div className="box-body">
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="mode">Select Transport Mode</label>
                      <select
                        className="form-control"
                        id="mode"
                        name="mode"
                        value={formData.mode}
                        onChange={handleChange}
                      >
                        <option value="" disabled>--Select Mode--</option>
                        <option value="CARRIER">Carrier</option>
                        <option value="LOG">Logistics</option>
                      </select>
                    </div>

                    {/* Conditionally render the carrier dropdown */}
                    {showCarriers && (
                      <div className="form-group">
                        <label htmlFor="carriers">Select Carrier</label>
                        <select
                          className="form-control"
                          id="carriers"
                          name="carriers"
                          value={formData.carriers}
                          onChange={handleChange}
                        >
                          <option value="" disabled>--Select Carrier--</option>
                          {carriersList&&carriersList.map((carrier) => (
                            <option key={carrier.id} value={carrier.id}>
                              {carrier.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor="remarks">Description</label>
                      <textarea
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Enter description"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="msg">Message for Carrier</label>
                      <textarea
                        className="form-control"
                        id="msg"
                        name="msg"
                        value={formData.msg}
                        onChange={handleChange}
                        placeholder="Enter Message for Carrier"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="rate">Rate</label>
                      <input
                        type="number"
                        className="form-control"
                        id="rate"
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        placeholder="Enter Rate"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="cur">Currency</label>
                      <select
                        className="form-control"
                        id="cur"
                        name="cur"
                        value={formData.cur}
                        onChange={handleChange}
                      >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="scaleticketno">Order #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        value={formData.scaleticketno}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pickupLocation">Pickup Location</label>
                      <input
                        type="text"
                        className="form-control"
                        id="pickupLocation"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="deliveryLocation">Delivery at</label>
                      <input
                        type="text"
                        className="form-control"
                        id="deliveryLocation"
                        name="deliveryLocation"
                        value={formData.deliveryLocation}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="pickupDate">Pickup Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="pickupDate"
                        name="pickupDate"
                        value={formData.pickupDate}
                        disabled
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="deliveryDate">Delivery Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="deliveryDate"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="box-footer">
                  <button type="submit" className="btn btn-primary">Confirm Order</button>
                  <Link to="/trips/" className="btn btn-warning">Cancel Order</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assignorder;

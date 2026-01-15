/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams ,Link} from "react-router-dom";

const Assigntrip = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the id from the URL

  const [formData, setFormData] = useState({
    truckunitnumber: "",
    trailors: "",
    trucks: "",
    drivers: "",
    co_driver_id: "",
    city_driver_id: "",
    remarks: "",
    msg: "",
    rate: "",
    cur: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const response = await axios.post(
        `http://localhost/fms_api/api/tripassign/${id}/1`,
        data
      );

      console.log("Response:", response.data);
      if (response.data.redirect_url) {
        alert();
        window.location.href = response.data.redirect_url;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    axios
      .get(`https://isovia.ca/fms_api/api/tripassign/${id}/1`)
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(data);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Manage
          <small>Logistics</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Products</li>
        </ol>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <div className="alert alert-success alert-dismissible" role="alert">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
              Successfully updated
            </div>
            <div className="box">
              <div className="box-header"></div>

              <form
                role="form"
                onSubmit={handleSubmit}
                method="post"
                encType="multipart/form-data"
              >
                <div className="box-body">
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div id="result-display" />

                    {/* Trailor Selection */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="trailors">Select Trailor</label>
                        <select
                          className="form-control"
                          id="trailors"
                          name="trailors"
                          onChange={handleChange}
                          value={formData.trailors}
                        >
                          <option value="" disabled selected>
                            Choose Trailor
                          </option>
                          {data.trailors?.map((trailor) => (
                            <option key={trailor.id} value={trailor.id}>
                              {trailor.trailor}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Truck Selection */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="trucks">Select Truck</label>
                        <select
                          className="form-control"
                          id="trucks"
                          name="trucks"
                          onChange={handleChange}
                          value={formData.trucks}
                        >
                          <option value="" disabled selected>
                            Choose Truck
                          </option>
                          {data.trucks?.map((truck) => (
                            <option key={truck.id} value={truck.id}>
                              {truck.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Driver Selection */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="drivers">Select Driver</label>
                        <select
                          className="form-control"
                          id="drivers"
                          name="drivers"
                          onChange={handleChange}
                          value={formData.drivers}
                        >
                          <option value="" disabled selected>
                            Choose Driver
                          </option>
                          {data.drivers?.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.fname} {driver.lname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Co-Driver Selection */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="co_driver_id">Select Co-Driver</label>
                        <select
                          className="form-control"
                          id="co_driver_id"
                          name="co_driver_id"
                          onChange={handleChange}
                          value={formData.co_driver_id}
                        >
                          <option value="" disabled selected>
                            Choose Co-Driver
                          </option>
                          {data.drivers?.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.fname} {driver.lname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="city_driver_id">
                          Truck Unit Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="truckunitnumber"
                          name="truckunitnumber"
                          placeholder="Enter Truck Unit Number"
                          autoComplete="off"
                          onChange={handleChange}
                          value={formData.truckunitnumber}
                        />
                      </div>
                    </div>
                    {/* City-Driver Selection */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="city_driver_id">
                          Select City-Driver
                        </label>
                        <select
                          className="form-control"
                          id="city_driver_id"
                          name="city_driver_id"
                          onChange={handleChange}
                          value={formData.city_driver_id}
                        >
                          <option value="" disabled selected>
                            Choose City-Driver
                          </option>
                          {data.drivers?.map((driver) => (
                            <option key={driver.id} value={driver.id}>
                              {driver.fname} {driver.lname}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Stop Notes */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="remarks">Stop Notes</label>
                        <textarea
                          className="form-control"
                          id="remarks"
                          rows={3}
                          name="remarks"
                          autoComplete="off"
                          onChange={handleChange}
                          value={formData.remarks}
                        ></textarea>
                      </div>
                    </div>

                    {/* Message for Broker */}
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="msg">Message for Broker</label>
                        <textarea
                          className="form-control"
                          id="msg"
                          rows={3}
                          name="msg"
                          autoComplete="off"
                          onChange={handleChange}
                          value={formData.msg}
                        ></textarea>
                      </div>
                    </div>

                    {/* Rate and Currency */}
                    {/* <div className="col-md-3 col-xs-12 pull pull-left">
            <div className="form-group">
              <label htmlFor="rate">Rate</label>
              <input type="number" className="form-control" id="rate" name="rate" placeholder="Enter Rate" autoComplete="off" onChange={handleChange} value={formData.rate} />
            </div>
          </div>
          <div className="col-md-3 col-xs-12 pull pull-left">
            <div className="form-group">
              <label htmlFor="cur">Currency</label>
              <select className="form-control" id="cur" name="cur" onChange={handleChange} value={formData.cur}>
                <option value="USD" selected={data.currency === 'USD'}>USD</option>
                <option value="CAD" selected={data.currency === 'CAD'}>CAD</option>
              </select>
            </div>
          </div> */}
                  </div>

                  {/* Order Details */}
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="scaleticketno">Order #</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.customer_orderno}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="scaleticketno">Shipment Type</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.shipment_type}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="scaleticketno">Load Type</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.load_type}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="scaleticketno">Pickup Location</label>
                        <input
                          style={{ background: "#99ffcc" }}
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.pickup_location}
                        />
                      </div>
                    </div>

                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Delivery at</label>
                        <input
                          style={{ background: "#ff5c33" }}
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.deliverylocation}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Pickup Date</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.pickup_date}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Delivery Date</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.deliver_date}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">HAZMAT</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.hazmat}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">View Manifest</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.manifest}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Addl. Charges</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.addl_charge}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">PRO Miles</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.distance}
                        />
                      </div>
                    </div>
                    <div className="col-md-4 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Delivery Appt.</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scaleticketno"
                          name="scaleticketno"
                          placeholder="Enter Rate"
                          autoComplete="off"
                          disabled
                          value={data.product_data?.appt}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* /.box-body */}
                <div className="box-footer">
                  <button type="submit" className="btn btn-primary">
                    Confirm Order
                  </button>
                  <Link
                    to="http://localhost/fms/trips/"
                    className="btn btn-warning"
                  >
                    Cancel Order
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
  );
};

export default Assigntrip;

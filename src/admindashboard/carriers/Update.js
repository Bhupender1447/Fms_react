import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Distance from "../Distance";
import {Link } from 'react-router-dom';


const Updatecarriers = () => {
  const { id } = useParams();
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address1: "",
    address2: "",
    country: "",
    state: "",
    city: "",
    zip: "",
    yard: "",
    region: "",
    csa: "No",
    pip: "No",
    ctpat: "No",
    qb: "No",
    bolconsignee: "No",
    bolcarrier: "No",
    stopnotes: "",
    pickupmail: "No",
    deliverymail: "No",
    company: "",
    legal: "",
    website: "",
    phone: "",
    tollfree: "",
    ext: "",
    fax: "",
    email: "",
    remarks: "",
    isbounded: "No",
    mcno: "",
    dotno: "",
    cvorno: "",
    fastno: "",
    fastexpdate: "",
    wsbno: "",
    wsbdate: "",
    localtaxno: "",
    fedraltaxno: "",
  });

  /* 🔹 Fetch existing carrier */
  useEffect(() => {
    axios
      .get(`https://isovia.ca/fms_api/api/fetchcarriersProductData/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setFormData(res.data.data || {});
      })
      .catch((err) => console.error(err));
  }, [id]);

  /* 🔹 Change handler */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "Yes" : "No") : value,
    });
  };

  /* 🔹 Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) =>
      fd.append(key, val ?? "")
    );

    try {
      const res = await axios.post(
        `https://isovia.ca/fms_api/api/updatecarriers/${id}`,
        fd,
        { withCredentials: true }
      );
      setMessage(res.data.message || "Carrier updated successfully");
    } catch (err) {
      alert("Error updating carrier");
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Manage <small>Carriers</small>
        </h1>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12">
            {message && <div className="alert alert-success">{message}</div>}

            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Update Carrier</h3>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="box-body">

                  {/* BASIC INFO */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Carrier Name</label>
                      <input className="form-control" name="name" value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label>DOT #</label>
                      <input className="form-control" name="dotno" value={formData.dotno} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label>MC #</label>
                      <input className="form-control" name="mcno" value={formData.mcno} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label>CVOR #</label>
                      <input className="form-control" name="cvorno" value={formData.cvorno} onChange={handleChange} />
                    </div>
                  </div>

                  {/* CONTACT */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone</label>
                      <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label>Email</label>
                      <input className="form-control" name="email" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label>Website</label>
                      <input className="form-control" name="website" value={formData.website} onChange={handleChange} />
                    </div>
                  </div>

                  {/* ADDRESS */}
                  <div className="col-md-12">
                    <h4><span className="label label-info">Address</span></h4>
                  </div>

                  {["address1","address2","city","state","zip","country"].map(f => (
                    <div className="col-md-4" key={f}>
                      <div className="form-group">
                        <label>{f.toUpperCase()}</label>
                        <input className="form-control" name={f} value={formData[f]} onChange={handleChange} />
                      </div>
                    </div>
                  ))}

                  {/* FLAGS */}
                  <div className="col-md-12">
                    <h4><span className="label label-success">Compliance</span></h4>
                  </div>

                  {["csa","pip","ctpat","qb","bolcarrier","bolconsignee","pickupmail","deliverymail","isbounded"].map(flag => (
                    <div className="col-md-3" key={flag}>
                      <div className="checkbox">
                        <label>
                          <input
                            type="checkbox"
                            name={flag}
                            checked={formData[flag] === "Yes"}
                            onChange={handleChange}
                          /> {flag.toUpperCase()}
                        </label>
                      </div>
                    </div>
                  ))}

                  {/* DATES */}
                  <div className="col-md-4">
                    <label>FAST Expiry</label>
                    <input type="date" className="form-control" name="fastexpdate" value={formData.fastexpdate} onChange={handleChange} />
                  </div>

                  <div className="col-md-4">
                    <label>WSB Date</label>
                    <input type="date" className="form-control" name="wsbdate" value={formData.wsbdate} onChange={handleChange} />
                  </div>

                  {/* REMARKS */}
                  <div className="col-md-12">
                    <label>Remarks</label>
                    <textarea className="form-control" name="remarks" value={formData.remarks} onChange={handleChange} />
                  </div>

                </div>

                <div className="box-footer">
                  <button className="btn btn-primary">Update Carrier</button>
                  <Link to="/carriers" className="btn btn-warning">Back</Link>
                </div>
              </form>

              <Distance />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Updatecarriers;

import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../config";

const DriverCustomPaperwork = () => {
  const [paperworkList, setPaperworkList] = useState([]);
  const [formData, setFormData] = useState({
    id: "", // update
    driver_id: "",
    broker_id: "",
    forward_date: "",
    upload_date: "",
    user_id: "",
    trip_id: "",
    custom_paper: null, // file
    type: "", // new
  });
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const userId = JSON.parse(localStorage.getItem("logindetail") || "{}").id;

  const [tripList, setTripList] = useState([]);
  const fetchTrips = () => {
    const user = JSON.parse(localStorage.getItem("logindetail") || "{}");
    const userId = user?.id;
    console.log(userId)
    if (userId) {
      axios
        .get(`${BASE_URL}api/tipsdriverfetchProductData/${userId}`)
        .then((res) => setTripList(res.data))
        .catch((err) => console.error("Error fetching trips:", err));
    }
  };
  const fetchDrivers = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/fetchdriversProductData`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setDrivers(data);
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchPaperworks(); // existing paperwork fetch
    fetchTrips();
  }, []);



  // Fetch list
  const fetchPaperworks = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/listCustompapers`);
      const data = await res.json();
      if (data.status === "success") setPaperworkList(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchBrokers = async () => {
    try {
      const res = await fetch(`${BASE_URL}api/listBrokers`);
      const data = await res.json();
      if (data.status === "success") {
        setBrokers(data.data || []); // data.data should be array of brokers
      }
    } catch (err) {
      console.error("Error fetching brokers:", err);
    }
  };


  useEffect(() => {
    fetchPaperworks();
    fetchBrokers();
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: "",
      driver_id: "",
      broker_id: "",
      forward_date: "",
      upload_date: "",
      user_id: "",
      trip_id: "",
      custom_paper: null,
      type: "",
    });
    setIsUpdate(false);
  };

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (

      !formData.forward_date ||
      !formData.upload_date ||

      (!formData.custom_paper && !isUpdate)
    ) {
      alert("Fill all fields & upload file!");
      return;
    }

    const fd = new FormData();
    fd.append("driver_id", userId);
    fd.append("broker_id", 0);
    fd.append("forward_date", formData.forward_date);
    fd.append("upload_date", formData.upload_date);
    fd.append("user_id", userId);
    fd.append("trip_id", formData.trip_id);
    fd.append("type", formData.type);

    // File upload key must match backend
    if (formData.custom_paper) fd.append("custom_paper", formData.custom_paper);

    if (isUpdate) {
      fd.append("id", formData.id);
      if (!formData.custom_paper) {
        const oldFile = paperworkList.find((p) => p.id === formData.id)?.custom_paper || "";
        fd.append("old_custom_paper", oldFile);
      }
    }

    const url = isUpdate
      ? `${BASE_URL}api/updateCustompaper`
      : `${BASE_URL}api/addCustompaper`;

    try {
      const res = await fetch(url, { method: "POST", body: fd });
      const data = await res.json();
      if (data.status === "success") {
        alert(data.message);
        fetchPaperworks();
        resetForm();
        setShowModal(false);
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      const res = await fetch(`${BASE_URL}api/deleteCustompaper`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.status === "success") {
        alert(data.message);
        fetchPaperworks();
      } else alert(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (doc) => {
    setFormData({
      id: doc.id,
      driver_id: doc.driver_id,
      broker_id: doc.broker_id,
      forward_date: doc.forward_date,
      upload_date: doc.upload_date,
      user_id: doc.user_id,
      custom_paper: null,
    });
    setIsUpdate(true);
    setShowModal(true);
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h3>Custom Paperwork</h3>
      <button className="btn btn-success mb-3" onClick={() => { resetForm(); setShowModal(true); }}>Add New</button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Trip/Order</th>
            <th>Driver</th>
            <th>Broker</th>
            <th>Document Type</th>
            <th>File</th>
            <th>Upload Date</th>
            <th>Forward Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const filteredDocs = paperworkList.filter(doc => doc.user_id == userId);

            if (filteredDocs.length === 0) {
              return (
                <tr>
                  <td colSpan="8" className="text-center">No documents</td>
                </tr>
              );
            }

            // Group filteredDocs by trip_id
            const grouped = filteredDocs.reduce((acc, doc) => {
              const tripId = doc.trip_id || "unassigned";
              if (!acc[tripId]) acc[tripId] = [];
              acc[tripId].push(doc);
              return acc;
            }, {});

            return Object.keys(grouped).map((tripId) => {
              const tripDocs = grouped[tripId];
              const tripInfo = tripList.find((t) => String(t.id) === String(tripId));
              const tripLabel = tripInfo
                ? `${tripInfo.customer_orderno} - ${tripInfo.pickup_address} to ${tripInfo.delivery_address}`
                : "Unassigned / General";

              return (
                <React.Fragment key={tripId}>
                  <tr className="table-secondary">
                    <td colSpan="8" className="fw-bold">
                      Trip: {tripLabel}
                    </td>
                  </tr>
                  {tripDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        {tripInfo ? tripInfo.customer_orderno : "N/A"}
                      </td>
                      <td>
                        {(() => {
                          const driver = drivers.find((d) => String(d.id) === String(doc.driver_id));
                          return driver ? `${driver.fname} ${driver.lname}` : "Unknown Driver";
                        })()}
                      </td>
                      <td>
                        {(() => {
                          const broker = brokers.find((b) => String(b.id) === String(doc.broker_id));
                          return broker ? broker.Broker : "Unknown Broker";
                        })()}
                      </td>
                      <td>{doc.type}</td>
                      <td>
                        {doc.custom_paper && (
                          <img
                            src={doc.custom_paper}
                            alt={doc.custom_paper}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              cursor: "pointer",
                              borderRadius: "4px",
                            }}
                            onClick={() => {
                              setPreviewImage(doc.custom_paper);
                              setShowPreviewModal(true);
                            }}
                          />
                        )}
                      </td>
                      <td>{doc.upload_date}</td>
                      <td>{doc.forward_date}</td>
                      <td>
                        <button className="btn btn-primary me-2 btn-sm" onClick={() => handleEdit(doc)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            });
          })()}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isUpdate ? "Update" : "Add"} Paperwork</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <input type="text" placeholder="Driver ID" name="driver_id" value={userId} onChange={handleChange} className="form-control mb-2" disabled />
                  <input type="hidden" name="broker_id" value={0} onChange={handleChange} className="form-control mb-2" />
                  <select
                    className="form-select"
                    name="trip_id"
                    value={formData.trip_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Trip --</option>
                    {tripList.map((trip) => (
                      <option key={trip.id} value={trip.id}>
                        {trip.customer_orderno} - {trip.pickup_address} to{" "}
                        {trip.delivery_address}
                      </option>
                    ))}
                  </select>

                  <select
                    className="form-select mb-2"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="Commercial Invoice">Commercial Invoice</option>
                    <option value="Bill of Lading">Bill of Lading</option>
                    <option value="Packing List">Packing List</option>
                    <option value="Certificate of Origin">Certificate of Origin</option>
                    <option value="Customs Invoice (B3 / CI1)">Customs Invoice (B3 / CI1)</option>
                    <option value="Other">Other</option>
                  </select>
                  <input type="date" name="upload_date" value={formData.upload_date} onChange={handleChange} className="form-control mb-2" />
                  <input type="date" name="forward_date" value={formData.forward_date} onChange={handleChange} className="form-control mb-2" />
                  <input type="text" placeholder="User ID" name="user_id" value={userId} onChange={handleChange} className="form-control mb-2" disabled />
                  <input type="file" name="custom_paper" onChange={handleChange} className="form-control mb-2" />
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-success">{isUpdate ? "Update" : "Add"}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview</h5>
                <button type="button" className="btn-close" onClick={() => setShowPreviewModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: "100%", height: "auto", maxHeight: "80vh", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DriverCustomPaperwork;

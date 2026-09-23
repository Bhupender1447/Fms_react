import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import AssignForm from "./AssignForm";

const CustomPaperwork = () => {
  const [paperworkList, setPaperworkList] = useState([]);
  const [formData, setFormData] = useState({
    id: "", // update
    driver_id: "",
    broker_id: "",
    forward_date: "",
    upload_date: "",
    user_id: "",
    custom_paper: null, // file
    trip_id: "",
    type: "", // new
  });
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [trips, setTrips] = useState([]);
  const [selectedTripFilter, setSelectedTripFilter] = useState("");

  const [selectedTripId, setSelectedTripId] = useState(null);

  const fetchDrivers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/fetchdriversProductData`);
      const data = res.data;
      if (Array.isArray(data)) {
        setDrivers(data);
      }
    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/tipsfetchProductData/1`);
      setTrips(res.data || []);
    } catch (err) {
      console.error("Error fetching trips:", err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchPaperworks(); // existing paperwork fetch
    fetchTrips();
  }, []);

  const onClose = () => {
    setShowAssignModal(false);

  }

  // Fetch list
  const fetchPaperworks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/listCustompapers`);
      const data = res.data;
      if (data.status === "success") setPaperworkList(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchBrokers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/listBrokers`);
      const data = res.data;
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

  const handleTripFilterChange = (e) => {
    setSelectedTripFilter(e.target.value);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      driver_id: "",
      broker_id: "",
      forward_date: "",
      upload_date: "",
      user_id: "",
      custom_paper: null,
      trip_id: "",
      type: "",
    });
    setIsUpdate(false);
  };

  // Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (
      !formData.driver_id ||
      !formData.broker_id ||
      !formData.forward_date ||
      !formData.upload_date ||
      !formData.user_id ||
      (!formData.custom_paper && !isUpdate)
    ) {
      alert("Fill all fields & upload file!");
      return;
    }

    const fd = new FormData();
    fd.append("driver_id", formData.driver_id);
    fd.append("broker_id", formData.broker_id);
    fd.append("forward_date", formData.forward_date);
    fd.append("upload_date", formData.upload_date);
    fd.append("user_id", formData.user_id);
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

    try {
      const res = await axios.post(isUpdate ? `${BASE_URL}api/updateCustompaper` : `${BASE_URL}api/addCustompaper`, fd);
      const data = res.data;
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



  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h3>Custom Paperwork</h3>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-success" onClick={() => { resetForm(); setShowModal(true); }}>Add New</button>
        <div className="d-flex align-items-center">
          <label className="me-2 mb-0">Filter by Trip:</label>
          <select
            className="form-select"
            style={{ width: "auto" }}
            value={selectedTripFilter}
            onChange={handleTripFilterChange}
          >
            <option value="">-- All Trips --</option>
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                {t.customer_orderno} - {t.pickup_address} to {t.delivery_address}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            const filteredDocs = paperworkList.filter(
              (doc) => !selectedTripFilter || String(doc.trip_id) === String(selectedTripFilter)
            );

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
              const tripInfo = trips.find((t) => String(t.id) === String(tripId));
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
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => {
                            setSelectedTripId(doc.trip_id); // set trip/document id
                            setShowAssignModal(true);
                          }}
                        >
                          Assign
                        </button>
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
                  <select
                    className="form-select"
                    name="driver_id"
                    value={formData.driver_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Driver --</option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fname} {d.lname} ({d.company})
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select"
                    name="broker_id"
                    value={formData.broker_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Broker --</option>
                    {brokers.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.Broker}
                      </option>
                    ))}
                  </select>
                  <select
                    className="form-select mb-2"
                    name="trip_id"
                    value={formData.trip_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Trip --</option>
                    {trips.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.customer_orderno} ({t.pickup_address})
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
                  <input type="text" placeholder="User ID" name="user_id" value={formData.user_id} onChange={handleChange} className="form-control mb-2" />
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


      {showAssignModal && (
        <AssignForm onClose={onClose} selectedTripId={selectedTripId} />
      )}
    </div>
  );
};

export default CustomPaperwork;

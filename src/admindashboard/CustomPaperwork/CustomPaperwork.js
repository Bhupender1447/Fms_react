import React, { useState, useEffect } from "react";
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
  });
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [brokers, setBrokers] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
 const [showAssignModal, setShowAssignModal] = useState(false);

const [selectedTripId, setSelectedTripId] = useState(null);

const fetchDrivers = async () => {
  try {
    const res = await fetch("https://isovia.ca/fms_api/api/fetchdriversProductData");
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
}, []);

const onClose = () => {
  setShowAssignModal(false);

}

  // Fetch list
  const fetchPaperworks = async () => {
    try {
      const res = await fetch("https://isovia.ca/fms_api/api/listCustompapers");
      const data = await res.json();
      if (data.status === "success") setPaperworkList(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchBrokers = async () => {
  try {
    const res = await fetch("https://isovia.ca/fms_api/api/listBrokers");
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
      custom_paper: null,
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
      ? "https://isovia.ca/fms_api/api/updateCustompaper"
      : "https://isovia.ca/fms_api/api/addCustompaper";

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



  return (
    <div  className="content-wrapper" style={{ minHeight: 440 }}>
      <h3>Custom Paperwork</h3>
      <button className="btn btn-success mb-3" onClick={() => { resetForm(); setShowModal(true); }}>Add New</button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Driver</th>
            <th>Broker</th>
            <th>File</th>
            <th>Upload Date</th>
            <th>Forward Date</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {paperworkList.length === 0 ? (
            <tr><td colSpan="6">No documents</td></tr>
          ) : paperworkList.map((doc) => (
            <tr key={doc.id}>
            <td>
  {drivers.find((d) => d.id === doc.driver_id)
    ? `${drivers.find((d) => d.id === doc.driver_id).fname} ${drivers.find((d) => d.id === doc.driver_id).lname}`
    : "Unknown Driver"}
</td>

             <td>
  {(() => {
    const broker = brokers.find((b) => b.id === doc.broker_id);
    return broker ? broker.Broker : "Unknown Broker";
  })()}
</td>

             <td>
  {doc.custom_paper && (
    <img
      src={doc.custom_paper}
      alt={doc.custom_paper}
      style={{ width: "60px", height: "60px", objectFit: "cover", cursor: "pointer", borderRadius: "4px" }}
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
                {/* <button className="btn btn-primary me-2 btn-sm" onClick={() => handleEdit(doc.id)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(doc.id)}>Delete</button> */}
              </td>
            </tr>
          ))}
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

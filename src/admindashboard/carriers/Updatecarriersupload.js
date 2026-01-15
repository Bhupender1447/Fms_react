import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Updatecarriersupload = () => {
  const { id } = useParams();

  /* ================= STATE ================= */

  const [formData, setFormData] = useState({
    name: "",
  });

  const [carriers, setCarriers] = useState([]);
  const [carrierId, setCarrierId] = useState("");

  const [docType, setDocType] = useState("");
  const [docFile, setDocFile] = useState(null);

  const [loading, setLoading] = useState(false);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchCarrier();
    fetchCarriersDropdown();
  }, [id]);

  const fetchCarrier = async () => {
    try {
      const res = await axios.get(
        `https://isovia.ca/fms_api/api/updatecarriers/${id}`,
        { withCredentials: true }
      );
      setFormData(res.data.product_data || {});
    } catch (err) {
      console.error("Carrier fetch error", err);
    }
  };

  const fetchCarriersDropdown = async () => {
    try {
      const res = await axios.get(
        "https://isovia.ca/fms_api/api/fetchcarriersProductData",
        { withCredentials: true }
      );
      setCarriers(res.data.data || []);
    } catch (err) {
      console.error("Carrier dropdown error", err);
    }
  };

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCarrierDocUpload = async (e) => {
    e.preventDefault();

    if (!carrierId || !docType || !docFile) {
      alert("Please select carrier, document type and file");
      return;
    }

    const fd = new FormData();
    fd.append("carrier_id", carrierId);
    fd.append("document_type", docType);
    fd.append("file", docFile);

    try {
      setLoading(true);

      await axios.post(
        "https://isovia.ca/fms_api/api/uploadCarrierDocument",
        fd,
        { withCredentials: true }
      );

      alert("Document uploaded successfully");
      setDocFile(null);
      setDocType("");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Header */}
      <section className="content-header">
        <h1>
          Manage <small>Carriers</small>
        </h1>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12">

            {/* ================= UPDATE CARRIER ================= */}
            {/* <div className="box box-primary">
              <div className="box-header with-border">
                <h3 className="box-title">Update Carrier</h3>
              </div>

              <div className="box-body">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>USDOT #</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      placeholder="Enter USDOT Number"
                    />
                  </div>
                </div>
              </div>

              <div className="box-footer">
                <button className="btn btn-primary">Save</button>
                <Link to="/carriers" className="btn btn-warning">
                  Back
                </Link>
              </div>
            </div> */}

            {/* ================= UPLOAD DOCUMENT ================= */}
            <div className="box box-success">
              <div className="box-header with-border">
                <h3 className="box-title">Upload Carrier Document</h3>
              </div>

              <form className="box-body" onSubmit={handleCarrierDocUpload}>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Carrier</label>
                    <select
                      className="form-control"
                      value={carrierId}
                      onChange={(e) => setCarrierId(e.target.value)}
                    >
                      <option value="">Select Carrier</option>
                      {carriers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Document Type</label>
                    <select
                      className="form-control"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="insurance">Insurance</option>
                      <option value="permit">Permit</option>
                      <option value="agreement">Agreement</option>
                      <option value="authority">Authority</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>File</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setDocFile(e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? "Uploading..." : "Upload Document"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Updatecarriersupload;

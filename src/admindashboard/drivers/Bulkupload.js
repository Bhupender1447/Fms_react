import React, { useState } from "react";
import axios from "axios";
import {Link } from 'react-router-dom';


const Bulkuploaddriver = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.name.endsWith(".csv") || selected.name.endsWith(".xlsx"))) {
      setFile(selected);
      setMessage("");
    } else {
      setMessage("❌ Please upload only .csv or .xlsx files");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a file first");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://isovia.ca/fms_api/drivers/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Cookie": "ci_session=6q7i20kt2rn6qv93372kj3lis0gr5le3",
          },
          withCredentials: true,
        }
      );
      setMessage(`✅ Upload Successful: ${response.data.message || "File imported successfully!"}`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Upload failed. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #74ABE2 0%, #5563DE 100%)",
        padding: "20px",
      }}
    >
      <div
        className="p-4 shadow-lg"
        style={{
          width: "420px",
          borderRadius: "20px",
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: "#fff",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
      >
        <div className="text-center mb-3">
          <i className="bi bi-cloud-upload-fill" style={{ fontSize: "3rem", color: "#fff" }}></i>
          <h3 className="fw-bold mt-2">Bulk Upload Drivers</h3>
          <p className="text-light small mb-0">
            Upload your driver list easily using CSV or Excel file
          </p>
        </div>

        {/* Example Templates */}
        <div
          className="p-3 mb-4"
          style={{
            borderRadius: "10px",
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        >
          <p className="fw-semibold mb-2 text-center">
            📂 Example Templates
          </p>
          <div className="d-flex justify-content-center gap-2">
            <Link
              to="/drivers_import_templateCSV.csv"
              download
              className="btn btn-sm btn-outline-light"
              style={{ borderRadius: "8px" }}
            >
              <i className="bi bi-filetype-csv me-1"></i>CSV
            </Link>
            <Link
              to="/drivers_import_template.xlsx"
              download
              className="btn btn-sm btn-outline-light"
              style={{ borderRadius: "8px" }}
            >
              <i className="bi bi-filetype-xlsx me-1"></i>XLSX
            </Link>
          </div>
        </div>

        {/* File Upload */}
        <div className="mb-3">
          <label className="form-label text-light fw-semibold">Select File</label>
          <input
            type="file"
            accept=".csv,.xlsx"
            className="form-control bg-transparent text-light border-light"
            onChange={handleFileChange}
            style={{ borderRadius: "10px" }}
          />
        </div>

        {file && (
          <div
            className="alert alert-info py-2 text-dark mt-3"
            style={{ borderRadius: "10px" }}
          >
            <i className="bi bi-paperclip me-2"></i>
            <strong>Selected:</strong> {file.name}
          </div>
        )}

        <button
          className="btn btn-light w-100 fw-semibold mt-3"
          style={{
            borderRadius: "10px",
            color: "#5563DE",
            transition: "all 0.3s",
          }}
          onClick={handleUpload}
          disabled={loading}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fff")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Uploading...
            </>
          ) : (
            <>
              <i className="bi bi-upload me-2"></i>
              Upload File
            </>
          )}
        </button>

        {message && (
          <div
            className={`mt-3 alert ${
              message.includes("✅")
                ? "alert-success"
                : message.includes("❌")
                ? "alert-danger"
                : "alert-warning"
            } py-2`}
            style={{ borderRadius: "10px" }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bulkuploaddriver;

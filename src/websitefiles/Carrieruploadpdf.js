import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const Carrieruploadpdf = () => {
  // Get formId from URL params (path)
  const { formId } = useParams();
  
  // Get pdfUrl from the query string
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pdfUrl = queryParams.get('pdfUrl');  // Extract the pdfUrl from the query string
  
  const [formData, setFormData] = useState({
    formId: formId || '',  // Set formId to the URL parameter
    pdfFile: null,
  });

  useEffect(() => {
    // Update formData when formId changes in the URL
    setFormData((prevData) => ({
      ...prevData,
      formId: formId || '',
    }));
  }, [formId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      pdfFile: file,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('form_id', formData.formId);
    data.append('pdf_file', formData.pdfFile);

    // Send the form data to your backend API (POST request to upload PDF)
    fetch('https://isovia.ca/fms_api/api/carrieruploadPdf', {
      method: 'POST',
      body: data,
    })
      .then((response) => response.json())
      .then((uploadData) => {
        // Use the pdfUrl in your GET request or process it
        console.log('Uploaded PDF URL:', pdfUrl);  // Logs the PDF URL from the query string
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  };

  const handleDownload = () => {
    // Trigger the download by opening the pdfUrl in a new tab
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.target = '_blank';  // Optional: opens the PDF in a new tab
      link.download = pdfUrl.split('/').pop();  // Extracts the file name from the URL and sets it as the download filename
      link.click();  // Programmatically clicks the link to trigger the download
    } else {
      console.error('PDF URL not available');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Upload PDF Form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label htmlFor="formId" className="form-label">Form ID</label>
          <input
            type="text"
            className="form-control"
            id="formId"
            name="formId"
            value={formData.formId}
            onChange={handleInputChange}
            required
            readOnly  // Prevent user from changing the formId manually
          />
        </div>

        <div className="mb-3">
          <label htmlFor="pdfFile" className="form-label">Choose PDF</label>
          <input
            type="file"
            className="form-control"
            id="pdfFile"
            name="pdfFile"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Upload PDF</button>
      </form>

      {/* Optionally, display the pdfUrl if it's available */}
      {pdfUrl && (
        <>
          <p>PDF URL: {pdfUrl}</p>
          <button className="btn btn-success" onClick={handleDownload}>
            Download PDF
          </button>
        </>
      )}
    </div>
  );
};

export default Carrieruploadpdf;

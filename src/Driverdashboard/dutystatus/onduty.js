import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SignatureCanvas from "react-signature-canvas";

const TripForm = () => {
  const datavalue = JSON.parse(localStorage.getItem("logindetail"));
  const loginDetail = {
    driver_id: datavalue?.id,
    motive_id: datavalue?.gomotive_id,
  };

  const [formData, setFormData] = useState({
    tripId: "",
    motiveDetails: "",
    note: "",
    images: [],
    preTripInspection: "",
  });

  const [signatureData, setSignatureData] = useState("");
  const sigRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [tripList, setTripList] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (datavalue?.id) {
      axios
        .get(`https://isovia.ca/fms_api/api/tipsdriverfetchProductData/${datavalue.id}`)
        .then((res) => setTripList(res.data))
        .catch((err) => console.log(err));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location access denied or unavailable", error);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...previewUrls];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData((prev) => ({ ...prev, images: newImages }));
    setPreviewUrls(newPreviews);
  };

  const handleSaveSignature = () => {
    if (sigRef.current.isEmpty()) {
      alert("Please sign first!");
    } else {
      let dataURL = sigRef.current.toDataURL();
      setSignatureData(dataURL);
    }
  };

  const handleClearSignature = () => {
    sigRef.current.clear();
    setSignatureData("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    const formDataToSend = new FormData();
    formDataToSend.append("driver_id", loginDetail.driver_id);
    formDataToSend.append("trip_id", formData.tripId);
    formDataToSend.append("motive_id", loginDetail.motive_id);
    formDataToSend.append("motive_details", formData.motiveDetails);
    formDataToSend.append("note", formData.note);
    formDataToSend.append("pre_trip_inspection", formData.preTripInspection);

    formDataToSend.append("latitude", location.lat || "");
    formDataToSend.append("longitude", location.lng || "");

    formData.images.forEach((image) => {
      formDataToSend.append("images[]", image);
    });

    if (signatureData) {
      const signatureBlob = await (await fetch(signatureData)).blob();
      formDataToSend.append("signature", signatureBlob, "signature.png");
    }

    try {
      await axios.post("https://isovia.ca/fms_api/api/on", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage({ type: "success", text: "Duty started successfully!" });

      setFormData({
        tripId: "",
        motiveDetails: "",
        note: "",
        images: [],
        preTripInspection: "",
      });
      setPreviewUrls([]);
      setSignatureData("");
      sigRef.current.clear();
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to start duty. Please try again.";
      setMessage({ type: "error", text: errMsg });
    }

    setLoading(false);
  };

  return (
    <div className="content-wrapper py-4">
      <div className="container">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-primary text-white text-center">
            <h3 className="mb-0">Start Trip Duty</h3>
          </div>

          <div className="card-body p-4 trip-form-large-text">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {/* Trip Selection */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Select Trip</label>
                  <select
                    className="form-select form-select-lg"
                    name="tripId"
                    value={formData.tripId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Trip --</option>
                    {tripList.map((trip) => (
                      <option key={trip.id} value={trip.id}>
                        {trip.customer_orderno} - {trip.pickup_location} to{" "}
                        {trip.destination_location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duty Status */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Duty Status</label>
                  <select
                    className="form-select form-select-lg"
                    name="motiveDetails"
                    value={formData.motiveDetails}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Status --</option>
                    <option value="trip_start">Trip Start</option>
                    <option value="break">Break</option>
                    <option value="trip_end">Trip End</option>
                    <option value="fuel-filling">Fuel Time</option>
                    <option value="additionally">Additionally</option>
                  </select>
                </div>

                {/* Pre Trip Inspection */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Pre Trip Inspection</label>
                  <select
                    className="form-select form-select-lg"
                    name="preTripInspection"
                    value={formData.preTripInspection}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Option --</option>
                    <option value="completed">Completed</option>
                    <option value="not_completed">Not Completed</option>
                  </select>
                </div>

                {/* Current Location */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Current Location (Lat, Lng)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      location.lat && location.lng
                        ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`
                        : "Fetching location..."
                    }
                    disabled
                  />
                </div>

                {/* Notes */}
                <div className="col-12">
                  <label className="form-label fw-bold">Notes</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Enter any additional notes..."
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="col-12">
                  <label className="form-label fw-bold">Upload Images (Optional)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <div className="form-text">You can upload multiple images (max 5)</div>

                  {previewUrls.length > 0 && (
                    <div className="mt-3 d-flex flex-wrap gap-3">
                      {previewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="position-relative border rounded p-1"
                          style={{ width: "120px" }}
                        >
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="img-fluid rounded"
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0"
                            onClick={() => removeImage(index)}
                            style={{ transform: "translate(50%, -50%)" }}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Signature Pad */}
                <div className="col-12">
                  <label className="form-label fw-bold">Driver Signature</label>
                  <div style={{ border: "2px solid #000", borderRadius: "5px" }}>
                    <SignatureCanvas
                      ref={sigRef}
                      penColor="black"
                      canvasProps={{
                        width: 500,
                        height: 200,
                        className: "signature-canvas",
                      }}
                    />
                  </div>
                  <div className="mt-2 d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={handleClearSignature}
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleSaveSignature}
                    >
                      Save Signature
                    </button>
                  </div>

                  {signatureData && (
                    <div className="mt-3">
                      <strong>Preview:</strong>
                      <img
                        src={signatureData}
                        alt="Signature Preview"
                        style={{ border: "1px solid #ccc", maxWidth: "100%" }}
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="col-12 d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        />
                        Starting Duty...
                      </>
                    ) : (
                      "Start Duty"
                    )}
                  </button>
                </div>

                {/* Message */}
                {message.text && (
                  <div className="col-12">
                    <div
                      className={`alert alert-${
                        message.type === "success" ? "success" : "danger"
                      } mt-3`}
                    >
                      {message.text}
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripForm;

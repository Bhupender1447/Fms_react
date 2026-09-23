import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import "./AssignForm.css";

const AssignForm = ({ onClose, selectedTripId }) => {
  const [brokers, setBrokers] = useState([]);

  const [form, setForm] = useState({
    broker_name: "",
    broker_phone: "",
    broker_email: "",
    carrier_name: "",
    carrier_contact: "",
    carrier_email: "",
    driver_phone: "",
    dispatch_phone: "",
    shipment_type: "",
    carrier_code: "",
    ssn: "",
    ssn2: "",
    ssn3: "",
    truck: "",
    driver_name: "",
    portof_entry: "",
    eta: "",
    documents_attached: "",
    documents: [],
    notes: "",
    sign: "",
    sign_date: "",
    brokermail: "",
    brokermail2: "",
    brokermail3: "",
    custom_paper: "",
  });

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      if (checked) {
        // नया document जोड़ना
        return { ...prev, documents: [...prev.documents, value] };
      } else {
        // document हटाना
        return {
          ...prev,
          documents: prev.documents.filter((doc) => doc !== value),
        };
      }
    });
  };
  const fetchTripDetails = async () => {
    try {
      if (!selectedTripId) return;

      const res = await axios.get(
        `${BASE_URL}api/getsingleTrip/${selectedTripId}`
      );
      if (res.data?.status === "success") {
        const trip = res.data.data;
        setForm((prev) => ({
          ...prev,
          carrier: trip.carriers || "N/A", // API से carrier डाल दो
        }));
      }
    } catch (err) {
      console.error("Error fetching trip details:", err);
    }
  };
  useEffect(() => {

    fetchTripDetails(); // ✅ trip details भी ले आओ
  }, [selectedTripId]);
  // fetch brokers
  const fetchBrokers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/listBrokers`);
      const data = res.data;
      if (data.status === "success") {
        setBrokers(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching brokers:", err);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrokerSelect = (e) => {
    const selectedId = e.target.value;
    const selectedBroker = brokers.find((b) => b.id === selectedId);
    if (selectedBroker) {
      setForm((prev) => ({
        ...prev,
        broker_name: selectedBroker.Broker || "",
        broker_phone: selectedBroker.PARS_CONTACT || "",
        broker_email: selectedBroker.PAPS_Email || "",
        brokermail: selectedBroker.PARS_Email || "",
        brokermail2: selectedBroker.PAPS_Email || "",
        brokermail3: selectedBroker.Additional_emails || "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      const res = await axios.post(
        `${BASE_URL}api/addCoversheet`,
        formData,
        {
          headers: {
            Accept: "application/json",
            // Use environment variable for session cookie if present, otherwise fallback
            Cookie: `ci_session=${process.env.REACT_APP_CI_SESSION || "kbm8vlk1v467g7tdka9ril1j4hsqk865"}`,
          },
        }
      );

      console.log("Response:", res.data);
      alert("Form submitted successfully!");
      onClose();
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Failed to submit form.");
    }
  };

  return (
    <div className="modal d-block">
      <div className="modal-dialog modal-xl">
        <div className="modal-content p-4 custom-cover">
          <div className="modal-header border-0">
            <h4 className="fw-bold">Customs Paperwork Cover Sheet</h4>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit} className="cover-form">
              {/* Broker Select */}
              <div className="line-input">
                Select Broker:{" "}
                <select onChange={handleBrokerSelect} className="form-select">
                  <option value="">-- Select Broker --</option>
                  {brokers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.Broker}
                    </option>
                  ))}
                </select>
              </div>

              {/* Broker Info */}
              <h6>Broker Information</h6>
              <div className="line-input">
                Broker Name:{" "}
                <input
                  type="text"
                  name="broker_name"
                  value={form.broker_name}
                  onChange={handleChange}
                />
              </div>
              <div className="two-col">
                <div className="line-input">
                  Broker Phone:{" "}
                  <input
                    type="text"
                    name="broker_phone"
                    value={form.broker_phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="line-input">
                  PARS Email:{" "}
                  <input
                    type="email"
                    name="brokeremail"
                    value={form.brokermail}
                    onChange={handleChange}
                  />
                </div>


                <div className="line-input">
                  PAPS EMAIL:{" "}
                  <input
                    type="email"
                    name="brokeremail2"
                    value={form.brokermail2}
                    onChange={handleChange}
                  />
                </div>
                <div className="line-input">
                  ADDITIONAL EMAIL:{" "}
                  <input
                    type="email"
                    name="brokeremail3"
                    value={form.brokermail3}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Carrier Info */}
              <h6 className="section-title">Carrier / Shipper Information</h6>
              <div className="line-input">
                From (Carrier/Shipper):{" "}
                <input type="text" name="carrier" value={form.carrier} onChange={handleChange} />
              </div>
              <div className="two-col">
                <div className="line-input">
                  Contact Person:{" "}
                  <input
                    type="text"
                    name="contact_person"
                    value={form.contact_person}
                    onChange={handleChange}
                  />
                </div>
                <div className="line-input">
                  Email:{" "}
                  <input
                    type="email"
                    name="carrier_email"
                    value={form.carrier_email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="two-col">
                <div className="line-input">
                  Driver Cell Phone:{" "}
                  <input
                    type="text"
                    name="driver_phone"
                    value={form.driver_phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="line-input">
                  Carrier Dispatch Phone #:{" "}
                  <input
                    type="text"
                    name="dispatch_phone"
                    value={form.dispatch_phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Shipment Details */}
              <h6 className="section-title">Shipment Details</h6>
              <div className="two-col">
                <div className="line-input">
                  PAPS # (U.S. Shipments):{" "}
                  <input type="text" name="paps" value={form.paps} onChange={handleChange} />
                </div>
                <div className="line-input">
                  PARS # (Canadian Shipments):{" "}
                  <input type="text" name="pars" value={form.pars} onChange={handleChange} />
                </div>
              </div>
              <div className="line-input">
                SCAC / Carrier Code:{" "}
                <input type="text" name="scac" value={form.scac} onChange={handleChange} />
                SSN#:{" "}
                <input type="text" name="ssn" value={form.ssn} onChange={handleChange} />
                SSN2#:{" "}
                <input type="text" name="ssn2" value={form.ssn2} onChange={handleChange} />
                SSN3#:{" "}
                <input type="text" name="ssn3" value={form.ssn3} onChange={handleChange} />
              </div>
              <div className="line-input">
                Truck #:{" "}
                <input type="text" name="truck" value={form.truck} onChange={handleChange} />
                Trailer #:{" "}
                <input type="text" name="trailer" value={form.trailer} onChange={handleChange} />
                Driver Name:{" "}
                <input
                  type="text"
                  name="driver_name"
                  value={form.driver_name}
                  onChange={handleChange}
                />
              </div>
              <div className="line-input">
                Port of Entry:{" "}
                <input type="text" name="port" value={form.port} onChange={handleChange} />
                ETA:{" "}
                <input type="text" name="eta" value={form.eta} onChange={handleChange} />
              </div>

              {/* Documents Attached */}
              <h6 className="section-title">Documents Attached</h6>
              <div className="checkbox-group">
                {[
                  "Commercial Invoice",
                  "Bill of Lading",
                  "Packing List",
                  "Certificate of Origin",
                  "Customs Invoice (B3 / CI1)",
                  "Other",
                ].map((doc, i) => (
                  <label key={i}>
                    <input
                      type="checkbox"
                      value={doc}
                      checked={form.documents.includes(doc)}
                      onChange={handleCheckboxChange} // ✅ अलग handler
                    />
                    {doc}
                  </label>
                ))}
              </div>


              {/* Notes */}
              <h6 className="section-title">Notes / Special Instructions</h6>
              <div className="line-input">
                <input
                  type="text"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                />
              </div>

              {/* Confirmation */}
              <h6 className="section-title">Confirmation</h6>
              <div className="line-input">
                Signature / Date:{" "}
                <input
                  type="text"
                  name="signature"
                  value={form.signature}
                  onChange={handleChange}
                />
              </div>


              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignForm;

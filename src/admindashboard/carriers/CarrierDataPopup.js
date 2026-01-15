import axios from "axios";
import React, { useState } from "react";
import { useNavigate ,Link} from "react-router-dom";

const CarrierDataPopup = ({ brokerData, popup, setpopup }) => {
  const [showModal] = useState(popup);
  let navigate = useNavigate();

  const handleClose = () => setpopup(false);
  const handleShow = () => setpopup(true);

  const handleSubmit = async (e, CarrierData) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("usdot", CarrierData);

    try {
      await axios.post("https://isovia.ca/fms_api/api/createcarriers", formData);
      setpopup(false);
      navigate("/carriers");
    } catch (error) {
      console.error(error);
    }
  };

  // Remove specific keys from brokerData
  const filteredBrokerData = Object.fromEntries(
    Object.entries(brokerData).filter(([key]) => !["vehicle", "driver", "hazmat", "iep"].includes(key))
  );

  return (
    <div>
      <button className="btn btn-primary" onClick={handleShow}>
        Show Broker Data
      </button>

      {/* Modal */}
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showModal ? "block" : "none" }}
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-fullscreen" role="document"> 
          <div className="modal-content rounded-3 shadow-lg">
            <div className="modal-header">
              <h5 className="modal-title">{brokerData.legal_name}</h5>
              <button
                type="button"
                className="btn-close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body">
              <div className="container-fluid"> {/* Ensure it fills the screen */}
                {/* General Data */}
                {Object.entries(filteredBrokerData).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <strong>{key.replace(/_/g, " ")}:</strong>{" "}
                    {typeof value === "object" && value !== null ? (
                      <ul>
                        {Object.entries(value).map(([subKey, subValue]) => (
                          <li key={subKey}>
                            <strong>{subKey.replace(/_/g, " ")}:</strong>{" "}
                            {typeof subValue === "object" && subValue !== null
                              ? JSON.stringify(subValue)
                              : subValue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      value?.toString() || "N/A"
                    )}
                  </div>
                ))}

                {/* Inspections Section */}
                <h5 className="mt-4">Inspection Details</h5>
                {["united_states_inspections", "canada_inspections"].map((regionKey) =>
                  brokerData[regionKey] ? (
                    <div key={regionKey} className="mt-3">
                      <h6>{regionKey.replace(/_/g, " ").toUpperCase()}</h6>
                      {Object.entries(brokerData[regionKey]).map(([category, details]) => (
                        <div key={category} className="mb-3">
                          <h6>{category.toUpperCase()}</h6>
                          <ul>
                            {Object.entries(details).map(([detailKey, detailValue]) => (
                              <li key={detailKey}>
                                <strong>{detailKey.replace(/_/g, " ")}:</strong> {detailValue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : null
                )}
              </div>

              <Link
                to={brokerData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-info btn-sm mt-3"
              >
                More Info
              </Link>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={(e) => handleSubmit(e, brokerData.usdot)}
              >
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarrierDataPopup;

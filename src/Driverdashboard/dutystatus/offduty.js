import React, { useState } from "react";
import axios from "axios";

const OffDutyButton = () => {
  const [message, setMessage] = useState("");

  const handleOffDuty = async () => {
     let { id } = JSON.parse(localStorage.getItem("logindetail"));
    const formData = new FormData();
    formData.append("driver_id", id); // Replace with dynamic ID if needed

    try {
      const response = await axios.post(
        "https://isovia.ca/fms_api/api/off",
        formData
      );
      setMessage("Success: " + JSON.stringify(response.data));
    } catch (error) {
      const errMsg =
        error.response?.data?.message || error.message || "Something went wrong.";
      setMessage("Error: " + errMsg);
    }
  };

  return (
  <div className='content-wrapper'>
      <button className="btn btn-warning" onClick={handleOffDuty}>
        Set Off Duty
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
};

export default OffDutyButton;

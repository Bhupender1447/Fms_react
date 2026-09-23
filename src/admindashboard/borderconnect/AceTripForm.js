import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";

const AceTripForm = () => {
  const [formData, setFormData] = useState({
    companyKey: "c-9000-2bcd8ae5954e0c48",
    tripNumber: "",
    usPortOfArrival: "",
    estimatedArrivalDateTime: "",
    truckNumber: "",
    truckType: "TR",
    truckVin: "",
    truckPlate: "",
    truckPlateProvince: "",
    trailerNumber: "",
    trailerPlate: "",
    trailerPlateProvince: "",
    driverNumber: "",
    driverFirstName: "",
    driverLastName: "",
    driverGender: "M",
    driverDob: "",
    driverCitizenship: "CA",
    driverFast: "",
    shipmentControlNumber: "",
    shipperName: "",
    shipperAddress: "",
    shipperCity: "",
    shipperState: "",
    shipperPostal: "",
    consigneeName: "",
    consigneeAddress: "",
    consigneeCity: "",
    consigneeState: "",
    consigneePostal: "",
    commodityDescription: "",
    commodityQuantity: "",
    commodityUnit: "BOX",
    commodityWeight: "",
    commodityWeightUnit: "L",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Convert datetime-local value into "YYYY-MM-DD HH:mm:ss"
    if (name === "estimatedArrivalDateTime") {
      const date = new Date(value);
      value = date.toISOString().slice(0, 19).replace("T", " ");
    }

    setFormData({ ...formData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BASE_URL}api/borderconnectsend`,
        formData
      );
      console.log(res.data);
      alert("Trip sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Error sending trip!");
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2 className="mb-4 text-center">ACE Trip Form</h2>
      <form onSubmit={handleSubmit}>

        {/* Trip Info */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-primary text-white">Trip Info</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Trip Number</label>
              <input className="form-control" name="tripNumber" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">US Port of Arrival</label>
              <input className="form-control" name="usPortOfArrival" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Estimated Arrival</label>
              <input type="datetime-local" className="form-control" name="estimatedArrivalDateTime" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Truck Info */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-success text-white">Truck Info</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Truck Number</label>
              <input className="form-control" name="truckNumber" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Truck VIN</label>
              <input className="form-control" name="truckVin" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Truck Plate</label>
              <input className="form-control" name="truckPlate" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Truck Plate Province</label>
              <input className="form-control" name="truckPlateProvince" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Trailer Info */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-info text-white">Trailer Info</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Trailer Number</label>
              <input className="form-control" name="trailerNumber" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Trailer Plate</label>
              <input className="form-control" name="trailerPlate" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Trailer Plate Province</label>
              <input className="form-control" name="trailerPlateProvince" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Driver Info */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-warning">Driver Info</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Driver Number</label>
              <input className="form-control" name="driverNumber" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">First Name</label>
              <input className="form-control" name="driverFirstName" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Last Name</label>
              <input className="form-control" name="driverLastName" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-control" name="driverDob" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">FAST Card</label>
              <input className="form-control" name="driverFast" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Shipment Info */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-secondary text-white">Shipment Info</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Shipment Control Number</label>
              <input className="form-control" name="shipmentControlNumber" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Shipper Name</label>
              <input className="form-control" name="shipperName" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Shipper Address</label>
              <input className="form-control" name="shipperAddress" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Shipper City</label>
              <input className="form-control" name="shipperCity" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Shipper State</label>
              <input className="form-control" name="shipperState" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Shipper Postal</label>
              <input className="form-control" name="shipperPostal" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Consignee Name</label>
              <input className="form-control" name="consigneeName" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Consignee Address</label>
              <input className="form-control" name="consigneeAddress" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Consignee City</label>
              <input className="form-control" name="consigneeCity" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Consignee State</label>
              <input className="form-control" name="consigneeState" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Consignee Postal</label>
              <input className="form-control" name="consigneePostal" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Commodity Info */}
        <div className="card mb-3 shadow-sm">
          <div className="card-header bg-dark text-white">Commodity Info</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Description</label>
              <input className="form-control" name="commodityDescription" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Quantity</label>
              <input type="number" className="form-control" name="commodityQuantity" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Unit</label>
              <input className="form-control" name="commodityUnit" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Weight</label>
              <input type="number" className="form-control" name="commodityWeight" onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Weight Unit</label>
              <input className="form-control" name="commodityWeightUnit" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-lg btn-primary px-5">
            Submit Trip
          </button>
        </div>
      </form>
    </div>
  );
};

export default AceTripForm;

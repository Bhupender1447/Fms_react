import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VehicleTable = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // For "Active", "Inactive", etc.

  // Fetch vehicle data
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/get_vehicles');
        console.log(response.data);

        // Extract vehicles and pagination data from the response
        setVehicles(response.data.vehicles);
        setFilteredVehicles(response.data.vehicles); // Initially set filteredVehicles to all vehicles
        setPagination(response.data.pagination);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Filter vehicles when search term or status changes
  useEffect(() => {
    let filtered = vehicles;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.vehicle.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicle.license_plate_number.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'All') {
      filtered = filtered.filter((item) => item.vehicle.status === statusFilter);
    }

    setFilteredVehicles(filtered);
  }, [searchTerm, statusFilter, vehicles]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2 className="text-center mb-4">Vehicle Data</h2>

      {/* Search and Filter Controls */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by Vehicle Number, Make, or License Plate"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-control w-25"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Vehicle Table */}
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>Vehicle ID</th>
            <th>Vehicle Number</th>
            <th>Status</th>
            <th>VIN</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>License Plate</th>
            <th>Fuel Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.map((item) => (
            <tr key={item.vehicle.id}>
              <td>{item.vehicle.id}</td>
              <td>{item.vehicle.number}</td>
              <td>{item.vehicle.status}</td>
              <td>{item.vehicle.vin}</td>
              <td>{item.vehicle.make}</td>
              <td>{item.vehicle.model}</td>
              <td>{item.vehicle.year}</td>
              <td>{item.vehicle.license_plate_number}</td>
              <td>{item.vehicle.fuel_type}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Details */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <p>
          Page: {pagination.page_no} / {Math.ceil(pagination.total / pagination.per_page)} <br />
          Total Vehicles: {pagination.total}
        </p>

        {/* Pagination Buttons */}
        <div>
          <button
            className="btn btn-primary mx-1"
            disabled={pagination.page_no <= 1}
            onClick={() => {
              // Logic to load previous page
            }}
          >
            Previous
          </button>
          <button
            className="btn btn-primary mx-1"
            disabled={pagination.page_no >= Math.ceil(pagination.total / pagination.per_page)}
            onClick={() => {
              // Logic to load next page
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleTable;

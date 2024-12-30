import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SamsaraDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch driver data from the API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get(
          'https://isovia.ca/fms_api/api/get_samsara_drivers'
        );
        setDrivers(response.data.data);
        setPagination(response.data.pagination);
        setLoading(false);
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error || 'An error occurred');
        } else if (err.request) {
          setError('No response received from server');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDrivers = drivers.filter((driver) => {
    return (
      driver.id.includes(searchTerm) ||
      driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const displayedDrivers = filterStatus
    ? filteredDrivers.filter(
        (driver) => driver.driverActivationStatus === filterStatus
      )
    : filteredDrivers;

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2 className="text-center mb-4">Samsara Drivers</h2>
      <section className="content">
        {/* Search and Filters */}
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by ID or Name"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            className="form-select w-25"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Filter by Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <table className="table table-bordered table-hover">
          <thead className="thead-light">
            <tr>
              <th>Driver ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Time Zone</th>
              <th>Driver Status</th>
              <th>HOS Rule</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedDrivers.map((driver) => (
              <tr key={driver.id}>
                <td>{driver.id}</td>
                <td>{driver.name}</td>
                <td>{driver.username}</td>
                <td>{driver.timezone || 'N/A'}</td>
                <td>
                  <span
                    className={`badge ${
                      driver.driverActivationStatus === 'active'
                        ? 'bg-success'
                        : 'bg-secondary'
                    }`}
                  >
                    {driver.driverActivationStatus}
                  </span>
                </td>
                <td>
                  {driver.eldSettings?.rulesets[0]?.cycle || 'N/A'}
                </td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm">...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Details */}
        <div className="mt-4 d-flex justify-content-between align-items-center">
          <div>
            Has Next Page: {pagination.hasNextPage ? 'Yes' : 'No'}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SamsaraDrivers;

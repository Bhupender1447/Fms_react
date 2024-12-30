import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GomotiveUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch user data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/get_users');
        setUsers(response.data.users);
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

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const email = user.user.email || ''; // Default to an empty string if null
    return (
      user.user.id.toString().includes(searchTerm) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  

  const displayedUsers = filterStatus
    ? filteredUsers.filter((user) => user.user.status === filterStatus)
    : filteredUsers;

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2 className="text-center mb-4">Gomotive Users</h2>
      <section className="content">
      {/* Search and Filters */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search by ID or Email"
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="form-select w-25"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <table className="table table-bordered table-hover">
        <thead className="thead-light">
          <tr>
            <th>User ID</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone</th>
            <th>Time Zone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayedUsers.map((item) => (
            <tr key={item.user.id}>
              <td>{item.user.id}</td>
              <td>{item.user.email}</td>
              <td>{item.user.first_name}</td>
              <td>{item.user.last_name}</td>
              <td>{item.user.phone ? `${item.user.phone_country_code} ${item.user.phone}` : 'N/A'}</td>
              <td>{item.user.time_zone || 'N/A'}</td>
              <td>{item.user.role}</td>
              <td>
                <span
                  className={`badge ${
                    item.user.status === 'Active' ? 'bg-success' : 'bg-secondary'
                  }`}
                >
                  {item.user.status}
                </span>
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
          Page: {pagination.page_no} /{' '}
          {Math.ceil(pagination.total / pagination.per_page)} <br />
          Total Users: {pagination.total} <br />
          Users Per Page: {pagination.per_page}
        </div>
        <div>
          <button className="btn btn-outline-primary btn-sm me-2">Previous</button>
          <button className="btn btn-outline-primary btn-sm">Next</button>
        </div>
      </div>
      </section>
    </div>
  );
};

export default GomotiveUsers;

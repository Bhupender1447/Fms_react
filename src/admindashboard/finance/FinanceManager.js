import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FinanceManager = () => {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'income',
    description: '',
    date: ''
  });

  const baseURL = 'https://isovia.ca/fms_api/finance';

  const fetchEntries = async () => {
    try {
      const res = await axios.get(`${baseURL}/get`);
      console.log(res.data.status)
      if (res.data.status) setEntries(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append('amount', formData.amount);
  data.append('type', formData.type);
  data.append('description', formData.description);
  data.append('date', formData.date);

  try {
    const res = await axios.post(`${baseURL}/add`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Optional cookie header (if needed):
        // 'Cookie': 'ci_session=your_session_id'
      },
      withCredentials: true, // if using CI session-based login
    });

    if (res.data.status) {
      fetchEntries(); // refresh list
      setFormData({ amount: '', type: 'income', description: '', date: '' });
    } else {
      alert('Failed to add entry');
    }
  } catch (err) {
    console.error(err);
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.post(`${baseURL}/delete/${id}`);
      fetchEntries();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-4">Finance Manager</h2>

      <form className="row g-3 mb-4" onSubmit={handleSubmit}>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div className="col-md-1">
          <button type="submit" className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Description</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No records found</td>
            </tr>
          ) : (
            entries.map(entry => (
              <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.amount}</td>
                <td>{entry.type}</td>
                <td>{entry.description}</td>
                <td>{entry.date}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FinanceManager;

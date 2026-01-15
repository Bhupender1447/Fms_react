import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Link } from 'react-router-dom';


const baseURL = 'https://isovia.ca/fms_api/api';

const ExpenseManager = () => {
  const [expenses, setExpenses] = useState([]);

  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    from_id: '',
    to_id: '',
    amount: '',
    exp_date: '',
    reason: '',
    any_image: null,
    exp_for: ''
  });
  const [tripList, setTripList] = useState([]);
  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${baseURL}/getExpense`, {
        withCredentials: true
      });
      const expensesData = Array.isArray(response.data?.message) 
      ? response.data.message 
      : [];
      
    setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  useEffect(() => {
  const logindetail = JSON.parse(localStorage.getItem("logindetail"));

 setNewExpense({ ...newExpense, from_id: logindetail?.id })

     if (logindetail?.id) {
      axios
        .get(`https://isovia.ca/fms_api/api/tipsdriverfetchProductData/${logindetail.id}`)
        .then((res) => setTripList(res.data))
        .catch((err) => console.log(err));
    }
    fetchExpenses();
  }, [newExpense]);

  // Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newExpense).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post(`${baseURL}/addExpenses`, formData, {
        withCredentials: true
      });
      setNewExpense({
        from_id: '',
        to_id: '',
        amount: '',
        exp_date: '',
        reason: '',
        any_image: null,
        exp_for: ''
      });
      fetchExpenses();
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  // Update Expense
  const handleUpdateExpense = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(editingExpense).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.post(`${baseURL}/updateExpenses`, formData, {
        withCredentials: true
      });
      setEditingExpense(null);
      fetchExpenses();
    } catch (err) {
      console.error('Error updating expense:', err);
    }
  };

  // Delete Expense
  const handleDeleteExpense = async (id) => {
    const formData = new FormData();
    formData.append('id', id);

    try {
      await axios.post(`${baseURL}/deleteExpenses`, formData, {
        withCredentials: true
      });
      fetchExpenses();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  return (
    <div  className="content-wrapper" style={{ minHeight: 440 }}>

      <div className="container mt-4">
        <h2>Expense Management</h2>

        {/* Add New Expense Form */}
        <h4 className="mt-4">Add New Expense</h4>
        <form onSubmit={handleAddExpense} className="mb-4">
          <div className="row g-3">
            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="From ID"
                value={newExpense.from_id}
                disabled
              
              />
            </div>
            <div className="col-md-2">
              {/* <input
                className="form-control"
                placeholder="To ID"
                value={newExpense.to_id}
                onChange={(e) => setNewExpense({ ...newExpense, to_id: e.target.value })}
              /> */}
              <select
                    className="form-select "
                    name="tripId"
                      value={newExpense.to_id}
                   onChange={(e) => setNewExpense({ ...newExpense, to_id: e.target.value })}
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
            <div className="col-md-2">
              <input
                className="form-control"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                type="datetime-local"
                className="form-control"
                value={newExpense.exp_date}
                onChange={(e) => setNewExpense({ ...newExpense, exp_date: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Reason"
                value={newExpense.reason}
                onChange={(e) => setNewExpense({ ...newExpense, reason: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              {/* <input
                className="form-control"
                placeholder="Expense For"
                value={newExpense.exp_for}
                onChange={(e) => setNewExpense({ ...newExpense, exp_for: e.target.value })}
              /> */}
                 <select
                    className="form-select form-select-lg"
                    name="motiveDetails"
                    value={newExpense.exp_for}
                   onChange={(e) => setNewExpense({ ...newExpense, exp_for: e.target.value })}
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
            <div className="col-md-4">
              <input
                type="file"
                className="form-control"
                onChange={(e) => setNewExpense({ ...newExpense, any_image: e.target.files[0] })}
              />
              {newExpense.any_image && (
                <small className="text-muted">Selected: {newExpense.any_image.name}</small>
              )}
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-primary">Add Expense</button>
          </div>
        </form>

        {/* Edit Expense Form */}
        {editingExpense && (
          <div className="mb-4">
            <h4>Edit Expense</h4>
            <form onSubmit={handleUpdateExpense}>
              <div className="row g-3">
                <div className="col-md-2">
                  <input
                    className="form-control"
                    placeholder="From ID"
                    value={editingExpense.from_id}
                    onChange={(e) => setEditingExpense({ ...editingExpense, from_id: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    placeholder="To ID"
                    value={editingExpense.to_id}
                    onChange={(e) => setEditingExpense({ ...editingExpense, to_id: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    className="form-control"
                    placeholder="Amount"
                    value={editingExpense.amount}
                    onChange={(e) => setEditingExpense({ ...editingExpense, amount: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={editingExpense.exp_date}
                    onChange={(e) => setEditingExpense({ ...editingExpense, exp_date: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    placeholder="Reason"
                    value={editingExpense.reason}
                    onChange={(e) => setEditingExpense({ ...editingExpense, reason: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    className="form-control"
                    placeholder="Expense For"
                    value={editingExpense.exp_for}
                    onChange={(e) => setEditingExpense({ ...editingExpense, exp_for: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setEditingExpense({ ...editingExpense, any_image: e.target.files[0] })}
                  />
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-success">Update</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditingExpense(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Expense Table */}
        <h4 className="mt-4">Expense List</h4>
        <table className="table table-bordered table-hover mt-2">
          <thead>
            <tr>
              <th>ID</th>
              <th>From ID</th>
              <th>To ID</th>
              <th>Amount</th>
              <th>Reason</th>
              <th>Date</th>
              <th>For</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length === 0 ? (
              <tr><td colSpan="9" className="text-center">No data</td></tr>
            ) : (
              expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.id}</td>
                 <td >{exp.driver_fname} {exp.driver_lname}</td>
                  <td>{exp.customer_orderno}</td>
                  <td>{exp.amount}</td>
                  <td>{exp.reason}</td>
                  <td>{exp.exp_date}</td>
                  <td>{exp.exp_for}</td>
                  <td>
                    {exp.any_image && (
                      <Link to={`https://${exp.any_image}`} target="_blank" rel="noreferrer">View</Link>
                    )}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => setEditingExpense(exp)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteExpense(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ExpenseManager;

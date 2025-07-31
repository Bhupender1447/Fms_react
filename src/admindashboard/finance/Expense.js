import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [formData, setFormData] = useState({
    from_id: '',
    to_id: '',
    amount: '',
    exp_date: '',
    reason: '',
    any_image: '',
    exp_for: '',
    id: '', // only used for update
  });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);
const fetchDrivers = async () => {
  try {
    const res = await axios.get('https://isovia.ca/fms_api/api/fetchdriversProductData', {
      headers: { Cookie: cookie },
      withCredentials: true,
    });
  
 
      setDrivers(res.data || []);
    
  } catch (err) {
    console.error('Error fetching drivers:', err);
  }
};

  const cookie = 'ci_session=8ecio0n0r8ive2d86cgrn5cvf93rtj1o'; // replace as needed
const handleDelete = async (id) => {
  if (!window.confirm('Are you sure you want to delete this expense?')) return;

  const form = new FormData();
  form.append('id', id);

  try {
    const res = await axios.post('https://isovia.ca/fms_api/api/deleteExpenses', form, {
      headers: { Cookie: cookie },
      withCredentials: true,
    });
    if (res.data.status === 'success') {
      alert('Expense deleted');
      fetchExpenses(); // refresh list
    } else {
      alert('Failed to delete');
    }
  } catch (err) {
    console.error('Delete error', err);
  }
};

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('https://isovia.ca/fms_api/api/getExpense', {
        headers: { Cookie: cookie },
        withCredentials: true,
      });
      if (res.data.status === 'success') setExpenses(res.data.message || []);
    } catch (err) {
      console.error('Error fetching expenses', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (let key in formData) {
      if (formData[key]) data.append(key, formData[key]);
    }

    const url = isEditing
      ? 'https://isovia.ca/fms_api/api/updateExpenses'
      : 'https://isovia.ca/fms_api/api/addExpenses';

    try {
      const res = await axios.post(url, data, {
        headers: { Cookie: cookie },
        withCredentials: true,
      });
      if (res.data.status === 'success') {
        alert('Expense saved successfully');
        setFormData({
          from_id: '',
          to_id: '',
          amount: '',
          exp_date: '',
          reason: '',
          any_image: '',
          exp_for: '',
          id: '',
        });
        setIsEditing(false);
        fetchExpenses();
      } else {
        alert('Error saving expense');
      }
    } catch (err) {
      console.error('Submit error', err);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
  };

  const filterByDate = async () => {
    if (!fromDate || !toDate) return alert('Select both dates');
    const form = new FormData();
    form.append('fromdate', fromDate);
    form.append('todate', toDate);

    try {
      const res = await axios.post('https://isovia.ca/fms_api/api/expenseByDate', form, {
        headers: { Cookie: cookie },
        withCredentials: true,
      });
      if (res.data.status === 'success') setExpenses(res.data.message || []);
    } catch (err) {
      console.error('Date filter error', err);
    }
  };

  useEffect(() => {
    fetchExpenses();
      fetchDrivers(); 
  }, []);

  return (
    <div className="container my-4">
      <h3>Expense Manager</h3>

      {/* Filter Dates */}
      <div className="row mb-3">
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col">
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="col">
          <button className="btn btn-primary" onClick={filterByDate}>
            Filter
          </button>
        </div>
      </div>

      {/* Expense Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row g-2">
          <div className="col"><select
  className="form-select"
  value={formData.from_id}
  onChange={(e) => setFormData({ ...formData, from_id: e.target.value })}
>
  <option value="">Select From ID</option>
  {drivers.map((driver) => (
    <option key={driver.id} value={driver.id}>
      {driver.fname || driver.id}
    </option>
  ))}
</select>
</div>
          <div className="col"><input type="text" placeholder="To ID" value={formData.to_id} onChange={(e) => setFormData({ ...formData, to_id: e.target.value })} className="form-control" /></div>
          <div className="col"><input type="number" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="form-control" /></div>
          <div className="col"><input type="datetime-local" value={formData.exp_date} onChange={(e) => setFormData({ ...formData, exp_date: e.target.value })} className="form-control" /></div>
          <div className="col"><input type="text" placeholder="Reason" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} className="form-control" /></div>
          <div className="col"><input type="text" placeholder="Image URL" value={formData.any_image} onChange={(e) => setFormData({ ...formData, any_image: e.target.value })} className="form-control" /></div>
          <div className="col"><input type="text" placeholder="Expense For" value={formData.exp_for} onChange={(e) => setFormData({ ...formData, exp_for: e.target.value })} className="form-control" /></div>
          {isEditing && (
            <div className="col">
              <input type="text" placeholder="ID" value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} className="form-control" />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-success mt-3">
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      {/* Expense Table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Date</th>
            <th>For</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.id}</td>
              <td>{exp.from_id}</td>
              <td>{exp.to_id}</td>
              <td>{exp.amount}</td>
              <td>{exp.reason}</td>
              <td>{exp.exp_date}</td>
              <td>{exp.exp_for}</td>
              <td>
                {exp.any_image ? (
                  <img src={`https://${exp.any_image}`} alt="img" width="50" />
                ) : (
                  'No Image'
                )}
              </td>
          <td>
  <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(exp)}>
    Edit
  </button>
  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp.id)}>
    Delete
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Expense;

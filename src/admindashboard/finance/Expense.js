import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [formData, setFormData] = useState({
    from_id: '',
    to_id: '',
    amount: '',
    exp_date: '',
    reason: '',
    any_image: '',
    exp_for: '',
    id: '',
  });
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const cookie = 'ci_session=8ecio0n0r8ive2d86cgrn5cvf93rtj1o'; // replace as needed

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

  const fetchTrips = async () => {
    try {
      const res = await axios.get('https://isovia.ca/fms_api/api/tipsfetchProductData/1', {
        headers: { Cookie: cookie },
        withCredentials: true,
      });
      setTrips(res.data || []);
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
  const fetchExpenses = useCallback(async () => {
    try {
      const res = await axios.get('https://isovia.ca/fms_api/api/getExpense', {
        headers: { Cookie: cookie },
        withCredentials: true,
      });
      if (res.data.status === 'success') {
        const expensesWithNames = res.data.message.map(expense => {
          const driver = drivers.find(d => d.id === expense.from_id);
          const trip = trips.find(t => t.id === expense.to_id);
          return {
            ...expense,
            from_name: driver ? `${driver.fname} ${driver.lname}` : expense.from_id,
            to_name: trip ? trip.customer_orderno : expense.to_id
          };
        });
        setExpenses(expensesWithNames || []);
      }
    } catch (err) {
      console.error('Error fetching expenses', err);
    }
  });

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
        fetchExpenses();
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error('Delete error', err);
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
      if (res.data.status === 'success') {
        const expensesWithNames = res.data.message.map(expense => {
          const driver = drivers.find(d => d.id === expense.from_id);
          const trip = trips.find(t => t.id === expense.to_id);
          return {
            ...expense,
            from_name: driver ? `${driver.fname} ${driver.lname}` : expense.from_id,
            to_name: trip ? trip.customer_orderno : expense.to_id
          };
        });
        setExpenses(expensesWithNames || []);
      }
    } catch (err) {
      console.error('Date filter error', err);
    }
  };

  useEffect(() => {
    fetchDrivers();
    fetchTrips();
  }, []);

  useEffect(() => {
    if (drivers.length > 0 && trips.length > 0) {
      fetchExpenses();
    }
  }, [drivers, fetchExpenses, trips]);

  // Chart Data
  const getChartData = () => {
    const grouped = {};

    expenses.forEach((exp) => {
      const driver = exp.from_name;
      grouped[driver] = (grouped[driver] || 0) + parseFloat(exp.amount);
    });

    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    return {
      labels,
     datasets: [
  {
    label: 'Total Expense per Driver',
    data,
    backgroundColor: 'rgba(75, 192, 192, 0.6)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1,
    barThickness: 20, // Adjust this value (10–40 range)
    maxBarThickness: 30, // Optional: limit the thickest it can get
  },
],

    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Expense Overview by Driver' },
    },
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
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
          <div className="col">
            <select
              className="form-select"
              value={formData.from_id}
              onChange={(e) => setFormData({ ...formData, from_id: e.target.value })}
              required
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.fname} {driver.lname}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <select
              className="form-select"
              value={formData.to_id}
              onChange={(e) => setFormData({ ...formData, to_id: e.target.value })}
              required
            >
              <option value="">Select Trip</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.customer_orderno} - {trip.pickup_location} to {trip.destination_location}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="datetime-local"
              value={formData.exp_date}
              onChange={(e) => setFormData({ ...formData, exp_date: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            {/* <input
              type="text"
              placeholder="Image URL"
              value={formData.any_image}
              onChange={(e) => setFormData({ ...formData, any_image: e.target.value })}
              className="form-control"
            /> */}
             <input
                type="file"
                className="form-control"
                onChange={(e) => setFormData({ ...formData, any_image: e.target.value })}
              />
          </div>
          <div className="col">
            <select
              className="form-select"
              value={formData.exp_for}
              onChange={(e) => setFormData({ ...formData, exp_for: e.target.value })}
              required
            >
              <option value="">-- Select Purpose --</option>
              <option value="trip_start">Trip Start</option>
              <option value="break">Break</option>
              <option value="trip_end">Trip End</option>
              <option value="fuel-filling">Fuel Time</option>
              <option value="driver-salary">Driver Salary</option>
              <option value="agent-salary">Agent Time</option>
              <option value="additionally">Additionally</option>
            </select>
          </div>
          {isEditing && (
            <div className="col">
              <input
                type="text"
                placeholder="ID"
                value={formData.id}
                readOnly
                className="form-control"
              />
            </div>
          )}
        </div>
        <button type="submit" className="btn btn-success mt-3">
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      {/* Expense Chart */}
      <div className="my-4">
        <h5>Expense Chart</h5>
        <Bar data={getChartData()} options={chartOptions} />
      </div>

      {/* Expense Table */}
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Driver</th>
            <th>Trip</th>
            <th>Amount</th>
            <th>Reason</th>
            <th>Date</th>
            <th>Purpose</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.id}</td>
              <td>{exp.from_name}</td>
              <td>{exp.to_name}</td>
              <td>{exp.amount}</td>
              <td>{exp.reason}</td>
              <td>{exp.exp_date}</td>
              <td>{exp.exp_for}</td>
              <td>
                {exp.any_image ? (
                  <img src={`https://${exp.any_image}`} alt="Receipt" width="50" />
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

import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link } from 'react-router-dom';


const OcrExpensesTable = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [truckId, setTruckId] = useState("all");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    let result = [...data];

    if (truckId !== "all") {
      result = result.filter(d => d.truck_id === truckId);
    }

    if (category !== "all") {
      result = result.filter(
        d => getExpenseCategory(d.expense_type) === category
      );
    }

    // ✅ sort by category then date
    result.sort((a, b) =>
      getExpenseCategory(a.expense_type)
        .localeCompare(getExpenseCategory(b.expense_type))
    );

    setFiltered(result);
  }, [truckId, category, data]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://isovia.ca/fms_api/OCRController/list_expenses",
        { withCredentials: true }
      );
      setData(res.data.data || []);
      setFiltered(res.data.data || []);
    } catch (err) {
      console.error("API Error", err);
    } finally {
      setLoading(false);
    }
  };

  const uniqueTrucks = [...new Set(data.map(d => d.truck_id))];

  return (
    <div className="content-wrapper" style={{ padding: 20 }}>
      <h3>OCR Expenses</h3>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <select value={truckId} onChange={e => setTruckId(e.target.value)}>
          <option value="all">All Trucks</option>
          {uniqueTrucks.map(id => (
            <option key={id} value={id}>Truck #{id}</option>
          ))}
        </select>

        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Fuel">Fuel Expenses</option>
          <option value="Repair">Repair Expenses</option>
          <option value="Parking">Parking / Toll</option>
          <option value="Leasing">Leasing</option>
          <option value="Office">Office Expenses</option>
          <option value="Misc">Miscellaneous</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Truck</th>
              <th>Date</th>
              <th>Category</th>
              <th>Expense Type</th>
              <th>Amount</th>
              <th>Mileage</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" align="center">No Data</td>
              </tr>
            ) : (
              filtered.map(row => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.truck_id}</td>
                  <td>{row.expense_date}</td>
                  <td>
                    <strong>{getExpenseCategory(row.expense_type)}</strong>
                  </td>
                  <td>{row.expense_type}</td>
                  <td>{row.amount}</td>
                  <td>{row.ocr_json?.invoice?.mileage || "-"}</td>
                  <td>
                    <Link
                      to={`https://isovia.ca/fms_api/${row.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const EXPENSE_CATEGORY_MAP = {
  Fuel: ["fuel", "diesel", "petrol", "def", "gas"],
  Repair: ["repair", "maintenance", "tire", "oil", "service"],
  Parking: ["parking", "toll", "weigh"],
  Leasing: ["lease", "emi", "installment"],
  Office: ["office", "internet", "rent", "phone", "stationery"],
  Misc: []
};

const getExpenseCategory = (expenseType = "") => {
  const type = expenseType.toLowerCase();
  for (const category in EXPENSE_CATEGORY_MAP) {
    if (
      EXPENSE_CATEGORY_MAP[category].some(keyword =>
        type.includes(keyword)
      )
    ) {
      return category;
    }
  }
  return "Misc";
};

export default OcrExpensesTable;

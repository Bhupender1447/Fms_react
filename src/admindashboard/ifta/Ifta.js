import { useState } from "react";
import axios from "axios";
import "./IftaTable.css";

const Ifta = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [stateReports, setStateReports] = useState([]);
  const [units, setUnits] = useState([]); // Unique truck units
  const [selectedUnit, setSelectedUnit] = useState(""); // Selected unit

  const avgKmPerL = 2.60; // From header (C - AVERAGE KM/L)

  const fetchData = async () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://isovia.ca/fms_api/distanceapi/getDistances?from_date=${fromDate}&to_date=${toDate}`
      );

      if (response.data.status) {
        const data = response.data.data;

        // Extract unique truck units
        const uniqueUnits = [...new Set(data.map(item => item.truckunitnumber).filter(Boolean))];
        setUnits(uniqueUnits);

        // Filter by selected unit (if any)
        let filteredOrders = data;
        if (selectedUnit) {
          filteredOrders = data.filter(order => order.truckunitnumber === selectedUnit);
        }

        // Combine state data
        const allStates = [];
        filteredOrders.forEach(order => {
          order.state_report.forEach(state => {
            if (state.State !== "TOTAL") {
              allStates.push(state);
            }
          });
        });

        const combined = {};
        allStates.forEach(st => {
          if (!combined[st.State]) {
            combined[st.State] = {
              State: st.State,
              FuelRate: st.FuelRate,
              Volume: st.Volume,
              StCntryName: st.StCntryName || "",
              Distance: parseFloat(st.Distance),
            };
          } else {
            combined[st.State].Distance += parseFloat(st.Distance);
          }
        });

        setStateReports(Object.values(combined));
      } else {
        alert("No data found for the selected dates");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data");
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4 ifta-container">
      <div className="header-section">
        <div className="logo-section">
          <img src="https://isovia.ca/img/logo2.png" alt="IFTA Logo" className="ifta-logo" />
        </div>
        <div className="company-info">
          <p><strong>COMPANY:</strong> NORTH STAR GROUP</p>
          <p>2025 Q2</p>
          <p>A - TOTAL KMS TRAVELLED: <strong>2,32,480</strong></p>
          <p>B - TOTAL FUEL USAGE: <strong>89,442</strong></p>
          <p>C - AVERAGE KM/L: <strong>{avgKmPerL}</strong></p>
        </div>
        <div className="fuel-charge">
          <div className="rebate-box">
            Net Charge Rebate $ -2372.15
          </div>
        </div>
      </div>

      {/* Date & Unit Filter */}
      <div className="row mb-3">
        <div className="col-md-3">
          <label className="form-label">From Date:</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">To Date:</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Truck Unit:</label>
          <select
            className="form-control"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            <option value="">All Units</option>
            {units.map((unit, index) => (
              <option key={index} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-primary w-100"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered ifta-table text-center">
          <thead>
            <tr>
              <th>D - JURISDICTION</th>
              <th>E - TOTAL KMS DRIVEN</th>
              <th>F - TOTAL TAXABLE KMS</th>
              <th>G - TAXABLE LITRES (L) / FUEL USED</th>
              <th>H - TAX PAID LITRES (L)</th>
              <th>I - NET TAXABLE LITRES</th>
              <th>J - TAX RATE</th>
              <th>K - TAX DUE/CR</th>
            </tr>
          </thead>
          <tbody>
            {stateReports.length > 0 ? (
              stateReports.map((state, index) => {
                const taxableLitres = Math.round(state.Distance / avgKmPerL);
                const TAXDUE = taxableLitres - state.Volume;
                return (
                  <tr key={index}>
                    <td>{state.StCntryName} ({state.State})</td>
                    <td>{state.Distance.toFixed(2)}</td>
                    <td>{state.Distance.toFixed(2)}</td>
                    <td>{taxableLitres}</td>
                    <td>{Math.round(state.Volume)}</td>
                    <td>{Math.round(taxableLitres - state.Volume)}</td>
                    <td>{state.FuelRate ?? 0}</td>
                    <td>{Math.round((TAXDUE * Number(state.FuelRate))).toFixed(2)}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="text-muted">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ifta;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';

const Driverpaylist = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchRate, setSearchRate] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/getdriverpay');
        console.log(response.data);
        setPayrollData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    let filtered = payrollData;
    if (searchName) {
      filtered = filtered.filter(entry => 
        (`${entry.fname} ${entry.lname}`).toLowerCase().includes(searchName.toLowerCase())
      );
    }
    if (searchRate) {
      filtered = filtered.filter(entry => 
        entry.rate && entry.rate.toString().includes(searchRate)
      );
    }
    if (searchDate) {
      filtered = filtered.filter(entry => 
        entry.deliver_date && entry.deliver_date.includes(searchDate)
      );
    }
    setFilteredData(filtered);
  };

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setSortField(field);
    setSortOrder(order);
    setFilteredData(sortedData);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12); // Set a smaller font size
    doc.text("Driver Payroll Report", 14, 15);

    const tableColumn = [
        "Driver Name", "Account No", "Payment Method", "Company", 
        "Pickup Address", "Delivery Address", "Delivery Date", 
        "Delivery Time", "Rate", "Trailer Type"
    ];
    const tableRows = [];

    filteredData.forEach(entry => {
        const rowData = [
            `${entry.driver_fname} ${entry.driver_lname}`,
            entry.accountno || 'N/A',
            entry.payment_method || 'N/A',
            entry.company || 'N/A',
            entry.pickup_address || 'N/A',
            entry.delivery_address || 'N/A',
            entry.deliver_date || 'N/A',
            entry.deliverytime || 'N/A',
            entry.rate || 'N/A',
            entry.trailortype || 'N/A',
        ];
        tableRows.push(rowData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 8 }, 
        headStyles: { fontSize: 8 }, 
    });

    doc.save("Driver_Payroll_Report.pdf");
};

  

  return (
    <div className="content-wrapper p-4" style={{ minHeight: 440 }}>
      <h2 className="mb-4">Driver Payroll Management</h2>
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by Name" 
            value={searchName} 
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by Rate" 
            value={searchRate} 
            onChange={(e) => setSearchRate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <input 
            type="date" 
            className="form-control" 
            value={searchDate} 
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
      </div>
      <button className="btn btn-primary mb-3 me-2" onClick={handleFilter}>Filter</button>
      <button className="btn btn-success mb-3" onClick={exportPDF}>Export to PDF</button>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort('fname')} style={{ cursor: 'pointer' }}>Driver Name {sortField === 'fname' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th>Account No</th>
            <th>Payment Method</th>
            <th>Company</th>
            <th>Pickup Address</th>
            <th>Delivery Address</th>
            <th onClick={() => handleSort('deliver_date')} style={{ cursor: 'pointer' }}>Delivery Date {sortField === 'deliver_date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th>Delivery Time</th>
            <th onClick={() => handleSort('rate')} style={{ cursor: 'pointer' }}>Rate {sortField === 'rate' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th>Trailer Type</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{`${entry.driver_fname} ${entry.driver_lname}`}</td>
                <td>{entry.accountno || 'N/A'}</td>
                <td>{entry.payment_method || 'N/A'}</td>
                <td>{entry.company || 'N/A'}</td>
                <td>{entry.pickup_address || 'N/A'}</td>
                <td>{entry.delivery_address || 'N/A'}</td>
                <td>{entry.deliver_date || 'N/A'}</td>
                <td>{entry.deliverytime || 'N/A'}</td>
                <td>{entry.rate || 'N/A'}</td>
                <td>{entry.trailortype || 'N/A'}</td>
                <td> {entry.tmsTriptId&&<Link to={`/tripviewer/${entry.tmsTriptId}`} className="btn btn-primary  btn-xs">
                                                  Map
                                                </Link>}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Driverpaylist;

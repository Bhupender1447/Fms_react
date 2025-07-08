import axios from 'axios';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const NetIncomeTable = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [searchCompany, setSearchCompany] = useState(''); // New state for company search
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://isovia.ca/fms_api/api/getlocationIncome');
        console.log(response);
        // Filter out entries with null or zero values
        const filteredData = response.data.filter(entry => entry.value && parseFloat(entry.value) > 0);

        // Convert value to number and include company field
        const formattedData = filteredData.map(entry => ({
          name: entry.name,
          company: entry.company || 'N/A', // Add company field
          value: parseFloat(entry.value),
          date: entry.date || 'N/A',
        }));

        setIncomeData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFilter = () => {
    let filtered = incomeData;
    if (searchLocation) {
      filtered = filtered.filter(entry => 
        entry.name.toLowerCase().includes(searchLocation.toLowerCase())
      );
    }
    if (searchValue) {
      filtered = filtered.filter(entry => 
        entry.value && entry.value.toString().includes(searchValue)
      );
    }
    if (searchDate) {
      filtered = filtered.filter(entry => 
        entry.date && entry.date.includes(searchDate)
      );
    }
    if (searchCompany) {
      filtered = filtered.filter(entry => 
        entry.company && entry.company.toLowerCase().includes(searchCompany.toLowerCase())
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

  // PDF Export Function
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Net Income by Location", 14, 15);

    const tableColumn = ["Location", "Company", "Income", "Date"];
    const tableRows = [];

    filteredData.forEach(entry => {
      const rowData = [
        entry.name,
        entry.company,
        entry.value,
        entry.date
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("Net_Income_Report.pdf");
  };
  console.log(filteredData)

  return (
    <div className="content-wrapper p-4" style={{ minHeight: 440 }}>
      <h2 className="mb-4">Net Income by Location</h2>
      <div className="row g-3 mb-3">
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by Location" 
            value={searchLocation} 
            onChange={(e) => setSearchLocation(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by Company" 
            value={searchCompany} 
            onChange={(e) => setSearchCompany(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by Value" 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="col-md-3">
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
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Location {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('company')} style={{ cursor: 'pointer' }}>Company {sortField === 'company' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('value')} style={{ cursor: 'pointer' }}>Income {sortField === 'value' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
            <th onClick={() => handleSort('date')} style={{ cursor: 'pointer' }}>Date {sortField === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <tr key={index}>
                <td>{entry.name}</td>
                <td>{entry.company}</td>
                <td>{entry.value}</td>
                <td>{entry.date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default NetIncomeTable;
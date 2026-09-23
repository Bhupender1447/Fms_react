import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Link } from 'react-router-dom';

const Agentpaylist = () => {
    const [payrollData, setPayrollData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetching agents list and assuming we calculate payroll based on orders/trips
                // For now, let's fetch get-agents and we might need another API for trip commissions
                const response = await axios.get(`${BASE_URL}api/get-agents`);
                console.log(response.data);
                const data = response.data.status === 'success' ? response.data.data : [];
                setPayrollData(data);
                setFilteredData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setPayrollData([]);
                setFilteredData([]);
            }
        };
        fetchData();
    }, []);

    const handleFilter = () => {
        let filtered = Array.isArray(payrollData) ? payrollData : [];
        if (searchName) {
            filtered = filtered.filter(entry =>
                (`${entry.firstname} ${entry.lastname}`).toLowerCase().includes(searchName.toLowerCase()) ||
                (entry.agent_id && entry.agent_id.toLowerCase().includes(searchName.toLowerCase()))
            );
        }
        // Date filtering if needed, though agent list might not have specific trip dates yet
        setFilteredData(filtered);
    };

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
        const dataToSort = Array.isArray(filteredData) ? filteredData : [];
        const sortedData = [...dataToSort].sort((a, b) => {
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
        doc.setFontSize(12);
        doc.text("Agent Payroll Report", 14, 15);

        const tableColumn = [
            "Agent ID", "First Name", "Last Name", "Email", "Phone", "Compensation"
        ];
        const tableRows = [];

        filteredData.forEach(entry => {
            let compensation = '';
            if (entry.pay_type === 'fixed') {
                compensation = `$${entry.percentage}`;
            } else if (entry.pay_type === 'hourly') {
                compensation = `$${entry.percentage}/hr (${entry.hours || 0} hrs)`;
            } else {
                compensation = `${entry.percentage}%`;
            }
            const rowData = [
                entry.agent_id || 'N/A',
                entry.firstname || 'N/A',
                entry.lastname || 'N/A',
                entry.email || 'N/A',
                entry.phone || 'N/A',
                compensation,
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

        doc.save("Agent_Payroll_Report.pdf");
    };

    return (
        <div className="content-wrapper p-4" style={{ minHeight: 440 }}>
            <h2 className="mb-4">Agent Payroll Management</h2>
            <div className="row g-3 mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Name or Agent ID"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary w-100" onClick={handleFilter}>Filter</button>
                </div>
                <div className="col-md-3">
                    <button className="btn btn-success w-100" onClick={exportPDF}>Export to PDF</button>
                </div>
            </div>

            <div className="box">
                <div className="box-body no-padding">
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th onClick={() => handleSort('agent_id')} style={{ cursor: 'pointer' }}>Agent ID {sortField === 'agent_id' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                                <th onClick={() => handleSort('firstname')} style={{ cursor: 'pointer' }}>First Name {sortField === 'firstname' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Compensation</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{entry.agent_id}</td>
                                        <td>{entry.firstname}</td>
                                        <td>{entry.lastname}</td>
                                        <td>{entry.email}</td>
                                        <td>{entry.phone}</td>
                                        <td>
                                            {entry.pay_type === 'fixed' ? (
                                                `$${entry.percentage}`
                                            ) : entry.pay_type === 'hourly' ? (
                                                <span>
                                                    <strong>Rate:</strong> ${entry.percentage}/hr <br />
                                                    <strong>Hours:</strong> {entry.hours || 0}
                                                </span>
                                            ) : (
                                                `${entry.percentage}%`
                                            )}
                                        </td>
                                        <td>
                                            <Link to={`/agentedit/${entry.id}`} className="btn btn-primary btn-xs">
                                                View/Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No agent data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Agentpaylist;

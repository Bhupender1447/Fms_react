import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const PerformanceDashboard = () => {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const response = await axios.get(`${BASE_URL}api/fetchdriversProductData`);
                setDrivers(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching drivers:', error);
                setLoading(false);
            }
        };
        fetchDrivers();
    }, []);

    // Mock data for Safety Scores (Since backend doesn't provide it yet)
    const safetyData = [
        { name: 'Safe', value: 85, color: '#4CAF50' },
        { name: 'Warning', value: 10, color: '#FFC107' },
        { name: 'Critical', value: 5, color: '#F44336' },
    ];

    const complianceData = [
        { month: 'Jan', violations: 4, compliance: 96 },
        { month: 'Feb', violations: 7, compliance: 93 },
        { month: 'Mar', violations: 2, compliance: 98 },
        { month: 'Apr', violations: 5, compliance: 95 },
    ];

    if (loading) return <div className="text-center p-5">Loading Dashboard...</div>;

    return (
        <div className="content-wrapper p-4">
            <h2 className="mb-4 fw-bold">Driver Performance & Safety Dashboard</h2>

            <div className="row g-4">
                {/* Safety Score Gauge */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100 p-3" style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold mb-3">Overall Safety Score</h5>
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={safetyData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {safetyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="text-center mt-2">
                                <h2 className="fw-bold text-success">85%</h2>
                                <span className="text-muted">Fleet Average</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compliance Trend */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 h-100 p-3" style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold mb-3">Compliance & Violation Trend</h5>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={complianceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend />
                                    <Bar dataKey="compliance" fill="#5563DE" radius={[4, 4, 0, 0]} name="Compliance %" />
                                    <Bar dataKey="violations" fill="#F44336" radius={[4, 4, 0, 0]} name="Violations" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Performers Table */}
                <div className="col-md-12">
                    <div className="card shadow-sm border-0 p-3" style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold mb-3">Driver Performance Rankings</h5>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Driver Name</th>
                                        <th>Safety Score</th>
                                        <th>HOS Compliance</th>
                                        <th>Documents</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {drivers.slice(0, 10).map((driver, index) => (
                                        <tr key={index}>
                                            <td className="fw-semibold">{driver.fname} {driver.lname}</td>
                                            <td>
                                                <div className="progress" style={{ height: '10px', width: '100px' }}>
                                                    <div
                                                        className={`progress-bar ${index % 3 === 0 ? 'bg-success' : 'bg-warning'}`}
                                                        style={{ width: `${95 - index * 5}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td><span className="badge bg-success-subtle text-success">98%</span></td>
                                            <td><span className="badge bg-info-subtle text-info">Valid</span></td>
                                            <td>
                                                <span className={`badge rounded-pill ${index % 4 === 0 ? 'bg-danger' : 'bg-success'}`}>
                                                    {index % 4 === 0 ? 'Review Needed' : 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceDashboard;

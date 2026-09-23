import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const TruckPerformance = () => {
    const [trucks, setTrucks] = useState([]);
    const [faults, setFaults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const truckRes = await axios.get(`${BASE_URL}api/fetchtruckProductData`);
                const faultRes = await axios.get(`${BASE_URL}api/get_truck_faults`);
                setTrucks(Array.isArray(truckRes.data) ? truckRes.data : []);
                setFaults(faultRes.data.faults || []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching truck data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Mock data for Fuel & Maintenance (Simulated)
    const fuelData = [
        { name: 'Truck 101', consumption: 450, efficiency: 6.2 },
        { name: 'Truck 102', consumption: 520, efficiency: 5.8 },
        { name: 'Truck 105', consumption: 380, efficiency: 6.5 },
        { name: 'Truck 109', consumption: 600, efficiency: 5.5 },
        { name: 'Truck 112', consumption: 410, efficiency: 6.1 },
    ];

    const maintenanceData = [
        { month: 'Jan', cost: 1200 },
        { month: 'Feb', cost: 1900 },
        { month: 'Mar', cost: 800 },
        { month: 'Apr', cost: 2500 },
        { month: 'May', cost: 1100 },
    ];

    const faultSeverityData = [
        { name: 'High', value: faults.filter(f => f.severity === 'high').length || 2, color: '#F44336' },
        { name: 'Medium', value: faults.filter(f => f.severity === 'medium').length || 5, color: '#FFC107' },
        { name: 'Low', value: faults.filter(f => f.severity === 'low').length || 10, color: '#4CAF50' },
    ];

    if (loading) return <div className="text-center p-5">Loading Truck Analytics...</div>;

    return (
        <div className="content-wrapper p-4">
            <h2 className="mb-4 fw-bold">Truck Performance & Analytics</h2>

            <div className="row g-4">
                {/* Fuel Efficiency Chart */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 p-3" style={{ borderRadius: '15.px' }}>
                        <h5 className="fw-bold mb-3"><i className="fa fa-tint me-2 text-primary"></i> Fuel Consumption (Liters)</h5>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={fuelData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="consumption" fill="#3498db" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Maintenance Cost Trend */}
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 p-3" style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold mb-3"><i className="fa fa-wrench me-2 text-warning"></i> Maintenance Cost Trend ($)</h5>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={maintenanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="cost" stroke="#f39c12" strokeWidth={3} dot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Fault Severity Distribution */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 p-3" style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold mb-3"><i className="fa fa-exclamation-triangle me-2 text-danger"></i> Fault Distribution</h5>
                        <div style={{ height: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={faultSeverityData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {faultSeverityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="d-flex justify-content-around mt-2">
                            {faultSeverityData.map(d => (
                                <div key={d.name} className="text-center">
                                    <div className="fw-bold" style={{ color: d.color }}>{d.value}</div>
                                    <small className="text-muted">{d.name}</small>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Predictive Maintenance Alerts */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0 p-3" style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold mb-3"><i className="fa fa-clock-o me-2 text-info"></i> Predictive Maintenance Alerts</h5>
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Truck Unit</th>
                                        <th>Odometer</th>
                                        <th>Next Service (Est.)</th>
                                        <th>Priority</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trucks.slice(0, 5).map((truck, idx) => (
                                        <tr key={idx}>
                                            <td>{truck.unitno || truck.name}</td>
                                            <td>{truck.odometer} {truck.units}</td>
                                            <td>{parseInt(truck.odometer || 0) + 5000} {truck.units}</td>
                                            <td>
                                                <span className={`badge ${idx % 2 === 0 ? 'bg-danger' : 'bg-warning'}`}>
                                                    {idx % 2 === 0 ? 'Critical' : 'Upcoming'}
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

export default TruckPerformance;

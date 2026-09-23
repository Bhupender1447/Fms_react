import React, { useState, useEffect } from "react";
import axios from 'axios';
import { BASE_URL } from '../../config';
import Adminheader from '../Adminheader';

const ListCoversheet = () => {
  const [coversheetList, setCoversheetList] = useState([]);

  const fetchCoversheets = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}api/listCoversheet`);
      if (data.status === "success") setCoversheetList(data.data || []);
    } catch (err) {
      console.error("Error fetching coversheets:", err);
    }
  };

  useEffect(() => {
    fetchCoversheets();
  }, []);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h3>Coversheet List</h3>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Broker Name</th>
            <th>Broker Phone</th>
            <th>Broker Email</th>
            <th>Carrier Name</th>
            <th>Carrier Contact</th>
            <th>Carrier Email</th>
            <th>Driver Name</th>
            <th>Driver Phone</th>
            <th>Dispatch Phone</th>
            <th>Truck</th>
            <th>Port of Entry</th>
            <th>ETA</th>
            <th>Documents Attached</th>
            <th>Notes</th>
            <th>Sign</th>
            <th>Sign Date</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {coversheetList.length === 0 ? (
            <tr>
              <td colSpan="18">No coversheets found</td>
            </tr>
          ) : (
            coversheetList.map((sheet) => (
              <tr key={sheet.id}>
                <td>{sheet.id}</td>
                <td>{sheet.broker_name}</td>
                <td>{sheet.broker_phone}</td>
                <td>{sheet.broker_email}</td>
                <td>{sheet.carrier_name}</td>
                <td>{sheet.carrier_contact}</td>
                <td>{sheet.carrier_email}</td>
                <td>{sheet.driver_name}</td>
                <td>{sheet.driver_phone}</td>
                <td>{sheet.dispatch_phone}</td>
                <td>{sheet.truck}</td>
                <td>{sheet.portof_entry}</td>
                <td>{sheet.eta}</td>
                <td>{sheet.documents_attached}</td>
                <td>{sheet.notes}</td>
                <td>{sheet.sign}</td>
                <td>{sheet.sign_date}</td>
                <td>{sheet.created_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListCoversheet;

/* eslint-disable react/jsx-no-undef */
// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RevenueExpenses from './RevenueExpenses';
import NetIncomeChart from './NetIncomeChart';
import PayrollChart from './PayrollChart';

const Dashboardaccounting = () => {
  const [showAlertPopup, setShowAlertPopup] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user just logged in (you might want to use your actual auth logic)
    const hasJustLoggedIn = localStorage.getItem('hasJustLoggedIn') === 'true' || 
                           sessionStorage.getItem('hasJustLoggedIn') === 'true';
    
    if (hasJustLoggedIn) {
      fetchDriverAlerts();
      // Clear the login flag
      localStorage.removeItem('hasJustLoggedIn');
      sessionStorage.removeItem('hasJustLoggedIn');
    }
  }, []);

  const fetchDriverAlerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://isovia.ca/fms_api/api/driverdocumentsexpiryalert'
      );
      
      if (response.data.status === 'success' && response.data.data.length > 0) {
        setAlertData(response.data);
        setShowAlertPopup(true);
      }
    } catch (err) {
      console.error('Error fetching driver alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badgeClasses = {
      expired: 'bg-danger',
      active: 'bg-success',
      expiring_today: 'bg-warning',
      not_provided: 'bg-secondary',
      default: 'bg-info'
    };

    const className = badgeClasses[status] || badgeClasses.default;
    const statusText = status.replace('_', ' ').toUpperCase();
    
    return (
      <span className={`badge ${className}`}>
        {statusText}
      </span>
    );
  };

  const getDaysLeftText = (daysLeft) => {
    if (daysLeft === null) return 'N/A';
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days ago`;
    if (daysLeft === 0) return 'Today';
    return `${daysLeft} days`;
  };

  const getPriorityAlerts = () => {
    if (!alertData?.data) return [];
    
    // Priority order: expired > expiring_today > active > not_provided
    const priorityOrder = {
      'expired': 1,
      'expiring_today': 2,
      'active': 3,
      'not_provided': 4
    };

    return alertData.data
      .filter(alert => alert.alert_status === 'expired' || alert.alert_status === 'expiring_today')
      .sort((a, b) => priorityOrder[a.alert_status] - priorityOrder[b.alert_status])
      .slice(0, 10); // Show only top 10 priority alerts
  };

  const handleClosePopup = () => {
    setShowAlertPopup(false);
    setAlertData(null);
  };

  return (
    <div className="content-wrapper">
      {/* Alert Popup Modal */}
      {showAlertPopup && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-xl" style={{ maxWidth: '95%' }}>
            <div className="modal-content">
              <div className="modal-header bg-warning">
                <h4 className="modal-title">
                  <i className="fa fa-exclamation-triangle mr-2"></i>
                  Driver Document Expiry Alerts
                </h4>
                <button 
                  type="button" 
                  className="close" 
                  onClick={handleClosePopup}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-warning" role="status">
                      <span className="sr-only">Loading alerts...</span>
                    </div>
                    <p className="mt-2">Loading document alerts...</p>
                  </div>
                ) : (
                  <div>
                    <div className="alert alert-info">
                      <strong>Total Alerts: {alertData.alert_count}</strong> | 
                      <strong className="text-danger ml-2"> 
                        Expired: {alertData.data.filter(a => a.alert_status === 'expired').length}
                      </strong> | 
                      <strong className="text-warning ml-2">
                        Expiring Today: {alertData.data.filter(a => a.alert_status === 'expiring_today').length}
                      </strong>
                    </div>

                    <h5>Priority Alerts (Expired & Expiring Today):</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered table-striped table-sm">
                        <thead className="thead-dark">
                          <tr>
                            <th>Driver Name</th>
                            <th>Document Type</th>
                            <th>Expiry Date</th>
                            <th>Days Left</th>
                            <th>Status</th>
                            <th>Contact</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getPriorityAlerts().map((alert, index) => (
                            <tr key={index} className={alert.alert_status === 'expired' ? 'table-danger' : 'table-warning'}>
                              <td>
                                <strong>{alert.driver_name}</strong>
                                <br />
                                <small className="text-muted">ID: {alert.driver_id}</small>
                              </td>
                              <td>{alert.document_type}</td>
                              <td>
                                {alert.expiry_date === 'Not Provided' ? (
                                  <span className="text-muted">Not Provided</span>
                                ) : (
                                  new Date(alert.expiry_date).toLocaleDateString()
                                )}
                              </td>
                              <td>
                                <strong className={
                                  alert.alert_status === 'expired' ? 'text-danger' : 
                                  alert.alert_status === 'expiring_today' ? 'text-warning' : 'text-success'
                                }>
                                  {getDaysLeftText(alert.days_left)}
                                </strong>
                              </td>
                              <td>{getStatusBadge(alert.alert_status)}</td>
                              <td>
                                <small>
                                  <div>{alert.driver_email}</div>
                                  <div>{alert.driver_phone}</div>
                                </small>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {getPriorityAlerts().length === 0 && (
                      <div className="alert alert-success text-center">
                        <i className="fa fa-check-circle mr-2"></i>
                        No priority alerts found! All documents are up to date.
                      </div>
                    )}

                    <div className="mt-3">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          // Navigate to driver management page or open detailed view
                          window.location.href = '/drivers'; // Adjust URL as needed
                        }}
                      >
                        <i className="fa fa-list mr-1"></i>
                        View All Driver Documents
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClosePopup}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => {
                    // Option to snooze the alert for 24 hours
                    localStorage.setItem('alertSnoozedUntil', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
                    handleClosePopup();
                  }}
                >
                  <i className="fa fa-bell-slash mr-1"></i>
                  Snooze for 24 Hours
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <h1>INTERNATIONAL ACCOUNTING STANDARDS</h1>
      
      {/* Quick Alert Summary (if alerts exist) */}
      {alertData && alertData.alert_count > 0 && (
        <div className="alert alert-warning alert-dismissible">
          <button type="button" className="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
          <strong>
            <i className="fa fa-exclamation-triangle mr-1"></i>
            Document Alerts: 
          </strong> 
          You have {alertData.alert_count} document expiry alerts. 
          <button 
            className="btn btn-warning btn-sm ml-2"
            onClick={() => setShowAlertPopup(true)}
          >
            View Details
          </button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <RevenueExpenses />
        <AccountsPayableReceivable />
        <NetIncomeChart/>
      </div>
      {/* <PayrollManagement /> */}
      <PayrollChart/>
    </div>
  );
};

export default Dashboardaccounting;
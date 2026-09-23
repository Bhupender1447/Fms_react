import React, { useState } from 'react';
import { toast } from 'react-toastify';

const NotificationConfig = () => {
    const [config, setConfig] = useState({
        emailAlerts: true,
        smsAlerts: false,
        leadTime: 30,
        notifyAdmin: true,
        notifyDriver: true,
    });

    const handleToggle = (field) => {
        setConfig({ ...config, [field]: !config[field] });
    };

    const handleSave = () => {
        // Save to local storage for now (Simulating backend persistence)
        localStorage.setItem('driver_notification_config', JSON.stringify(config));
        toast.success('Notification settings saved successfully!');
    };

    return (
        <div className="content-wrapper p-4">
            <h2 className="mb-4 fw-bold">Notification Configuration</h2>

            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
                        <h5 className="fw-bold mb-4">Document Renewal Alerts</h5>

                        <div className="mb-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="mb-0 fw-semibold">Email Notifications</h6>
                                <small className="text-muted">Send automated renewal reminders via email</small>
                            </div>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={config.emailAlerts}
                                    onChange={() => handleToggle('emailAlerts')}
                                    style={{ width: '2.5em', height: '1.25em' }}
                                />
                            </div>
                        </div>

                        <div className="mb-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="mb-0 fw-semibold">SMS Notifications</h6>
                                <small className="text-muted">Send automated reminders via text message</small>
                            </div>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={config.smsAlerts}
                                    onChange={() => handleToggle('smsAlerts')}
                                    style={{ width: '2.5em', height: '1.25em' }}
                                />
                            </div>
                        </div>

                        <hr className="my-4" />

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Alert Lead Time (Days)</label>
                            <div className="input-group" style={{ width: '150px' }}>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={config.leadTime}
                                    onChange={(e) => setConfig({ ...config, leadTime: e.target.value })}
                                />
                                <span className="input-group-text">days</span>
                            </div>
                            <small className="text-muted mt-2 d-block">Number of days before expiry to start sending alerts</small>
                        </div>

                        <div className="mb-4">
                            <h6 className="fw-semibold mb-3">Recipients</h6>
                            <div className="form-check mb-2">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="notifyAdmin"
                                    checked={config.notifyAdmin}
                                    onChange={() => handleToggle('notifyAdmin')}
                                />
                                <label className="form-check-label" htmlFor="notifyAdmin">Fleet Administrators</label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="notifyDriver"
                                    checked={config.notifyDriver}
                                    onChange={() => handleToggle('notifyDriver')}
                                />
                                <label className="form-check-label" htmlFor="notifyDriver">The Driver</label>
                            </div>
                        </div>

                        <button
                            className="btn btn-primary w-100 fw-bold py-2 mt-3"
                            onClick={handleSave}
                            style={{ borderRadius: '10px', backgroundColor: '#5563DE', border: 'none' }}
                        >
                            Save Configuration
                        </button>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="alert alert-info border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <h6 className="fw-bold"><i className="bi bi-info-circle-fill me-2"></i> How it works</h6>
                        <p className="small mb-0 mt-2">
                            The automated alert system checks all driver documents daily. When a document (License, Passport, CVOR)
                            enters the lead time window, the system will trigger notifications based on these settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationConfig;

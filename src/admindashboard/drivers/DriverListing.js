import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BASE_URL } from '../../config';

const displayValue = (value) => value === null || value === undefined || value === '' ? '—' : value;
const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function DriverListing() {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedDriver, setExpandedDriver] = useState(null);
  const [recordsByDriver, setRecordsByDriver] = useState({});
  const [loadingDriver, setLoadingDriver] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadDrivers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}api/hos/fleet-roster`, { credentials: 'include' });
      const result = await response.json();
      if (!response.ok || result.status !== 'success') throw new Error(result.message || 'Could not load drivers.');
      setDrivers(result.drivers || []);
    } catch (loadError) {
      setError(loadError.message || 'Could not load drivers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDrivers(); }, [loadDrivers]);

  const openDriver = async (driver) => {
    const driverId = String(driver.driver_id || driver.id);
    if (expandedDriver === driverId) {
      setExpandedDriver(null);
      return;
    }
    setExpandedDriver(driverId);
    if (recordsByDriver[driverId]) return;
    setLoadingDriver(driverId);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}api/drivers/${driverId}/hos/records`, { credentials: 'include' });
      const result = await response.json();
      if (!response.ok || result.status !== 'success') throw new Error(result.message || 'Could not load driver HOS records.');
      setRecordsByDriver((current) => ({ ...current, [driverId]: result }));
    } catch (loadError) {
      setError(loadError.message || 'Could not load driver HOS records.');
      setExpandedDriver(null);
    } finally {
      setLoadingDriver(null);
    }
  };

  const filteredDrivers = useMemo(() => drivers.filter((driver) =>
    `${driver.name || ''} ${driver.driver_id || driver.id}`.toLowerCase().includes(search.trim().toLowerCase())
  ), [drivers, search]);

  return (
    <main className="content-wrapper p-3 p-md-4" style={{ minHeight: 600 }}>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="mb-1">Driver Listing</h2>
          <p className="text-muted mb-0">Browse each driver and load every HOS activity and duty record stored by the IFM backend.</p>
        </div>
        <button className="btn btn-outline-primary" onClick={loadDrivers} disabled={loading}>
          <i className="fa fa-refresh me-1" aria-hidden="true" /> {loading ? 'Refreshing…' : 'Refresh drivers'}
        </button>
      </div>

      <div className="alert alert-info" role="note">
        These are backend records. They are shown as received and do not represent a validated HOS compliance calculation.
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <section className="card shadow-sm">
        <div className="card-header d-flex flex-wrap justify-content-between align-items-center gap-2">
          <strong>Drivers <span className="text-muted fw-normal">({filteredDrivers.length})</span></strong>
          <input className="form-control" style={{ maxWidth: 340 }} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search driver name or ID" aria-label="Search drivers" />
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light"><tr><th>Driver</th><th>Driver ID</th><th>HOS history</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan="3" className="text-center py-4" role="status">Loading drivers…</td></tr>}
              {!loading && filteredDrivers.length === 0 && <tr><td colSpan="3" className="text-center text-muted py-4">No drivers found.</td></tr>}
              {!loading && filteredDrivers.map((driver) => {
                const driverId = String(driver.driver_id || driver.id);
                const records = recordsByDriver[driverId];
                const isExpanded = expandedDriver === driverId;
                return <React.Fragment key={driverId}>
                  <tr>
                    <td className="fw-semibold">{driver.name || 'Unnamed driver'}</td>
                    <td>{driverId}</td>
                    <td><button type="button" className="btn btn-sm btn-outline-primary" onClick={() => openDriver(driver)} aria-expanded={isExpanded}>
                      {loadingDriver === driverId ? 'Loading records…' : isExpanded ? 'Hide records' : records ? 'Show records' : 'View all records'}
                    </button></td>
                  </tr>
                  {isExpanded && <tr><td colSpan="3" className="bg-light p-3 p-lg-4">
                    {!records ? <div role="status">Loading this driver’s HOS history…</div> : <>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className="badge bg-primary">{records.counts?.hos_logs ?? records.hos_logs?.length ?? 0} HOS activities</span>
                        <span className="badge bg-secondary">{records.counts?.duty_records ?? records.duty_records?.length ?? 0} duty records</span>
                      </div>
                      <h5 className="mb-2">HOS activity records</h5>
                      <div className="table-responsive mb-4">
                        <table className="table table-sm table-striped table-bordered bg-white mb-0">
                          <thead><tr><th>Activity</th><th>Start</th><th>End</th><th>Duration (min)</th><th>Truck</th><th>Location</th><th>Updated</th></tr></thead>
                          <tbody>
                            {(records.hos_logs || []).length === 0 ? <tr><td colSpan="7" className="text-center text-muted">No HOS activity records.</td></tr> : records.hos_logs.map((log) => <tr key={`hos-${log.id}`}>
                              <td>{displayValue(log.activity_type)}</td><td>{formatDate(log.start_time)}</td><td>{formatDate(log.end_time)}</td><td>{displayValue(log.duration_minutes)}</td><td>{displayValue(log.truck_id)}</td>
                              <td>{log.location_lat || log.location_lng ? `${displayValue(log.location_lat)}, ${displayValue(log.location_lng)}` : '—'}</td><td>{formatDate(log.updated_at || log.created_at)}</td>
                            </tr>)}
                          </tbody>
                        </table>
                      </div>
                      <h5 className="mb-2">Duty status records</h5>
                      <div className="table-responsive">
                        <table className="table table-sm table-striped table-bordered bg-white mb-0">
                          <thead><tr><th>Status</th><th>Login</th><th>Logout</th><th>Trip</th><th>Truck</th><th>Location</th><th>Updated</th></tr></thead>
                          <tbody>
                            {(records.duty_records || []).length === 0 ? <tr><td colSpan="7" className="text-center text-muted">No duty status records.</td></tr> : records.duty_records.map((record) => <tr key={`duty-${record.id}`}>
                              <td>{displayValue(record.status)}</td><td>{formatDate(record.login_time)}</td><td>{formatDate(record.logout_time)}</td><td>{displayValue(record.trip_id)}</td><td>{displayValue(record.odotrucks)}</td>
                              <td>{record.latitude || record.longitude ? `${displayValue(record.latitude)}, ${displayValue(record.longitude)}` : '—'}</td><td>{formatDate(record.updated_at)}</td>
                            </tr>)}
                          </tbody>
                        </table>
                      </div>
                    </>}
                  </td></tr>}
                </React.Fragment>;
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

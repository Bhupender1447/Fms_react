import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BASE_URL } from '../../config';

const formatSources = (sources = []) => sources
  .map((source) => ({
    active_trip: 'Active trip',
    duty_status: 'Duty record',
    hos_log: 'HOS history',
  }[source] || source))
  .join(', ');

export default function FleetHosRoster() {
  const [roster, setRoster] = useState({ drivers: [], trucks: [], counts: {} });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRoster = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${BASE_URL}api/hos/fleet-roster`, { credentials: 'include' });
      const result = await response.json();
      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || 'Could not load the HOS fleet roster.');
      }
      setRoster(result);
    } catch (loadError) {
      setError(loadError.message || 'Could not load the HOS fleet roster.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRoster(); }, [loadRoster]);

  const truckById = useMemo(() => Object.fromEntries(
    roster.trucks.map((truck) => [String(truck.id), truck])
  ), [roster.trucks]);
  const filteredDrivers = roster.drivers.filter((driver) =>
    `${driver.name} ${driver.driver_id} ${driver.connections.map((connection) => connection.truck_id).join(' ')}`
      .toLowerCase().includes(search.toLowerCase())
  );
  const filteredTrucks = roster.trucks.filter((truck) =>
    `${truck.name || ''} ${truck.truckunitnumber || ''} ${truck.plateno || ''} ${truck.id} ${truck.connections.map((connection) => connection.name).join(' ')}`
      .toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="content-wrapper p-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <div>
          <h2 className="mb-1">Driver and Truck HOS Connections</h2>
          <p className="text-muted mb-0">Fleet records are matched through active trips, duty records, and recent HOS logs.</p>
        </div>
        <button className="btn btn-outline-primary" onClick={loadRoster} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="alert alert-warning" role="alert">
        HOS assessment: <strong>Not assessed.</strong> This page shows IFM duty/HOS records and possible record associations only. Record recency does not establish complete ELD duty-history coverage, calculate remaining hours, or confirm legal compliance. A connection does not confirm an active vehicle assignment unless its source is an active trip.
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3 mb-4">
        {[
          ['Drivers', roster.counts.drivers],
          ['Trucks', roster.counts.trucks],
          ['Unlinked drivers', roster.counts.unlinked_drivers],
          ['Unlinked trucks', roster.counts.unlinked_trucks],
        ].map(([label, value]) => (
          <div className="col-6 col-lg-3" key={label}>
            <div className="card h-100"><div className="card-body">
              <div className="text-muted small">{label}</div>
              <div className="fs-3 fw-bold">{value ?? '—'}</div>
            </div></div>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <input className="form-control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Filter by driver, truck, plate, or unit number" />
      </div>

      {loading && <p role="status">Loading all drivers and trucks…</p>}

      <section className="card mb-4">
        <div className="card-header fw-bold">Drivers ({filteredDrivers.length})</div>
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead><tr><th>Driver</th><th>Duty</th><th>Connected truck(s)</th><th>Latest HOS record</th><th>Connection source</th></tr></thead>
            <tbody>
              {!loading && filteredDrivers.length === 0 && <tr><td colSpan="5" className="text-center">No drivers found.</td></tr>}
              {filteredDrivers.map((driver) => (
                <tr key={driver.driver_id}>
                  <td>{driver.name || 'Unnamed driver'}<div className="small text-muted">ID {driver.driver_id}</div></td>
                  <td>{driver.duty_status || 'unknown'}{driver.duty_login_time && <div className="small text-muted">Since {driver.duty_login_time}</div>}</td>
                  <td>{driver.connections.length ? driver.connections.map((connection) => {
                    const truck = truckById[String(connection.truck_id)];
                    const label = truck ? `${truck.name || 'Truck'}${truck.truckunitnumber ? ` · ${truck.truckunitnumber}` : ''}` : `Truck ${connection.truck_id}`;
                    return <div key={connection.truck_id}>{label}{connection.active_trip_id && <span className="badge bg-success ms-2">Active trip</span>}</div>;
                  }) : <span className="text-muted">No linked truck record</span>}</td>
                  <td>{driver.latest_hos ? <>{driver.latest_hos.activity_type || 'Activity'}<div className="small text-muted">{driver.latest_hos.end_time || driver.latest_hos.start_time || 'Time unavailable'}</div></> : <span className="text-muted">No HOS log in the last 30 days</span>}</td>
                  <td>{driver.connections.length ? driver.connections.map((connection) => <div key={connection.truck_id}>{formatSources(connection.sources)} · Truck {connection.truck_id}</div>) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="card-header fw-bold">Trucks ({filteredTrucks.length})</div>
        <div className="table-responsive">
          <table className="table table-striped table-hover mb-0">
            <thead><tr><th>Truck</th><th>Connected driver(s)</th><th>Connection source</th><th>Connection state</th></tr></thead>
            <tbody>
              {!loading && filteredTrucks.length === 0 && <tr><td colSpan="4" className="text-center">No trucks found.</td></tr>}
              {filteredTrucks.map((truck) => (
                <tr key={truck.id}>
                  <td>{truck.name || 'Truck'}<div className="small text-muted">ID {truck.id}{truck.truckunitnumber ? ` · Unit ${truck.truckunitnumber}` : ''}{truck.plateno ? ` · Plate ${truck.plateno}` : ''}</div></td>
                  <td>{truck.connections.length ? truck.connections.map((connection) => <div key={connection.driver_id}>{connection.name || `Driver ${connection.driver_id}`}{connection.active_trip_id && <span className="badge bg-success ms-2">Active trip</span>}</div>) : <span className="text-muted">No linked driver record</span>}</td>
                  <td>{truck.connections.length ? truck.connections.map((connection) => <div key={connection.driver_id}>{formatSources(connection.sources)}</div>) : '—'}</td>
                  <td><span className={`badge ${truck.connection_status === 'linked' ? 'bg-success' : 'bg-secondary'}`}>{truck.connection_status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

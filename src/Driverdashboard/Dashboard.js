import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiCheckCircle, FiClock, FiFileText, FiMapPin, FiNavigation, FiRefreshCw, FiTruck, FiCreditCard, FiAlertCircle } from 'react-icons/fi';
import { BASE_URL } from '../config';
import './driver-portal.css';
import TripDetailsDialog from './TripDetailsDialog';
import TripDriverlist from './trips/Triplist';

const states = { ACTIVE: 'Not started', IN_PROGRESS: 'In progress', PAUSED: 'Paused', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
const metrics = [
  ['active', 'Active trips', FiTruck], ['in_progress', 'In progress', FiNavigation],
  ['not_started', 'Not started', FiClock], ['completed', 'Completed', FiCheckCircle],
];
const tools = [
  ['/drivercustompaper', 'Trip documents', 'Paperwork for your assignments', FiFileText],
  ['/driver/eld', 'ELD logbook', 'Review your recorded activity', FiClock],
  ['/expense', 'Record an expense', 'Keep your trip expenses together', FiCreditCard],
  ['/driverincome', 'My income', 'View your income records', FiArrowUpRight],
];

function schedule(date, time) {
  if (!date || String(date).startsWith('0000')) return 'Schedule pending';
  const parsed = new Date(`${String(date).slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return 'Schedule pending';
  const day = parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return [day, time && String(time).slice(0, 5)].filter(Boolean).join(' · ');
}

export default function DriverDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [selectedTrip, setSelectedTrip] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setData(null); setSelectedTrip(null);
    axios.get(`${BASE_URL}api/driver-dashboard`, { withCredentials: true, signal: controller.signal })
      .then(({ data: response }) => {
        if (response?.status !== 'success' || !Array.isArray(response.trips)
          || !metrics.every(([key]) => Number.isInteger(response.summary?.[key]) && response.summary[key] >= 0)) {
          throw new Error('The dashboard response could not be verified.');
        }
        if (!controller.signal.aborted) setData(response);
      })
      .catch(failure => {
        if (!controller.signal.aborted) setError(failure.response?.data?.message || failure.message || 'Your assignments could not be loaded.');
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);

  const trips = data?.trips || [];
  const current = trips.find(trip => ['IN_PROGRESS', 'PAUSED', 'ACTIVE'].includes(trip.status));
  const firstName = data?.driver?.name?.split(/[\s_]+/)[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const updated = data?.updated_at && !Number.isNaN(Date.parse(data.updated_at))
    ? new Date(data.updated_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : null;

  return <main id="driver-main" className="content-wrapper driver-dashboard">
    <header className="driver-page-heading"><div>
      <p className="driver-page-date">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
      <h1>{greeting}{firstName ? `, ${firstName}` : ''}<span>.</span></h1>
      <p>Your assignments and the next step, all in one place.</p>
    </div><div className="driver-refresh"><button className="driver-button driver-button-light" disabled={loading} onClick={() => setRevision(value => value + 1)}><FiRefreshCw className={loading ? 'is-spinning' : ''} />{loading ? 'Updating' : 'Refresh'}</button>
      <span aria-live="polite">{updated ? `Updated at ${updated}` : loading ? 'Checking your assignments' : 'Refresh for the latest information'}</span>
    </div></header>

    {error && <div className="driver-error" role="alert"><FiAlertCircle /><div><strong>Trip information unavailable</strong><p>{error}</p></div><button className="driver-button driver-button-light" onClick={() => setRevision(value => value + 1)}>Try again</button></div>}

    <section className="driver-metrics" aria-label="Assigned trip summary" aria-busy={loading}>
      {metrics.map(([key, label, Icon]) => <div className={`driver-metric driver-metric-${key}`} key={key}><span className="driver-metric-icon"><Icon /></span><div><span>{label}</span><strong>{data ? data.summary[key] : '—'}</strong></div></div>)}
    </section>

    <TripDriverlist embedded />
    <div className="driver-overview-grid">
      <section className="driver-trip-panel" aria-label="Featured assignment" aria-busy={loading}>
        <div className="driver-section-heading"><h2>{current?.status === 'IN_PROGRESS' || current?.status === 'PAUSED' ? 'Current trip' : 'Up next'}</h2><a href="#driver-assignments">Assignments <FiArrowUpRight /></a></div>
        {loading ? <div className="driver-trip-loading" role="status"><span className="driver-loading-bar" /><span className="driver-loading-bar" /><FiTruck /><p>Getting your trip ready…</p></div>
          : current ? <>
            <div className="driver-trip-heading"><div><span className="driver-trip-caption">Trip reference</span><h3>{current.reference || current.trip_id}</h3></div><span className={`driver-state driver-state-${current.status.toLowerCase()}`}>{states[current.status] || current.status}</span></div>
            <div className="driver-route">
              <div className="driver-route-stop"><span className="driver-route-dot" /><div><span className="driver-route-label">Pickup</span><h4>{current.pickup_address || 'Pickup address pending'}</h4><p><FiClock />{schedule(current.pickup_date, current.pickup_time)}</p></div></div>
              <div className="driver-route-stop"><span className="driver-route-dot is-destination" /><div><span className="driver-route-label">Delivery</span><h4>{current.delivery_address || 'Delivery address pending'}</h4><p><FiClock />{schedule(current.delivery_date, current.delivery_time)}</p></div></div>
            </div>
            <div className="driver-trip-equipment"><div><span>Truck</span><strong>{current.truckunitnumber || current.truck_id || 'Not assigned'}</strong></div><div><span>Trailer</span><strong>{current.trailor_id || 'Not assigned'}</strong></div><div><span>Equipment</span><strong>{current.equipment || 'Not specified'}</strong></div></div>
            {current.instructions && <p className="driver-trip-instructions"><FiFileText /><span>{current.instructions}</span></p>}
            <div className="driver-trip-footer"><span><FiMapPin />Assigned to you</span><button className="driver-button driver-button-primary" onClick={() => setSelectedTrip(current)}>View trip <FiArrowRight /></button></div>
          </> : <div className="driver-empty-feature"><span><FiTruck /></span><h3>{error ? 'Your next trip will appear here' : 'No active trips right now'}</h3><p>{error ? 'Try refreshing to reconnect to your assignments.' : 'You have no active assignments in the current response. Check your trip list for other work.'}</p><button className="driver-button driver-button-primary" onClick={() => setRevision(value => value + 1)}>Refresh assignments <FiRefreshCw /></button></div>}
      </section>

      <aside className="driver-tools-panel"><div className="driver-section-heading"><h2>Quick access</h2><span className="driver-section-icon"><FiArrowUpRight /></span></div>
        <div className="driver-tool-list">{tools.map(([to, title, detail, Icon]) => <Link className="driver-tool" to={to} key={to}><span className="driver-tool-icon"><Icon /></span><span><strong>{title}</strong><small>{detail}</small></span><FiArrowUpRight /></Link>)}</div>
        <div className="driver-duty-card"><span className="driver-duty-icon"><FiClock /></span><h3>Keep your day up to date</h3><p>Manage your duty activity and review your recorded history.</p><Link to="/driver/eld">Open daily logbook <FiArrowRight /></Link></div>
      </aside>
    </div>

    <section id="driver-assignments" className="driver-assignments-panel"><div className="driver-section-heading"><div><h2>Your assignments</h2><p>{data ? `Showing ${trips.length} of ${data.summary.assigned} assigned trips` : 'Current work first, followed by other recent trips.'}</p></div>{data?.capabilities?.dispatch_available && <Link to="/drivertrip">View all <FiArrowUpRight /></Link>}</div>
      {loading ? <p className="driver-list-feedback" role="status">Loading assignments…</p> : !trips.length ? <p className="driver-list-feedback">{error ? 'Assignments are temporarily unavailable.' : 'No assigned trips to display.'}</p> : <div className="driver-assignment-list">{trips.map(trip => <button type="button" onClick={() => setSelectedTrip(trip)} className="driver-assignment-row" key={trip.id}>
        <span className="driver-assignment-icon"><FiTruck /></span><span className="driver-assignment-reference"><strong>{trip.reference || trip.trip_id}</strong><span>{schedule(trip.pickup_date, trip.pickup_time)}</span></span>
        <span className="driver-assignment-route"><span>{trip.pickup_address || 'Pickup pending'}</span><FiArrowRight /><span>{trip.delivery_address || 'Delivery pending'}</span></span>
        <span className={`driver-state driver-state-${String(trip.status).toLowerCase()}`}>{states[trip.status] || trip.status}</span><FiArrowUpRight className="driver-assignment-arrow" />
      </button>)}</div>}
    </section>
    <footer className="driver-page-footer"><span>Isovia · Driver workspace</span><span>Trip times are shown as recorded in your assignment.</span></footer>
    {current && <div className="driver-mobile-action"><div><strong>{states[current.status] || current.status}</strong><span>{current.reference || current.trip_id}</span></div><button className="driver-button driver-button-primary" aria-label="View current trip" onClick={() => setSelectedTrip(current)}>View trip <FiArrowRight /></button></div>}
    {selectedTrip && <TripDetailsDialog trip={selectedTrip} controlsAvailable={data?.capabilities?.trip_controls_available === true} onClose={() => setSelectedTrip(null)} />}
  </main>;
}
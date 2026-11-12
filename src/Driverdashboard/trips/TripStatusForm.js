import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Alert, Button } from '../../design-system/components';
import { BASE_URL } from '../../config';
import '../../admindashboard/drivers/driver-command-center.css';
import './trip-execution.css';

const STATUS_LABELS = { ACTIVE: 'Not started', IN_PROGRESS: 'In progress', PAUSED: 'Paused', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
const API = `${BASE_URL}api/maps/trip/`;
const errorMessage = error => error.response?.data?.message || error.message || 'The request could not be completed.';
const requestId = () => `execution_${window.crypto.randomUUID()}`;

export default function TripStatusForm() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [result, setResult] = useState('PASS');
  const [defects, setDefects] = useState('');
  const [notes, setNotes] = useState('');
  const [podNote, setPodNote] = useState('');
  const [podFile, setPodFile] = useState(null);
  const [podError, setPodError] = useState('');
  const [revision, setRevision] = useState(0);
  const gate = useRef(false);
  const controller = useRef(null);
  const pendingRequest = useRef(null);
  const fileInput = useRef(null);

<<<<<<< Updated upstream
  const [trip,       setTrip]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [location,   setLocation]   = useState({ lat: '', lon: '' });
  const [label,      setLabel]      = useState('');
  const [podNote,    setPodNote]    = useState('');
  const [podFile,    setPodFile]    = useState(null);
  const [podError,   setPodError]   = useState('');

  // Get logged-in driver ID from localStorage
  const driverInfo = (() => {
    try { return JSON.parse(localStorage.getItem('logindetail')) || {}; }
    catch { return {}; }
  })();
  const driverId = driverInfo.id || driverInfo.user_id || 0;

  // Auto-fetch GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => setError('⚠ Could not auto-fetch GPS location. You can still update status.')
      );
    }
  }, []);

  // Fetch current trip status
  const fetchTripStatus = useCallback(async () => {
    if (!tripId) { setError('No trip ID provided.'); setLoading(false); return; }
    try {
      const res = await axios.get(`${BASE_URL}api/maps/trip/status/${tripId}`);
      if (res.data.status) setTrip(res.data);
      else setError(res.data.message || 'Trip not found');
    } catch (err) {
      setError('Failed to load trip: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
=======
  const refresh = useCallback(async signal => {
    const response = await axios.get(`${API}status/${encodeURIComponent(tripId)}`, { withCredentials: true, signal });
    const data = response.data;
    if (data?.status !== true || data.contract_version !== 'trip-execution.v1' || data.tmsTripId !== tripId
        || !STATUS_LABELS[data.trip_status] || !Array.isArray(data.stops) || !Array.isArray(data.inspections)
        || !Array.isArray(data.history) || !Array.isArray(data.documents)) {
      throw new Error('The trip response could not be verified. Refresh the trip.');
>>>>>>> Stashed changes
    }
    if (!signal.aborted) setTrip(data);
  }, [tripId]);

  useEffect(() => {
    const abort = new AbortController();
    controller.current = abort;
    pendingRequest.current = null;
    gate.current = false;
    setTrip(null); setLoading(true); setBusy(false); setError(''); setSuccess('');
    setPodFile(null); setPodNote(''); setPodError(''); setResult('PASS'); setDefects(''); setNotes('');
    refresh(abort.signal).catch(failure => {
      if (!abort.signal.aborted) setError(errorMessage(failure));
    }).finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [refresh, revision]);

  const mutate = async (path, values, file) => {
    if (gate.current) return;
    const signal = controller.current.signal;
    gate.current = true; setBusy(true); setError(''); setSuccess('');
    // Retain the same key after an uncertain network result. The server returns
    // the saved response if the first attempt committed before the connection failed.
    const signature = JSON.stringify([path, values, file && [file.name, file.size, file.lastModified]]);
    if (pendingRequest.current?.signature !== signature) pendingRequest.current = { signature, id: requestId() };
    const body = { tmsTripId: tripId, ...values, request_id: pendingRequest.current.id };
    try {
<<<<<<< Updated upstream
      let res;

      if (newStatus === 'COMPLETED' && podFile) {
        // Multipart form for POD upload + status
        const formData = new FormData();
        formData.append('tmsTripId',  tripId);
        formData.append('status',     newStatus);
        formData.append('driver_id',  driverId);
        formData.append('timeStamp',  new Date().toISOString());
        formData.append('pod_note',   podNote);
        formData.append('pod_image',  podFile);
        if (location.lat) formData.append('loc[lat]', location.lat);
        if (location.lon) formData.append('loc[lon]', location.lon);
        if (label)        formData.append('loc[label]', label);
        res = await axios.post(`${BASE_URL}api/maps/trip/status`, formData);
      } else {
        res = await axios.post(`${BASE_URL}api/maps/trip/status`, {
          tmsTripId: tripId,
          status:    newStatus,
          driver_id: driverId,
          timeStamp: new Date().toISOString(),
          pod_note:  podNote,
          loc: { lat: String(location.lat), lon: String(location.lon), label },
        });
=======
      let payload = body;
      if (file) {
        payload = new FormData();
        Object.entries(body).forEach(([key, value]) => payload.append(key, value));
        payload.append('pod_image', file);
>>>>>>> Stashed changes
      }
      const response = await axios.post(`${API}${path}`, payload, { withCredentials: true, signal });
      if (response.data?.status !== true) throw new Error(response.data?.message || 'The change could not be verified.');
      if (signal.aborted) return;
      pendingRequest.current = null;
      setSuccess(response.data.message || 'Trip updated.');
      setTrip(null);
      await refresh(signal);
      if (signal.aborted) return;
      if (file) { setPodFile(null); if (fileInput.current) fileInput.current.value = ''; }
    } catch (failure) {
      if (signal.aborted) return;
      setError(errorMessage(failure));
      if ([401, 403, 404].includes(failure.response?.status)) setTrip(null);
      if (failure.response) pendingRequest.current = null;
      if (failure.response?.status === 409) {
        setTrip(null);
        try { await refresh(signal); } catch (refreshFailure) { if (!signal.aborted) setError(errorMessage(refreshFailure)); }
      }
    } finally {
      if (!signal.aborted) { gate.current = false; setBusy(false); }
    }
  };

  const choosePod = event => {
    const file = event.target.files?.[0];
    const valid = !file || (['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type) && file.size > 0 && file.size <= 5 * 1024 * 1024);
    setPodError(valid ? '' : 'Choose a JPEG, PNG, GIF, or PDF up to 5 MB.');
    setPodFile(valid ? file || null : null);
  };
  const active = trip?.trip_status === 'ACTIVE';
  const completed = trip?.trip_status === 'COMPLETED';
  const accepted = trip && (!trip.assignment_id || trip.dispatch_status === 'ACCEPTED');
  const unfinishedStops = trip?.stops.some(stop => stop.execution_status !== 'COMPLETED');
  const inspectionType = completed ? 'POST_TRIP' : 'PRE_TRIP';

<<<<<<< Updated upstream
  const statusCfg = STATUS_CONFIG[trip?.trip_status?.toUpperCase()] || STATUS_CONFIG.ACTIVE;
  const isTerminal = ['COMPLETED', 'CANCELLED'].includes(trip?.trip_status?.toUpperCase());

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>Trip Status <small>Update</small></h1>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">

            {/* Trip info card */}
            {trip && (
              <div className="box box-primary">
                <div className="box-header with-border">
                  <h3 className="box-title">Trip: {trip.tmsTripId}</h3>
                  <div className="box-tools">
                    <span
                      style={{
                        ...styles.badge,
                        background: statusCfg.color,
                      }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>
                </div>
                <div className="box-body">
                  <table className="table table-condensed">
                    <tbody>
                      <tr>
                        <th style={{ width: 140 }}>Pickup</th>
                        <td>{trip.pickup_address || '—'}</td>
                      </tr>
                      <tr>
                        <th>Delivery</th>
                        <td>{trip.delivery_address || '—'}</td>
                      </tr>
                      <tr>
                        <th>Truck</th>
                        <td>{trip.truck_id || '—'}</td>
                      </tr>
                      <tr>
                        <th>GPS</th>
                        <td>
                          {location.lat
                            ? `${location.lat}, ${location.lon}`
                            : <span style={{ color: '#999' }}>Not available</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alerts */}
            {error   && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* POD section for COMPLETED action */}
            {!isTerminal && trip && (
              <div className="box box-default">
                <div className="box-header"><h3 className="box-title">Location Label (optional)</h3></div>
                <div className="box-body">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Warehouse Bay 3"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* POD upload — only show when trip is IN_PROGRESS (about to complete) */}
            {trip?.trip_status?.toUpperCase() === 'IN_PROGRESS' && (
              <div className="box box-warning">
                <div className="box-header">
                  <h3 className="box-title">Proof of Delivery (required to Complete)</h3>
                </div>
                <div className="box-body">
                  <div className="form-group">
                    <label>Upload POD Image / PDF</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/png,image/gif,application/pdf"
                      onChange={handlePodFileChange}
                      id="pod_image_input"
                    />
                    {podError && <span className="text-danger small">{podError}</span>}
                  </div>
                  <div className="form-group">
                    <label>POD Note</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="Delivery notes…"
                      value={podNote}
                      onChange={(e) => setPodNote(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="box box-solid">
              <div className="box-body">
                {isTerminal ? (
                  <div className="text-center" style={{ padding: '20px 0' }}>
                    <p style={{ fontSize: 16, color: statusCfg.color }}>
                      This trip is <strong>{statusCfg.label}</strong>.
                    </p>
                    <button
                      className="btn btn-default"
                      onClick={() => navigate('/drivertrip')}
                    >
                      ← Back to My Trips
                    </button>
                  </div>
                ) : (
                  <div style={styles.buttonRow}>
                    {statusCfg.next.map((action) => (
                      <button
                        key={action.value}
                        className={`btn btn-lg ${action.value === 'COMPLETED' ? 'btn-success' : action.value === 'PAUSED' ? 'btn-warning' : 'btn-primary'}`}
                        disabled={submitting || (action.value === 'COMPLETED' && podFile && podError !== '')}
                        onClick={() => handleStatusUpdate(action.value)}
                        id={`status-btn-${action.value.toLowerCase()}`}
                      >
                        {submitting ? <span className="fa fa-spinner fa-spin" /> : action.label}
                      </button>
                    ))}
                    <button
                      className="btn btn-default btn-lg"
                      onClick={() => navigate('/drivertrip')}
                      disabled={submitting}
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
=======
  return <main className="content-wrapper iso-ui dcc trip-execution" data-iso-theme="light">
    <header className="dcc-header">
      <div><h1>Trip execution</h1><p>{tripId}</p></div>
      <div className="trip-execution-actions"><Link className="iso-button iso-button--secondary" to="/drivertrip">My trips</Link>
        <Button variant="secondary" disabled={loading || busy} onClick={() => setRevision(value => value + 1)}>Refresh trip</Button></div>
    </header>
    {error && <Alert tone="danger" title="Trip action failed">{error}</Alert>}
    {success && <p role="status">{success}</p>}
    {loading && <p role="status">Loading trip...</p>}
    {trip && <>
      <section className="dcc-dispatch" aria-label="Trip details">
        <h2>{STATUS_LABELS[trip.trip_status]}</h2>
        <dl className="dcc-profile-facts">{[['Pickup', trip.pickup_address], ['Delivery', trip.delivery_address], ['Truck', trip.truck_id], ['Dispatch', trip.dispatch_status || 'Direct assignment']].map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value || 'Unavailable'}</dd></div>)}</dl>
        {!accepted && <p>Accept this dispatch from My trips before recording execution.</p>}
        <div className="trip-execution-actions">
          {active && <Button disabled={busy || !accepted || !trip.pretrip_passed} onClick={() => mutate('status', { status: 'IN_PROGRESS' })}>Start trip</Button>}
          {active && !trip.pretrip_passed && <p>Save a passed pre-trip inspection to enable start.</p>}
          {trip.trip_status === 'IN_PROGRESS' && <Button variant="secondary" disabled={busy} onClick={() => mutate('status', { status: 'PAUSED' })}>Pause trip</Button>}
          {trip.trip_status === 'PAUSED' && <Button disabled={busy || !accepted} onClick={() => mutate('status', { status: 'IN_PROGRESS' })}>Resume trip</Button>}
>>>>>>> Stashed changes
        </div>
      </section>
      {(active || completed) && accepted && <section className="dcc-dispatch" aria-label="Inspection">
        <h2>{completed ? 'Post-trip inspection' : 'Pre-trip inspection'}</h2>
        <form onSubmit={event => { event.preventDefault(); mutate('inspection', { inspection_type: inspectionType, result, defects, notes }); }}>
          <fieldset disabled={busy}>
            <label htmlFor="inspection-result">Inspection result</label>
            <select id="inspection-result" value={result} onChange={event => setResult(event.target.value)}><option value="PASS">Pass</option><option value="FAIL">Fail</option></select>
            <label htmlFor="inspection-defects">Defects found{result === 'FAIL' ? ' (required)' : ''}</label>
            <textarea id="inspection-defects" value={defects} maxLength={4000} required={result === 'FAIL'} onChange={event => setDefects(event.target.value)} />
            <label htmlFor="inspection-notes">Inspection notes</label>
            <textarea id="inspection-notes" value={notes} maxLength={500} onChange={event => setNotes(event.target.value)} />
            <Button type="submit" disabled={busy}>Save {completed ? 'post-trip' : 'pre-trip'} inspection</Button>
          </fieldset>
        </form>
      </section>}
      <section className="dcc-dispatch" aria-label="Stops">
        <h2>Stops</h2>
        {!trip.stops.length && <p>No stops are recorded for this trip.</p>}
        <ol className="trip-execution-stops">{trip.stops.map((stop, index) => {
          const eligible = trip.trip_status === 'IN_PROGRESS' && trip.stops.slice(0, index).every(prior => prior.execution_status === 'COMPLETED');
          return <li key={stop.id}><h3>{stop.stoptype || 'Stop'} · {stop.location || stop.address1 || 'Location unavailable'}</h3>
            <p>{stop.execution_status}{stop.arrived_at ? ` · Arrived ${stop.arrived_at}` : ''}{stop.completed_at ? ` · Completed ${stop.completed_at}` : ''}</p>
            {stop.execution_status !== 'COMPLETED' && <Button variant="secondary" disabled={busy || !eligible} onClick={() => mutate('stop', { stop_id: stop.id, status: stop.execution_status === 'PENDING' ? 'ARRIVED' : 'COMPLETED' })}>{stop.execution_status === 'PENDING' ? 'Record arrival' : 'Complete stop'}</Button>}
          </li>;
        })}</ol>
      </section>
      {trip.trip_status === 'IN_PROGRESS' && <section className="dcc-dispatch" aria-label="Proof of delivery">
        <h2>Proof of delivery</h2>
        <form onSubmit={event => { event.preventDefault(); if (podFile && !podError && !unfinishedStops) mutate('status', { status: 'COMPLETED', pod_note: podNote }, podFile); }}>
          <fieldset disabled={busy}>
            <label htmlFor="execution-pod">POD file (required, up to 5 MB)</label>
            <input ref={fileInput} id="execution-pod" type="file" accept="image/jpeg,image/png,image/gif,application/pdf" onChange={choosePod} required />
            {podError && <p role="alert">{podError}</p>}
            <label htmlFor="execution-pod-note">Delivery note</label>
            <textarea id="execution-pod-note" value={podNote} maxLength={255} onChange={event => setPodNote(event.target.value)} />
            {unfinishedStops && <p>Complete all recorded stops before completing the trip.</p>}
            <Button type="submit" disabled={busy || !podFile || !!podError || unfinishedStops}>Complete trip</Button>
          </fieldset>
        </form>
      </section>}
      <section className="dcc-dispatch" aria-label="Saved inspections">
        <h2>Saved inspections</h2>
        {!trip.inspections.length && <p>No inspections recorded.</p>}
        <ul>{trip.inspections.map(inspection => <li key={inspection.id}>{inspection.inspection_type === 'PRE_TRIP' ? 'Pre-trip' : 'Post-trip'} · {inspection.result} · {inspection.completed_at}{inspection.defects && <p>{inspection.defects}</p>}{inspection.notes && <p>{inspection.notes}</p>}</li>)}</ul>
      </section>
      <section className="dcc-dispatch" aria-label="Trip documents">
        <h2>Documents</h2>
        {!trip.documents.length && <p>No documents recorded.</p>}
        <ul>{trip.documents.map(document => <li key={document.id}><a href={`${API}document/${document.id}`} target="_blank" rel="noreferrer">{document.imagetype} · {document.remarks || 'View document'}</a></li>)}</ul>
      </section>
      <section className="dcc-dispatch" aria-label="Trip history">
        <h2>Trip history</h2>
        {!trip.history.length && <p>No events recorded.</p>}
        <ol className="dcc-dispatch-history">{trip.history.map(event => <li key={event.id}>{event.note || STATUS_LABELS[event.new_status] || event.new_status}<time>{event.created_at}</time></li>)}</ol>
      </section>
    </>}
  </main>;
}

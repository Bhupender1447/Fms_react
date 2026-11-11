import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Select } from '../../design-system/components';
import { driverName } from './driverCommandData';
import { dispatchError, dispatchRequest } from './dispatchApi';

export default function DispatchWorkspace({ accountId, drivers }) {
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const gate = useRef(false);
  const request = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    dispatchRequest('trips', { accountId, signal: controller.signal }).then(data => {
      if (!Array.isArray(data.trips)) throw new Error('Invalid trip list.');
      if (!controller.signal.aborted) setTrips(data.trips);
    }).catch(err => { if (!controller.signal.aborted) setError(dispatchError(err)); });
    return () => controller.abort();
  }, [accountId, revision]);
  useEffect(() => {
    const controller = new AbortController(); request.current = controller;
    setDetail(null); setError('');
    let refreshing = false;
    const refresh = async () => {
      if (!tripId || gate.current || refreshing) return;
      refreshing = true;
      try {
        const data = await dispatchRequest(`status/${encodeURIComponent(tripId)}`, { accountId, signal: controller.signal });
        if (!controller.signal.aborted) { setDetail(data); setError(''); }
      } catch (err) { if (!controller.signal.aborted) { setDetail(null); setError(dispatchError(err)); } }
      finally { refreshing = false; }
    };
    refresh(); const timer = setInterval(refresh, 15000);
    return () => { controller.abort(); clearInterval(timer); };
  }, [tripId, accountId, revision]);
  const act = async action => {
    if (gate.current || !detail) return;
    const assignment = detail.assignment;
    if (action === 'assign' && assignment && !window.confirm('Reassign this trip? The previous driver will no longer be able to accept it.')) return;
    gate.current = true; setBusy(true); setError('');
    try {
      await dispatchRequest(action, { accountId, signal: request.current.signal, body: action === 'assign' ? {
        tms_trip_id: tripId, driver_record_id: Number(driverId), expected_assignment_id: Number(assignment?.id || 0), confirm_reassignment: Boolean(assignment),
      } : { tms_trip_id: tripId, assignment_id: Number(assignment.id) } });
      setRevision(value => value + 1);
    } catch (err) { if (!request.current.signal.aborted) { setError(dispatchError(err)); setDetail(null); setRevision(value => value + 1); } }
    finally { gate.current = false; setBusy(false); }
  };
  return <section className="dcc-dispatch" aria-label="Dispatch workspace">
    <h2>Dispatch workspace</h2><p>Choose an account trip and a driver with a verified login. Acceptance does not start a trip. Status refreshes every 15 seconds.</p>
    {error && <Alert tone="danger" title="Dispatch action unavailable">{error}</Alert>}
    <div className="dcc-edit-fields">
      <Select label="Dispatch trip" value={tripId} disabled={busy} onChange={event => setTripId(event.target.value)}><option value="">Select a trip</option>{trips.map(trip => <option key={trip.tmsTriptId} value={trip.tmsTriptId}>{trip.customer_orderno || trip.tmsTriptId} / {trip.status}</option>)}</Select>
      <Select label="Assign driver" value={driverId} disabled={busy} onChange={event => setDriverId(event.target.value)}><option value="">Select a driver</option>{drivers.map(driver => <option key={driver.id} value={driver.id} disabled={!driver.login_user_id}>{driverName(driver)}{!driver.login_user_id ? ' (login not linked)' : ''}</option>)}</Select>
    </div>
    <div className="dcc-profile-actions">
      <Button disabled={busy || !detail || detail.trip.status !== 'ACTIVE' || !driverId} onClick={() => act('assign')}>{detail?.assignment ? 'Reassign Driver' : 'Assign Driver'}</Button>
      <Button variant="secondary" disabled={busy || detail?.assignment?.dispatch_status !== 'ASSIGNED'} onClick={() => act('send')}>Send Dispatch</Button>
      <Button variant="secondary" disabled={busy || !tripId} onClick={() => setRevision(value => value + 1)}>Refresh Dispatch</Button>
    </div>
    {detail && <><p role="status">Acceptance status: <strong>{detail.assignment?.dispatch_status || 'Not assigned'}</strong> / Trip: {detail.trip.status}</p>
      {detail.assignment?.reject_reason && <p>Rejection reason: {detail.assignment.reject_reason}</p>}
      <h3>Dispatch history</h3>{detail.history?.length ? <ol className="dcc-dispatch-history">{detail.history.map(event => <li key={event.id}><strong>{event.new_status}</strong> <time>{event.created_at}</time><p>{event.note}</p></li>)}</ol> : <p>No dispatch events recorded.</p>}</>}
  </section>;
}

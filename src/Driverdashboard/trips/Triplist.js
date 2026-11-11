import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Input } from '../../design-system/components';
import { dispatchError, dispatchRequest } from '../../admindashboard/drivers/dispatchApi';
import '../../admindashboard/drivers/driver-command-center.css';

export default function TripDriverlist() {
  const [assignments, setAssignments] = useState([]);
  const [selected, setSelected] = useState('');
  const [reasons, setReasons] = useState({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const gate = useRef(false);
  const controller = useRef(null);
  useEffect(() => {
    const abort = new AbortController(); controller.current = abort;
    setLoading(true); setAssignments([]);
    dispatchRequest('inbox', { signal: abort.signal }).then(data => {
      if (!Array.isArray(data.assignments)) throw new Error('Invalid assigned trips response.');
      if (!abort.signal.aborted) { setAssignments(data.assignments); setError(''); }
    }).catch(err => { if (!abort.signal.aborted) setError(dispatchError(err)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [revision]);
  const respond = async (assignment, action) => {
    const reason = (reasons[assignment.assignment_id] || '').trim();
    if (gate.current) return;
    if (action === 'reject' && !reason) { setError('Enter a rejection reason.'); return; }
    gate.current = true; setBusy(true); setError('');
    try {
      await dispatchRequest('respond', { signal: controller.current.signal, body: { tms_trip_id: assignment.tms_trip_id, assignment_id: assignment.assignment_id, action, reason } });
      setRevision(value => value + 1);
    } catch (err) { if (!controller.current.signal.aborted) { setError(dispatchError(err)); setAssignments([]); } }
    finally { gate.current = false; setBusy(false); }
  };
  return <main className="content-wrapper iso-ui dcc" data-iso-theme="light">
    <header className="dcc-header"><div><p className="dcc-eyebrow">Driver workspace</p><h1>Assigned trips</h1><p>Review your dispatch before accepting. Starting a trip is a separate action.</p></div><Button variant="secondary" disabled={busy || loading} onClick={() => setRevision(value => value + 1)}>Refresh Trips</Button></header>
    {error && <Alert tone="danger" title="Dispatch action failed">{error}</Alert>}
    {loading ? <p role="status">Loading assigned trips...</p> : !assignments.length ? <p>No sent dispatches are available for your login. Refresh to check for updates.</p> : assignments.map(assignment => {
      const trip = assignment.trip;
      const open = selected === String(assignment.assignment_id);
      return <section className="dcc-dispatch" key={assignment.assignment_id} aria-label={`Dispatch ${trip.customer_orderno || assignment.tms_trip_id}`}>
        <h2>{trip.customer_orderno || assignment.tms_trip_id}</h2><p>Dispatch: <strong>{assignment.dispatch_status}</strong> / Trip: {trip.status}</p>
        <Button variant="secondary" disabled={busy} onClick={() => setSelected(open ? '' : String(assignment.assignment_id))}>{open ? 'Close dispatch' : 'Review dispatch'}</Button>
        {open && <><dl className="dcc-profile-facts">{[
          ['Pickup', trip.pickup_address], ['Delivery', trip.delivery_address], ['Pickup date / time', [trip.pickup_date, trip.pickuptime].filter(Boolean).join(' ')], ['Delivery date / time', [trip.deliver_date, trip.deliverytime].filter(Boolean).join(' ')],
          ['Truck', trip.truckunitnumber || trip.truck_id], ['Trailer', trip.trailor_id], ['Equipment', trip.trailortype], ['Instructions', [trip.remarks, trip.msg, trip.shipment_desc].filter(Boolean).join(' / ')],
        ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Unavailable'}</dd></div>)}</dl>
        {assignment.reject_reason && <p>Rejection reason: {assignment.reject_reason}</p>}
        {assignment.dispatch_status === 'SENT' && <><Input label="Rejection reason" value={reasons[assignment.assignment_id] || ''} maxLength={500} disabled={busy} onChange={event => setReasons(current => ({ ...current, [assignment.assignment_id]: event.target.value }))} />
          <div className="dcc-profile-actions"><Button disabled={busy} onClick={() => respond(assignment, 'accept')}>Accept Dispatch</Button><Button variant="secondary" disabled={busy} onClick={() => respond(assignment, 'reject')}>Reject Dispatch</Button></div></>}
        {assignment.dispatch_status === 'ACCEPTED' && ['ACTIVE','IN_PROGRESS','PAUSED'].includes(trip.status) && <Link className="iso-button" to={`/tripstatus/${encodeURIComponent(assignment.tms_trip_id)}`}>{trip.status === 'ACTIVE' ? 'Start accepted trip' : 'Open trip controls'}</Link>}
        </>}
      </section>;
    })}
  </main>;
}

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';

// Status display config
const STATUS_CONFIG = {
  ACTIVE:      { label: 'Not Started',  color: '#6c757d', next: [{ value: 'IN_PROGRESS', label: '▶ Start Trip' }] },
  IN_PROGRESS: { label: 'In Progress',  color: '#28a745', next: [{ value: 'PAUSED', label: '⏸ Pause' }, { value: 'COMPLETED', label: '✅ Complete' }] },
  PAUSED:      { label: 'Paused',       color: '#ffc107', next: [{ value: 'IN_PROGRESS', label: '▶ Resume' }] },
  COMPLETED:   { label: 'Completed',    color: '#007bff', next: [] },
  CANCELLED:   { label: 'Cancelled',    color: '#dc3545', next: [] },
};

function TripStatusForm() {
  const { tripId } = useParams();
  const navigate   = useNavigate();

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
    }
  }, [tripId]);

  useEffect(() => { fetchTripStatus(); }, [fetchTripStatus]);

  const validatePod = (file) => {
    if (!file) return '';
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) return 'Only JPEG, PNG, GIF, or PDF files are accepted.';
    if (file.size > 5 * 1024 * 1024) return 'File must be smaller than 5 MB.';
    return '';
  };

  const handlePodFileChange = (e) => {
    const file = e.target.files[0];
    const err  = validatePod(file);
    setPodError(err);
    setPodFile(err ? null : file);
  };

  const handleStatusUpdate = async (newStatus) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    const currentStatus = trip?.trip_status?.toUpperCase();

    // Client-side transition guard
    const validTransitions = {
      ACTIVE:      ['IN_PROGRESS'],
      IN_PROGRESS: ['PAUSED', 'COMPLETED'],
      PAUSED:      ['IN_PROGRESS'],
    };
    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      setError(`Cannot transition from ${currentStatus} to ${newStatus}.`);
      setSubmitting(false);
      return;
    }

    try {
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
      }

      if (res.data.status) {
        setSuccess(`✅ Trip status updated to ${newStatus}` + (res.data.pod_uploaded ? ' · POD uploaded.' : '.'));
        setTrip(prev => ({ ...prev, trip_status: newStatus }));
        if (newStatus === 'COMPLETED') {
          setTimeout(() => navigate('/drivertrip'), 2500);
        }
      } else {
        setError(res.data.message || 'Update failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Network error';
      setError('❌ ' + msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="content-wrapper">
        <div style={styles.center}>
          <div className="spinner-border text-primary" role="status" />
          <p style={{ marginTop: 12, color: '#666' }}>Loading trip…</p>
        </div>
      </div>
    );
  }

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
        </div>
      </section>
    </div>
  );
}

const styles = {
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    padding: 40,
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: 12,
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
  },
  buttonRow: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    padding: '8px 0',
  },
};

export default TripStatusForm;

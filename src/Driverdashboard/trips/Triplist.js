import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../../config'

const TripDriverlist = () => {
  const [list, setList] = useState([])

  useEffect(() => {
<<<<<<< Updated upstream
    let { id } = JSON.parse(localStorage.getItem('logindetail'))
    axios.get(`${BASE_URL}api/tipsdriverfetchProductData/${id}`)
      .then(res => setList(res.data))
      .catch(err => console.log(err))
  }, [])
  console.log(list)
  return (
    <div className='content-wrapper'>
      <section className="content-header">
        <h1>
          Manage
          <small>Trips</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Orders</li>
        </ol>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <br /> <br />
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Manage trips</h3>
              </div>
              <div className="box-body">
                <div id="manageTable_wrapper" className="dataTables_wrapper form-inline dt-bootstrap no-footer">
                  <div className="row">
                    <div className="col-sm-6">
                      <div className="dataTables_length" id="manageTable_length">
                        <label>
                          Show{" "}
                          <select
                            name="manageTable_length"
                            aria-controls="manageTable"
                            className="form-control input-sm"
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>{" "}
                          entries
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div id="manageTable_filter" className="dataTables_filter">
                        <label>
                          Search:
                          <input
                            type="search"
                            className="form-control input-sm"
                            placeholder=""
                            aria-controls="manageTable"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <table
                        id="manageTable"
                        className="table table-bordered table-striped dataTable no-footer"
                        role="grid"
                        aria-describedby="manageTable_info"
                        style={{ width: 1241 }}
                      >
                        <thead>
                          <tr role="row">
                            <th style={{ width: "62.2px" }}>Invoice #</th>
                            <th style={{ width: "79.2px" }}>Company</th>
                            <th style={{ width: "397.2px" }}>Pickup</th>
                            <th style={{ width: "331.2px" }}>Delivery</th>
                            <th style={{ width: 178 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {list && list.map((item, index) => (
                            <tr role="row" key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                              <td>{item.customer_orderno}</td>
                              <td>{item.company}</td>
                              <td>{item.pickup_address}</td>
                              <td>{item.delivery_address}</td>
                              <td>
                                {/* Trip status badge */}
                                {item.status && (
                                  <span className="badge-status" style={{
                                    marginBottom: 4,
                                    background:
                                      item.status === 'COMPLETED'   ? '#ecfdf5' :
                                      item.status === 'IN_PROGRESS' ? '#eff6ff' :
                                      item.status === 'PAUSED'      ? '#fffbeb' :
                                      item.status === 'CANCELLED'   ? '#fef2f2' : '#f1f5f9',
                                    color:
                                      item.status === 'COMPLETED'   ? '#065f46' :
                                      item.status === 'IN_PROGRESS' ? '#1e40af' :
                                      item.status === 'PAUSED'      ? '#92400e' :
                                      item.status === 'CANCELLED'   ? '#991b1b' : '#475569',
                                    border: `1px solid ${
                                      item.status === 'COMPLETED'   ? '#a7f3d0' :
                                      item.status === 'IN_PROGRESS' ? '#bfdbfe' :
                                      item.status === 'PAUSED'      ? '#fde68a' :
                                      item.status === 'CANCELLED'   ? '#fecaca' : '#cbd5e1'
                                    }`,
                                  }}>
                                    <span style={{
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      backgroundColor:
                                        item.status === 'COMPLETED'   ? '#10b981' :
                                        item.status === 'IN_PROGRESS' ? '#3b82f6' :
                                        item.status === 'PAUSED'      ? '#f59e0b' :
                                        item.status === 'CANCELLED'   ? '#ef4444' : '#64748b'
                                    }} />
                                    {item.status}
                                  </span>
                                )}

                                <Link
                                  target="_blank"
                                  to={`${BASE_URL}pdf/invoice_log.php?id=${item.id}`}
                                  className="btn btn-danger btn-xs"
                                >
                                  Dispatch
                                </Link>
                                <Link
                                  target="_blank"
                                  to={`${BASE_URL}pdf/invoice_orders.php?id=${item.id}`}
                                  className="btn btn-warning btn-xs"
                                >
                                  Invoice
                                </Link>

                                {/* Update Status — only for non-terminal trips */}
                                {item.status !== 'COMPLETED' && item.status !== 'CANCELLED' && item.tmsTriptId && (
                                  <Link
                                    to={`/tripstatus/${item.tmsTriptId}`}
                                    className="btn btn-success btn-xs"
                                  >
                                    <i className="fa fa-refresh" /> Update Status
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5">
                      <div className="dataTables_info" id="manageTable_info" role="status" aria-live="polite">
                        {/* Showing 1 to 10 of {list.length} entries */}
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <div className="dataTables_paginate paging_simple_numbers" id="manageTable_paginate">
                        <ul className="pagination">
                          <li className="paginate_button previous disabled" id="manageTable_previous">
                            <Link to="#" aria-controls="manageTable" data-dt-idx={0} tabIndex={0}>Previous</Link>
                          </li>
                          {/* Pagination buttons */}
                          <li className="paginate_button next" id="manageTable_next">
                            <Link to="#" aria-controls="manageTable" data-dt-idx={8} tabIndex={0}>Next</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /.box-body */}
            </div>
            {/* /.box */}
          </div>
          {/* col-md-12 */}
        </div>
        {/* /.row */}
      </section>
    </div>
  )
=======
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
        {assignment.dispatch_status === 'ACCEPTED' && trip.status === 'COMPLETED' && <Link className="iso-button" to={`/tripstatus/${encodeURIComponent(assignment.tms_trip_id)}`}>Review completed trip</Link>}
        </>}
      </section>;
    })}
  </main>;
>>>>>>> Stashed changes
}

export default TripDriverlist

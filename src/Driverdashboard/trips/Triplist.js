import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { dispatchError, dispatchRequest } from '../../admindashboard/drivers/dispatchApi';
import './trip-workflow.css';

const views = [ ['all','All'], ['pending','Pending dispatch'], ['accepted','Accepted trips'], ['progress','In progress'], ['completed','Completed'], ['rejected','Rejected'] ];
function category(assignment) {
  if (assignment.trip.status === 'COMPLETED') return 'completed';
  if (['IN_PROGRESS','PAUSED'].includes(assignment.trip.status)) return 'progress';
  return { SENT:'pending', ACCEPTED:'accepted', REJECTED:'rejected' }[assignment.dispatch_status] || 'all';
}
export default function TripDriverlist({ embedded = false }) {
  const [parameters] = useSearchParams();
  const initial = parameters.get('view');
  const [view,setView] = useState(views.some(([key])=>key===initial)?initial:'all');
  const [assignments,setAssignments] = useState([]);
  const [selected,setSelected] = useState('');
  const [reasons,setReasons] = useState({});
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [busy,setBusy] = useState(false);
  const [loading,setLoading] = useState(true);
  const [revision,setRevision] = useState(0);
  const gate=useRef(false);
  const controller=useRef(null);
  useEffect(()=>{
    const abort=new AbortController();controller.current=abort;
    let refreshing=false;
    const refresh=async()=>{
      if(gate.current||refreshing)return;
      refreshing=true;
      try {
        const data=await dispatchRequest('inbox',{signal:abort.signal});
        if(!Array.isArray(data.assignments))throw new Error('Invalid assigned trips response.');
        if(!abort.signal.aborted){setAssignments(data.assignments);setError('');}
      }catch(failure){if(!abort.signal.aborted){setAssignments([]);setError(dispatchError(failure));}}
      finally{refreshing=false;if(!abort.signal.aborted)setLoading(false);}
    };
    refresh();const timer=window.setInterval(refresh,15000);
    return()=>{abort.abort();window.clearInterval(timer);};
  },[revision]);
  async function respond(assignment,action){
    const reason=(reasons[assignment.assignment_id]||'').trim();
    if(gate.current)return;
    if(action==='reject'&&!reason){setError('Enter a rejection reason.');return;}
    gate.current=true;setBusy(true);setError('');
    try{
      await dispatchRequest('respond',{signal:controller.current.signal,body:{tms_trip_id:assignment.tms_trip_id,assignment_id:assignment.assignment_id,action,reason}});
      setNotice(action==='accept'?'Dispatch accepted. Your trip is now in Accepted trips.':'Dispatch rejected. Your company can review the reason.');
      setView(action==='accept'?'accepted':'rejected');setRevision(value=>value+1);
    }catch(failure){if(!controller.current.signal.aborted){setError(dispatchError(failure));setAssignments([]);}}
    finally{gate.current=false;setBusy(false);}
  }
  const Container=embedded?'section':'main';
  const visible=assignments.filter(assignment=>view==='all'||category(assignment)===view);
  return <Container id={embedded?undefined:'driver-main'} className={embedded?'driver-dispatch-board':'content-wrapper driver-dashboard'}><div className="trip-workflow">
    <header className="workflow-top"><div><p>Connected to your company's dispatch</p><h1>{embedded?'Your dispatch board':'Assigned trips'}</h1><p>Acceptance confirms the assignment. Pre-trip preparation and driving status are separate steps.</p></div><button className="driver-button driver-button-light" disabled={busy} onClick={()=>setRevision(value=>value+1)}>Refresh Trips</button></header>
    {error&&<div className="workflow-alert is-error" role="alert">{error}</div>}{notice&&<div className="workflow-alert" role="status">{notice}</div>}
    <nav className="workflow-tabs" aria-label="Trip workflow stages">{views.map(([key,label])=><button key={key} aria-pressed={view===key} onClick={()=>setView(key)}>{label}<strong>{key==='all'?assignments.length:assignments.filter(assignment=>category(assignment)===key).length}</strong></button>)}</nav>
    {loading?<p role="status">Loading assigned trips…</p>:!visible.length?<div className="workflow-card"><h2>No trips in this stage</h2><p>New dispatches and company updates appear here automatically. Refresh to check again.</p></div>:visible.map(assignment=>{
      const trip=assignment.trip;
      const open=selected===String(assignment.assignment_id);
      return <section className="workflow-card" key={assignment.assignment_id} aria-label={`Dispatch ${trip.customer_orderno||assignment.tms_trip_id}`}><div className="workflow-top"><div><p>{category(assignment)==='accepted'?'Accepted trip':displayStatus(assignment.dispatch_status)}</p><h2>{trip.customer_orderno||assignment.tms_trip_id}</h2></div><span className="driver-state">{displayStatus(trip.status)}</span></div>
        <dl className="workflow-facts">{[['Pickup',trip.pickup_address],['Delivery',trip.delivery_address],['Truck',trip.truckunitnumber||trip.truck_id],['Trailer',trip.trailor_id]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value||'Not assigned'}</dd></div>)}</dl>
        <div className="workflow-actions"><button className="driver-button driver-button-light" disabled={busy} onClick={()=>setSelected(open?'':String(assignment.assignment_id))}>{open?'Close dispatch':'Review dispatch'}</button>
          {assignment.dispatch_status==='ACCEPTED'&&['ACTIVE','IN_PROGRESS','PAUSED'].includes(trip.status)&&<Link className="driver-button driver-button-primary" to={`/tripstatus/${encodeURIComponent(assignment.tms_trip_id)}`}>{trip.status==='ACTIVE'?'Start Trip':'Open trip controls'}</Link>}
          {trip.status==='COMPLETED'&&<Link className="driver-button driver-button-light" to={`/tripstatus/${encodeURIComponent(assignment.tms_trip_id)}`}>Review completed trip</Link>}
          <Link className="driver-button driver-button-light" to="/driver/eld">ELD Logbook</Link>
        </div>
        {open&&<><dl className="workflow-facts">{[['Pickup date / time',[trip.pickup_date,trip.pickuptime].filter(Boolean).join(' ')],['Delivery date / time',[trip.deliver_date,trip.deliverytime].filter(Boolean).join(' ')],['Equipment',trip.trailortype],['Instructions',[trip.remarks,trip.msg,trip.shipment_desc].filter(Boolean).join(' / ')]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value||'Unavailable'}</dd></div>)}</dl>
          {assignment.reject_reason&&<p>Rejection reason: {assignment.reject_reason}</p>}
          {assignment.dispatch_status==='SENT'&&<><label>Rejection reason<input maxLength={500} value={reasons[assignment.assignment_id]||''} disabled={busy} onChange={event=>setReasons({...reasons,[assignment.assignment_id]:event.target.value})}/></label><div className="workflow-actions"><button className="driver-button driver-button-primary" disabled={busy} onClick={()=>respond(assignment,'accept')}>Accept Dispatch</button><button className="driver-button driver-button-light" disabled={busy} onClick={()=>respond(assignment,'reject')}>Reject Dispatch</button></div></>}
        </>}
      </section>;
    })}
  </div></Container>;
}
function displayStatus(value){return String(value||'Unavailable').replaceAll('_',' ');}
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config';
import './trip-workflow.css';
import { truckNavigationPath } from './truckRouteGeometry';
import TruckRoutingProfile from './TruckRoutingProfile';

const labels = { brakes:'Brakes', steering:'Steering', tires:'Tires', wheels:'Wheels', lights:'Lights', reflectors:'Reflectors', mirrors:'Mirrors', wipers:'Windshield wipers', horn:'Horn', coupling:'Coupling devices', emergency_equipment:'Emergency equipment', cargo_securement:'Cargo securement', trailer_equipment:'Trailer equipment' };
const display = value => String(value || 'Not recorded').replaceAll('_',' ');

export default function TripWorkflowPanel(props) {
  return <TripWorkflowContent key={String(props.tripId) + ':' + Boolean(props.staff)} {...props} />;
}

function TripWorkflowContent({ tripId, staff = false }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [confirmation, setConfirmation] = useState({ odometer:'', location_label:'', eld_provider:'', acknowledged_by:'', duty_acknowledged:false });
  const [checklist, setChecklist] = useState({});
  const [signed, setSigned] = useState(false);
  const [equipmentReason, setEquipmentReason] = useState('');
  const [review, setReview] = useState({ review_note:'', truck_id:'', trailer_id:'', equipment_authorized:false });
  const [repairNote, setRepairNote] = useState('');
  const [repairConfirmed, setRepairConfirmed] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentType, setDocumentType] = useState('PICKUP_DOCS');
  const [documentNotes, setDocumentNotes] = useState({});
  const gate = useRef(false);
  const generation = useRef(0);
  const receipt = useRef(null);
  const assignmentKey = useRef('');
  const [editingConfirmation, setEditingConfirmation] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let loading = false;
    const refresh = async () => {
      if (gate.current || loading) return;
      loading = true;
      const version = generation.current;
      try {
        const response = await axios.get(`${BASE_URL}api/maps/trip/status/${encodeURIComponent(tripId)}`, { withCredentials:true, signal:controller.signal });
        if (response.data.status !== true || !response.data.workflow) throw new Error(response.data.message || 'Trip workflow is unavailable.');
        if (!controller.signal.aborted && version === generation.current) {
          const key = [tripId,response.data.assignment_id,response.data.truck_id,response.data.trailer_id].join(':');
          if (assignmentKey.current !== key) {
            assignmentKey.current=key; setChecklist({}); setSigned(false);setEditingConfirmation(false);
            setConfirmation({odometer:'',location_label:'',eld_provider:'',acknowledged_by:'',duty_acknowledged:false});
          }
          setData(response.data); setError('');
        }
      } catch (failure) {
        if (!controller.signal.aborted) { setData(null); setError(failure.response?.data?.message || failure.message); }
      } finally { loading = false; }
    };
    refresh();
    const timer = window.setInterval(refresh,15000);
    return () => { controller.abort(); window.clearInterval(timer); };
  }, [tripId,revision]);

  function requestKey(signature) {
    if (!receipt.current || receipt.current.signature !== signature) receipt.current = { signature, id:window.crypto.randomUUID() };
    return receipt.current.id;
  }
  async function mutate(action, fields = {}, navigationWindow = null) {
    if (gate.current) return;
    gate.current = true; generation.current++;
    setBusy(true); setActionError(''); setNotice('');
    const body = { tmsTripId:tripId, ...fields };
    body.request_id = requestKey(action + JSON.stringify(body));
    const routes = { inspection:'api/maps/trip/inspection', status:'api/maps/trip/status', stop:'api/maps/trip/stop' };
    try {
      const response = await axios.post(`${BASE_URL}${routes[action] || `api/driver/workflow/${action}`}`, body, { withCredentials:true });
      if (response.data.status !== true) throw new Error(response.data.message || 'The action could not be saved.');
      setNotice(response.data.message || 'Saved.'); receipt.current = null;
      if (action === 'prepare') setEditingConfirmation(false);
      if (action === 'status' && fields.status === 'IN_PROGRESS' && data?.trip_status === 'ACTIVE') {
        const url = new URL(truckNavigationPath(tripId), window.location.origin).href;
        if (navigationWindow && !navigationWindow.closed && url) {
          navigationWindow.location.replace(url);
        } else {
          navigationWindow?.close();
          setNotice('Trip started. Use Open truck navigation below to navigate to your pickup.');
        }
      }
      setRevision(value => value + 1);
    } catch (failure) {
      navigationWindow?.close();
      setActionError(failure.response?.data?.message || failure.message); setRevision(value => value + 1);
    } finally { gate.current = false; setBusy(false); }
  }
  function startAndNavigate() {
    if (gate.current) return;
    if (typeof data?.pickup_address !== 'string' || !data.pickup_address.trim()) {
      setActionError('Your pickup address is missing. Ask dispatch to update the trip before starting navigation.');
      return;
    }
    // Reserve the window during the click so mobile browsers do not block it
    // after the asynchronous start request. Never send it to Maps on failure.
    const navigationWindow = window.open('about:blank', '_blank');
    if (navigationWindow) navigationWindow.opener = null;
    mutate('status', { status:'IN_PROGRESS' }, navigationWindow);
  }

  async function upload(event) {
    event.preventDefault();
    if (!documentFile || gate.current) return;
    gate.current = true; generation.current++; setBusy(true); setError('');
    const form = new FormData();
    form.append('tmsTripId',tripId); form.append('doc_type',documentType); form.append('document',documentFile);
    form.append('request_id',requestKey(`upload:${tripId}:${documentType}:${documentFile.name}:${documentFile.size}:${documentFile.lastModified}`));
    try {
      const response = await axios.post(`${BASE_URL}api/maps/trip/document`,form,{withCredentials:true});
      if (response.data.status !== true) throw new Error(response.data.message || 'Upload failed');
      receipt.current = null; setDocumentFile(null); setNotice('Document saved. Dispatcher review is pending.');
    } catch (failure) { setError(failure.response?.data?.message || failure.message); }
    finally { gate.current=false;setBusy(false);setRevision(value=>value+1); }
  }

  const workflow = data?.workflow;
  const prepared = workflow?.preparation;
  const holds = workflow?.safety_holds || [];
  const accepted = data?.dispatch_status === 'ACCEPTED';
  const unstarted = data?.trip_status === 'ACTIVE';
  const reviewFor = id => workflow?.document_reviews?.find(item=>String(item.document_id)===String(id));
  const approvedPod = data?.documents?.find(document=>document.imagetype==='POD' && reviewFor(document.id)?.status==='APPROVED');
  const allStopsComplete = data?.stops?.every(stop=>stop.execution_status==='COMPLETED');
  const defects = Object.entries(checklist).filter(([,value])=>value!=='PASS');

  return <section className="trip-workflow" aria-label={staff ? 'Shared trip operations' : 'Driver trip operations'}>
    <div className="workflow-top"><div><p>{staff ? 'IFM · Shared operations' : 'Your trip workspace'}</p><h1>{data?.reference || tripId}</h1></div><button className="driver-button driver-button-light" disabled={busy} onClick={()=>setRevision(value=>value+1)}>Refresh workflow</button></div>
    {(error || actionError) && <div className="workflow-alert is-error" role="alert">{error || actionError}</div>}
    {notice && <div className="workflow-alert" role="status">{notice}</div>}
    {!data ? !error && <p role="status">Loading the shared trip record…</p> : <>
      <div className="workflow-status"><span>Dispatch <strong>{display(data.dispatch_status)}</strong></span><span>Trip <strong>{display(data.trip_status)}</strong></span><span>Account <strong>{data.account_id}</strong></span>{!staff && <Link to="/driver/eld">Daily ELD logbook ↗</Link>}</div>
      <ol className="workflow-steps">{['Accept dispatch','Confirm equipment','Pre-trip inspection','Pickup & delivery','Paperwork review','Billing & pay review'].map((step,index)=><li key={step} className={(index===0&&accepted)||(index===1&&prepared)||(index===2&&data.pretrip_passed)||(index===3&&data.trip_status==='COMPLETED')?'is-done':''}><span>{index+1}</span>{step}</li>)}</ol>
      <div className="workflow-two-columns"><section className="workflow-card"><h2>Assignment</h2><dl className="workflow-facts">{[['Pickup',data.pickup_address],['Delivery',data.delivery_address],['Truck',data.truckunitnumber||data.truck_id],['Trailer',data.trailer_id],['Equipment',data.equipment]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value||'Not assigned'}</dd></div>)}</dl></section>
        <section className="workflow-card"><h2>ELD & HOS</h2><p className="workflow-source-state">Provider data unverified</p><p>Trip progress and duty status are recorded separately. Confirm On Duty, Not Driving in your ELD provider before acknowledging pre-trip work here.</p><p>Driving, certification and HOS clocks depend on the compliant provider source.</p>{!staff && <Link to="/driver/eld">Open the daily logbook →</Link>}</section></div>
      {accepted && ['ACTIVE','IN_PROGRESS','PAUSED'].includes(data.trip_status) && <TruckRoutingProfile key={String(data.assignment_id)+':'+String(data.truck_id)+':'+String(data.trailer_id)+':'+String(workflow.routing_profile?.version||0)} profile={workflow.routing_profile} requireNorthAmerica={workflow.truck_routing?.providers?.ptv_truck===true} busy={busy} onSave={fields=>mutate('routing_profile_save',fields)}/>}
      {holds.length>0 && <section className="workflow-card workflow-safety" role="alert"><h2>Equipment held for a safety-critical defect</h2><p>Starting or resuming is blocked until company repair clearance is recorded and the driver passes a new inspection.</p>{staff && <><label>Repair and release note<textarea value={repairNote} onChange={event=>setRepairNote(event.target.value)} maxLength={1000}/></label><label className="workflow-checkbox"><input type="checkbox" checked={repairConfirmed} onChange={event=>setRepairConfirmed(event.target.checked)}/>I confirm the required repair and safe release.</label>{holds.map(hold=><button key={hold.id} className="driver-button driver-button-primary" disabled={busy||!repairNote.trim()||!repairConfirmed} onClick={()=>mutate('release_hold',{hold_id:hold.id,repair_note:repairNote,repair_confirmed:repairConfirmed})}>Record company clearance #{hold.id}</button>)}</>}</section>}
      {!staff && !accepted && unstarted && <div className="workflow-alert">Accept this dispatch from <Link to="/drivertrip">Assigned trips</Link> before preparing to start.</div>}
      {!staff && accepted && unstarted && (!prepared || editingConfirmation || prepared.truck_id !== String(data.truck_id) || prepared.trailer_id !== String(data.trailer_id)) && <section className="workflow-card"><h2>1. Confirm equipment & open pre-trip</h2><p>The assigned truck and trailer come from IFM. Equipment changes go to your company for approval.</p>
        <form className="workflow-form" onSubmit={event=>{event.preventDefault();mutate('prepare',confirmation);}}>
          <label>Odometer<input required type="number" min="0" step="0.1" value={confirmation.odometer} onChange={event=>setConfirmation({...confirmation,odometer:event.target.value})}/></label>
          <label>Current location<input required maxLength={255} value={confirmation.location_label} onChange={event=>setConfirmation({...confirmation,location_label:event.target.value})}/></label>
          <label>ELD provider<select required value={confirmation.eld_provider} onChange={event=>setConfirmation({...confirmation,eld_provider:event.target.value})}><option value="">Select your provider</option><option>Motive</option><option>Samsara</option><option>Other compliant provider</option></select></label>
          <label>Your acknowledgment name<input required maxLength={150} value={confirmation.acknowledged_by} onChange={event=>setConfirmation({...confirmation,acknowledged_by:event.target.value})}/></label>
          <label className="workflow-checkbox workflow-span"><input type="checkbox" required checked={confirmation.duty_acknowledged} onChange={event=>setConfirmation({...confirmation,duty_acknowledged:event.target.checked})}/>I confirmed the equipment and recorded On Duty, Not Driving in my ELD provider. This acknowledgment does not change provider records.</label>
          <button className="driver-button driver-button-primary" disabled={busy}>Confirm & open inspection</button>
        </form></section>}
      {!staff && prepared && unstarted && !editingConfirmation && <div className="workflow-alert">Equipment and odometer confirmed · {prepared.odometer} · {prepared.location_label} <button className="driver-button driver-button-light" disabled={busy} onClick={()=>{setConfirmation({...prepared,duty_acknowledged:false});setEditingConfirmation(true);}}>Edit confirmation</button></div>}
      {!staff && prepared && unstarted && accepted && !data.pretrip_passed && <section className="workflow-card"><h2>2. Company pre-trip inspection</h2><p>Complete each item and acknowledge the results. This digital form is company policy.</p>
        <form onSubmit={event=>{event.preventDefault();mutate('inspection',{inspection_type:'PRE_TRIP',result:defects.length?'FAIL':'PASS',defects:defects.map(([key,value])=>`${labels[key]}: ${value}`).join('; '),checklist,signature:prepared.acknowledged_by});}}>
          <div className="workflow-inspection">{(workflow.inspection_items||[]).map(item=><label key={item}>{labels[item]||item}<select required value={checklist[item]||''} onChange={event=>setChecklist({...checklist,[item]:event.target.value})}><option value="">Choose result</option><option value="PASS">Checked · satisfactory</option><option value="MINOR_DEFECT">Defect reported</option><option value="CRITICAL_DEFECT">Safety-critical defect</option></select></label>)}</div>
          <label className="workflow-checkbox"><input required type="checkbox" checked={signed} onChange={event=>setSigned(event.target.checked)}/>I acknowledge these results as {prepared.acknowledged_by}.</label>
          <button className="driver-button driver-button-primary" disabled={busy}>Save pre-trip inspection</button>
        </form>{data.pretrip_passed&&<p className="workflow-source-state">Passed inspection recorded for this assignment.</p>}</section>}
      {!staff && unstarted && accepted && <button className="driver-button driver-button-primary workflow-start" disabled={busy||!data.pretrip_passed||holds.length>0} onClick={startAndNavigate}>Start trip · proceed to pickup</button>}
      {!staff && data.trip_status === 'IN_PROGRESS' && <section className="workflow-card" aria-label="Truck navigation"><h2>Truck navigation to pickup</h2><p>{data.pickup_address || 'Pickup address is missing. Contact dispatch.'}</p>{data.pickup_address && <Link className="driver-button driver-button-primary" to={truckNavigationPath(tripId)} target="_blank" rel="noopener noreferrer">Open truck navigation</Link>}<p>Uses the confirmed loaded vehicle profile. Truck route coverage and provider access must be available; car directions are not substituted.</p></section>}
      {!staff && ['IN_PROGRESS','PAUSED'].includes(data.trip_status) && <div className="workflow-actions"><button className="driver-button driver-button-light" disabled={busy} onClick={()=>mutate('status',{status:data.trip_status==='PAUSED'?'IN_PROGRESS':'PAUSED'})}>{data.trip_status==='PAUSED'?'Resume trip':'Pause trip'}</button><span>Operational status only. Your ELD duty records are unchanged.</span></div>}
      <section className="workflow-card"><h2>Stops & delivery progress</h2>{!data.stops.length?<p>No stops are recorded for this trip.</p>:data.stops.map(stop=><div className="workflow-stop" key={stop.id}><div><strong>{stop.location||stop.address1||stop.stoptype}</strong><span>{display(stop.stoptype)} · {display(stop.execution_status)}</span></div>{!staff && stop.execution_status!=='COMPLETED'&&<button className="driver-button driver-button-light" disabled={busy||data.trip_status!=='IN_PROGRESS'} onClick={()=>mutate('stop',{stop_id:stop.id,status:stop.execution_status==='PENDING'?'ARRIVED':'COMPLETED'})}>{stop.execution_status==='PENDING'?'Arrived':'Complete stop / depart'}</button>}</div>)}</section>
      <section className="workflow-card"><h2>Equipment change requests</h2>{!staff&&accepted&&unstarted&&<form onSubmit={event=>{event.preventDefault();mutate('equipment_request',{reason:equipmentReason});}}><label>Describe the requested change<textarea required maxLength={1000} value={equipmentReason} onChange={event=>setEquipmentReason(event.target.value)}/></label><button className="driver-button driver-button-light" disabled={busy||workflow.equipment_requests.some(request=>request.status==='PENDING')}>Request company approval</button></form>}
        {!workflow.equipment_requests.length&&<p>No equipment changes requested.</p>}{workflow.equipment_requests.map(request=><article className="workflow-request" key={request.id}><strong>{request.status}</strong><p>{request.reason}</p>{request.review_note&&<p>Company review · {request.review_note}</p>}{staff&&request.status==='PENDING'&&String(request.assignment_id)===String(data.assignment_id)&&<div className="workflow-form">
          <label>Truck record ID<input value={review.truck_id||data.truck_id} onChange={event=>setReview({...review,truck_id:event.target.value})}/></label><label>Trailer record ID<input value={review.trailer_id||data.trailer_id} onChange={event=>setReview({...review,trailer_id:event.target.value})}/></label>
          <label className="workflow-span">Review note<textarea value={review.review_note} maxLength={1000} onChange={event=>setReview({...review,review_note:event.target.value})}/></label><label className="workflow-checkbox workflow-span"><input type="checkbox" checked={review.equipment_authorized} onChange={event=>setReview({...review,equipment_authorized:event.target.checked})}/>I authorize this equipment for the company's trip.</label>
          <button className="driver-button driver-button-primary" disabled={busy||!review.review_note.trim()||!review.equipment_authorized} onClick={()=>mutate('equipment_review',{...review,truck_id:review.truck_id||data.truck_id,trailer_id:review.trailer_id||data.trailer_id,equipment_request_id:request.id,decision:'APPROVED'})}>Approve change</button><button className="driver-button driver-button-light" disabled={busy||!review.review_note.trim()} onClick={()=>mutate('equipment_review',{...review,equipment_request_id:request.id,decision:'REJECTED'})}>Reject request</button>
        </div>}</article>)}</section>
      <section className="workflow-card"><h2>Trip paperwork & dispatcher review</h2><p>Uploaded files remain unverified until the dispatcher reviews them. Customs release requires the authorized customs workflow.</p>
        {!staff&&<form className="workflow-form" onSubmit={upload}><label>Document type<select value={documentType} onChange={event=>setDocumentType(event.target.value)}><option value="PICKUP_DOCS">BOL / pickup paperwork</option><option value="POD">Signed proof of delivery</option><option value="OTHER">Other trip document</option></select></label><label>File<input type="file" required accept="image/jpeg,image/png,image/gif,application/pdf" onChange={event=>setDocumentFile(event.target.files[0]||null)}/></label><button className="driver-button driver-button-light" disabled={busy||!documentFile}>Upload for review</button></form>}
        {data.documents.map(document=><div className="workflow-document" key={document.id}><div><a href={`${BASE_URL}api/maps/trip/document/${document.id}`} target="_blank" rel="noreferrer">{document.imagetype} · {document.remarks||`Document ${document.id}`}</a><span>{reviewFor(document.id)?.status||'PENDING_REVIEW'}</span></div>{staff&&<><label>Review note<input value={documentNotes[document.id]||''} maxLength={1000} onChange={event=>setDocumentNotes({...documentNotes,[document.id]:event.target.value})}/></label><div className="workflow-actions">{['APPROVED','NEEDS_CORRECTION','REJECTED'].map(decision=><button key={decision} className="driver-button driver-button-light" disabled={busy||!documentNotes[document.id]?.trim()} onClick={()=>mutate('document_review',{document_id:document.id,decision,review_note:documentNotes[document.id]})}>{display(decision)}</button>)}</div></>}</div>)}
        {!staff&&data.trip_status==='IN_PROGRESS'&&<button className="driver-button driver-button-primary" disabled={busy||!approvedPod||!allStopsComplete} onClick={()=>mutate('status',{status:'COMPLETED',pod_document_id:approvedPod?.id})}>Complete trip with approved POD</button>}
        {data.trip_status==='COMPLETED'&&<p className="workflow-source-state">Delivery complete. {approvedPod?'Paperwork approved for billing and payroll review.':'Dispatcher paperwork review is pending.'} Payroll approval and payment remain separate.</p>}
      </section>
      <section className="workflow-card"><h2>Shared activity</h2><ul className="workflow-history">{data.history.slice(0,15).map(event=><li key={event.id}><strong>{display(event.new_status)}</strong><time>{event.created_at}</time><p>{event.note}</p></li>)}</ul></section>
    </>}
  </section>;
}
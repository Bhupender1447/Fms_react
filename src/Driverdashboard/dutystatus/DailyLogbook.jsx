import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import '../trips/trip-workflow.css';

export default function DailyLogbook() {
  const today = new Date().toLocaleDateString('en-CA');
  const [date,setDate] = useState(today);
  const [data,setData] = useState(null);
  const [error,setError] = useState('');
  useEffect(()=>{
    const controller=new AbortController();setData(null);setError('');
    axios.get(`${BASE_URL}api/driver/eld/logbook`,{params:{date},withCredentials:true,signal:controller.signal})
      .then(response=>{if(response.data.status!=='success')throw new Error(response.data.message);if(!controller.signal.aborted)setData(response.data);})
      .catch(failure=>{if(!controller.signal.aborted)setError(failure.response?.data?.message||failure.message);});
    return()=>controller.abort();
  },[date]);
  return <main id="driver-main" className="content-wrapper driver-dashboard"><div className="trip-workflow">
    <header className="workflow-top"><div><p>ELD & HOS · independent of your trips</p><h1>Daily logbook</h1><p>One duty day across all your assignments.</p></div><label>Log date<input type="date" value={date} max={today} onChange={event=>setDate(event.target.value)}/></label></header>
    {error&&<div className="workflow-alert is-error" role="alert">{error}</div>}
    {!data&&!error?<p role="status">Loading the daily logbook…</p>:data&&<>
      <div className="workflow-alert">{data.message}</div>
      <section className="workflow-card"><h2>{data.driver.name} · {date}</h2><dl className="workflow-facts">{[['Driver ID',data.driver.id],['Carrier',data.carrier||'Not configured'],['Home-terminal time zone',data.home_terminal_timezone||'Not configured'],['Rule set',data.rule_set||'Unverified']].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></section>
      <section className="workflow-eld-clocks" aria-label="Provider-backed HOS clocks">{[['driving','Driving remaining'],['on_duty','On-duty remaining'],['cycle','Cycle available'],['break','Break requirement']].map(([key,label])=><article key={key}><span>{label}</span><strong>{data.hos[key]??'—'}</strong><span>Verified source required</span></article>)}</section>
      <section className="workflow-card"><h2>24-hour duty status graph</h2><p>No duty status is inferred from trip activity or missing provider data.</p><div className="workflow-log-grid" aria-label="Duty graph has no verified events"><span>Time</span>{Array.from({length:12},(_,index)=><span key={index}>{String(index*2).padStart(2,'0')}</span>)}{['OFF','SB','D','ON'].map(status=><React.Fragment key={status}><span>{status}</span>{Array.from({length:12},(_,index)=><span key={index}/>)}</React.Fragment>)}<strong>No verified events for this day</strong></div><div className="workflow-log-status"><span>OFF · Off duty</span><span>SB · Sleeper berth</span><span>D · Driving</span><span>ON · On Duty, Not Driving</span></div></section>
      <section className="workflow-card"><h2>Events & correction history</h2><p>No verified ELD events, diagnostics, unidentified driving records or provider correction history are available for this date.</p><div className="workflow-actions"><button className="driver-button driver-button-light" disabled>Certify daily log</button><button className="driver-button driver-button-light" disabled>Roadside inspection / transfer</button></div><p>Complete these functions in your compliant ELD provider until the authorized integration supports them.</p></section>
    </>}
  </div></main>;
}
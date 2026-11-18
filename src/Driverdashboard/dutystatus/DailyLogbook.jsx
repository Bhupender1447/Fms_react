import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import DutyDayView from '../../admindashboard/eld/DutyDayView';
import '../../admindashboard/eld/eld-workspace.css';
import '../trips/trip-workflow.css';
const today = () => { const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
export default function DailyLogbook() {
  const [date,setDate]=useState(today);const [account,setAccount]=useState('');const [accounts,setAccounts]=useState([]);const [connection,setConnection]=useState('');
  const [data,setData]=useState(null);const [error,setError]=useState('');const [refresh,setRefresh]=useState(0);const [busy,setBusy]=useState(false);const inFlight=useRef(false);
  useEffect(()=>{const controller=new AbortController();axios.get(`${BASE_URL}api/eld/accounts`,{withCredentials:true,signal:controller.signal}).then(({data:reply})=>{if(!controller.signal.aborted&&reply.status==='success'&&Array.isArray(reply.accounts))setAccounts(reply.accounts);}).catch(()=>{});return()=>controller.abort();},[]);
  useEffect(()=>{
    const controller=new AbortController();setData(null);setError('');
    axios.get(`${BASE_URL}api/driver/eld/logbook`,{params:{date,...(account?{account_id:account}:{}),...(connection?{connection_id:connection}:{})},withCredentials:true,signal:controller.signal})
      .then(response=>{if(response.data.status!=='success')throw new Error(response.data.message);if(!controller.signal.aborted)setData(response.data);})
      .catch(failure=>{if(!controller.signal.aborted)setError(failure.response?.data?.message||failure.message);});
    return()=>controller.abort();
  },[date,account,connection,refresh]);
  const sync=async()=>{if(inFlight.current||!data)return;const options=data.provider_options||[];const source=connection||(options.length===1?options[0].connection_id:'');if(!source)return;inFlight.current=true;setBusy(true);setError('');try{const response=await axios.post(`${BASE_URL}api/driver/eld/sync`,{account_id:data.account_id,connection_id:source,date},{withCredentials:true});if(response.data.status!=='success')throw new Error(response.data.message||'Provider refresh failed.');setRefresh(value=>value+1);}catch(failure){setError(failure.response?.data?.message||failure.message);}finally{inFlight.current=false;setBusy(false);}};
  return <main id="driver-main" className="content-wrapper driver-dashboard"><div className="trip-workflow eld-workspace">
    <header className="workflow-top"><div><p>ELD & HOS / independent of your trips</p><h1>Daily logbook</h1><p>One duty day across all your assignments.</p></div><label>Log date<input type="date" value={date} disabled={busy} max={today()} onChange={event=>setDate(event.target.value)}/></label></header>
    {accounts.length>1&&<label>Company account<select value={account} disabled={busy} onChange={event=>{setAccount(event.target.value);setConnection('');setData(null);}}><option value="">Choose your company</option>{accounts.map(row=><option key={row.account_id} value={row.account_id}>{row.account_name}</option>)}</select></label>}
    {error&&<div className="workflow-alert is-error" role="alert">{error}</div>}
    {!data&&!error?<p role="status">Loading the daily logbook...</p>:data&&<>
      <div className="workflow-alert">{data.message}<p>HOS assessment: Not assessed. Provider records do not grant dispatch clearance.</p></div>
      <section className="workflow-card"><h2>{data.driver.name} / {date}</h2><dl className="workflow-facts">{[['Driver ID',data.driver.id],['Carrier',data.carrier||'Not configured'],['Home-terminal time zone',data.home_terminal_timezone||'Not configured'],['Rule set',data.rule_set||'Unverified'],['Source',data.source_status||'NOT_CONNECTED'],['Retrieved (UTC)',data.retrieved_at||'No source retrieval'],['Freshness',data.freshness||'No data']].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      {data.provider_options?.length>1&&<label>ELD source<select value={connection} disabled={busy} onChange={event=>{setData(null);setConnection(event.target.value);}}><option value="">Choose a provider</option>{data.provider_options.map(row=><option key={row.connection_id} value={row.connection_id}>{row.provider}</option>)}</select></label>}
      <button className="driver-button driver-button-light" disabled={busy||!data.policy_revision||!(connection||data.provider_options?.length===1)} onClick={sync}>{busy?'Refreshing source...':'Refresh provider records'}</button>
      {data.issues?.length>0&&<p role="status">Source issues: {data.issues.join(', ')}</p>}</section>
      <DutyDayView data={data}/>
      <section className="workflow-card"><h2>Certification & roadside inspection</h2><div className="workflow-actions"><button className="driver-button driver-button-light" disabled>Certify daily log</button><button className="driver-button driver-button-light" disabled>Roadside inspection / transfer</button></div><p>Complete duty changes, corrections, certification and roadside transfer in your official ELD provider.</p></section>
    </>}
  </div></main>;
}

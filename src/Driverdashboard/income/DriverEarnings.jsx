import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config';
import '../trips/trip-workflow.css';

export default function DriverEarnings() {
  const [data,setData]=useState(null);
  const [error,setError]=useState('');
  useEffect(()=>{const controller=new AbortController();axios.get(`${BASE_URL}api/driver-dashboard`,{withCredentials:true,signal:controller.signal}).then(response=>{if(response.data.status!=='success')throw new Error('Earnings context unavailable');if(!controller.signal.aborted)setData(response.data);}).catch(failure=>{if(!controller.signal.aborted)setError(failure.response?.data?.message||failure.message);});return()=>controller.abort();},[]);
  return <main id="driver-main" className="content-wrapper driver-dashboard"><div className="trip-workflow"><header className="workflow-top"><div><p>Your earnings & payment records</p><h1>Earnings & settlements</h1></div><Link className="driver-button driver-button-light" to="/drivertrip?view=completed">Completed trips</Link></header>
    {error&&<div className="workflow-alert is-error" role="alert">{error}</div>}
    <section className="workflow-eld-clocks">{['Approved earnings','Reimbursements','Net pay','Payment status'].map(label=><article key={label}><span>{label}</span><strong>—</strong><span>Payroll connection required</span></article>)}</section>
    <section className="workflow-card"><h2>Payroll review</h2><p>{data?`${data.summary.completed} completed assignments are recorded for your login.`:'Your assigned work is checked through the authenticated driver session.'} Approved earnings, deductions and payment references require a linked payroll or settlement record.</p><p>Employee payroll, contractor payments and owner-operator settlements use separate agreements. Trip completion and HOS records do not issue a paystub or calculate net pay.</p><div className="workflow-actions"><button className="driver-button driver-button-light" disabled>Download paystub</button><button className="driver-button driver-button-light" disabled>Payment history</button></div></section>
    <section className="workflow-card"><h2>From delivery to payment</h2><ol><li>Complete delivery stops and submit signed POD.</li><li>Dispatcher reviews documents and exceptions.</li><li>Payroll reviews agreed earnings and approved expenses.</li><li>An issued paystub and payment reference appear after provider integration.</li></ol><Link to="/expense">Open expense records →</Link></section>
  </div></main>;
}
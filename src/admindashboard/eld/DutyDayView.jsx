import React, { useEffect, useState } from 'react';
const statuses = { OFF: 'Off duty', SB: 'Sleeper berth', D: 'Driving', ON: 'On duty, not driving', PC: 'Personal conveyance', YM: 'Yard move' };
export default function DutyDayView({ data }) {
  const [now,setNow]=useState(Date.now);
  useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),10000);return()=>clearInterval(timer);},[]);
  const fetched=data.retrieved_at ? Date.parse(data.retrieved_at.replace(' ','T')+'Z') : NaN;
  const expired=!Number.isFinite(fetched)||fetched>now||now-fetched>300000;
  const events = Array.isArray(data.events) ? data.events : [];
  const start = Number(data.day?.start_epoch);
  const end = Number(data.day?.end_epoch);
  const span = end - start;
  const zone = data.home_terminal_timezone || 'UTC';
  const time = value => { try { return new Intl.DateTimeFormat('en-CA', { timeZone: zone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value)); } catch { return 'Time unavailable'; } };
  return <>
    <section className="eld-clock-grid" aria-label="Provider-backed HOS clocks">{[['driving','Driving remaining'],['on_duty','Shift remaining'],['cycle','Cycle remaining'],['break','Until break']].map(([key,label]) => <article key={key}><span>{label}</span><strong>{(!expired ? data.hos?.[key] : null) ?? '\u2014'}</strong><small>{!expired && data.hos?.[key] != null ? 'Provider-reported, not an IFM clearance' : 'Verified source required'}</small></article>)}</section>
    {expired&&data.retrieved_at&&<p role="status">The clock snapshot has expired or its timestamp is invalid. Refresh provider records before reviewing remaining time.</p>}
    <section className="eld-panel"><h2>Duty-day timeline</h2><p>Source time zone: {data.home_terminal_timezone || 'Not configured'}. Missing periods remain unknown. Trip activity does not create duty events.</p>
      {!events.length ? <div className="eld-empty" aria-label="Duty graph has no verified events">No verified events for this day</div> : <div className="eld-timeline" role="img" aria-label={`Provider duty graph with ${events.length} events; coverage is unverified`}>
        <div className="eld-axis"><span>Day start</span><span>Midday</span><span>Day end</span></div>
        {['OFF','SB','D','ON'].map(status => <div className="eld-track" key={status}><b>{status}</b><div>{events.filter(event => (event.status === 'PC' ? 'OFF' : event.status === 'YM' ? 'ON' : event.status) === status).map(event => {
          const left = span > 0 ? Math.max(0,Math.min(100,((Number(event.start_epoch) || Date.parse(event.start)/1000)-start)/span*100)) : 0;
          const width = span > 0 ? Math.max(0,Math.min(100-left,((Number(event.end_epoch) || Date.parse(event.end)/1000)-(Number(event.start_epoch) || Date.parse(event.start)/1000))/span*100)) : 0;
          return <span className={`eld-segment eld-segment-${status}`} key={event.id} style={{ left:`${left}%`,width:`${width}%` }} title={`${statuses[event.status] || event.status}: ${time(event.start)} to ${time(event.end)}`}><span className="eld-sr">{statuses[event.status] || event.status}</span></span>;
        })}</div></div>)}
      </div>}
      {data.day?.elapsed_hours && data.day.elapsed_hours !== 24 && <p role="status">This time-zone view spans {data.day.elapsed_hours} elapsed hours because of a daylight-saving transition. It is not a certified regulatory log form.</p>}
      <p className="eld-muted">OFF: off duty / SB: sleeper / D: driving / ON: on duty, not driving. PC and YM remain provider annotations.</p>
    </section>
    <section className="eld-panel"><h2>Duty records</h2><div className="eld-table-wrap"><table><caption>Provider source events for the selected day</caption><thead><tr><th>Status</th><th>Start ({zone})</th><th>End ({zone})</th><th>Provider vehicle</th><th>Annotation</th></tr></thead><tbody>{events.map(event => <tr key={event.id}><td>{statuses[event.status] || event.status}</td><td>{time(event.start)}</td><td>{time(event.end)}</td><td>{event.vehicle_provider_id || 'Not supplied'}</td><td>{event.annotation || 'None'}</td></tr>)}{!events.length && <tr><td colSpan={5}>No source events loaded.</td></tr>}</tbody></table></div></section>
  </>;
}

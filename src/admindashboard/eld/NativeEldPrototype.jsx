import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCpu, FiDownload, FiLayers, FiShield } from 'react-icons/fi';
import { Alert, Badge, Button, Card, EmptyState, PageHeader } from '../../design-system/components';
import { exampleNativeBatch, validateNativePrototype } from './nativeEldModel';
import './NativeEldPrototype.css';
import NativeEldCaptures from './NativeEldCaptures';
const names = { OFF_DUTY: 'Off duty', SLEEPER_BERTH: 'Sleeper berth', DRIVING: 'Driving', ON_DUTY: 'On duty' };
const duration = seconds => `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;

export default function NativeEldPrototype() {
  const [raw, setRaw] = useState(''); const [report, setReport] = useState(null); const [example, setExample] = useState(false);
  const [storageBusy,setStorageBusy]=useState(false);
  const edit = value => { setRaw(value); setReport(null); setExample(false); };
  const exportReport = () => {
    if (!report) return;
    const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'isovia-native-eld-prototype-report.json'; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };
  return <main className="iso-ui iso-native-page" data-iso-theme="light">
    <div className="iso-native-hero" data-iso-theme="dark"><PageHeader eyebrow="ISOVIA / FIRST-PARTY DEVICE WORKSPACE" title="Native ELD Lab" actions={<Badge tone="warning">Hardware-neutral prototype</Badge>}>Build the recording foundation. Keep the evidence intact.</PageHeader><div className="iso-native-principles"><span><FiCpu aria-hidden="true" />Device-independent format</span><span><FiLayers aria-hidden="true" />Ordered evidence</span><span><FiShield aria-hidden="true" />Explicit trust boundaries</span></div></div>
    <Alert tone="warning" title="Prototype only · no live device or official logs">This lab checks browser-supplied test events and can save encrypted lab captures with account permissions. It does not authenticate a device, create official ELD logs, calculate HOS, certify compliance or authorize dispatch. Samhil’s operational driver and trip records are separate.</Alert>
    <div className="iso-native-layout"><Card className="iso-native-input"><div className="iso-native-section-title"><span>01 / EVENT INTAKE</span><h2>Bring your device format.</h2></div><p>Paste the proposed JSON batch, or start with a synthetic example. Offline upload order may differ; original device sequence and occurrence times are retained.</p>
      <div className="iso-native-actions"><Button variant="secondary" disabled={storageBusy} onClick={() => { setRaw(exampleNativeBatch()); setReport(null); setExample(true); }}>Load synthetic example</Button><Button variant="secondary" disabled={!raw||storageBusy} onClick={() => edit('')}>Clear session</Button></div>
      {example && <p className="iso-native-example" role="status">Synthetic example loaded. These are not real drivers, vehicles or logs.</p>}
      <label className="iso-native-editor-label" htmlFor="native-eld-json">Prototype event batch (JSON)</label><textarea id="native-eld-json" className="iso-native-editor" disabled={storageBusy} spellCheck="false" value={raw} maxLength={256000} onChange={event => edit(event.target.value)} aria-describedby="native-eld-input-help" placeholder="Load an example to inspect the event format." />
      <p id="native-eld-input-help">Edits invalidate the report. Input stays in memory unless you explicitly save a lab capture. Clear session resets this editor only; saved captures remain. Do not paste credentials or real personal records.</p><Button disabled={!raw.trim()||storageBusy} onClick={() => setReport(validateNativePrototype(raw))}>Validate prototype session</Button>
      <NativeEldCaptures raw={raw} schemaValid={report?.schema_valid===true} onLoad={edit} onBusyChange={setStorageBusy} />
    </Card><div className="iso-native-results"><div className="iso-native-section-title"><span>02 / EVIDENCE REVIEW</span><h2>What the batch tells us.</h2>{report && <Button variant="secondary" onClick={exportReport}><FiDownload aria-hidden="true" />Export prototype report</Button>}</div>
      {!report && <Card><EmptyState title="No prototype report yet">Load or paste a session, then validate it. No sample data is presented as live telemetry.</EmptyState></Card>}
      {report && !report.schema_valid && <Card><h3>Review the event evidence</h3><p>No timeline or trusted log was created.</p><ul className="iso-native-issues" aria-label="Prototype validation issues">{report.issues.map((issue, i) => <li key={`${issue.code}-${i}`}><strong>{issue.code.replace(/_/g, ' ')}{issue.sequence !== null ? ` · sequence ${issue.sequence}` : ''}</strong><p>{issue.detail}</p></li>)}</ul></Card>}
      {report?.schema_valid && <>
        <Alert tone="info" title="Schema checks passed · evidence remains unverified">A valid prototype shape does not establish device authenticity, accurate engine evidence or legal duty history.</Alert>
        <div className="iso-native-stats"><Card><span>Events in this batch</span><strong>{report.summary.event_count}</strong></Card><Card><span>Telemetry points</span><strong>{report.summary.telemetry_points}</strong></Card><Card><span>Explicit window</span><strong>{duration(report.summary.window_seconds)}</strong></Card></div>
        <Card><h3>Session context</h3><dl className="iso-native-context"><div><dt>Device</dt><dd>{report.context.device_id}</dd></div><div><dt>Vehicle</dt><dd>{report.context.vehicle_id}</dd></div><div><dt>Driver</dt><dd>{report.context.driver_id}</dd></div><div><dt>Sequence</dt><dd>{report.summary.sequence_start}—{report.summary.sequence_end}</dd></div></dl></Card>
        <Card><h3>Explicit duty intervals</h3><p>Only supplied duty states inside the declared window are shown. These are not remaining-hours or violation calculations.</p><div className="iso-native-timeline" aria-label="Prototype duty timeline">{report.timeline.filter(interval => interval.seconds > 0).map(interval => <div key={interval.event_id} className={`duty-${interval.status.toLowerCase()}`} style={{ flexBasis: `${interval.seconds / report.summary.window_seconds * 100}%` }} title={`${names[interval.status]} · ${duration(interval.seconds)}`}><span>{names[interval.status]}</span></div>)}</div><ol className="iso-native-intervals">{report.timeline.map(interval => <li key={interval.event_id}><span>{names[interval.status]}</span><strong>{duration(interval.seconds)}</strong><small>{interval.start} → {interval.end}</small></li>)}</ol></Card>
        <Card><h3>Ordered source events</h3><div className="iso-native-event-list">{report.normalized_events.map(event => <details key={event.event_id}><summary><span>#{event.sequence} · {event.type.replace(/_/g, ' ')}</span><small>{event.occurred_at}</small></summary><pre>{JSON.stringify(event, null, 2)}</pre></details>)}</div></Card>
      </>}
      <Card className="iso-native-next"><h3>From prototype to connected device</h3><p>Next: choose hardware, verify driver/device/vehicle ownership, define authenticated ingestion and protected append-only storage, then independently test recording and HOS requirements.</p><Link to="/sis/connections">Return to SIS workspaces →</Link></Card>
    </div></div>
  </main>;
}

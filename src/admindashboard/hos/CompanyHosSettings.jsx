import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, Input, PageHeader, Select } from '../../design-system/components';

export default function CompanyHosSettings() {
  const [schedule, setSchedule] = useState('');
  const [cycle, setCycle] = useState('');
  const [timezone, setTimezone] = useState('');
  const [reference, setReference] = useState('');
  const [review, setReview] = useState(null);
  const [errors, setErrors] = useState({});
  const change = (setter, value) => { setter(value); setReview(null); setErrors({}); };
  const inspect = event => {
    event.preventDefault();
    const next = {};
    if (!schedule) next.schedule = 'Choose the carrier operating schedule explicitly.';
    if (!cycle) next.cycle = 'Choose a cycle explicitly.';
    else if (schedule && ((schedule === 'every-day') !== (cycle === '70_8'))) next.cycle = 'The cycle must match the selected carrier operating schedule.';
    if (!timezone || (!timezone.includes('/') && timezone !== 'UTC')) next.timezone = 'Enter an IANA timezone such as America/Toronto.';
    else {
      try { new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(); }
      catch (error) { next.timezone = 'Enter a recognized IANA timezone.'; }
    }
    if (!reference.trim() || new Blob([reference.trim()]).size > 160 || [...reference].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) next.reference = 'Provide a review reference up to 160 bytes without control characters.';
    setErrors(next);
    setReview(Object.keys(next).length ? null : { schedule, cycle, timezone, reference: reference.trim() });
  };
  const reset = () => { setSchedule(''); setCycle(''); setTimezone(''); setReference(''); setReview(null); setErrors({}); };
  return <main className="content-wrapper iso-ui iso-workspace" style={{ padding: 24 }}>
    <PageHeader eyebrow="SIS / COMPANY POLICY" title="Company HOS Settings">Prepare a company-specific U.S. cycle policy without changing driver history.</PageHeader>
    <Alert tone="warning" title="Local review only — not saved">
      Authorized company selection and settings persistence are not connected. The prepared migration has not been executed. Entries are lost on navigation or refresh; no company is selected and no policy is active.
    </Alert>
    <Card>
      <h2>U.S. federal interstate property-carrying policy</h2>
      <p>Non-hazmat, standard-rule research scope only. Canada, cross-border operations, sleeper and other exceptions are not configured here.</p>
      <Select label="Authorized company" disabled value="" onChange={() => {}}>
        <option value="">Company authorization unavailable</option>
      </Select>
      <form onSubmit={inspect} noValidate>
        <Select label="Carrier operating schedule" value={schedule} error={errors.schedule} onChange={event => change(setSchedule, event.target.value)}>
          <option value="">Choose operating schedule</option><option value="not-every-day">Does not operate CMVs every day of the week</option><option value="every-day">Operates CMVs every day of the week</option>
        </Select>
        <Select label="Cycle selection" value={cycle} error={errors.cycle} onChange={event => change(setCycle, event.target.value)}
          help="The selected cycle must reflect actual carrier applicability, not whichever provides more hours.">
          <option value="">Choose cycle</option><option value="60_7">60 hours / 7 consecutive days</option><option value="70_8">70 hours / 8 consecutive days</option>
        </Select>
        <Input label="Home-terminal timezone" value={timezone} error={errors.timezone} placeholder="America/Toronto" onChange={event => change(setTimezone, event.target.value)} help="IANA timezone, not the browser timezone or a fixed UTC offset." />
        <Input label="Day start" value="00:00" readOnly help="Only midnight day start is supported by the current research calculator." />
        <Input label="Review reference" value={reference} error={errors.reference} onChange={event => change(setReference, event.target.value)} help="A reference records rationale; entering one does not grant regulatory approval." />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <Button type="submit">Review local proposal</Button><Button variant="secondary" onClick={reset}>Clear proposal</Button>
          <Button disabled title="Account-authorized persistence is not connected.">Save company settings</Button>
        </div>
      </form>
      {Object.keys(errors).length > 0 && <div role="alert">Correct the highlighted policy fields before reviewing.</div>}
    </Card>
    {review && <Card aria-label="Local policy proposal">
      <h2>Unsaved proposal — not assigned to a company</h2>
      <dl><dt>Cycle</dt><dd>{review.cycle === '60_7' ? '60 hours / 7 days' : '70 hours / 8 days'}</dd><dt>Home-terminal timezone</dt><dd>{review.timezone}</dd><dt>Review reference</dt><dd>{review.reference}</dd></dl>
      <p role="status">This is not a saved policy, a regulatory approval or permission to drive.</p>
    </Card>}
    <Card>
      <h2>Driver ID separation and history continuity</h2>
      <p>Future assessments must bind the authorized account, company, Driver ID and policy revision. Company or truck reassignment must never reset the driver&apos;s all-carrier duty history.</p>
      <p>A policy revision must trigger a fresh assessment; it must not silently replace historical settings or open compliance clearance.</p>
      <Link to="/hos-fleet">Return to Driver and Truck HOS Connections</Link>
    </Card>
  </main>;
}

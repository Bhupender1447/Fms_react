import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Alert, Badge, Button, Select } from '../../design-system/components';
import { BASE_URL } from '../../config';
import './EldSimulation.css';

const API = `${BASE_URL}api/sis/eld-simulation/`;
const providerNames = { motive: 'Motive', samsara: 'Samsara' };
const issueNames = {
  STALE_SOURCE: 'Source observation is stale', MISSING_PERIOD: 'A duty period is missing',
  RECORD_IDENTITY_MISMATCH: 'An event belongs to a different driver or vehicle',
  DUPLICATE_OR_MISSING_EVENT_ID: 'An event identifier is duplicated or missing',
  DEVICE_UPLOAD_COVERAGE_UNVERIFIED: 'Device upload coverage is unverified',
  INCOMPLETE_RETRIEVAL: 'Provider retrieval is incomplete', UNKNOWN_DUTY_STATUS: 'An event has an unknown duty status',
  UNVERIFIED_PROVIDER_SEMANTICS: 'Source semantics are unverified',
};
const message = error => error.response?.data?.message || error.message || 'The simulation could not be loaded.';
const formatTime = value => new Date(value).toLocaleString('en-CA', { timeZone: 'America/Toronto', timeZoneName: 'short' });

export function readSimulation(data, accountId, provider, scenario) {
  const value = data?.simulation;
  if (data?.status !== true || value?.contract_version !== 'eld-simulation.v1' || value.synthetic !== true
      || value.account_id !== String(accountId) || value.identity?.account_id !== String(accountId)
      || value.provider !== provider || value.scenario_id !== scenario || value.profile?.scope !== 'SYNTHETIC'
      || value.profile.production_verified !== false || value.operational_eligible !== false
      || value.ready_for_rules_engine !== false || value.dispatch_authorized !== false
      || !['PASSED', 'UNKNOWN'].includes(value.fixture_validation) || !Array.isArray(value.intervals)
      || !Array.isArray(value.missing_data) || !Array.isArray(value.retrieval?.requests)
      || !Array.isArray(value.retrieval?.retry_delays_seconds) || !Array.isArray(value.retrieval?.errors)) {
    throw new Error('The simulation response could not be verified. Refresh the accounts and try again.');
  }
  return value;
}

export default function EldSimulation() {
  const [accounts, setAccounts] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState('motive');
  const [scenario, setScenario] = useState('complete');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const request = useRef(null);
  const gate = useRef(false);

  useEffect(() => {
    const abort = new AbortController();
    request.current?.abort();
    setAccounts([]); setScenarios([]); setAccount(''); setResult(null); setError(''); setLoading(true);
    axios.get(`${API}scenarios`, { withCredentials: true, signal: abort.signal }).then(response => {
      const data = response.data;
      if (data?.status !== true || data.contract_version !== 'eld-simulation.v1' || data.synthetic !== true
          || !Array.isArray(data.accounts) || !data.accounts.length || !Array.isArray(data.scenarios)
          || !data.scenarios.length || new Set(data.accounts.map(item => String(item.account_id))).size !== data.accounts.length
          || data.accounts.some(item => !/^[1-9][0-9]*$/.test(String(item.account_id)) || typeof item.account_name !== 'string')
          || data.scenarios.some(item => typeof item.id !== 'string' || typeof item.name !== 'string')) {
        throw new Error('The authorized simulation choices could not be verified.');
      }
      if (!abort.signal.aborted) {
        setAccounts(data.accounts); setScenarios(data.scenarios);
        setAccount(data.accounts.length === 1 ? String(data.accounts[0].account_id) : '');
      }
    }).catch(failure => { if (!abort.signal.aborted) setError(message(failure)); })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => { abort.abort(); request.current?.abort(); };
  }, [revision]);

  const change = (setter, value) => {
    request.current?.abort(); gate.current = false;
    setBusy(false); setResult(null); setError(''); setter(value);
  };
  const run = async event => {
    event.preventDefault();
    if (!account || gate.current) return;
    request.current?.abort();
    const abort = new AbortController(); request.current = abort;
    gate.current = true; setBusy(true); setResult(null); setError('');
    try {
      const response = await axios.post(`${API}preview`, { account_id: account, provider, scenario_id: scenario }, { withCredentials: true, signal: abort.signal });
      const simulation = readSimulation(response.data, account, provider, scenario);
      if (!abort.signal.aborted) setResult(simulation);
    } catch (failure) {
      if (!abort.signal.aborted) {
        setError(message(failure));
        if ([401, 403].includes(failure.response?.status)) { setAccounts([]); setAccount(''); }
      }
    } finally {
      if (!abort.signal.aborted) { gate.current = false; setBusy(false); }
    }
  };

  return <main className="content-wrapper iso-ui eld-simulation" data-iso-theme="light">
    <header className="eld-simulation-header"><div><h1>ELD simulation</h1><p>Inspect synthetic provider data and its evidence quality.</p></div><Badge tone="warning">Synthetic data</Badge></header>
    <form className="eld-simulation-controls" onSubmit={run}>
      <Select label="Account workspace" value={account} disabled={loading || !accounts.length} required onChange={event => change(setAccount, event.target.value)}>
        <option value="">Choose an account</option>{accounts.map(item => <option key={item.account_id} value={item.account_id}>{item.account_name}</option>)}
      </Select>
      <Select label="Provider" value={provider} disabled={loading || !accounts.length} onChange={event => change(setProvider, event.target.value)}>{Object.entries(providerNames).map(([id, name]) => <option key={id} value={id}>{name}</option>)}</Select>
      <Select label="Scenario" value={scenario} disabled={loading || !accounts.length} onChange={event => change(setScenario, event.target.value)}>{scenarios.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</Select>
      <div className="eld-simulation-actions"><Button type="submit" disabled={loading || busy || !account}>Run simulation</Button><Button variant="secondary" disabled={loading || busy} onClick={() => setRevision(value => value + 1)}>Refresh accounts</Button></div>
    </form>
    {loading && <p role="status">Loading authorized accounts...</p>}
    {busy && <p role="status">Running simulation...</p>}
    {error && <Alert tone="danger" title="Simulation unavailable">{error}</Alert>}
    {result && <div aria-label="Simulation results">
      <section className="eld-simulation-panel" aria-label="Evidence assessment">
        <h2>{result.fixture_validation === 'PASSED' ? 'Fixture checks passed' : 'Evidence unknown'}</h2>
        <dl className="eld-simulation-facts">
          <div><dt>Assessment time</dt><dd>{formatTime(result.assessed_at)}</dd></div>
          <div><dt>Retrieval</dt><dd>{result.retrieval.cursor_complete ? 'Pagination complete' : 'Incomplete'}</dd></div>
          <div><dt>Records received</dt><dd>{result.retrieval.records_received}</dd></div>
          <div><dt>Operational readiness</dt><dd>Unavailable</dd></div>
          <div><dt>Source profile</dt><dd>{result.profile.version}</dd></div>
          <div><dt>Driver / vehicle</dt><dd>{result.identity.driver_id}<br />{result.identity.vehicle_id}</dd></div>
        </dl>
        {result.missing_data.length > 0 && <ul>{result.missing_data.map(issue => <li key={issue}>{issueNames[issue] || issue.replaceAll('_', ' ').toLowerCase()}</li>)}</ul>}
      </section>
      <section className="eld-simulation-panel" aria-label="Duty intervals">
        <h2>Duty intervals</h2>
        {!result.intervals.length && <p>No intervals could be verified for this fixture.</p>}
        <ol className="eld-simulation-intervals">{result.intervals.map(interval => <li key={interval.id}>
          <strong>{interval.status.replaceAll('_', ' ').toLowerCase()}</strong>
          <span><time dateTime={interval.start}>{formatTime(interval.start)}</time> – <time dateTime={interval.end}>{formatTime(interval.end)}</time></span>
          <small>Observed <time dateTime={interval.source_observed_at}>{formatTime(interval.source_observed_at)}</time></small>
          <details><summary>Source reference</summary><p>{interval.raw_reference}</p></details>
        </li>)}</ol>
      </section>
      <section className="eld-simulation-panel" aria-label="Retrieval trace">
        <h2>Retrieval trace</h2>
        <ol className="eld-simulation-trace">{result.retrieval.requests.map((entry, index) => <li key={index}><strong>{entry.method} {entry.path}</strong><span>HTTP {entry.status}</span></li>)}</ol>
        {result.retrieval.retry_delays_seconds.length > 0 && <p>Simulated retry delays · {result.retrieval.retry_delays_seconds.join(', ')} seconds</p>}
        {result.retrieval.errors.map(issue => <p key={issue}>{issue.replaceAll('_', ' ').toLowerCase()}</p>)}
      </section>
    </div>}
  </main>;
}

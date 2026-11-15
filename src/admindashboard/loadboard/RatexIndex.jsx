import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config';
import { Alert, Badge, Button, Card, PageHeader } from '../../design-system/components';
import './ratex-index.css';

export function validRatex(data) {
  return data?.kind === 'national_price_indexes' && ['success', 'partial', 'unavailable'].includes(data.status)
    && data.lane_rates_available === false && typeof data.retrieved_at === 'string' && Number.isFinite(Date.parse(data.retrieved_at))
    && Array.isArray(data.sources) && data.sources.length === 2
    && ['us', 'ca'].every(id => data.sources.filter(source => source?.id === id).length === 1)
    && data.sources.every(source => ['available', 'unavailable'].includes(source.status)
      && (source.status !== 'available' || (source.latest && Number.isFinite(source.latest.value) && source.latest.value > 0
        && /^\d{4}-(0[1-9]|1[0-2])$/.test(source.latest.period) && Array.isArray(source.history) && source.history.length > 0
        && source.history.every(point => Number.isFinite(point.value) && point.value > 0 && /^\d{4}-(0[1-9]|1[0-2])$/.test(point.period))
        && (source.previous_month_change_pct === null || Number.isFinite(source.previous_month_change_pct)))));
}
const names = { us: 'United States', ca: 'Canada' };
const sources = {
  us: 'https://fred.stlouisfed.org/series/PCU484121484121',
  ca: 'https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810028101',
};
export default function RatexIndex() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    setLoading(true); setData(null); setError('');
    axios.get(`${BASE_URL}api/loadboard/ratex-index`, { withCredentials: true, signal: controller.signal })
      .then(response => {
        if (!validRatex(response.data)) throw new Error('The index response could not be validated.');
        if (active) setData(response.data);
      }).catch(reason => {
        if (active) setError(reason.response?.data?.message || 'Official freight indexes are unavailable. Please retry later.');
      }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; controller.abort(); };
  }, [revision]);
  return <main className="content-wrapper iso-ui iso-workspace ratex-index">
    <PageHeader eyebrow="LOAD BOARD / MARKET CONTEXT" title="Ratex Index"
      actions={<Button disabled={loading} onClick={() => setRevision(value => value + 1)}>Refresh indexes</Button>}>
      Official Canada and U.S. monthly freight price indexes, in one workspace.
    </PageHeader>
    <Link to="/loadboard">Back to Load Board</Link>
    <Alert tone="warning" title="Market indexes, not lane-rate quotes">
      These are national price movements, not CAD/USD per mile, fleet quotes or real-time spot rates.
      Canada includes long-distance general freight, not truckload only. Different base periods mean the two index levels cannot be compared directly.
      Ratex does not set order, trip or invoice prices.
    </Alert>
    {loading && <p role="status">Loading official monthly indexes...</p>}
    {error && <Alert tone="danger" title="Indexes unavailable">{error}</Alert>}
    {data && <>
      <p>Retrieved: <time dateTime={data.retrieved_at}>{new Date(data.retrieved_at).toLocaleString()}</time>
        {data.cached ? ' (server cache)' : ''}. Cache: up to one hour; provider failures retried after five minutes.</p>
      {data.status !== 'success' && <Alert tone="warning" title="Partial source coverage">One or more providers are unavailable. Missing values are not estimated.</Alert>}
      <div className="ratex-index__grid">
        {data.sources.map(source => <Card key={source.id} aria-label={`${names[source.id]} index`}>
          <h2>{names[source.id]}</h2><p>{source.provider}</p><p>{source.title}</p>
          {source.status === 'available' ? <>
            <Badge>{source.frequency} published data</Badge>
            {source.delayed && <Alert tone="warning" title="Reporting lag">The latest reference month ended over 90 days ago. This is not current pricing.</Alert>}
            <p className="ratex-index__value">{source.latest.value.toLocaleString(undefined, { maximumFractionDigits: 3 })}</p>
            <p>{source.units}</p>
            <dl><dt>Reference month</dt><dd>{source.latest.period}</dd>
              <dt>Change from preceding month</dt><dd>{source.previous_month_change_pct === null ? 'Unavailable (no adjacent month)' : `${source.previous_month_change_pct > 0 ? '+' : ''}${source.previous_month_change_pct}%`}</dd></dl>
            <p>{source.latest.notes}</p>
            <details><summary>Monthly history</summary><table><caption>{names[source.id]} monthly index points</caption>
              <thead><tr><th scope="col">Month</th><th scope="col">Index</th></tr></thead>
              <tbody>{source.history.map(point => <tr key={point.period}><th scope="row">{point.period}</th><td>{point.value}</td></tr>)}</tbody>
            </table></details>
          </> : <Alert tone="danger" title="Source unavailable">No validated index is available from this provider. Try again later.</Alert>}
          <p><a href={sources[source.id]} target="_blank" rel="noreferrer">Official series and methodology</a></p>
        </Card>)}
      </div>
    </>}
    <Card><h2>Lane rates: provider required</h2><p>Canada/U.S. origin-destination rates, equipment-specific quotes and cross-border prices are not connected.
      A permitted lane-rate API and any required subscription must be approved first. No national index is converted into a freight quote.</p></Card>
  </main>;
}

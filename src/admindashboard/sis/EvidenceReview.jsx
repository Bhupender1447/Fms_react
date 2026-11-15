import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config';
import { Alert, Badge, Button, Card, EmptyState, Input, PageHeader, Select } from '../../design-system/components';
import { readAccountResponse, readSnapshotResponse } from './snapshotResponse';
import { readReview } from './reviewResponse';
import './EvidenceReview.css';

export default function EvidenceReview() {
  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountError, setAccountError] = useState('');
  const [accountRetry, setAccountRetry] = useState(0);
  const [accountId, setAccountId] = useState('');
  const [offset, setOffset] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');

  useEffect(() => {
    const controller = new AbortController();
    setAccountsLoading(true); setAccounts([]); setAccountId(''); setResult(null); setAccountError(''); setOffset(0);
    (async () => {
      try {
        const response = await fetch(`${BASE_URL}api/sis/accounts`, { credentials: 'include', signal: controller.signal, headers: { Accept: 'application/json' } });
        const choices = await readAccountResponse(response);
        if (controller.signal.aborted) return;
        setAccounts(choices);
        if (choices.length === 1) setAccountId(choices[0].account_id);
      } catch (failure) { if (!controller.signal.aborted) setAccountError(failure.message); }
      finally { if (!controller.signal.aborted) setAccountsLoading(false); }
    })();
    return () => controller.abort();
  }, [accountRetry]);

  useEffect(() => {
    setResult(null); setError('');
    if (!accountId) { setLoading(false); return undefined; }
    const controller = new AbortController(); setLoading(true);
    (async () => {
      try {
        const query = new URLSearchParams({ account_id: accountId, limit: '50', offset: String(offset) });
        const response = await fetch(`${BASE_URL}api/sis/world-model?${query}`, { credentials: 'include', signal: controller.signal, headers: { Accept: 'application/json' } });
        const snapshot = await readSnapshotResponse(response, accountId);
        const review = readReview(snapshot, accountId, offset);
        if (!controller.signal.aborted) setResult({ accountId, offset, review, entities: snapshot.entities });
      } catch (failure) { if (!controller.signal.aborted) setError(failure.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [accountId, offset, refresh]);

  const current = result?.accountId === accountId && result?.offset === offset ? result : null;
  const review = current?.review;
  const findings = useMemo(() => (review?.findings || []).filter(finding => (priority === 'all' || finding.priority === priority)
    && `${finding.title} ${finding.detail} ${finding.entity_key || ''}`.toLowerCase().includes(search.trim().toLowerCase())), [review, priority, search]);
  // A full source page may have more records; no global total is claimed.
  const nextPossible = current && ['order', 'trip'].some(type => current.entities.filter(entity => entity.entity_type === type).length >= 50);
  const changeAccount = event => { setResult(null); setError(''); setOffset(0); setSearch(''); setPriority('all'); setAccountId(event.target.value); };

  return <main className="iso-ui sis-review-page" data-iso-theme="light">
    <PageHeader eyebrow="SIS / EVIDENCE REVIEW" title="Review the context" actions={<Link className="iso-button iso-button--secondary" to="/sis/world-model">Open World Model</Link>}>
      See what the operational evidence can tell you, and what still needs verification.
    </PageHeader>
    <Alert tone="info" title="Informational review · no operational actions">Findings describe this account page only. This view excludes LOG-mode orders and uses bounded source pages. Findings are not HOS assessments, dispatch clearance or a saved decision history.</Alert>
    <div className="sis-review-account"><Select label="Authorized account" help="Operating account only. Trip customer: the broker for the carrier. Order/route customer: a customer or company." value={accountId} disabled={accountsLoading || !!accountError || !accounts.length} onChange={changeAccount}>
      <option value="">{accountsLoading ? 'Loading authorized accounts…' : 'Select an authorized account'}</option>{accounts.map(account => <option key={account.account_id} value={account.account_id}>{account.name}</option>)}
    </Select><Button disabled={!accountId || loading} onClick={() => { setResult(null); setRefresh(value => value + 1); }}>Refresh evidence</Button></div>
    {accountError && <Alert tone="danger" title="Account access unavailable" action={<Button onClick={() => setAccountRetry(value => value + 1)}>Retry account access</Button>}>{accountError}</Alert>}
    {accountsLoading && <EmptyState title="Loading account access" loading />}
    {!accountsLoading && !accountError && !accounts.length && <EmptyState title="No authorized accounts">A verified account membership and order/trip read permissions are required. No global records were requested.</EmptyState>}
    {!accountsLoading && accounts.length > 1 && !accountId && <EmptyState title="Choose an account to review">Only server-authorized accounts are listed.</EmptyState>}
    {loading && <EmptyState title="Reviewing the selected evidence page" loading />}
    {error && <Alert tone="danger" title="Evidence review unavailable">{error}</Alert>}
    {review && !loading && <>
      <section className="sis-review-summary" aria-label="Current page review"><Card><span>Records on this page</span><strong>{review.reviewed_entity_count}</strong></Card><Card><span>Findings on this page</span><strong>{review.finding_count}</strong></Card><Card><span>Review mode</span><strong className="sis-review-mode">Informational only</strong><small>Nothing approved or executed</small></Card></section>
      <Card className="sis-review-evidence"><div><h2>Evidence in view</h2><p>Snapshot {new Date(review.generated_at).toLocaleString()} · page {offset / 50 + 1} · up to 50 records per source</p></div><details><summary>Inspect snapshot reference</summary><code>{review.snapshot_digest}</code><p>A reference to this snapshot, not a signature or a saved decision.</p></details></Card>
      <div className="sis-review-filters"><Input label="Search findings" value={search} onChange={event => setSearch(event.target.value)} /><Select label="Finding type" value={priority} onChange={event => setPriority(event.target.value)}><option value="all">All findings</option><option value="review">Record review</option><option value="information">Page context</option></Select><span role="status">{findings.length} of {review.finding_count} findings on this page</span></div>
      <section className="sis-review-findings" aria-label="Evidence findings">{findings.map(finding => <Card as="article" key={finding.finding_id}>
        <div className="sis-review-finding-heading"><Badge tone={finding.priority === 'review' ? 'warning' : 'info'}>{finding.priority === 'review' ? 'Record review' : 'Page context'}</Badge>{finding.entity_key && <code>{finding.entity_key}</code>}</div><h2>{finding.title}</h2><p>{finding.detail}</p><div className="sis-review-next"><strong>Suggested next step</strong><p>{finding.next_step}</p></div>
      </Card>)}</section>
      {!findings.length && <EmptyState title={review.finding_count ? 'No findings match these filters' : 'No additional findings on this page'}>This is not a safety or compliance clearance. Coverage remains bounded.</EmptyState>}
      <nav className="sis-review-pagination" aria-label="Evidence page navigation"><Button variant="secondary" disabled={offset === 0} onClick={() => { setResult(null); setOffset(value => Math.max(0, value - 50)); }}>Previous page</Button><span>Page {offset / 50 + 1} · no account-wide total</span><Button variant="secondary" disabled={!nextPossible || offset >= 100000} onClick={() => { setResult(null); setOffset(value => value + 50); }}>Next page</Button></nav>
    </>}
  </main>;
}

import React, { useCallback, useEffect, useState } from 'react';
import { BASE_URL } from '../../config';
import { Alert, Badge, Button, Card, EmptyState, Input, PageHeader, Select } from '../../design-system/components';
import './DriverOnboarding.css';

const PAGE_SIZE = 50;

function validIdentifier(value) {
  return (typeof value === 'string' && /^[1-9]\d*$/.test(value))
    || (Number.isSafeInteger(value) && value > 0);
}

async function readJson(response) {
  let body;
  try {
    body = await response.json();
  } catch (error) {
    throw new Error('The SIS service returned an unreadable response.');
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('The SIS service returned an invalid response.');
  }
  if (!response.ok || body.status !== 'success') {
    const requestError = new Error(typeof body.message === 'string' ? body.message : 'The SIS onboarding request could not be completed.');
    requestError.status = response.status;
    requestError.reason = body.reason;
    throw requestError;
  }
  return body;
}

function readAccounts(body) {
  if (!Array.isArray(body.accounts) || body.accounts.some((account) => (
    !account || !validIdentifier(account.account_id)
    || typeof account.name !== 'string' || !account.name
  ))) {
    throw new Error('The SIS service returned an invalid authorized-account list.');
  }
  return body.accounts;
}

function readCsrfToken(body) {
  if (typeof body.token !== 'string' || !/^[a-f0-9]{64}$/i.test(body.token)) {
    throw new Error('The SIS service returned an invalid security token.');
  }
  return body.token;
}

function readOnboardingPage(body) {
  const validStatuses = ['PENDING_REVIEW', 'VERIFIED_UNLINKED', 'REJECTED'];
  if (!Array.isArray(body.records)
    || !body.page || typeof body.page !== 'object'
    || typeof body.page.has_more !== 'boolean'
    || (body.page.next_cursor !== null && typeof body.page.next_cursor !== 'string')
    || body.records.some((record) => (
      !record
      || !validIdentifier(record.onboarding_id)
      || !validIdentifier(record.driver_id)
      || !validStatuses.includes(record.status)
      || !validIdentifier(record.requested_by_user_id)
      || typeof record.requested_at !== 'string'
      || typeof record.ownership_evidence_reference !== 'string'
      || typeof record.can_review !== 'boolean'
      || (record.reviewed_by_user_id !== null && !validIdentifier(record.reviewed_by_user_id))
      || (record.reviewed_at !== null && typeof record.reviewed_at !== 'string')
      || (record.review_reference !== null && typeof record.review_reference !== 'string')
    ))) {
    throw new Error('The SIS service returned an invalid onboarding request page.');
  }
  if (body.page.has_more && (!body.records.length || !body.page.next_cursor)) {
    throw new Error('The SIS service returned incomplete pagination metadata.');
  }
  return body;
}

export default function DriverOnboarding() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [token, setToken] = useState('');
  const [records, setRecords] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageCursors, setPageCursors] = useState([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMoreRecords, setHasMoreRecords] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(null);
  const [storageIssue, setStorageIssue] = useState('');
  const [listReload, setListReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [driverId, setDriverId] = useState('');
  const [ownershipReference, setOwnershipReference] = useState('');
  const [reviewReferences, setReviewReferences] = useState({});

  const loadRecords = useCallback(async (selectedAccount, signal, selectedStatus, cursor) => {
    if (!selectedAccount) {
      setRecords([]);
      setNextCursor(null);
      setHasMoreRecords(false);
      return;
    }
    const query = new URLSearchParams({
      account_id: selectedAccount,
      limit: String(PAGE_SIZE),
    });
    if (cursor) query.set('after_id', cursor);
    if (selectedStatus !== 'all') query.set('status', selectedStatus);
    const response = await fetch(`${BASE_URL}api/sis/driver-onboarding?${query}`, {
      credentials: 'include', signal, headers: { Accept: 'application/json' },
    });
    const body = readOnboardingPage(await readJson(response));
    if (!signal.aborted) {
      setRecords(body.records);
      setHasMoreRecords(body.page?.has_more === true);
      setNextCursor(body.page?.next_cursor || null);
      setStorageAvailable(true);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function initialize() {
      setLoading(true);
      setError('');
      try {
        const [accountsResponse, tokenResponse] = await Promise.all([
          fetch(`${BASE_URL}api/sis/driver-onboarding/accounts`, {
            credentials: 'include', signal: controller.signal, headers: { Accept: 'application/json' },
          }),
          fetch(`${BASE_URL}api/sis/csrf-token`, {
            credentials: 'include', signal: controller.signal, headers: { Accept: 'application/json' },
          }),
        ]);
        const [accountBody, tokenBody] = await Promise.all([readJson(accountsResponse), readJson(tokenResponse)]);
        if (controller.signal.aborted) return;
        const authorizedAccounts = readAccounts(accountBody);
        setAccounts(authorizedAccounts);
        setToken(readCsrfToken(tokenBody));
        if (authorizedAccounts.length === 1) setAccountId(authorizedAccounts[0].account_id);
      } catch (loadError) {
        if (!controller.signal.aborted) setError(loadError.message || 'SIS driver onboarding is unavailable.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    initialize();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setRecords([]);
    setNextCursor(null);
    setHasMoreRecords(false);
    setStorageAvailable(null);
    setStorageIssue('');
    setError('');
    if (!accountId) return () => controller.abort();
    loadRecords(accountId, controller.signal, statusFilter, pageCursors[pageIndex]).catch((loadError) => {
      if (!controller.signal.aborted) {
        setError(loadError.message || 'Could not load onboarding requests.');
        setStorageAvailable(false);
        setStorageIssue(loadError.reason === 'ONBOARDING_STORAGE_NOT_INSTALLED'
          ? 'Reviewed onboarding storage is not installed.'
          : 'Onboarding requests are unavailable.');
      }
    });
    return () => controller.abort();
  }, [accountId, listReload, loadRecords, pageCursors, pageIndex, statusFilter]);

  async function submitRequest(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${BASE_URL}api/sis/driver-onboarding/request`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-SIS-CSRF': token },
        body: JSON.stringify({
          account_id: accountId,
          driver_id: driverId,
          ownership_evidence_reference: ownershipReference,
        }),
      });
      await readJson(response);
      setDriverId('');
      setOwnershipReference('');
      setMessage('Request submitted for a separate authorized review.');
      setPageCursors([null]);
      setPageIndex(0);
      setStatusFilter('all');
      setListReload((value) => value + 1);
    } catch (submitError) {
      setError(submitError.message || 'Could not submit the onboarding request.');
    } finally {
      setBusy(false);
    }
  }

  async function submitReview(record, decision) {
    const reviewReference = reviewReferences[record.onboarding_id] || '';
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${BASE_URL}api/sis/driver-onboarding/${encodeURIComponent(record.onboarding_id)}/review`, {
        method: 'POST',
        credentials: 'include',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-SIS-CSRF': token },
        body: JSON.stringify({
          account_id: accountId,
          decision,
          review_reference: reviewReference,
        }),
      });
      await readJson(response);
      setReviewReferences((references) => ({
        ...references,
        [record.onboarding_id]: '',
      }));
      setMessage(decision === 'approve'
        ? 'Evidence review recorded. The SIS association remains unlinked from ELD providers.'
        : 'Request rejected; no driver or provider records were changed.');
      setPageCursors([null]);
      setPageIndex(0);
      setListReload((value) => value + 1);
    } catch (reviewError) {
      setError(reviewError.message || 'Could not record the review.');
    } finally {
      setBusy(false);
    }
  }

  return <main className="iso-ui sis-onboarding-page" data-iso-theme="dark">
    <PageHeader eyebrow="ISOVIA / SAFETY INTELLIGENCE" title="SIS driver onboarding" actions={<Badge tone="warning">Manual · unlinked</Badge>}>
      Submit a driver ID and ownership evidence reference for a second authorized person to verify.
    </PageHeader>
    <Alert tone="warning" title="No driver or provider records are automatically connected." className="sis-onboarding-notice">
      This workflow does not create or modify IFM drivers, change historical ownership, contact ELD providers, or establish HOS availability.
    </Alert>
    {error && <Alert tone="danger" title="Onboarding unavailable">{error}</Alert>}
    {message && <Alert tone="info" title="Update">{message}</Alert>}

    {loading ? <EmptyState title="Loading authorized onboarding accounts…" loading /> : accounts.length === 0
      ? <EmptyState title="No onboarding account is available">An administrator must grant the SIS onboarding capability to an approved account membership.</EmptyState>
      : <>
        <div className="sis-onboarding-account">
          <Select label="Authorized account" value={accountId} onChange={(event) => {
            setPageCursors([null]);
            setPageIndex(0);
            setAccountId(event.target.value);
          }}>
            <option value="">Choose an account</option>
            {accounts.map((account) => <option key={account.account_id} value={account.account_id}>{account.name}</option>)}
          </Select>
          <p>Only accounts with an explicit server-verified onboarding grant are shown.</p>
        </div>
        {accountId && <>
          <Card className="sis-onboarding-form-card">
            <h2>Request manual association</h2>
            <p>Enter the claimed internal driver ID and a reference that lets the reviewer verify its ownership. SIS does not look up or validate the legacy driver record. Do not enter document contents, credentials, or personal details here.</p>
            <form onSubmit={submitRequest}>
              <Input label="Internal driver ID" type="number" min="1" step="1" required value={driverId} onChange={(event) => setDriverId(event.target.value)} />
              <Input label="Ownership evidence reference" maxLength={160} required value={ownershipReference} onChange={(event) => setOwnershipReference(event.target.value)} />
              <Button type="submit" disabled={busy || !token || storageAvailable !== true}>{busy ? 'Submitting…' : 'Submit for review'}</Button>
            </form>
          </Card>

          {storageAvailable === null
            ? <EmptyState title="Checking onboarding storage…" loading />
            : storageAvailable === false
              ? <Alert tone="warning" title={storageIssue || 'Onboarding requests are unavailable.'}>
                No write actions are available until the authorized onboarding data can be safely loaded.
                <Button variant="secondary" onClick={() => setListReload((value) => value + 1)}>Retry</Button>
              </Alert>
              : <Card className="sis-onboarding-records">
            <div className="sis-onboarding-records-heading">
              <h2>Onboarding requests</h2>
              <div className="sis-onboarding-records-controls">
                <Badge tone="warning">{records.length} on this page</Badge>
                <Select label="Filter requests by status" value={statusFilter} onChange={(event) => {
                  setPageCursors([null]);
                  setPageIndex(0);
                  setStatusFilter(event.target.value);
                }}>
                  <option value="all">All statuses</option>
                  <option value="PENDING_REVIEW">Pending review</option>
                  <option value="VERIFIED_UNLINKED">Verified · unlinked</option>
                  <option value="REJECTED">Rejected</option>
                </Select>
              </div>
            </div>
            {records.length === 0 ? <EmptyState title="No onboarding requests">New requests remain pending until a different authorized person reviews them.</EmptyState> : <div className="sis-onboarding-table-wrap">
              <table>
                <thead><tr><th>Driver ID</th><th>Status</th><th>Evidence reference</th><th>Request audit (UTC)</th><th>Review audit (UTC)</th><th>Review action</th></tr></thead>
                <tbody>{records.map((record) => <tr key={record.onboarding_id}>
                  <td>{record.driver_id}</td>
                  <td>{record.status === 'VERIFIED_UNLINKED' ? 'Verified · unlinked' : record.status.replace(/_/g, ' ')}</td>
                  <td>{record.ownership_evidence_reference}</td>
                  <td><div className="sis-onboarding-audit">
                    <span>Requested by user {record.requested_by_user_id}</span>
                    {record.requested_at
                      ? <time dateTime={`${record.requested_at.replace(' ', 'T')}Z`}>{record.requested_at} UTC</time>
                      : <span>Request time not recorded</span>}
                  </div></td>
                  <td><div className="sis-onboarding-audit">
                    {record.reviewed_by_user_id
                      ? <span>Reviewed by user {record.reviewed_by_user_id}</span>
                      : <span>Not reviewed</span>}
                    {record.reviewed_at
                      ? <time dateTime={`${record.reviewed_at.replace(' ', 'T')}Z`}>{record.reviewed_at} UTC</time>
                      : null}
                    {record.review_reference && <span>Reference: {record.review_reference}</span>}
                  </div></td>
                  <td>{record.status === 'PENDING_REVIEW' && record.can_review ? <div className="sis-onboarding-review-actions">
                    <Input label={`Decision reference for driver ${record.driver_id}`} value={reviewReferences[record.onboarding_id] || ''} maxLength={160} required onChange={(event) => setReviewReferences((references) => ({
                      ...references,
                      [record.onboarding_id]: event.target.value,
                    }))} />
                    <Button variant="secondary" disabled={busy || !(reviewReferences[record.onboarding_id] || '').trim() || !token || storageAvailable !== true} onClick={() => submitReview(record, 'approve')}>Approve unlinked</Button>
                    <Button variant="secondary" disabled={busy || !(reviewReferences[record.onboarding_id] || '').trim() || !token || storageAvailable !== true} onClick={() => submitReview(record, 'reject')}>Reject</Button>
                  </div> : record.status === 'PENDING_REVIEW' ? 'Requester cannot review their own request.' : '—'}</td>
                </tr>)}</tbody>
              </table>
            </div>}
            <nav className="sis-onboarding-pagination" aria-label="Onboarding request pages">
              <Button variant="secondary" disabled={busy || pageIndex === 0} onClick={() => setPageIndex((index) => Math.max(0, index - 1))}>Previous</Button>
              <span>Page {pageIndex + 1} · {records.length} request{records.length === 1 ? '' : 's'}</span>
              <Button variant="secondary" disabled={busy || !hasMoreRecords || !nextCursor} onClick={() => {
                setPageCursors((cursors) => [...cursors.slice(0, pageIndex + 1), nextCursor]);
                setPageIndex((index) => index + 1);
              }}>Next</Button>
            </nav>
          </Card>}
        </>}
      </>}
    <p className="sis-onboarding-footer">“Verified · unlinked” records an account-scoped manual evidence review only. It is not a legal qualification, provider connection, verified ELD feed, or dispatch clearance.</p>
  </main>;
}

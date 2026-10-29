import React, { useState } from 'react';
import { Alert, Badge, Button, EmptyState, Input } from '../../design-system/components';
import './customs-review.css';

const states = {
  DRAFT: 'Manifest Draft', PENDING_VERIFICATION: 'Pending Dispatcher Verification',
  APPROVED: 'Approved', SUBMITTED: 'Submitted', ACCEPTED: 'Accepted',
  REJECTED: 'Rejected', AMENDMENT_REQUIRED: 'Amendment Required',
};
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const revision = value => Number.isSafeInteger(value) && value > 0;

function validateReview(review) {
  const snapshot = review?.snapshot;
  const assessment = review?.assessment;
  if (!snapshot || !assessment
    || !['account_id', 'manifest_id', 'trip_id', 'order_id'].every(key => nonempty(snapshot[key]))
    || !['revision', 'source_revision', 'ocr_revision'].every(key => revision(snapshot[key]))
    || !Object.prototype.hasOwnProperty.call(states, snapshot.state)
    || !['CA_US', 'US_CA'].includes(snapshot.direction)
    || assessment.manifest_type !== (snapshot.direction === 'CA_US' ? 'ACE' : 'ACI')
    || typeof assessment.approval_current !== 'boolean'
    || assessment.submission_enabled !== false
    || !['blocking_issues', 'warnings'].every(key => Array.isArray(assessment[key]) && assessment[key].every(nonempty))
    || !Array.isArray(snapshot.documents) || !snapshot.documents.length
    || new Set(snapshot.documents.map(document => document?.id)).size !== snapshot.documents.length
    || snapshot.documents.some(document => !document || !nonempty(document.id) || !revision(document.version)
      || typeof document.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(document.sha256)
      || (document.name !== undefined && !nonempty(document.name)))
    || !['fields', 'extracted_fields'].every(key => snapshot[key] && typeof snapshot[key] === 'object'
      && !Array.isArray(snapshot[key]) && Object.keys(snapshot[key]).length
      && Object.entries(snapshot[key]).every(([name, value]) => nonempty(name) && (value === null || typeof value === 'string')))) {
    throw new Error('An authorized, versioned customs review projection is required. Legacy trip or OCR responses cannot be treated as an approved manifest.');
  }
}

function ReviewWorkspace({ review, canReview }) {
  const { snapshot, assessment } = review;
  const [proposed, setProposed] = useState(snapshot.fields);
  const dirty = Object.keys(snapshot.fields).some(key => proposed[key] !== snapshot.fields[key]);
  const editable = canReview && ['DRAFT', 'PENDING_VERIFICATION', 'APPROVED'].includes(snapshot.state);
  const reset = () => {
    if (!dirty || window.confirm('Discard proposed customs corrections? Nothing has been saved.')) setProposed(snapshot.fields);
  };
  return <>
    <section className="customs-review-summary" aria-label="Manifest identity and status">
      <div><span>Manifest</span><strong>{snapshot.manifest_id}</strong></div>
      <div><span>TripID / OrderID</span><strong>{snapshot.trip_id} / {snapshot.order_id}</strong></div>
      <div><span>Manifest status</span><Badge tone="neutral">{states[snapshot.state]}</Badge></div>
      <div><span>Customs release</span><strong>Not verified</strong></div>
    </section>
    <p>Direction: {snapshot.direction === 'CA_US' ? 'Canada to United States / ACE' : 'United States to Canada / ACI'}.
      {' '}Review revision {snapshot.revision}; shipment revision {snapshot.source_revision}; OCR revision {snapshot.ocr_revision}.</p>
    {(dirty || (snapshot.state === 'APPROVED' && !assessment.approval_current)) && <Alert tone="warning" title="Dispatcher review required">
      {dirty ? 'These are local proposed corrections only. They are not saved, approved or submitted. A change requires validation and a fresh dispatcher approval.' : 'The prior approval does not match the current document/field versions. Revalidation and another dispatcher review are required.'}
    </Alert>}
    <div className="customs-review-columns">
      <section aria-labelledby="customs-original-title"><h2 id="customs-original-title">Original shipment documents</h2>
        <p>Private original-file viewing is not connected. No public document URLs are opened.</p>
        <ul className="customs-documents">{snapshot.documents.map(document => <li key={document.id}>
          <strong>{document.name || document.id}</strong><span>Document {document.id} / version {document.version}</span>
          <Button variant="secondary" disabled title="Requires an account-authorized private document download.">View original document</Button>
        </li>)}</ul>
        <h3>Original OCR extraction</h3><p>Preserved separately from corrections. Confidence and document evidence require review; no missing value is invented.</p>
        <dl className="customs-extraction">{Object.entries(snapshot.extracted_fields).map(([key, value]) => <div key={key}><dt>{key.replace(/_/g, ' ')}</dt><dd>{value || 'Not provided'}<small>OCR value / unverified</small></dd></div>)}</dl>
      </section>
      <section aria-labelledby="customs-fields-title"><h2 id="customs-fields-title">Dispatcher verification</h2>
        <p>Compare every value against the originals before approval. These controls do not create a filing payload.</p>
        {assessment.blocking_issues.length > 0 && <Alert tone="danger" title="Blocking validation issues"><ul>{assessment.blocking_issues.map((issue, index) => <li key={index}>{issue}</li>)}</ul></Alert>}
        {assessment.warnings.length > 0 && <Alert tone="warning" title="Validation warnings"><ul>{assessment.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></Alert>}
        {Object.entries(proposed).map(([key, value]) => <Input key={key} label={key.replace(/_/g, ' ')} value={value ?? ''} disabled={!editable} onChange={event => setProposed(current => ({ ...current, [key]: event.target.value }))} />)}
        <div className="customs-review-actions">
          <Button variant="secondary" disabled={!dirty} onClick={reset}>Reset proposed corrections</Button>
          <Button disabled title="Account-scoped versioned persistence is not connected.">Save corrections</Button>
          <Button disabled title="Durable dispatcher approval and idempotent authorized submission are not connected.">Approve and Submit</Button>
        </div>
      </section>
    </div>
  </>;
}

export default function CustomsManifestReview({ review = null, canReview = false }) {
  let error = '';
  if (review !== null) {
    try { validateReview(review); } catch (validationError) { error = validationError.message; }
  }
  return <main className="content-wrapper iso-ui customs-review" data-iso-theme="light">
    <header><p className="customs-review-eyebrow">IFM / SIS / Human verification</p><h1>Customs Manifest Review</h1><p>SIS prepares the first review. An authorized dispatcher performs the second.</p></header>
    <Alert tone="warning" title="Review foundation only">
      Live documents, saved corrections, durable approval and BorderConnect submission are not connected.
      Manifest acceptance never proves customs release. No customs filing or certified HOS update is made by this screen.
    </Alert>
    {error && <Alert tone="danger" title="Customs review unavailable">{error}</Alert>}
    {review !== null && !error ? <ReviewWorkspace key={JSON.stringify([review.snapshot.account_id, review.snapshot.manifest_id, review.snapshot.revision])} review={review} canReview={canReview} /> :
      <EmptyState title="Authorized customs review not connected">Select a persisted account-owned trip and versioned documents through the future authorized workflow. No demo or legacy records are loaded as real customs data.</EmptyState>}
  </main>;
}

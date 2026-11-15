import React, { useState } from 'react';
import { Alert, Badge, Button, Card, PageHeader, Select } from '../../design-system/components';
import { COMPLIANCE_COVERAGE, SAFETY_AREAS, SAFETY_REFERENCE_DATE } from './safetyRequirements';
import './Safety.css';

const VIEWS = [
  { id: 'overview', label: 'Safety overview' },
  { id: 'evidence', label: 'Evidence requirements' },
  { id: 'coverage', label: 'Compliance coverage' },
  { id: 'references', label: 'U.S. references' },
];

function CoverageStatus({ status }) {
  return <Badge tone="warning">{status === 'NOT_ASSESSED' ? 'Not assessed' : 'Disabled · review pending'}</Badge>;
}

function JurisdictionSourceDirectory({ scope }) {
  const [filter, setFilter] = useState('');
  const normalizedFilter = filter.trim().toLocaleLowerCase();
  const sources = scope.jurisdictionSources.filter((source) => (
    `${source.jurisdiction} ${source.title}`.toLocaleLowerCase().includes(normalizedFilter)
  ));

  return <details className="sis-safety-jurisdictions">
    <summary>{scope.portalLabel} ({scope.jurisdictionSources.length})</summary>
    <label className="sis-safety-portal-filter">
      <span>Filter by jurisdiction or portal</span>
      <input
        type="search"
        aria-label={`${scope.portalLabel} filter`}
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </label>
    <p className="sis-safety-source-status" role="status">Showing {sources.length} of {scope.jurisdictionSources.length} portals</p>
    {sources.length > 0
      ? <ul>{sources.map((source) => <li key={source.jurisdiction}>
        <strong>{source.jurisdiction}:</strong> <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sis-safety-sr-only"> (opens in a new tab)</span></a>
      </li>)}</ul>
      : <p>No jurisdiction or portal matches that filter.</p>}
    <p className="sis-safety-source-status">{scope.portalDisclaimer}</p>
  </details>;
}

function ComplianceCoverage() {
  return <>
    <p className="sis-safety-view-note">Coverage inventory only. No jurisdiction or carrier program is certified by this page. Every scope below remains unavailable for a compliance or dispatch decision.</p>
    <div className="sis-safety-coverage-grid">{COMPLIANCE_COVERAGE.map((scope) => <Card as="article" key={scope.id}>
      <div className="sis-safety-requirement-heading">
        <h3>{scope.title}</h3>
        <CoverageStatus status={scope.status} />
      </div>
      <p>{scope.summary}</p>
      <details className="sis-safety-jurisdictions">
        <summary>Included scopes ({scope.jurisdictions.length})</summary>
        <ul>{scope.jurisdictions.map((jurisdiction) => <li key={jurisdiction}>{jurisdiction}</li>)}</ul>
      </details>
      {scope.sources && <>
        <p className="sis-safety-source-status">{scope.sourceStatus} · source checked {scope.sourceChecked}</p>
        <SourceLinks sources={scope.sources} />
      </>}
      {scope.jurisdictionSources && <JurisdictionSourceDirectory scope={scope} />}
      <p className="sis-safety-boundary">{scope.boundary}</p>
    </Card>)}</div>
  </>;
}

function SourceLinks({ sources }) {
  return <ul className="sis-safety-sources">{sources.map((source) => <li key={source.url}>
    <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}<span className="sis-safety-sr-only"> (opens in a new tab)</span> <i className="fa fa-external-link" aria-hidden="true" /></a>
  </li>)}</ul>;
}

export default function Safety() {
  const [view, setView] = useState('overview');
  const [area, setArea] = useState('all');
  const areas = SAFETY_AREAS.filter((item) => area === 'all' || item.id === area);

  function reviewArea(id) {
    setArea(id);
    setView('evidence');
  }

  return <main className="iso-ui sis-safety-page" data-iso-theme="dark">
    <PageHeader eyebrow="ISOVIA / SAFETY INTELLIGENCE" title="SIS Safety" actions={<Badge tone="warning">Advisory workspace</Badge>}>
      Bring the evidence into focus. Keep safety decisions with the people responsible.
    </PageHeader>

    <Alert tone="warning" title="Live safety assessment is not connected." className="sis-safety-notice">
      Driver, vehicle and trip safety remain unknown. This workspace does not provide compliance clearance or dispatch approval.
    </Alert>

    <section className="sis-safety-hero" aria-labelledby="safety-review-title">
      <div className="sis-safety-hero-copy">
        <span className="sis-safety-kicker"><i className="fa fa-shield" aria-hidden="true" /> EVIDENCE BEFORE ACTION</span>
        <h2 id="safety-review-title">A clearer view.<br />A considered decision.</h2>
        <p>Review hours, equipment, route conditions and driver concerns together. Missing information stays visible at every step.</p>
        <Button onClick={() => { setArea('all'); setView('evidence'); }}>Explore evidence requirements <i className="fa fa-arrow-right" aria-hidden="true" /></Button>
      </div>
      <div className="sis-safety-readiness">
        <div className="sis-safety-readiness-heading"><span>Assessment readiness</span><Badge tone="warning">Not assessed</Badge></div>
        <ol>
          <li><i className="fa fa-circle-o" aria-hidden="true" /><div><strong>Confirm authorized context</strong><span>Company, driver, vehicle and trip</span></div></li>
          <li><i className="fa fa-circle-o" aria-hidden="true" /><div><strong>Verify source evidence</strong><span>Identity, freshness and complete history</span></div></li>
          <li><i className="fa fa-circle-o" aria-hidden="true" /><div><strong>Apply reviewed requirements</strong><span>Jurisdiction, exceptions and rule version</span></div></li>
          <li><i className="fa fa-circle-o" aria-hidden="true" /><div><strong>Present for human review</strong><span>Explanation, uncertainty and alternatives</span></div></li>
        </ol>
      </div>
    </section>

    <section className="sis-safety-metrics" aria-label="Current assessment availability">
      {[
        ['clock-o', 'HOS availability', 'Not assessed', 'Calculations disabled; reviewed rules and verified duty history required'],
        ['truck', 'Vehicle readiness', 'Unknown', 'Inspection and defect evidence required'],
        ['map-signs', 'Route assessment', 'Unavailable', 'Verified truck route required'],
        ['user-o', 'Human review workflow', 'Not connected', 'No recommendation or approval queue'],
      ].map(([icon, title, status, detail]) => <Card as="article" key={title}>
        <div className="sis-safety-metric-title"><i className={`fa fa-${icon}`} aria-hidden="true" /><span>{title}</span></div>
        <strong>{status}</strong><p>{detail}</p>
      </Card>)}
    </section>

    <nav className="sis-safety-views" aria-label="Safety workspace views">
      {VIEWS.map((item) => <Button key={item.id} variant="secondary" aria-pressed={view === item.id} aria-controls="sis-safety-content" onClick={() => setView(item.id)}>{item.label}</Button>)}
    </nav>

    <section id="sis-safety-content" className="sis-safety-content" aria-label={VIEWS.find((item) => item.id === view).label}>
      {view === 'overview' ? <>
        <div className="sis-safety-section-heading"><div><span className="sis-safety-kicker">REVIEW DOMAINS</span><h2>One safety context. Every source matters.</h2></div><span>U.S. federal property-carrying reference scope</span></div>
        <div className="sis-safety-domains">{SAFETY_AREAS.map((item) => <Card as="article" className="sis-safety-domain" key={item.id}>
          <div className="sis-safety-domain-top"><span className="sis-safety-icon"><i className={`fa fa-${item.icon}`} aria-hidden="true" /></span><Badge>Awaiting evidence</Badge></div>
          <h3>{item.title}</h3><p>{item.description}</p>
          <Button variant="secondary" onClick={() => reviewArea(item.id)} aria-label={`Review ${item.title} evidence`}>Review requirements <i className="fa fa-arrow-right" aria-hidden="true" /></Button>
        </Card>)}</div>
        <Card className="sis-safety-alert-empty"><i className="fa fa-inbox" aria-hidden="true" /><div><h2>Operational alerts unavailable</h2><p>A verified alert feed has not been connected. This is not a report of zero risks or a safe-to-drive result.</p></div></Card>
      </> : view === 'coverage' ? <>
        <div className="sis-safety-section-heading">
          <div><span className="sis-safety-kicker">JURISDICTION INVENTORY</span><h2>Where SIS safety coverage stands</h2></div>
          <Badge tone="warning">No compliance clearance</Badge>
        </div>
        <ComplianceCoverage />
      </> : <>
        <div className="sis-safety-section-heading"><div><span className="sis-safety-kicker">{view === 'evidence' ? 'INPUT READINESS' : 'REGULATORY REFERENCES'}</span><h2>{view === 'evidence' ? 'What a safety review needs' : 'Start with the source'}</h2></div>
          <Select label="Safety area" value={area} onChange={(event) => setArea(event.target.value)}><option value="all">All safety areas</option>{SAFETY_AREAS.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</Select>
        </div>
        <p className="sis-safety-view-note">{view === 'evidence' ? 'These are required inputs, not completed checks. No operational evidence has been loaded into this workspace.' : `References checked ${SAFETY_REFERENCE_DATE}. Applicability, exceptions and effective requirements need qualified review for each operation.`}</p>
        <div className="sis-safety-requirements">{areas.map((item) => <Card as="article" key={item.id}>
          <div className="sis-safety-requirement-heading"><h3><i className={`fa fa-${item.icon}`} aria-hidden="true" /> {item.title}</h3><Badge tone="warning">{view === 'evidence' ? 'Evidence unavailable' : 'Reference only'}</Badge></div>
          {item.id === 'hos' && view === 'evidence' && <Alert tone="warning" title="HOS calculations are disabled">
            U.S. and Canadian federal source records are references only. Qualified applicability and rule review, independently reviewed expected-result cases, and verified duty-history evidence are still required. SIS does not calculate driver hours or authorize dispatch.
          </Alert>}
          {view === 'evidence' && <ul className="sis-safety-evidence-list">{item.evidence.map((requirement) => <li key={requirement}><i className="fa fa-circle-o" aria-hidden="true" /><span>{requirement}</span><span className="sis-safety-evidence-state">Not verified</span></li>)}</ul>}
          <p className="sis-safety-boundary">{item.boundary}</p><SourceLinks sources={item.sources} />
        </Card>)}</div>
      </>}
    </section>

    <footer className="sis-safety-footer"><strong>Scope & applicability</strong><p>This initial design references U.S. federal property-carrying operations and lists Canadian federal sources for discovery only. Neither scope has approved calculation rules or expected-result cases. Passenger operations, state and provincial/territorial rules, cross-border requirements, hazmat, CDL and drug/alcohol programs need operation-specific review. The references are a starting point, not a complete USDOT compliance program or Canadian compliance program.</p><p>Dispatcher workspace · Use detailed review while safely parked or away from driving. No official ELD records are edited here.</p></footer>
  </main>;
}

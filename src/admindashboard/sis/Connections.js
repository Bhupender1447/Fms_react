import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Card, PageHeader } from '../../design-system/components';
import './Connections.css';
import { FiActivity, FiArrowRight, FiCheckCircle, FiDatabase, FiEye, FiGitBranch, FiLayers, FiShield } from 'react-icons/fi';

const FOUNDATIONS = [
  { name: 'World Model', icon: FiDatabase, status: 'Read-only prototype', description: 'One operational picture, with the source and uncertainty kept in view.', detail: 'Account-scoped inspection exists. Verified ownership, complete relationships and live account acceptance are still required.', to: '/sis/world-model', action: 'Inspect account context' },
  { name: 'Event Engine', icon: FiActivity, status: 'Contract only', description: 'Make each committed change part of a traceable journey.', detail: 'An event format is defined and tested. Reliable capture, storage, delivery and replay are not connected.' },
  { name: 'Governance Engine', icon: FiShield, status: 'Planned', description: 'Check the evidence, permissions and approval before an action.', detail: 'The general policy and approval service is planned. A recommendation will never be its own permission to act.' },
  { name: 'Decision Ledger', icon: FiGitBranch, status: 'Planned', description: 'Keep the why, the review and the outcome together.', detail: 'A durable decision history is planned. Existing review fields and raw provider evidence do not form a decision ledger.' },
  { name: 'Supervisor', icon: FiEye, status: 'Planned', description: 'Give your team the final say, with the context to decide.', detail: 'The human review queue and governed action workflow are planned. This hub does not approve or execute operational changes.' },
];

const CONNECTIONS = [
  {
    id: 'native-eld', title: 'Isovia Native ELD Lab', status: 'Hardware-neutral prototype',
    description: 'Test Isovia’s event format, sequence integrity, telemetry consistency and explicit duty intervals. Synthetic/browser-supplied evidence is not an official ELD record.',
    links: [{ to: '/sis/native-eld', label: 'Open Native ELD Lab' }],
  },
  {
    id: 'evidence-review', title: 'Evidence review', status: 'Read-only · page context',
    description: 'Review source-time gaps, unspecified statuses and withheld context from your authorized World Model page. Findings do not authorize actions.',
    links: [{ to: '/sis/review', label: 'Open evidence review' }],
  },
  {
    id: 'drivers',
    title: 'Driver and account association',
    status: 'Manual · unlinked',
    description: 'Submit a driver ID and ownership-evidence reference for separate review. Approved records stay unlinked from legacy ownership and ELD identities.',
    links: [{ to: '/sis/driver-onboarding', label: 'Open driver onboarding' }],
  },
  {
    id: 'world-model',
    title: 'SIS World Model',
    status: 'Read-only · acceptance pending',
    description: 'Inspect account-scoped operational projections. Live authenticated account acceptance and trusted driver ownership mappings are still outstanding.',
    links: [{ to: '/sis/world-model', label: 'Open World Model' }],
  },
  {
    id: 'eld',
    title: 'ELD provider consoles',
    status: 'Not verified as SIS sources',
    description: 'Existing Motive and Samsara pages are legacy application views. Their identities, account scope, payload semantics, and upload coverage are not verified for SIS.',
    links: [
      { to: '/gomotive/vehicletable', label: 'Open legacy Motive data' },
      { to: '/samsara/samsarausers', label: 'Open legacy Samsara data' },
    ],
  },
  {
    id: 'hos-safety',
    title: 'HOS and Safety',
    status: 'NOT ASSESSED · calculations disabled',
    description: 'No HOS result or compliance clearance is connected. Regulatory review, verified duty-history evidence, and independently reviewed expected-result cases remain required.',
    links: [
      { to: '/sis/safety', label: 'Open SIS Safety' },
      { to: '/hos-fleet', label: 'Open legacy HOS view (not SIS evidence)' },
    ],
  },
];

export default function Connections() {
  return <main className="iso-ui sis-connections-page" data-iso-theme="light">
    <div className="sis-connections-hero" data-iso-theme="dark">
    <PageHeader eyebrow="ISOVIA / SAFETY INTELLIGENCE" title="SIS connections" actions={<Badge tone="warning">Readiness overview</Badge>}>
      A clearer picture. A considered next move.
    </PageHeader>
    <p className="sis-connections-hero-description">Bring operational context, source evidence and human oversight into one connected direction.</p>
    <div className="sis-connections-principles" aria-label="SIS operating principles"><span><FiLayers aria-hidden="true" />Read-only first</span><span><FiShield aria-hidden="true" />Evidence before action</span><span><FiCheckCircle aria-hidden="true" />Human oversight</span></div>
    </div>

    <Alert tone="warning" title="Navigation is connected; operational integrations are not certified.">
      This page does not link driver ownership, call providers, import ELD records, calculate HOS, or authorize dispatch. Existing legacy pages are labeled and remain outside SIS evidence verification.
    </Alert>

    <section className="sis-foundation-section" aria-labelledby="sis-foundations-heading">
      <div className="sis-connections-section-heading"><div><p className="sis-connections-eyebrow">THE INTELLIGENCE FOUNDATION</p><h2 id="sis-foundations-heading">Five parts. One accountable flow.</h2></div><p>Explore what each foundation does and where it stands today.</p></div>
      <ol className="sis-foundation-grid">{FOUNDATIONS.map((foundation, index) => { const Icon = foundation.icon; return <li key={foundation.name}>
        <details className="sis-foundation-card"><summary><div className="sis-foundation-top"><Icon aria-hidden="true" /><span>0{index + 1}</span></div><h3>{foundation.name}</h3><span className="sis-foundation-status">{foundation.status}</span><p>{foundation.description}</p><span className="sis-foundation-expand">View readiness <span aria-hidden="true">+</span></span></summary><div className="sis-foundation-detail"><p>{foundation.detail}</p>{foundation.to && <Link to={foundation.to}>{foundation.action}<FiArrowRight aria-hidden="true" /></Link>}</div></details>
      </li>; })}</ol>
    </section>
    <div className="sis-connections-section-heading sis-workspace-heading"><div><p className="sis-connections-eyebrow">YOUR WORKSPACES</p><h2>Start with the source.</h2></div><p>Open an existing workspace. Its status stays visible before you enter.</p></div>
    <section className="sis-connections-grid" aria-label="SIS connection status">
      {CONNECTIONS.map((connection) => <Card as="article" key={connection.id} className="sis-connection-card">
        <div className="sis-connection-heading">
          <h2>{connection.title}</h2>
          <Badge tone="warning">{connection.status}</Badge>
        </div>
        <p>{connection.description}</p>
        <nav aria-label={`${connection.title} links`}>
          {connection.links.map((link) => <Link key={link.to} className="sis-connection-link" to={link.to}>{link.label}<span aria-hidden="true"> →</span></Link>)}
        </nav>
      </Card>)}
    </section>

    <p className="sis-connections-footer">A navigation link is not a data mapping, evidence verification, legal review, or authorization to act. SIS keeps unknown and unverified states explicit.</p>
  </main>;
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Badge, Card, PageHeader } from '../../design-system/components';
import './Connections.css';

const CONNECTIONS = [
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
  return <main className="iso-ui sis-connections-page" data-iso-theme="dark">
    <PageHeader eyebrow="ISOVIA / SAFETY INTELLIGENCE" title="SIS connections" actions={<Badge tone="warning">Readiness overview</Badge>}>
      Navigate the SIS workspaces and see which operational links are still gated.
    </PageHeader>

    <Alert tone="warning" title="Navigation is connected; operational integrations are not certified.">
      This page does not link driver ownership, call providers, import ELD records, calculate HOS, or authorize dispatch. Existing legacy pages are labeled and remain outside SIS evidence verification.
    </Alert>

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

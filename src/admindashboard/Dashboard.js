import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../config';
import { getLoadErrorMessage } from '../services/loadErrors';
import TaskReminder from './Tasks/TaskReminder';
import './command-center.css';

const metrics = [
  { label: 'Trucks', key: 'total_trucks', to: '/trucks', icon: 'fa fa-truck', tone: 'cyan' },
  { label: 'Drivers', key: 'total_drivers', to: '/drivers', icon: 'fa fa-id-card-o', tone: 'violet' },
  { label: 'Trailers', key: 'total_trailors', to: '/trailors', icon: 'fa fa-train', tone: 'blue' },
  { label: 'Fleets', key: 'total_fleets', to: '/fleets', icon: 'fa fa-sitemap', tone: 'mint' },
];

const workflow = [
  { number: '01', title: 'Order intake', detail: 'Capture customer, route, dates and freight details.', to: '/orderlist', action: 'Manage orders', icon: 'fa fa-inbox' },
  { number: '02', title: 'Dispatch planning', detail: 'Build a trip, assign equipment and coordinate capacity.', to: '/DispatchBoard', action: 'Open dispatch', icon: 'fa fa-random' },
  { number: '03', title: 'Driver execution', detail: 'Review assigned work, stops and duty records.', to: '/triplist', action: 'Manage trips', icon: 'fa fa-road' },
  { number: '04', title: 'Closeout & finance', detail: 'Continue into documents, invoices and accounting.', to: '/invoices', action: 'Open invoices', icon: 'fa fa-file-text-o' },
];

const sisLayers = [
  { title: 'World Model', icon: 'fa fa-globe' },
  { title: 'Event Engine', icon: 'fa fa-bolt' },
  { title: 'Governance Engine', icon: 'fa fa-shield' },
  { title: 'Decision Ledger', icon: 'fa fa-book' },
  { title: 'Supervisor', icon: 'fa fa-eye' },
];

const formatCount = (value) => {
  const count = Number(value);
  return Number.isFinite(count) ? count.toLocaleString() : '—';
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    axios.get(`${BASE_URL}api/cpanel`, { withCredentials: true })
      .then((response) => {
        if (active) setData(response.data || {});
      })
      .catch((requestError) => {
        console.error('Dashboard summary request failed:', requestError.response?.status || requestError.message);
        if (active) setError(getLoadErrorMessage(requestError, 'Fleet totals'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [refreshToken]);

  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long', month: 'long', day: 'numeric',
  }).format(new Date());

  return (
    <main className="content-wrapper dashboard-page command-center">
      <div className="command-center-inner">
        <header className="cc-topline">
          <div className="cc-breadcrumb"><span className="cc-breadcrumb-dot" /> ISOVIA <span>/</span> OPERATIONS</div>
          <div className="cc-topline-right">
            <span className={`cc-api-state ${error ? 'is-waiting' : loading ? 'is-loading' : 'is-ready'}`}>
              <span className="cc-state-dot" /> {error ? 'Data feed unavailable' : loading ? 'Connecting to data' : 'Fleet data connected'}
            </span>
            <button className="cc-refresh" type="button" onClick={() => setRefreshToken((token) => token + 1)} disabled={loading} aria-label="Refresh dashboard data">
              <i className={`fa fa-refresh ${loading ? 'cc-spin' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </header>

        <section className="cc-hero">
          <div className="cc-hero-copy">
            <p className="cc-kicker">FREIGHT OPERATIONS PLATFORM <span>·</span> {today.toUpperCase()}</p>
            <h1>Command <span>center</span></h1>
            <p className="cc-hero-subtitle">One view of freight, fleet and the work moving through Isovia.</p>
            <div className="cc-hero-actions">
              <Link className="cc-button cc-button-primary" to="/DispatchBoard"><i className="fa fa-random" aria-hidden="true" /> Open dispatch</Link>
              <Link className="cc-button cc-button-quiet" to="/createorder"><i className="fa fa-plus" aria-hidden="true" /> Create an order</Link>
            </div>
          </div>
          <div className="cc-orbit" aria-hidden="true">
            <div className="cc-orbit-ring cc-orbit-ring-one" />
            <div className="cc-orbit-ring cc-orbit-ring-two" />
            <div className="cc-orbit-core"><span>IFM</span><small>CONTROL</small></div>
            <span className="cc-orbit-node cc-orbit-node-one"><i className="fa fa-truck" /></span>
            <span className="cc-orbit-node cc-orbit-node-two"><i className="fa fa-map-marker" /></span>
            <span className="cc-orbit-node cc-orbit-node-three"><i className="fa fa-cube" /></span>
            <span className="cc-orbit-caption">CONNECTED OPERATIONS</span>
          </div>
        </section>

        {error && (
          <div className="cc-feed-notice" role="status">
            <span className="cc-notice-icon"><i className="fa fa-exclamation-triangle" aria-hidden="true" /></span>
            <div><strong>Fleet totals could not be loaded</strong><p>{error} Values below stay blank until the dashboard API responds.</p></div>
            <button type="button" onClick={() => setRefreshToken((token) => token + 1)} disabled={loading}>Try again</button>
          </div>
        )}

        <section className="cc-section" aria-labelledby="fleet-snapshot-title">
          <div className="cc-section-heading">
            <div><p className="cc-section-label">LIVE SNAPSHOT</p><h2 id="fleet-snapshot-title">Fleet overview</h2></div>
            <span className="cc-section-meta"><span className="cc-state-dot" /> {loading ? 'Syncing records' : error ? 'Waiting for API' : 'Current records'}</span>
          </div>
          <div className="cc-metrics">
            {metrics.map((metric) => (
              <Link className={`cc-metric cc-tone-${metric.tone}`} key={metric.key} to={metric.to}>
                <div className="cc-metric-top"><span>{metric.label}</span><span className="cc-metric-icon"><i className={metric.icon} aria-hidden="true" /></span></div>
                <strong>{data ? formatCount(data[metric.key]) : '—'}</strong>
                <span className="cc-metric-link">View records <i className="fa fa-arrow-right" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </section>

        <div className="cc-main-grid">
          <section className="cc-panel cc-workflow-panel" aria-labelledby="workflow-title">
            <div className="cc-section-heading cc-panel-heading">
              <div><p className="cc-section-label">THE OPERATING LOOP</p><h2 id="workflow-title">Move work forward</h2></div>
              <span className="cc-panel-tag">IFM WORKFLOW</span>
            </div>
            <div className="cc-workflow-list">
              {workflow.map((step, index) => (
                <article className="cc-workflow-step" key={step.number}>
                  <div className="cc-step-track"><span className="cc-step-node"><i className={step.icon} aria-hidden="true" /></span>{index < workflow.length - 1 && <span className="cc-step-line" />}</div>
                  <div className="cc-step-content"><div className="cc-step-title"><span>{step.number}</span><h3>{step.title}</h3></div><p>{step.detail}</p></div>
                  <Link className="cc-step-link" to={step.to} aria-label={step.action}><span>{step.action}</span><i className="fa fa-arrow-right" aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
            <div className="cc-flow-footnote"><i className="fa fa-info-circle" aria-hidden="true" /> Workflow links open existing IFM screens. End-to-end transitions still need staging verification.</div>
          </section>

          <aside className="cc-side-stack">
            <section className="cc-panel cc-sis-panel" aria-labelledby="sis-title">
              <div className="cc-sis-heading"><div><p className="cc-section-label">INTELLIGENCE LAYER</p><h2 id="sis-title">SIS foundation</h2></div><span className="cc-planned-badge">PLANNED</span></div>
              <p className="cc-sis-intro">A future coordination layer built on stable IFM operations and defined product requirements.</p>
              <div className="cc-sis-layers">
                {sisLayers.map((layer, index) => <div className="cc-sis-layer" key={layer.title}><span className="cc-sis-layer-icon"><i className={layer.icon} aria-hidden="true" /></span><span>{layer.title}</span><small>{String(index + 1).padStart(2, '0')}</small></div>)}
              </div>
              <div className="cc-sis-footnote"><i className="fa fa-lock" aria-hidden="true" /> Architecture view only · SIS workflows are not defined or live</div>
            </section>

            <section className="cc-panel cc-readiness-panel" aria-labelledby="readiness-title">
              <div className="cc-section-heading cc-panel-heading"><div><p className="cc-section-label">TRUSTED OPERATIONS</p><h2 id="readiness-title">Data & readiness</h2></div><i className="fa fa-shield cc-shield-icon" aria-hidden="true" /></div>
              <ul className="cc-readiness-list">
                <li><span className="cc-readiness-mark cc-mark-pending"><i className="fa fa-database" aria-hidden="true" /></span><div><strong>Database connection</strong><small>{error ? 'Dashboard feed is unavailable' : 'Status reflects the dashboard API response'}</small></div></li>
                <li><span className="cc-readiness-mark cc-mark-caution"><i className="fa fa-clock-o" aria-hidden="true" /></span><div><strong>HOS & ELD data</strong><small>Source freshness and compliance remain unverified</small></div></li>
                <li><span className="cc-readiness-mark cc-mark-neutral"><i className="fa fa-exchange" aria-hidden="true" /></span><div><strong>Loadboard</strong><small>Local IFM postings · external Loadlink is not connected</small></div></li>
              </ul>
              <Link className="cc-readiness-link" to="/hos-fleet">Review HOS fleet view <i className="fa fa-arrow-right" aria-hidden="true" /></Link>
            </section>
          </aside>
        </div>

        <section className="cc-quick-nav" aria-label="Operations shortcuts">
          <span className="cc-quick-label">QUICK ACCESS</span>
          <Link to="/loadboard"><i className="fa fa-exchange" aria-hidden="true" /> Loadboard</Link>
          <Link to="/tripsmap"><i className="fa fa-map-o" aria-hidden="true" /> Fleet map</Link>
          <Link to="/drivers/listing"><i className="fa fa-users" aria-hidden="true" /> Drivers & HOS</Link>
          <Link to="/accounting"><i className="fa fa-line-chart" aria-hidden="true" /> Accounting</Link>
        </section>

        <div className="cc-reminders"><TaskReminder /></div>
        <footer className="cc-footer"><span>ISOVIA FREIGHT MANAGEMENT</span><span>Operational data is shown only when its source responds.</span></footer>
      </div>
    </main>
  );
};

export default Dashboard;

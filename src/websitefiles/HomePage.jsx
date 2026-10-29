import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiArrowDown, FiTruck, FiUsers, FiSmartphone, FiMap, FiCpu, FiTool, FiCheck, FiLayers } from 'react-icons/fi';
import { Badge } from '../design-system/components';
import { products, sisFoundations, workflow } from './home-content';
import './home-phase2.css';
import HolographicWorkflow from './HolographicWorkflow';
import IsoviaHologram from '../components/IsoviaHologram';

const productIcons = { ifm: FiTruck, ilb: FiUsers, driver: FiSmartphone, visibility: FiMap, sis: FiCpu, ira: FiTool };
const demoEmail = 'mailto:Isoviafreightmanagement@gmail.com?subject=Isovia%20product%20walkthrough';

function ProductLink({ product }) {
  const content = <>{product.action}<FiArrowRight aria-hidden="true" /></>;
  return product.to
    ? <Link className="iso-home-text-link" to={product.to}>{content}</Link>
    : <a className="iso-home-text-link" href={product.href}>{content}</a>;
}

export default function HomePage() {
  const [videoFailed, setVideoFailed] = useState(false);

  return (
    <main id="isovia-page-content" className="iso-ui iso-home" data-iso-theme="light" tabIndex={-1}>
      <Helmet>
        <title>Isovia | Freight Connected. Without Limits.</title>
        <meta name="description" content="A connected direction for freight teams. Explore IFM workspaces, driver workflows, routing views, and SIS intelligence foundations under development." />
      </Helmet>

      <section className="iso-home-hero" aria-labelledby="iso-home-title">
        <div className="iso-home-hero-grid" aria-hidden="true" />
        <div className="iso-home-hero-content">
          <p className="iso-home-eyebrow"><span className="iso-home-brand-mark" aria-hidden="true" />The connected freight ecosystem</p>
          <h1 id="iso-home-title">Every move.<br /><span>Connected.</span></h1>
          <p className="iso-home-hero-lead">Freight connected. Without limits.</p>
          <p className="iso-home-hero-description">From the first order to the final handoff.<br className="iso-home-desktop-break" /> A clearer place for your people, freight, and operations.</p>
          <div className="iso-home-actions">
            <Link className="iso-home-button iso-home-button-primary" to="/alllogin">Open your workspace <FiArrowRight aria-hidden="true" /></Link>
            <a className="iso-home-button iso-home-button-glass" href="#workflow-film">Explore the workflow <FiArrowDown aria-hidden="true" /></a>
          </div>
          <div className="iso-home-hero-footnote"><span>Designed around freight teams</span><span>Canada <span aria-hidden="true">↔</span> United States</span></div>
        </div>
        <IsoviaHologram className="iso-hologram-hero" />
        <a className="iso-home-scroll" href="#products"><span>Discover the ecosystem</span><FiArrowDown aria-hidden="true" /></a>
      </section>

      <nav className="iso-home-explore" aria-label="Explore the Isovia platform">
        <a href="#products"><FiLayers aria-hidden="true" /><span>One ecosystem<small>Tools for the whole move</small></span><FiArrowRight aria-hidden="true" /></a>
        <a href="#ifm-workflow"><FiMap aria-hidden="true" /><span>Connected operations<small>From intake to closeout</small></span><FiArrowRight aria-hidden="true" /></a>
        <a href="#sis-foundations"><FiCpu aria-hidden="true" /><span>Intelligence with oversight<small>Meet the SIS foundations</small></span><FiArrowRight aria-hidden="true" /></a>
      </nav>

      <section className="iso-home-section iso-home-story" aria-labelledby="iso-home-story-title">
        <div className="iso-home-section-heading">
          <div><p className="iso-home-eyebrow">Less fragmentation. More perspective.</p><h2 id="iso-home-story-title">The work is complex.<br /><span>The connection should not be.</span></h2></div>
          <p>Freight moves through people, places, and decisions. Isovia brings the work areas into a shared product direction, so each team can see where it fits.</p>
        </div>
        <ul className="iso-home-audiences" aria-label="Built around freight teams">{[
          ['Brokers', 'Coordinate customers and freight', FiUsers],
          ['Carriers', 'Organize trips and equipment', FiTruck],
          ['Drivers', 'Keep trip details close', FiSmartphone],
          ['Customers', 'Connect around the next handoff', FiMap],
        ].map(([name, description, Icon]) => <li key={name}><Icon aria-hidden="true" /><strong>{name}</strong><span>{description}</span></li>)}</ul>
      </section>

      <section className="iso-home-section iso-home-cinema" aria-labelledby="workflow-film-title">
        <div className="iso-home-section-heading"><div><p className="iso-home-eyebrow">The bigger picture, in motion</p><h2 id="workflow-film-title">Every move. Every handoff.</h2></div><p>Explore the dispatch and delivery cycle in a holographic Isovia view. Select a stage or play the journey.</p></div>
        <div id="workflow-film"><HolographicWorkflow /></div>
        <details className="iso-home-original-film"><summary>Watch the original reference recording</summary>
        <figure className="iso-home-film">
          <div className="iso-home-film-toolbar"><span><span className="iso-home-film-dot" />ISOVIA / WORKFLOW FILM</span><span>30 seconds · Play at your pace</span></div>
          {videoFailed
            ? <div className="iso-home-film-error" role="alert"><strong>The workflow video could not be played.</strong><p>Your browser may not support this recording. Open it directly or explore the steps below.</p><a className="iso-home-text-link" href="/media/isovia-overview.mp4">Open video file <FiArrowRight aria-hidden="true" /></a></div>
            : <div className="iso-home-film-stage"><video className="iso-home-film-video" src="/media/isovia-overview.mp4" controls playsInline preload="none" poster="/images/a-truck1.jpg" aria-label="Dispatch and delivery cycle workflow film" aria-describedby="workflow-film-description" onError={() => setVideoFailed(true)}>
              Your browser does not support this video. <a href="/media/isovia-overview.mp4">Open the workflow film</a>.
            </video></div>}
          <figcaption id="workflow-film-description">Original reference: an illustrated dispatch and delivery cycle, from load creation and pickup to delivery, documents, invoicing, and payment.</figcaption>
        </figure>
        </details>
      </section>

      <section id="products" className="iso-home-section iso-home-ecosystem" aria-labelledby="iso-home-products-title">
        <div className="iso-home-section-heading"><div><p className="iso-home-eyebrow">Purpose-built. Connected by design.</p><h2 id="iso-home-products-title">Built around the whole move.</h2></div><p>One product direction. Distinct work areas. Explore what exists today and what is still taking shape.</p></div>
        <div className="iso-home-products">{products.map((product, index) => {
          const Icon = productIcons[product.id];
          return <article className={`iso-home-product${index === 0 ? ' iso-home-product-featured' : ''}`} key={product.id} aria-labelledby={`product-${product.id}`}>
            <div className="iso-home-product-top"><span className="iso-home-product-icon"><Icon aria-hidden="true" /></span><span className="iso-home-product-index">0{index + 1}</span></div>
            <Badge tone={product.tone}>{product.status}</Badge>
            <h3 id={`product-${product.id}`}>{product.name}</h3>
            <p className="iso-home-product-subtitle">{product.subtitle}</p><p>{product.description}</p>
            {product.note && <p className="iso-home-product-note">{product.note}</p>}
            <ProductLink product={product} />
          </article>;
        })}</div>
      </section>

      <section id="ifm-workflow" className="iso-home-section iso-home-workflow" aria-labelledby="iso-home-workflow-title">
        <div className="iso-home-section-heading"><div><p className="iso-home-eyebrow">One move. A connected journey.</p><h2 id="iso-home-workflow-title">Keep every handoff in view.</h2></div><p>From intake to closeout, these are the work areas that bring the intended operating flow together. End-to-end behavior still requires non-production verification.</p></div>
        <ol className="iso-home-steps">{workflow.map(([title, description], index) => <li key={title}><span className="iso-home-step-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
        <div className="iso-home-workflow-bottom"><p>People stay at the center of the operation.</p><Link className="iso-home-text-link" to="/freightmanagement">Explore the operating platform <FiArrowRight aria-hidden="true" /></Link></div>
      </section>

      <section id="sis-foundations" className="iso-home-section iso-home-sis" aria-labelledby="iso-home-sis-title">
        <div className="iso-home-sis-intro"><p className="iso-home-eyebrow">The next chapter / SIS</p><h2 id="iso-home-sis-title">Intelligence with<br />a clear foundation.</h2><p>Shared context. Traceable decisions. Human oversight. SIS is being developed on top of IFM's operational records, not as a substitute for verified evidence.</p><Badge tone="warning">No autonomous execution implemented</Badge><p className="iso-home-sis-boundary">The World Model has a source implementation and inspection UI. Live account acceptance remains unverified. Other foundations are planned or early scaffolds, not operational automation.</p><div className="iso-home-sis-emblem" aria-hidden="true"><FiCpu /><span>SIS</span><small>Context before action</small></div></div>
        <ol className="iso-home-sis-layers">{sisFoundations.map((foundation, index) => <li key={foundation.name}><span className="iso-home-sis-number">0{index + 1}</span><div><div className="iso-home-sis-layer-heading"><h3>{foundation.name}</h3><Badge tone={index === 0 ? 'info' : 'neutral'}>{foundation.status}</Badge></div><p>{foundation.description}</p></div></li>)}</ol>
      </section>

      <section className="iso-home-section iso-home-integrations-section" aria-labelledby="iso-home-integrations-title">
        <div className="iso-home-section-heading"><div><p className="iso-home-eyebrow">A connected direction, not a closed system</p><h2 id="iso-home-integrations-title">Built to work in your world.</h2></div><p>Provider surfaces referenced in the application. Connectivity, data freshness, and configuration require deployment-specific verification.</p></div>
        <ul className="iso-home-integrations">{[['Google Maps', 'Maps and places'], ['PTV', 'Routing integration'], ['Motive', 'Provider records'], ['Samsara', 'Provider records']].map(([name, description]) => <li key={name}><FiCheck aria-hidden="true" /><div><strong>{name}</strong><span>{description}</span></div></li>)}</ul>
        <p className="iso-home-disclosure">Workflow illustration only. No customer, location, revenue, or performance metrics are displayed.</p>
      </section>

      <section className="iso-home-section iso-home-contact" aria-labelledby="iso-home-contact-title">
        <p className="iso-home-eyebrow">Your next move starts here</p><h2 id="iso-home-contact-title">Bring it all<br /><span>together.</span></h2><p>Tell us how your freight team works.<br />Let's explore where Isovia fits.</p>
        <div className="iso-home-actions"><a className="iso-home-button iso-home-button-primary" href={demoEmail}>Request a walkthrough <FiArrowRight aria-hidden="true" /></a><Link className="iso-home-button iso-home-button-outline" to="/contact">Contact details <FiArrowRight aria-hidden="true" /></Link></div>
        <small>The walkthrough link opens an email request.</small>
      </section>
    </main>
  );
}

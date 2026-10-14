import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight, FiTruck, FiUsers, FiSmartphone, FiMap, FiCpu, FiTool, FiCheck, FiFileText } from 'react-icons/fi';
import { Badge, Card } from '../design-system/components';
import { products, sisFoundations, workflow } from './home-content';
import './home-phase2.css';

const productIcons = { ifm: FiTruck, ilb: FiUsers, driver: FiSmartphone, visibility: FiMap, sis: FiCpu, ira: FiTool };
const demoEmail = 'mailto:Isoviafreightmanagement@gmail.com?subject=Isovia%20product%20walkthrough';

function ProductLink({ product }) {
  const content = <>{product.action}<FiArrowRight aria-hidden="true" /></>;
  return product.to ? <Link className="iso-home-text-link" to={product.to}>{content}</Link> : <a className="iso-home-text-link" href={product.href}>{content}</a>;
}

export default function HomePage() {
  return (
    <main id="isovia-page-content" className="iso-ui iso-home" data-iso-theme="light" tabIndex={-1}>
      <Helmet>
        <title>Isovia | Freight Connected. Without Limits.</title>
        <meta name="description" content="Explore Isovia's IFM freight and fleet workspaces, local load board, driver workflows, and SIS intelligence foundations under development." />
      </Helmet>

      <section className="iso-home-hero" aria-labelledby="iso-home-title">
        <div className="iso-home-hero-copy">
          <p className="iso-home-eyebrow">Freight operations reimagined</p>
          <h1 id="iso-home-title">Freight<br />connected.<br /><span>Without limits.</span></h1>
          <p className="iso-home-hero-lead">Where freight connects. Beyond borders.</p>
          <p className="iso-home-copy">Coordinate orders, dispatch, drivers, and paperwork in a connected freight workflow, designed for teams working across Canada and the United States.</p>
          <div className="iso-home-actions"><Link className="iso-button iso-button--primary" to="/alllogin">Open your workspace <FiArrowRight aria-hidden="true" /></Link><a className="iso-button iso-button--secondary" href={demoEmail}>Request a walkthrough</a></div>
          <ul className="iso-home-audiences" aria-label="Built around freight teams"><li>Brokers</li><li>Carriers</li><li>Drivers</li><li>Customers</li></ul>
        </div>
        <figure className="iso-home-hero-art">
          <img className="iso-home-truck-photo" src="/images/a-truck1.jpg" alt="Freight trucks parked together" loading="eager" />
          <div className="iso-home-photo-shade" aria-hidden="true" />
          <svg className="iso-home-infinity" viewBox="0 0 600 350" fill="none" aria-hidden="true"><path d="M300 175C190 15 40 65 40 175s150 160 260 0 260-110 260 0-150 160-260 0Z" /><path className="iso-home-infinity-connection" d="M55 250C175 40 365 330 545 90" /></svg>
          <div className="iso-home-art-label"><span>Canada</span><span className="iso-home-connection-line" /><span>United States</span></div>
          <figcaption><strong>Isovia is infinity.</strong><span>Connected freight illustration. No live tracking data.</span></figcaption>
        </figure>
      </section>

      <section id="products" className="iso-home-section" aria-labelledby="iso-home-products-title">
        <div className="iso-home-section-heading"><div><p className="iso-home-eyebrow">One connected product direction</p><h2 id="iso-home-products-title">Built around the whole move.</h2></div><p>Explore today's IFM work areas and the next foundations. Each showcase names its current implementation boundary.</p></div>
        <div className="iso-home-products">{products.map((product) => {
          const Icon = productIcons[product.id];
          return <Card as="article" className="iso-home-product" key={product.id} aria-labelledby={'product-' + product.id}>
            <div className="iso-home-product-top"><span className="iso-home-product-icon"><Icon aria-hidden="true" /></span><Badge tone={product.tone}>{product.status}</Badge></div>
            <h3 id={'product-' + product.id}>{product.name}</h3><p className="iso-home-product-subtitle">{product.subtitle}</p><p>{product.description}</p>
            {product.note && <p className="iso-home-product-note">{product.note}</p>}<ProductLink product={product} />
          </Card>;
        })}</div>
      </section>

      <section id="ifm-workflow" className="iso-home-section iso-home-workflow" aria-labelledby="iso-home-workflow-title">
        <div className="iso-home-section-heading"><div><p className="iso-home-eyebrow">Intake to closeout</p><h2 id="iso-home-workflow-title">Keep every handoff in view.</h2></div><p>The intended operating flow is clear. End-to-end database behavior still requires non-production verification.</p></div>
        <ol className="iso-home-steps">{workflow.map(([title, description], index) => <li key={title}><span className="iso-home-step-number">{'0' + (index + 1)}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
      </section>

      <section className="iso-home-section iso-home-visibility" aria-labelledby="iso-home-visibility-title">
        <div><p className="iso-home-eyebrow">See the big picture</p><h2 id="iso-home-visibility-title">From field detail<br />to operational clarity.</h2><p className="iso-home-copy">Bring the people, equipment, records, and next handoff into the same conversation. IFM has work areas for dispatch, tracking, documents, and closeout.</p><ul className="iso-home-checklist"><li><FiCheck aria-hidden="true" />Order and trip workspaces</li><li><FiCheck aria-hidden="true" />Driver and equipment records</li><li><FiCheck aria-hidden="true" />Document and accounting views</li></ul><Link className="iso-home-text-link" to="/freightmanagement">Explore the operating platform <FiArrowRight aria-hidden="true" /></Link></div>
        <Card className="iso-home-workspace-preview" aria-label="Workflow illustration, not a live dashboard"><div className="iso-home-preview-heading"><FiFileText aria-hidden="true" /><strong>Connected workspaces</strong><Badge>Illustration</Badge></div><div className="iso-home-preview-grid">{['Orders', 'Dispatch', 'Drivers', 'Documents', 'Fleet', 'Closeout'].map((name) => <div key={name}>{name}</div>)}</div><p>Workflow illustration only. No customer, location, revenue, or performance metrics are displayed.</p></Card>
      </section>

      <section id="sis-foundations" className="iso-home-section iso-home-sis" data-iso-theme="dark" aria-labelledby="iso-home-sis-title">
        <div className="iso-home-sis-intro"><p className="iso-home-eyebrow">SIS / under development</p><h2 id="iso-home-sis-title">Intelligence with<br />a clear foundation.</h2><p>SIS is intended to coordinate freight operations through shared context, traceable decisions, and human oversight. It builds on IFM's operational records.</p><Badge tone="warning">No autonomous execution implemented</Badge><p className="iso-home-sis-boundary">The World Model has a source implementation and inspection UI. Database-backed behavior remains unverified; the other foundations are planned.</p></div>
        <ol className="iso-home-sis-layers">{sisFoundations.map((foundation, index) => <li key={foundation.name}><span className="iso-home-sis-number">{'0' + (index + 1)}</span><div><div className="iso-home-sis-layer-heading"><h3>{foundation.name}</h3><Badge tone={index === 0 ? 'info' : 'neutral'}>{foundation.status}</Badge></div><p>{foundation.description}</p></div></li>)}</ol>
      </section>

      <section className="iso-home-section" aria-labelledby="iso-home-integrations-title"><div className="iso-home-section-heading"><div><p className="iso-home-eyebrow">Integration surfaces</p><h2 id="iso-home-integrations-title">Connections with clear limits.</h2></div><p>These providers are referenced in the existing application. Configuration, source freshness, and availability depend on deployment and need verification.</p></div><ul className="iso-home-integrations"><li><strong>Google Maps</strong><span>Maps and places</span></li><li><strong>PTV</strong><span>Routing integration</span></li><li><strong>Motive</strong><span>Provider records</span></li><li><strong>Samsara</strong><span>Provider records</span></li></ul></section>

      <section className="iso-home-section iso-home-contact" aria-labelledby="iso-home-contact-title"><div><p className="iso-home-eyebrow">Let's connect</p><h2 id="iso-home-contact-title">Bring your freight workflow into focus.</h2><p>Tell us how your team works. The walkthrough link opens an email request.</p></div><div className="iso-home-actions"><a className="iso-button iso-button--primary" href={demoEmail}>Request a walkthrough <FiArrowRight aria-hidden="true" /></a><Link className="iso-button iso-button--secondary" to="/contact">Contact details</Link></div></section>
    </main>
  );
}

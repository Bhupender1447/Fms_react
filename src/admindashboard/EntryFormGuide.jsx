import React from 'react';

export default function EntryFormGuide({ kind, values, onReview }) {
  const fields = [
    { key: 'company', label: 'Company', section: 'customer' },
    { key: 'customer_id', label: 'Customer', section: 'customer' },
    { key: 'pickup_from', label: 'Pickup', section: 'route' },
    { key: 'delivery', label: 'Delivery', section: 'route' },
  ];
  const completed = fields.filter(({ key }) => String(values[key] ?? '').trim()).length;
  return (
    <div className="entry-form-guide">
      <nav aria-label={`${kind === 'trip' ? 'Trip' : 'Order'} form sections`} className="entry-section-nav">
        {[
          ['customer', 'Customer', 'Company & contact'],
          ['route', 'Pickup & delivery', 'Locations & schedule'],
          ['shipment', 'Cargo', 'Load & equipment'],
          ['revenue', 'Pricing', 'Rates & charges'],
        ].map(([section, title, description], index) => (
          <a key={section} href={`#${kind}-${section}-details`}><b>{index + 1}</b><span>{title}<small>{description}</small></span></a>
        ))}
      </nav>
      <div className="entry-readiness">
        <div><strong>Start with the essentials</strong><p>{completed} of 4 required selections entered. Review dates, cargo, and pricing before saving.</p></div>
        <ul aria-label="Required selections">{fields.map(({ key, label, section }) => {
          const done = Boolean(String(values[key] ?? '').trim());
          return <li key={key}><a href={`#${kind}-${section}-details`} className={done ? 'is-entered' : ''}><i className={`fa ${done ? 'fa-check-circle' : 'fa-circle-o'}`} aria-hidden="true" />{label}<span className="sr-only">{done ? ' entered' : ' needed'}</span></a></li>;
        })}</ul>
        <button type="button" className="btn btn-primary" onClick={onReview}>Review &amp; save</button>
      </div>
    </div>
  );
}

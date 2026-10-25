import React from 'react';
import { Link } from 'react-router-dom';

export default function HoursOfServiceReport() {
  return (
    <main className="content-wrapper p-3 p-md-4" style={{ minHeight: 440 }}>
      <h2 className="mb-4">Route planning and HOS</h2>
      <div className="alert alert-warning" role="status">
        <h3 className="h5">HOS calculations are disabled</h3>
        <p>
          This route-planning screen used hard-coded driver-hour inputs and does
          not have a verified SIS calculation service. No remaining-hours,
          arrival-feasibility, or dispatch-clearance result is available here.
        </p>
        <p className="mb-0">
          Qualified jurisdiction and rule review, independently reviewed
          expected-result cases, verified duty-history evidence, and a reviewed
          route-planning integration are required before this workflow can be
          enabled.
        </p>
      </div>
      <Link className="btn btn-outline-primary" to="/sis/safety">
        Review SIS Safety requirements
      </Link>
    </main>
  );
}

import React from "react";
import { Link } from "react-router-dom";

const CheckHos = () => (
  <main className="content-wrapper p-4" style={{ minHeight: 440 }}>
    <h2 className="mb-4">Hours of Service Assessment</h2>
    <div className="alert alert-warning" role="status">
      <h3 className="h5">HOS calculations are disabled</h3>
      <p>
        This legacy screen cannot assess driver hours. No HOS result, violation
        status, or dispatch clearance is available.
      </p>
      <p className="mb-0">
        Qualified jurisdiction and rules review, independently reviewed
        expected-result cases, and verified duty-history evidence are required
        before an advisory calculation can be considered.
      </p>
    </div>
    <Link className="btn btn-outline-primary" to="/sis/safety">
      Review SIS Safety requirements
    </Link>
  </main>
);

export default CheckHos;

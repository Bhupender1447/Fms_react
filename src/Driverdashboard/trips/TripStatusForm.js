import React from 'react';
import { Link, useParams } from 'react-router-dom';
import TripWorkflowPanel from './TripWorkflowPanel';

export default function TripStatusForm() {
  const { tripId } = useParams();
  return <main id="driver-main" className="content-wrapper driver-dashboard"><Link className="driver-button driver-button-light" to="/drivertrip">← Assigned trips</Link><TripWorkflowPanel tripId={tripId}/></main>;
}
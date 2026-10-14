import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import RouteMap from './RouteMap';
import RouteProgress from './RouteProgress';
import './routes.css';

export default function RouteDetails() {
	const { routeId } = useParams();
	const location = useLocation();
	const draft = location.state?.draft;
	const route = draft?.routes?.find((item) => item.id === routeId) || (draft?.id === routeId ? {
		id: draft.id,
		routeNumber: draft.id,
		vehicle: null,
		driver: null,
		stops: draft.stops || [],
		status: draft.status,
		locationStatus: 'LOCATION_UNAVAILABLE',
	} : null);

	if (!draft || !route) {
		return <main className="content-wrapper route-module"><div className="route-empty-state"><h1>Route preview is unavailable</h1><p>This page expects a session-only planning draft. Route persistence is not enabled.</p><Link className="btn btn-outline-primary" to="/routes/manage">Back to Manage Routes</Link></div></main>;
	}

	const routeStops = route.stops || [];
	return (
		<main className="content-wrapper route-module">
			<div className="route-page-header">
				<div><p className="route-eyebrow">SESSION PREVIEW · NOT DISPATCHED</p><h1>{route.routeNumber}</h1><p>{draft.routeName}</p></div>
				<Link className="btn btn-outline-secondary" to="/routes/manage" state={{ drafts: location.state?.drafts || [draft] }}><i className="fa fa-arrow-left" aria-hidden="true" /> Back to routes</Link>
			</div>
			<div className="route-safety-notice" role="status"><strong>Not operational</strong><span>This route has not been optimized by PTV, saved to IFM, assigned to a driver, or sent to a Driver App.</span></div>
			<section className="route-summary-grid" aria-label="Route information">
				<div className="route-summary"><span>Vehicle profile</span><strong>{route.vehicle?.id || 'Not provided'}</strong></div>
				<div className="route-summary"><span>Driver label (local)</span><strong>{route.driver?.name || 'Not selected'}</strong></div>
				<div className="route-summary"><span>Total stops</span><strong>{routeStops.length}</strong></div>
				<div className="route-summary"><span>Remaining stops</span><strong>{routeStops.length - routeStops.filter((stop) => stop.completionEvidence?.verified).length}</strong></div>
			</section>
			<section className="route-section"><div className="route-section-heading"><div><h2>Verified stop progress</h2><p>Completion requires server-verified driver evidence.</p></div></div><RouteProgress stops={routeStops} /></section>
			<section className="route-section"><div className="route-section-heading"><div><h2>Route map</h2><p>Coordinates are shown only when supplied and validated.</p></div></div><RouteMap stops={routeStops} /></section>
			<section className="route-section">
				<div className="route-section-heading"><div><h2>Stops</h2><p>All {routeStops.length} stops belong to this single route. The driver label is not an IFM assignment.</p></div></div>
				{routeStops.length === 0 ? <p className="route-empty-inline">This route has no stops.</p> : (
					<div className="table-responsive"><table className="table table-sm route-table">
						<thead><tr><th>Sequence</th><th>Stop ID</th><th>Type</th><th>Customer</th><th>Address</th><th>Appointment</th><th>Completion</th></tr></thead>
						<tbody>{routeStops.map((stop, index) => <tr key={stop.previewKey || `${stop.stopId || 'stop'}-${index}`}><td>{index + 1}</td><td>{stop.stopId || `Stop ${index + 1}`}</td><td>{stop.stopType}</td><td>{stop.customer}</td><td>{[stop.address, stop.city, stop.region, stop.postalCode].filter(Boolean).join(', ')}</td><td>{stop.appointmentStart || 'None'}{stop.appointmentEnd ? ` – ${stop.appointmentEnd}` : ''}</td><td><span className="route-status route-status-unavailable">NOT COMPLETED</span></td></tr>)}</tbody>
					</table></div>
				)}
			</section>
			<section className="route-section"><div className="route-section-heading"><div><h2>Controls</h2><p>Operational mutations remain disabled until backend authorization and persistence are implemented.</p></div></div>
				<div className="route-action-bar route-detail-controls"><button className="btn btn-outline-secondary" disabled title="Requires verified active-account route permission.">Assign Driver</button><button className="btn btn-outline-secondary" disabled title="Requires verified fleet inventory and route persistence.">Assign Truck</button><button className="btn btn-outline-secondary" disabled title="Requires verified PTV V2 backend job adapter.">Reoptimize remaining</button><button className="btn btn-outline-secondary" disabled title="Requires verified route persistence and Driver App integration.">Send to Driver</button><button className="btn btn-outline-secondary" disabled title="No tracking event store is connected.">View history</button></div>
			</section>
		</main>
	);
}

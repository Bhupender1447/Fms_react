import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteProgress from './RouteProgress';
import './routes.css';

function rowsFromDraft(draft) {
	if (draft.routes?.length) return draft.routes.map((route) => ({ ...route, draft }));
	return [{
		id: draft.id,
		routeNumber: draft.id,
		vehicle: null,
		driver: null,
		stops: draft.stops || [],
		progress: { completed: 0, total: (draft.stops || []).length, percent: 0 },
		status: draft.status,
		locationStatus: 'LOCATION_UNAVAILABLE',
		draft,
	}];
}

export default function ManageRoutes() {
	const navigate = useNavigate();
	const location = useLocation();
	const drafts = location.state?.drafts || [];
	const [query, setQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('ALL');
	const [sortOrder, setSortOrder] = useState('newest');
	const rows = useMemo(() => drafts.flatMap(rowsFromDraft), [drafts]);
	const filteredRows = rows.filter((route) => {
		const text = `${route.routeNumber} ${route.draft.routeName || ''} ${route.vehicle?.id || ''} ${route.vehicle?.label || ''} ${route.driver?.name || ''}`.toLowerCase();
		return text.includes(query.trim().toLowerCase()) && (statusFilter === 'ALL' || route.status === statusFilter);
	});
	if (sortOrder === 'name') filteredRows.sort((a, b) => (a.draft.routeName || '').localeCompare(b.draft.routeName || ''));
	else filteredRows.reverse();
	const draftStopCount = drafts.reduce((total, draft) => total + (draft.stops?.length || 0), 0);
	const unassignedCount = drafts.reduce((total, draft) => total + (draft.unassignedStops?.length || 0), 0);

	return (
		<main className="content-wrapper route-module">
			<div className="route-page-header">
				<div><p className="route-eyebrow">CARRIER · ROUTE PLANNING</p><h1>Manage Routes</h1><p>Review one-route drafts, stop counts, and local driver labels. Persisted routes and live tracking are not enabled.</p></div>
				<button className="btn btn-primary" type="button" onClick={() => navigate('/routes/create', { state: { drafts } })}><i className="fa fa-plus" aria-hidden="true" /> Create route</button>
			</div>
			<div className="route-safety-notice" role="status"><strong>Session-only drafts</strong><span>This list contains drafts carried through the current browser navigation. It is not an IFM route record.</span></div>
			<section className="route-summary-grid" aria-label="Route draft summary">
				<div className="route-summary"><span>Planning drafts</span><strong>{drafts.length}</strong></div>
				<div className="route-summary"><span>Stops in drafts</span><strong>{draftStopCount}</strong></div>
				<div className="route-summary"><span>Unassigned stops</span><strong>{unassignedCount}</strong></div>
				<div className="route-summary"><span>Live locations</span><strong>Unavailable</strong></div>
			</section>
			<section className="route-section" aria-labelledby="manage-route-list-heading">
				<div className="route-section-heading"><div><h2 id="manage-route-list-heading">Route plans</h2><p>{filteredRows.length} local preview rows</p></div></div>
				<div className="route-filter-row">
					<label className="route-field"><span>Search</span><input className="form-control" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Route, truck, or driver" /></label>
					<label className="route-field"><span>Status</span><select className="form-control" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="ALL">All statuses</option><option value="DRAFT_NOT_OPTIMIZED">Draft</option><option value="DRAFT">Draft route</option></select></label>
					<label className="route-field"><span>Sort by</span><select className="form-control" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="newest">Newest added</option><option value="name">Route name A–Z</option></select></label>
					{(query || statusFilter !== 'ALL') && <button type="button" className="btn btn-outline-secondary" onClick={() => { setQuery(''); setStatusFilter('ALL'); }}>Clear filters</button>}
				</div>
				{filteredRows.length === 0 ? (
					<div className="route-empty-state"><i className="fa fa-map-signs" aria-hidden="true" /><h3>{rows.length ? 'No matching route plans' : 'Plan your first route'}</h3><p>{rows.length ? 'Try a different route name, vehicle, driver, or status.' : 'Name your route, add stops manually or from Excel, then review your draft.'}</p>{rows.length ? <button type="button" className="btn btn-outline-primary" onClick={() => { setQuery(''); setStatusFilter('ALL'); }}>Show all routes</button> : <button type="button" className="btn btn-primary" onClick={() => navigate('/routes/create', { state: { drafts } })}>Create route</button>}</div>
				) : (
					<div className="table-responsive"><table className="table table-hover route-table">
						<thead><tr><th scope="col">Route plan</th><th scope="col">Vehicle / driver</th><th scope="col">Stops</th><th scope="col">Stop progress</th><th scope="col">Location</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead>
						<tbody>{filteredRows.map((route) => (
							<tr key={route.id}>
								<td><strong>{route.routeNumber}</strong><small>{route.draft.routeName}</small></td>
								<td>{route.vehicle?.id || 'No vehicle selected'}<small>{route.driver?.name || 'No driver selected'}</small></td>
								<td>{route.stops.length}<small>{route.draft.unassignedStops?.length || 0} stops unassigned</small></td>
								<td><RouteProgress stops={route.stops} /></td>
								<td><span className="route-status route-status-unavailable">LOCATION UNAVAILABLE</span></td>
								<td><span className="route-status route-status-draft">{route.status.replaceAll('_', ' ')}</span></td>
								<td className="route-actions">
									<button type="button" className="btn btn-outline-primary btn-sm" onClick={() => navigate('/routes/view', { state: { draft: route.draft, drafts } })}><i className="fa fa-eye" aria-hidden="true" /> View route</button>
									<button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/routes/${encodeURIComponent(route.id)}`, { state: { draft: route.draft, routeId: route.id, drafts } })}><i className="fa fa-list" aria-hidden="true" /> Details</button>
									<button type="button" className="btn btn-outline-secondary btn-sm" disabled title="Requires verified AuthContext, route persistence, and a live tracking source."><i className="fa fa-ban" aria-hidden="true" /> Track Live</button>
								</td>
							</tr>
						))}</tbody>
					</table></div>
				)}
			</section>
		</main>
	);
}

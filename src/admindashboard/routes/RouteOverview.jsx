import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteMap from './RouteMap';
import { getStopProgress, reorderRouteStops, validateRouteStops } from './routePlanningModel';
import './routes.css';

export default function RouteOverview() {
	const location = useLocation();
	const navigate = useNavigate();
	const draft = location.state?.draft;
	const routePreview = location.state?.routePreview || draft;
	const routeData = location.state?.routeData;
	const [stops, setStops] = useState(() => routePreview?.stops || []);
	const [routeIsStale, setRouteIsStale] = useState(false);
	const [draggingIndex, setDraggingIndex] = useState(null);
	const dragSourceIndex = useRef(null);
	const isExistingDraft = Boolean(draft);
	const driverName = routePreview?.driverName || draft?.routes?.[0]?.driver?.name || '';
	const progress = getStopProgress(stops);
	const sequenceValidation = validateRouteStops(stops);

	if (!routePreview) {
		return <main className="content-wrapper route-module"><div className="route-empty-state"><h1>Route preview is unavailable</h1><p>Open View Route from the current Create Route form or a session-only draft.</p><button className="btn btn-outline-primary" type="button" onClick={() => navigate('/routes/create')}>Back to Create Route</button></div></main>;
	}

	const handleDragStart = (event, index) => {
		dragSourceIndex.current = index;
		setDraggingIndex(index);
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', String(index));
	};

	const handleDrop = (event, destinationIndex) => {
		event.preventDefault();
		const transferredIndex = event.dataTransfer.getData('text/plain');
		const sourceIndex = dragSourceIndex.current ?? (transferredIndex === '' ? -1 : Number(transferredIndex));
		if (Number.isInteger(sourceIndex)) {
			setStops((current) => reorderRouteStops(current, sourceIndex, destinationIndex));
			setRouteIsStale(true);
		}
		dragSourceIndex.current = null;
		setDraggingIndex(null);
	};

	const moveStop = (index, offset) => {
		setStops((current) => reorderRouteStops(current, index, index + offset));
		setRouteIsStale(true);
	};

	const applyStopOrder = () => {
		if (!isExistingDraft) {
			navigate('/routes/create', {
				state: {
					routeFormData: {
						routeName: routePreview.routeName,
						driverName,
						stops,
						vehicles: routePreview.vehicles || [],
						depot: routePreview.depot || { startAddress: '', endAddress: '' },
						options: routePreview.options || {},
					},
					drafts: location.state?.drafts || [],
				},
			});
			return;
		}

		const existingRoute = draft.routes?.[0];
		const route = {
			...existingRoute,
			id: existingRoute?.id || `${draft.id}-ROUTE`,
			routeNumber: existingRoute?.routeNumber || `${draft.id}-ROUTE`,
			vehicle: existingRoute?.vehicle || draft.vehicles?.[0] || null,
			driver: driverName ? { name: driverName } : existingRoute?.driver || null,
			stops,
			progress: getStopProgress(stops),
			status: existingRoute?.status || 'DRAFT',
			locationStatus: 'LOCATION_UNAVAILABLE',
		};
		const updatedDraft = { ...draft, stops, routes: stops.length ? [route] : [], driverName, unassignedStops: [] };
		const drafts = (location.state?.drafts || [draft]).map((item) => item.id === draft.id ? updatedDraft : item);
		navigate('/routes/manage', { state: { drafts } });
	};

	return (
		<main className="content-wrapper route-module">
			<div className="route-page-header"><div><p className="route-eyebrow">CARRIER · ROUTE PLANNING</p><h1>View Route</h1><p>{routePreview.routeName || 'Untitled route plan'}</p></div><span className="route-state-pill route-state-draft"><i className="fa fa-flask" aria-hidden="true" /> Local preview</span></div>
			<div className="route-safety-notice" role="status"><strong>Sequence preview only</strong><span>Drag stops to reorder the local sequence. No distance, ETA, provider result, database record, assignment, or dispatch is changed.</span></div>
			<section className="route-summary-grid" aria-label="Route summary">
				<div className="route-summary"><span>Stops in sequence</span><strong>{stops.length}</strong></div>
				<div className="route-summary"><span>Driver for this route</span><strong>{driverName || 'Not selected'}</strong></div>
				<div className="route-summary"><span>Vehicle profile</span><strong>{routePreview.vehicles?.[0]?.id || draft?.routes?.[0]?.vehicle?.id || 'Not provided'}</strong></div>
				<div className="route-summary"><span>Verified completions</span><strong>{progress.completed} / {progress.total}</strong></div>
			</section>
			<section className="route-section" aria-labelledby="route-overview-map-heading"><div className="route-section-heading"><div><h2 id="route-overview-map-heading">Stop map</h2><p>{routeData?.path?.length > 1 && !routeIsStale ? 'PTV road route for the current stop order.' : routeIsStale ? 'Stop order changed. The prior PTV road route is stale; recalculate from Create Route.' : 'Markers require coordinates supplied with each stop. Return to Create Route to calculate a PTV road route.'}</p></div></div>
				{routeData?.result && !routeIsStale && <div className="route-route-summary" role="status"><span><strong>PTV truck routing</strong></span><span>{routeData.result.distanceKms ?? '—'} km</span><span>{routeData.result.durationText || 'Duration unavailable'}</span></div>}
				<RouteMap stops={stops} routePath={routeIsStale ? [] : routeData?.path || []} providerRoute={Boolean(!routeIsStale && routeData?.path?.length > 1)} />
			</section>
			<section className="route-section" aria-labelledby="route-sequence-heading">
				<div className="route-section-heading"><div><h2 id="route-sequence-heading">Full stop sequence</h2><p>Use the drag handle or the arrow controls to change order.</p></div></div>
				{!sequenceValidation.valid && <div className="route-validation route-validation-error" role="alert"><strong>Review the route sequence before applying it</strong><ul>{sequenceValidation.errors.map((error, index) => <li key={`${error.sourceRow}-${error.field}-${index}`}>{error.message}</li>)}</ul></div>}
				{stops.length === 0 ? <p className="route-empty-inline">There are no stops to display.</p> : (
					<ol className="route-sequence-list" aria-label="Reorder route stops">
						{stops.map((stop, index) => (
							<li key={stop.previewKey || `${stop.stopId || 'stop'}-${stop.sourceRow ?? index}`} className={`route-sequence-item${draggingIndex === index ? ' is-dragging' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => handleDrop(event, index)}>
								<button className="route-drag-handle" type="button" draggable="true" aria-label={`Drag stop ${stop.stopId || index + 1} to reorder`} onDragStart={(event) => handleDragStart(event, index)} onDragEnd={() => { dragSourceIndex.current = null; setDraggingIndex(null); }}><i className="fa fa-bars" aria-hidden="true" /></button>
								<span className="route-sequence-number">{index + 1}</span>
								<div className="route-sequence-details">
									<strong>{stop.stopId || `Stop ${index + 1}`} · {stop.stopType || 'STOP'}</strong>
									<span>{stop.customer || 'Customer unavailable'}</span>
									<small>{[stop.address, stop.city, stop.region, stop.postalCode].filter(Boolean).join(', ') || 'Address unavailable'}</small>
									<small>{stop.appointmentStart || 'No appointment window'}{stop.appointmentEnd ? ` to ${stop.appointmentEnd}` : ''} · {stop.serviceMinutes ?? 'Service time unknown'} min</small>
								</div>
								<span className="route-sequence-vehicle">{driverName || 'Driver not selected'}</span>
								<div className="route-sequence-controls">
									<button type="button" className="btn btn-outline-secondary btn-sm" aria-label={`Move stop ${index + 1} up`} disabled={index === 0} onClick={() => moveStop(index, -1)}><i className="fa fa-arrow-up" aria-hidden="true" /></button>
									<button type="button" className="btn btn-outline-secondary btn-sm" aria-label={`Move stop ${index + 1} down`} disabled={index === stops.length - 1} onClick={() => moveStop(index, 1)}><i className="fa fa-arrow-down" aria-hidden="true" /></button>
								</div>
							</li>
						))}
					</ol>
				)}
			</section>
			<div className="route-action-bar"><button className="btn btn-outline-secondary" type="button" onClick={() => navigate(-1)}><i className="fa fa-arrow-left" aria-hidden="true" /> Back</button><button className="btn btn-primary" type="button" disabled={!sequenceValidation.valid} onClick={applyStopOrder}><i className="fa fa-check" aria-hidden="true" /> {isExistingDraft ? 'Apply order to local draft' : 'Use this order'}</button></div>
		</main>
	);
}

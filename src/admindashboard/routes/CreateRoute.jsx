import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapService from '../../services/MapService';
import ExcelStopUploader from './ExcelStopUploader';
import RouteMap from './RouteMap';
import { buildRouteApiPreview, createLocalRouteDraft, createMockPtvOptimizationClient } from './routePlanningService';
import { calculatePlanningEstimate, createRouteStopPreviewKey, validateManualAssignments, validateRouteStops } from './routePlanningModel';
import './routes.css';

const newManualStop = () => ({
	stopId: '', customer: '', address: '', city: '', region: '', postalCode: '', stopType: 'PICKUP',
	appointmentStart: '', appointmentEnd: '', serviceMinutes: '', weight: '', pallets: '',
	priority: 'NORMAL', instructions: '', equipment: '', latitude: '', longitude: '',
});

const newVehicle = () => ({ id: '', label: '', maxWeight: '', maxPallets: '', equipment: '', startAddress: '', endAddress: '', maxOperatingMinutes: '' });

export default function CreateRoute() {
	const navigate = useNavigate();
	const location = useLocation();
	const routeFormData = location.state?.routeFormData;
	const [routeName, setRouteName] = useState(() => routeFormData?.routeName || '');
	const [driverName, setDriverName] = useState(() => routeFormData?.driverName || '');
	const [stops, setStops] = useState(() => routeFormData?.stops || []);
	const [vehicles, setVehicles] = useState(() => (routeFormData?.vehicles || []).slice(0, 1));
	const [manualStop, setManualStop] = useState(newManualStop);
	const [depot, setDepot] = useState(() => routeFormData?.depot || { startAddress: '', endAddress: '' });
	const [options, setOptions] = useState(() => routeFormData?.options || { objective: 'time', obeyTimeWindows: true, balanceWorkload: true, minimizeVehicles: false });
	const [mapCreated, setMapCreated] = useState(false);
	const [showEstimate, setShowEstimate] = useState(false);
	const [estimateRequested, setEstimateRequested] = useState(false);
	const [estimateInputs, setEstimateInputs] = useState({ distanceKm: '', averageSpeedKmh: '', fuelConsumptionLPer100Km: '', fuelPricePerL: '', driverCostPerHour: '' });
	const [routeData, setRouteData] = useState(null);
	const [routeRequestStatus, setRouteRequestStatus] = useState('');
	const [routeRequestError, setRouteRequestError] = useState('');
	const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
	const [isOptimizingStops, setIsOptimizingStops] = useState(false);
	const [stopOptimizationStatus, setStopOptimizationStatus] = useState('');
	const [stopOptimizationError, setStopOptimizationError] = useState('');
	const [showRequestPreview, setShowRequestPreview] = useState(false);
	const [mockLifecycle, setMockLifecycle] = useState(null);
	const [mockRunning, setMockRunning] = useState(false);
	const [saveMessage, setSaveMessage] = useState('');
	const latestRouteInputs = useRef(null);
	latestRouteInputs.current = { stops, depot, objective: options.objective };

	const validation = useMemo(() => validateRouteStops(stops), [stops]);
	const assignmentValidation = useMemo(() => {
		const routeVehicles = vehicles.filter((vehicle) => vehicle.id.trim()).slice(0, 1);
		if (!routeVehicles.length) return { errors: [], warnings: [], unassignedStopIds: [], valid: true };
		const routeStops = stops.map((stop) => ({ ...stop, assignedVehicleId: routeVehicles[0].id }));
		return validateManualAssignments(routeStops, routeVehicles);
	}, [stops, vehicles]);
	const validVehiclePool = vehicles.filter((vehicle) => vehicle.id.trim()).slice(0, 1);
	const aggregateWeight = stops.reduce((total, stop) => total + (Number.isFinite(stop.weight) ? stop.weight : 0), 0);
	const aggregateCapacity = validVehiclePool.reduce((total, vehicle) => total + (Number(vehicle.maxWeight) || 0), 0);
	const canCreateDraft = validation.valid && assignmentValidation.valid && routeName.trim() && driverName.trim();
	const draftChecklist = [
		{ label: 'Name your route', done: Boolean(routeName.trim()), target: 'route-plan-heading' },
		{ label: 'Enter a driver name', done: Boolean(driverName.trim()), target: 'route-plan-heading' },
		{ label: 'Add and validate stops', done: stops.length > 0 && validation.valid, target: 'route-stop-review-heading' },
		{ label: 'Review vehicle capacity (optional)', done: assignmentValidation.valid, target: 'route-vehicles-heading' },
	];
	const requestPreview = showRequestPreview ? buildRouteApiPreview({ routeName, stops, vehicles: validVehiclePool, options, depot }) : null;
	const planningEstimate = useMemo(() => calculatePlanningEstimate({ ...estimateInputs, stops }), [estimateInputs, stops]);
	const providerToll = useMemo(() => {
		const toll = routeData?.result?.tolls ?? routeData?.result?.toll;
		const isAmount = (value) => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value));
		if (isAmount(toll)) return { amount: Number(toll), currency: null };
		if (!toll || typeof toll !== 'object') return null;
		if (isAmount(toll.amount)) return { amount: Number(toll.amount), currency: toll.currency || toll.currencyCode || null };
		const prices = toll.costs?.prices;
		if (Array.isArray(prices) && prices.length) {
			const price = prices.find((item) => item.currency === 'CAD') || prices[0];
			if (isAmount(price.price)) return { amount: Number(price.price), currency: price.currency || null };
		}
		if (Array.isArray(toll.costs) && toll.costs.length && isAmount(toll.costs[0].amount)) {
			return { amount: Number(toll.costs[0].amount), currency: toll.costs[0].currency || null };
		}
		if (isAmount(toll.cost)) return { amount: Number(toll.cost), currency: toll.currency || null };
		return null;
	}, [routeData]);
	const routeFingerprint = useMemo(() => JSON.stringify({
		stops: stops.map(({ address, city, region, postalCode, latitude, longitude }) => ({ address, city, region, postalCode, latitude, longitude })),
		depot,
		objective: options.objective,
	}), [stops, depot, options.objective]);
	const currentRouteFormData = { routeName, driverName, stops, vehicles: validVehiclePool, depot, options };

	const openRouteView = () => navigate('/routes/view', {
		state: {
			routePreview: { ...currentRouteFormData, routeName: routeName.trim() || 'Untitled route plan' },
			routeData: routeData?.fingerprint === routeFingerprint ? routeData : null,
			routeFormData: currentRouteFormData,
			drafts: location.state?.drafts || [],
		},
	});

	const calculatePtvRoute = async (routeStops = stops) => {
		const requestInputs = latestRouteInputs.current;
		if (routeStops === stops && routeData?.fingerprint === routeFingerprint) {
			setRouteRequestStatus('Using the existing PTV route for the current stop order.');
			setRouteRequestError('');
			return routeData;
		}
		if (routeStops.length < 2) throw new Error('Add at least two stops before calculating a PTV truck route.');
		if (routeStops.length > 20) throw new Error('PTV route preview supports up to 20 stops at a time. Reduce the stop count before requesting a route.');
		const startAddress = String(depot.startAddress || '').trim();
		const endAddress = String(depot.endAddress || '').trim();

		const resolvePoint = async (address, point) => {
			const hasLatitude = point?.latitude !== null && point?.latitude !== undefined && point.latitude !== '';
			const hasLongitude = point?.longitude !== null && point?.longitude !== undefined && point.longitude !== '';
			if (hasLatitude && hasLongitude && Number.isFinite(Number(point.latitude)) && Number.isFinite(Number(point.longitude))) {
				return { lat: Number(point.latitude), lng: Number(point.longitude) };
			}
			const place = await MapService.geocode(address);
			const lat = Number(place?.lat);
			const lng = Number(place?.lng);
			if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
				throw new Error(`Could not find valid coordinates for ${address}.`);
			}
			return { lat, lng };
		};

		const resolvedStops = await Promise.all(routeStops.map(async (stop) => {
			const address = [stop.address, stop.city, stop.region, stop.postalCode].filter(Boolean).join(', ');
			const hasLatitude = stop.latitude !== null && stop.latitude !== undefined && stop.latitude !== '';
			const hasLongitude = stop.longitude !== null && stop.longitude !== undefined && stop.longitude !== '';
			if (!address && !(hasLatitude && hasLongitude && Number.isFinite(Number(stop.latitude)) && Number.isFinite(Number(stop.longitude)))) {
				throw new Error(`Stop ${stop.stopId || stop.sourceRow} needs an address or coordinates.`);
			}
			const point = await resolvePoint(address, stop);
			return { ...stop, latitude: point.lat, longitude: point.lng };
		}));
		const startPoint = startAddress
			? await resolvePoint(startAddress)
			: { lat: resolvedStops[0].latitude, lng: resolvedStops[0].longitude };
		const endPoint = endAddress
			? await resolvePoint(endAddress)
			: { lat: resolvedStops[resolvedStops.length - 1].latitude, lng: resolvedStops[resolvedStops.length - 1].longitude };
		const waypoints = startAddress || endAddress
			? resolvedStops.map((stop) => ({ lat: stop.latitude, lng: stop.longitude }))
			: resolvedStops.slice(1, -1).map((stop) => ({ lat: stop.latitude, lng: stop.longitude }));
		const routeChoice = options.objective === 'distance' ? 'shortest' : options.objective === 'cost' ? 'economic' : 'fast';
		const result = await MapService.getRoute(startPoint, endPoint, waypoints, { type: 'truck' }, routeChoice, true);
		const latestInputs = latestRouteInputs.current;
		if ((latestInputs.stops !== requestInputs.stops && latestInputs.stops !== routeStops)
			|| latestInputs.depot !== requestInputs.depot || latestInputs.objective !== requestInputs.objective) {
			throw new Error('Route inputs changed while the request was running. Your edits were preserved; calculate the route again.');
		}
		const hasMetric = (value) => value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;
		if (result?.status !== true || !hasMetric(result.distanceKms) || !hasMetric(result.duration)) {
			throw new Error('PTV returned incomplete route distance or duration. No route metrics were applied.');
		}
		const path = MapService.parseRoutePath(result?.path);
		const nextRouteData = {
			fingerprint: JSON.stringify({
				stops: resolvedStops.map(({ address, city, region, postalCode, latitude, longitude }) => ({ address, city, region, postalCode, latitude, longitude })),
				depot,
				objective: options.objective,
			}),
			result,
			path,
			stops: resolvedStops,
			provider: 'PTV truck routing',
		};
		setStops(resolvedStops);
		setRouteData(nextRouteData);
		setRouteRequestError('');
		setRouteRequestStatus(path.length >= 2
			? 'PTV returned a truck route for the current stop order.'
			: 'PTV returned route metrics, but no usable road geometry. The map will show stop markers only.');

		const distanceKm = Number(result.distanceKms);
		const durationSeconds = Number(result.duration);
		if (Number.isFinite(distanceKm) && distanceKm > 0 && Number.isFinite(durationSeconds) && durationSeconds > 0) {
			setEstimateInputs((current) => ({
				...current,
				distanceKm: String(distanceKm),
				averageSpeedKmh: String(Math.round((distanceKm / (durationSeconds / 3600)) * 100) / 100),
			}));
		}
		return nextRouteData;
	};

	const createMapPreview = async () => {
		setMapCreated(true);
		setIsCalculatingRoute(true);
		setRouteRequestError('');
		setRouteRequestStatus('Resolving stop locations and requesting a PTV truck route…');
		requestAnimationFrame(() => document.getElementById('route-map-preview')?.scrollIntoView?.({ behavior: 'smooth', block: 'start' }));
		try {
			await calculatePtvRoute();
		} catch (error) {
			setRouteRequestError(error.message || 'PTV route calculation failed.');
			setRouteRequestStatus('');
		} finally {
			setIsCalculatingRoute(false);
		}
	};

	const createEstimate = async () => {
		setShowEstimate(true);
		setEstimateRequested(false);
		setIsCalculatingRoute(true);
		setRouteRequestError('');
		setRouteRequestStatus('Using the current stop sequence to request PTV route distance and duration…');
		try {
			await calculatePtvRoute();
		} catch (error) {
			setRouteRequestError(error.message || 'Could not load PTV route metrics. Enter distance and speed assumptions manually.');
			setRouteRequestStatus('');
		} finally {
			setIsCalculatingRoute(false);
		}
	};

	const optimizeStopOrderPreview = async () => {
		setStopOptimizationError('');
		setStopOptimizationStatus('');
		setRouteRequestError('');
		if (stops.length < 4 || stops.length > 20) {
			setStopOptimizationError('Stop-order preview requires 4 to 20 stops, including the fixed first and last stops.');
			return;
		}
		if (depot.startAddress.trim() || depot.endAddress.trim()) {
			setStopOptimizationError('Stop-order optimization with depot start/end is not supported in this preview yet. Clear depot addresses to optimize stop order.');
			return;
		}
		setIsOptimizingStops(true);
		const optimizationInputs = latestRouteInputs.current;
		try {
			const currentRoute = await calculatePtvRoute();
			const resolvedStops = currentRoute.stops || [];
			const start = { lat: resolvedStops[0].latitude, lng: resolvedStops[0].longitude };
			const end = { lat: resolvedStops[resolvedStops.length - 1].latitude, lng: resolvedStops[resolvedStops.length - 1].longitude };
			const intermediates = resolvedStops.slice(1, -1).map((stop) => ({ lat: stop.latitude, lng: stop.longitude }));
			const stopOrder = await MapService.optimizeStops(start, end, intermediates);
			const latestInputs = latestRouteInputs.current;
			if ((latestInputs.stops !== optimizationInputs.stops && latestInputs.stops !== resolvedStops)
				|| latestInputs.depot !== optimizationInputs.depot || latestInputs.objective !== optimizationInputs.objective) {
				throw new Error('Route inputs changed during optimization. Your edits were preserved; run optimization again.');
			}
			if (!Array.isArray(stopOrder) || stopOrder.length !== intermediates.length
				|| new Set(stopOrder).size !== intermediates.length
				|| !stopOrder.every((index) => Number.isInteger(index) && index >= 0 && index < intermediates.length)) {
				throw new Error('Backend optimizer returned an invalid stop order.');
			}
			const reorderedStops = [
				resolvedStops[0],
				...stopOrder.map((index) => resolvedStops[index + 1]),
				resolvedStops[resolvedStops.length - 1],
			];
			setStops(reorderedStops);
			setRouteData(null);
			setEstimateRequested(false);
			setEstimateInputs((current) => ({ ...current, distanceKm: '', averageSpeedKmh: '' }));
			setMapCreated(true);
			setRouteRequestStatus('Refreshing the PTV road route for the updated stop order...');
			try {
				await calculatePtvRoute(reorderedStops);
				setStopOptimizationStatus('Stop order was optimized by Google Route Optimization and the PTV road route was refreshed.');
			} catch (error) {
				setRouteRequestStatus('');
				setRouteRequestError(error.message || 'PTV route refresh failed.');
				setStopOptimizationError('Stop order was optimized by Google Route Optimization, but PTV route refresh failed. The updated stops are retained; retry the PTV route before using its metrics.');
			}
		} catch (error) {
			setStopOptimizationError(error.message || 'Could not optimize stop order with the backend optimizer.');
		} finally {
			setIsOptimizingStops(false);
		}
	};

	const updateVehicle = (index, field, value) => {
		setVehicles((current) => current.map((vehicle, vehicleIndex) => (
			vehicleIndex === index ? { ...vehicle, [field]: value } : vehicle
		)));
	};

	const addManualStop = (event) => {
		event.preventDefault();
		const stop = {
			...manualStop,
			previewKey: createRouteStopPreviewKey(),
			sourceRow: stops.length + 1,
			serviceMinutes: manualStop.serviceMinutes === '' ? null : Number(manualStop.serviceMinutes),
			weight: manualStop.weight === '' ? null : Number(manualStop.weight),
			pallets: manualStop.pallets === '' ? null : Number(manualStop.pallets),
			latitude: manualStop.latitude === '' ? null : Number(manualStop.latitude),
			longitude: manualStop.longitude === '' ? null : Number(manualStop.longitude),
			assignedVehicleId: '',
			completionEvidence: null,
		};
		setStops((current) => [...current, stop]);
		setManualStop(newManualStop());
		setSaveMessage('');
	};

	const runMockLifecycle = async () => {
		if (!requestPreview) return;
		setMockRunning(true);
		setMockLifecycle(null);
		try {
			const client = createMockPtvOptimizationClient();
			const accepted = await client.createOptimization(requestPreview);
			const running = await client.getOptimization(accepted.id);
			const completed = await client.getOptimization(accepted.id);
			setMockLifecycle({ accepted, running, completed });
		} catch (error) {
			setMockLifecycle({ error: error.message || 'Mock lifecycle failed.' });
		} finally {
			setMockRunning(false);
		}
	};

	const removeStop = (targetStop) => setStops((current) => current.filter((stop) => stop !== targetStop));

	const saveLocalDraft = () => {
		if (!canCreateDraft) return;
		const draft = createLocalRouteDraft({ routeName, driverName, stops, vehicles: validVehiclePool, options, depot });
		const drafts = location.state?.drafts || [];
		setSaveMessage('Local draft created in this browser flow only. It was not saved to IFM or sent to a driver.');
		navigate('/routes/manage', { state: { drafts: [...drafts, draft] } });
	};

	return (
		<main className="content-wrapper route-module">
			<div className="route-page-header">
				<div>
					<p className="route-eyebrow">CARRIER · ROUTE PLANNING</p>
					<h1>Create Route</h1>
					<p>Plan one carrier route across multiple stops. Broker order creation and trip management remain separate workflows.</p>
				</div>
				<button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/routes/manage', { state: { drafts: location.state?.drafts || [] } })}>Route manager</button>
			</div>

			<div className="route-safety-notice" role="status"><strong>Preview only</strong><span>Map and estimate actions may request geocoding and PTV truck-routing data. Optional stop-order optimization uses a backend preview optimizer. Route plans stay in page memory; no database write, driver assignment, HOS calculation, or dispatch is run.</span></div>

			<nav className="route-step-nav" aria-label="Route planning steps">
				<a href="#route-plan-heading"><b>1</b><span>Plan details<small>Name and driver</small></span></a>
				<a href="#manual-stop-heading"><b>2</b><span>Add stops<small>Import or enter manually</small></span></a>
				<a href="#route-stop-review-heading"><b>3</b><span>Review<small>Check stops and capacity</small></span></a>
			</nav>
			<section className="route-section" aria-labelledby="route-plan-heading">
				<div className="route-section-heading"><div><h2 id="route-plan-heading">Plan details</h2><p>Name the route and set the operating objective.</p></div></div>
				<div className="route-form-grid">
					<label className="route-field"><span>Route name *</span><input className="form-control" required value={routeName} onChange={(event) => setRouteName(event.target.value)} placeholder="e.g. London north deliveries" /></label>
					<label className="route-field"><span>Driver for this route *</span><input className="form-control" required value={driverName} onChange={(event) => setDriverName(event.target.value)} placeholder="Local preview driver name or ID" /></label>
					<label className="route-field"><span>PTV routing objective</span><select className="form-control" value={options.objective} onChange={(event) => setOptions((current) => ({ ...current, objective: event.target.value }))}><option value="time">Fastest truck route</option><option value="distance">Shortest truck route</option><option value="cost">Most economical PTV route</option></select></label>
					<label className="route-field"><span>Depot start</span><input className="form-control" value={depot.startAddress} onChange={(event) => setDepot((current) => ({ ...current, startAddress: event.target.value }))} placeholder="Depot address" /></label>
					<label className="route-field"><span>Depot end</span><input className="form-control" value={depot.endAddress} onChange={(event) => setDepot((current) => ({ ...current, endAddress: event.target.value }))} placeholder="Optional return address" /></label>
				</div>
				<div className="route-toggle-row">
					<label><input type="checkbox" checked={options.obeyTimeWindows} onChange={(event) => setOptions((current) => ({ ...current, obeyTimeWindows: event.target.checked }))} /> Draft preference: respect appointment windows</label>
					<label><input type="checkbox" checked={options.balanceWorkload} onChange={(event) => setOptions((current) => ({ ...current, balanceWorkload: event.target.checked }))} /> Draft preference: balance workload</label>
					<label><input type="checkbox" checked={options.minimizeVehicles} onChange={(event) => setOptions((current) => ({ ...current, minimizeVehicles: event.target.checked }))} /> Draft preference: minimize trucks</label>
				</div>
				<p className="route-estimate-note">These draft preferences are not enforced by PTV in this preview. Only the selected PTV routing objective is sent; stop order remains as entered.</p>
			</section>

			<ExcelStopUploader onStopsChange={(nextStops) => { setStops(nextStops); setSaveMessage(''); }} />

			<section className="route-section" aria-labelledby="manual-stop-heading">
				<div className="route-section-heading"><div><h2 id="manual-stop-heading">Add a stop manually</h2><p>Manual stops use the same validation rules as spreadsheet rows.</p></div></div>
				<form className="route-manual-stop-form" onSubmit={addManualStop}>
					<label className="route-field"><span>Stop ID *</span><input className="form-control" required value={manualStop.stopId} onChange={(event) => setManualStop((current) => ({ ...current, stopId: event.target.value }))} /></label>
					<label className="route-field"><span>Customer *</span><input className="form-control" required value={manualStop.customer} onChange={(event) => setManualStop((current) => ({ ...current, customer: event.target.value }))} /></label>
					<label className="route-field"><span>Stop type *</span><select className="form-control" value={manualStop.stopType} onChange={(event) => setManualStop((current) => ({ ...current, stopType: event.target.value }))}><option>PICKUP</option><option>DELIVERY</option><option>SERVICE</option></select></label>
					<label className="route-field route-field-wide"><span>Address *</span><input className="form-control" required value={manualStop.address} onChange={(event) => setManualStop((current) => ({ ...current, address: event.target.value }))} /></label>
					<label className="route-field"><span>City *</span><input className="form-control" required value={manualStop.city} onChange={(event) => setManualStop((current) => ({ ...current, city: event.target.value }))} /></label>
					<label className="route-field"><span>Province / State *</span><input className="form-control" required value={manualStop.region} onChange={(event) => setManualStop((current) => ({ ...current, region: event.target.value }))} /></label>
					<label className="route-field"><span>Postal / ZIP *</span><input className="form-control" required value={manualStop.postalCode} onChange={(event) => setManualStop((current) => ({ ...current, postalCode: event.target.value }))} /></label>
					<label className="route-field"><span>Weight</span><input className="form-control" type="number" min="0" step="any" value={manualStop.weight} onChange={(event) => setManualStop((current) => ({ ...current, weight: event.target.value }))} /></label>
					<label className="route-field"><span>Pallets</span><input className="form-control" type="number" min="0" step="any" value={manualStop.pallets} onChange={(event) => setManualStop((current) => ({ ...current, pallets: event.target.value }))} /></label>
					<label className="route-field"><span>Service time (minutes)</span><input className="form-control" type="number" min="0" step="1" value={manualStop.serviceMinutes} onChange={(event) => setManualStop((current) => ({ ...current, serviceMinutes: event.target.value }))} /></label>
					<label className="route-field"><span>Latitude (optional)</span><input className="form-control" type="number" min="-90" max="90" step="any" value={manualStop.latitude} onChange={(event) => setManualStop((current) => ({ ...current, latitude: event.target.value }))} /></label>
					<label className="route-field"><span>Longitude (optional)</span><input className="form-control" type="number" min="-180" max="180" step="any" value={manualStop.longitude} onChange={(event) => setManualStop((current) => ({ ...current, longitude: event.target.value }))} /></label>
					<button className="btn btn-outline-primary route-manual-add" type="submit"><i className="fa fa-plus" aria-hidden="true" /> Add stop</button>
				</form>
			</section>

			<section className="route-section" aria-labelledby="route-vehicles-heading">
				<div className="route-section-heading"><div><h2 id="route-vehicles-heading">Route vehicle profile</h2><p>Optional local preview only. Every stop remains on this single route.</p></div><button className="btn btn-outline-primary btn-sm" type="button" disabled={validVehiclePool.length > 0} onClick={() => setVehicles([{ ...newVehicle(), id: 'LOCAL-1' }])}><i className="fa fa-plus" aria-hidden="true" /> Add vehicle</button></div>
				{vehicles.length === 0 ? <p className="route-empty-inline">No local vehicle profiles added.</p> : <div className="table-responsive"><table className="table table-sm route-table">
					<thead><tr><th>Vehicle ID</th><th>Label</th><th>Max weight</th><th>Max pallets</th><th>Equipment</th><th>Start</th><th>End</th><th>Remove</th></tr></thead>
					<tbody>{vehicles.map((vehicle, index) => <tr key={`${vehicle.id}-${index}`}>
						<td><input aria-label={`Vehicle ${index + 1} ID`} className="form-control form-control-sm" value={vehicle.id} onChange={(event) => updateVehicle(index, 'id', event.target.value)} /></td>
						<td><input aria-label={`Vehicle ${index + 1} label`} className="form-control form-control-sm" value={vehicle.label} onChange={(event) => updateVehicle(index, 'label', event.target.value)} placeholder="Local preview vehicle" /></td>
						<td><input aria-label={`Vehicle ${index + 1} max weight`} className="form-control form-control-sm" type="number" min="0" value={vehicle.maxWeight} onChange={(event) => updateVehicle(index, 'maxWeight', event.target.value)} /></td>
						<td><input aria-label={`Vehicle ${index + 1} max pallets`} className="form-control form-control-sm" type="number" min="0" value={vehicle.maxPallets} onChange={(event) => updateVehicle(index, 'maxPallets', event.target.value)} /></td>
						<td><input aria-label={`Vehicle ${index + 1} equipment`} className="form-control form-control-sm" value={vehicle.equipment} onChange={(event) => updateVehicle(index, 'equipment', event.target.value)} placeholder="e.g. Reefer" /></td>
						<td><input aria-label={`Vehicle ${index + 1} start address`} className="form-control form-control-sm" value={vehicle.startAddress} onChange={(event) => updateVehicle(index, 'startAddress', event.target.value)} /></td>
						<td><input aria-label={`Vehicle ${index + 1} end address`} className="form-control form-control-sm" value={vehicle.endAddress} onChange={(event) => updateVehicle(index, 'endAddress', event.target.value)} /></td>
						<td><button className="btn btn-link text-danger btn-sm" type="button" aria-label={`Remove vehicle ${index + 1}`} onClick={() => setVehicles((current) => current.filter((_, itemIndex) => itemIndex !== index))}><i className="fa fa-trash" aria-hidden="true" /></button></td>
					</tr>)}</tbody>
				</table></div>}
				{aggregateWeight > aggregateCapacity && validVehiclePool.length > 0 && <p className="route-inline-warning" role="status">Total stop weight exceeds the entered aggregate vehicle capacity. This is an advisory check only; no assignment or optimizer is running.</p>}
			</section>

			<section className="route-section" aria-labelledby="route-stop-review-heading">
				<div className="route-section-heading"><div><h2 id="route-stop-review-heading">Review stops</h2><p>{stops.length} stops · 300 maximum</p></div></div>
				{validation.errors.length > 0 && <div className="route-validation route-validation-error" role="alert"><strong>{validation.errors.length} validation errors</strong><ul>{validation.errors.slice(0, 8).map((error, index) => <li key={`${error.sourceRow}-${error.field}-${index}`}>{error.sourceRow ? `Row ${error.sourceRow}: ` : ''}{error.message}</li>)}</ul>{validation.errors.length > 8 && <span>Additional errors are available in the imported row data.</span>}</div>}
				{validation.warnings.length > 0 && <div className="route-validation route-validation-warning" role="status"><strong>{validation.warnings.length} review warnings</strong><ul>{validation.warnings.slice(0, 5).map((warning, index) => <li key={`${warning.sourceRow}-${index}`}>Row {warning.sourceRow}: {warning.message}</li>)}</ul></div>}
				{assignmentValidation.errors.length > 0 && <div className="route-validation route-validation-error" role="alert"><strong>{assignmentValidation.errors.length} vehicle assignment errors</strong><ul>{assignmentValidation.errors.map((error, index) => <li key={`${error.stopId || error.vehicleId}-${index}`}>{error.message}</li>)}</ul></div>}
				{assignmentValidation.warnings.length > 0 && <div className="route-validation route-validation-warning" role="status"><strong>Assignment review</strong><ul>{assignmentValidation.warnings.map((warning, index) => <li key={`${warning.vehicleId || 'unassigned'}-${index}`}>{warning.message}</li>)}</ul></div>}
				{stops.length === 0 ? <p className="route-empty-inline">Add a stop manually or import an Excel workbook.</p> : <div className="table-responsive"><table className="table table-sm route-table">
					<thead><tr><th>Stop</th><th>Type</th><th>Customer / address</th><th>Window</th><th>Load</th><th>Review</th><th>Remove</th></tr></thead>
					<tbody>{stops.map((stop, index) => {
						const rowErrors = validation.errors.filter((error) => error.sourceRow === stop.sourceRow);
						return <tr key={stop.previewKey || `${stop.stopId || 'stop'}-${index}`}>
							<td><strong>{stop.stopId || `Stop ${index + 1}`}</strong><small>Row {stop.sourceRow}</small></td>
							<td>{stop.stopType}</td>
							<td>{stop.customer}<small>{[stop.address, stop.city, stop.region, stop.postalCode].filter(Boolean).join(', ')}</small></td>
							<td>{stop.appointmentStart || 'No window'}<small>{stop.appointmentEnd || ''}</small></td>
							<td>{stop.weight ?? '—'} weight · {stop.pallets ?? '—'} pallets</td>
							<td>{rowErrors.length ? <span className="route-status route-status-error">{rowErrors.length} errors</span> : <span className="route-status route-status-ready">Ready for review</span>}</td>
							<td><button type="button" className="btn btn-link text-danger btn-sm" aria-label={`Remove stop ${stop.stopId || index + 1}`} onClick={() => removeStop(stop)}><i className="fa fa-trash" aria-hidden="true" /></button></td>
						</tr>;
					})}</tbody>
				</table></div>}
			</section>

			{mapCreated && <section id="route-map-preview" className="route-section" aria-labelledby="route-map-preview-heading">
				<div className="route-section-heading"><div><h2 id="route-map-preview-heading">PTV truck route preview</h2><p>PTV routes the current stop order. "Optimize stop order" uses Google Route Optimization, then automatically refreshes the PTV road route. This is not PTV stop-order optimization or truck-constraint clearance.</p></div><button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setMapCreated(false)}>Hide map</button></div>
				{routeRequestStatus && <p className="route-inline-success" role="status">{routeRequestStatus}</p>}
				{routeRequestError && <div className="route-validation route-validation-error" role="alert"><strong>Route preview unavailable</strong><p>{routeRequestError}</p><button type="button" className="btn btn-outline-primary btn-sm" disabled={isCalculatingRoute || isOptimizingStops} onClick={createMapPreview}>{isCalculatingRoute ? 'Calculating…' : 'Retry PTV route'}</button></div>}
				{routeData && routeData.fingerprint === routeFingerprint && <div className="route-route-summary" role="status">
					<span><strong>{routeData.provider}</strong></span>
					<span>{routeData.result.distanceKms ?? '—'} km</span>
					<span>{routeData.result.durationText || 'Duration unavailable'}</span>
					<span>Objective: {options.objective}</span>
					{providerToll && <span>PTV-reported tolls: {providerToll.amount.toFixed(2)} {providerToll.currency || '(currency not provided)'}</span>}
				</div>}
				<RouteMap stops={routeData?.fingerprint === routeFingerprint ? routeData.stops : stops} routePath={routeData?.fingerprint === routeFingerprint ? routeData.path : []} providerRoute={Boolean(routeData?.fingerprint === routeFingerprint && routeData.path.length >= 2)} />
			</section>}

			{showEstimate && <section className="route-section" aria-labelledby="route-estimate-heading">
				<div className="route-section-heading"><div><h2 id="route-estimate-heading">Route cost estimate</h2><p>Distance and driving time come from PTV when available. Fuel consumption, fuel price, and driver rate are your assumptions.</p></div><button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setShowEstimate(false)}>Hide estimate</button></div>
				{routeRequestError && <p className="route-inline-error" role="status">PTV metrics unavailable: {routeRequestError} You can still enter distance and speed manually.</p>}
				{providerToll && <p className="route-estimate-note">PTV-reported tolls are displayed separately and are not included in the fuel and driver estimate subtotal.</p>}
				<div className="route-estimate-grid">
					<label className="route-field"><span>Route distance (km) *</span><input className="form-control" type="number" min="0" step="any" value={estimateInputs.distanceKm} onChange={(event) => setEstimateInputs((current) => ({ ...current, distanceKm: event.target.value }))} /></label>
					<label className="route-field"><span>Average speed (km/h) *</span><input className="form-control" type="number" min="0.1" step="any" value={estimateInputs.averageSpeedKmh} onChange={(event) => setEstimateInputs((current) => ({ ...current, averageSpeedKmh: event.target.value }))} /></label>
					<label className="route-field"><span>Fuel consumption (L/100 km) *</span><input className="form-control" type="number" min="0" step="any" value={estimateInputs.fuelConsumptionLPer100Km} onChange={(event) => setEstimateInputs((current) => ({ ...current, fuelConsumptionLPer100Km: event.target.value }))} /></label>
					<label className="route-field"><span>Fuel price (per L) *</span><input className="form-control" type="number" min="0" step="any" value={estimateInputs.fuelPricePerL} onChange={(event) => setEstimateInputs((current) => ({ ...current, fuelPricePerL: event.target.value }))} /></label>
					<label className="route-field"><span>Driver cost (per hour) *</span><input className="form-control" type="number" min="0" step="any" value={estimateInputs.driverCostPerHour} onChange={(event) => setEstimateInputs((current) => ({ ...current, driverCostPerHour: event.target.value }))} /></label>
				</div>
				<p className="route-estimate-note">Service time uses stop durations you supplied; {stops.filter((stop) => !Number.isFinite(stop.serviceMinutes)).length} stop(s) have no service-time input. Tolls, taxes, maintenance, and empty/return mileage are not included. Monetary values use your entered currency units without conversion.</p>
				<button type="button" className="btn btn-primary btn-sm" onClick={() => setEstimateRequested(true)}>Calculate local estimate</button>
				{estimateRequested && (planningEstimate.valid ? <div className="route-estimate-result" role="status">
					<strong>Local planning estimate · not a quote</strong><span>Driving time: {planningEstimate.drivingHours} h</span><span>Known service time: {planningEstimate.knownServiceMinutes} min</span><span>Estimated duration: {planningEstimate.estimatedHours} h</span><span>Estimated fuel: {planningEstimate.fuelLitres} L</span><span>Fuel cost: {planningEstimate.fuelCost.toFixed(2)} entered units</span><span>Driver cost: {planningEstimate.driverCost.toFixed(2)} entered units</span><b>Total: {planningEstimate.totalCost.toFixed(2)} entered units</b>
				</div> : <div className="route-validation route-validation-error" role="alert"><strong>Complete valid assumptions</strong><ul>{planningEstimate.errors.map((error) => <li key={error}>{error}</li>)}</ul></div>)}
			</section>}

			<section className="route-draft-checklist" aria-label="Draft readiness">
				<div><h2>{canCreateDraft ? 'Ready to create your draft' : 'Finish your route plan'}</h2><p>{stops.length} stop{stops.length === 1 ? '' : 's'} added. Drafts stay in this navigation session; refreshing may clear them.</p></div>
				<ul>{draftChecklist.map((item) => <li key={item.label} className={item.done ? 'is-complete' : ''}><a href={`#${item.target}`}><i className={`fa ${item.done ? 'fa-check-circle' : 'fa-circle-o'}`} aria-hidden="true" />{item.label}<span>{item.done ? 'Complete' : 'Needed'}</span></a></li>)}</ul>
			</section>
			<div className="route-action-bar">
				<button className="btn btn-outline-primary" type="button" disabled={!stops.length || isCalculatingRoute || isOptimizingStops} onClick={createMapPreview}><i className="fa fa-map" aria-hidden="true" /> {isCalculatingRoute && mapCreated ? 'Calculating map…' : 'Create map'}</button>
				<button className="btn btn-outline-primary" type="button" disabled={!stops.length || isCalculatingRoute || isOptimizingStops} onClick={createEstimate}><i className="fa fa-calculator" aria-hidden="true" /> {isCalculatingRoute && showEstimate ? 'Loading estimate…' : 'Create estimate'}</button>
				<button className="btn btn-outline-primary" type="button" disabled={!stops.length || isOptimizingStops} onClick={openRouteView}><i className="fa fa-list-ol" aria-hidden="true" /> View route</button>
				<button className="btn btn-outline-primary" type="button" title="Google Route Optimization preview; 4 to 20 stops, fixed endpoints, no depot addresses. PTV road routing refreshes automatically." disabled={stops.length < 4 || stops.length > 20 || isOptimizingStops || isCalculatingRoute} onClick={optimizeStopOrderPreview}><i className="fa fa-random" aria-hidden="true" /> {isOptimizingStops ? 'Optimizing stops…' : 'Optimize stop order'}</button>
				<button className="btn btn-outline-secondary" type="button" disabled={!validation.valid || validVehiclePool.length === 0} onClick={() => setShowRequestPreview((current) => !current)}><i className="fa fa-code" aria-hidden="true" /> {showRequestPreview ? 'Hide request preview' : 'Preview API request'}</button>
				<button className="btn btn-primary" type="button" disabled={!canCreateDraft} onClick={saveLocalDraft}><i className="fa fa-save" aria-hidden="true" /> Create local draft</button>
				<button className="btn btn-outline-secondary" type="button" disabled title="Enable only after server authorization and persistence are implemented."><i className="fa fa-ban" aria-hidden="true" /> Save to IFM</button>
				<button className="btn btn-outline-secondary" type="button" disabled title="No route has been authorized or persisted."><i className="fa fa-ban" aria-hidden="true" /> Dispatch to Driver App</button>
			</div>
			{stopOptimizationStatus && <p className="route-inline-success" role="status">{stopOptimizationStatus}</p>}
			{stopOptimizationError && <p className="route-inline-error" role="alert">{stopOptimizationError}</p>}
			{!validation.valid && <p className="route-action-hint">Resolve validation errors before creating a local draft.</p>}
			{!driverName.trim() && <p className="route-action-hint">Enter the one driver who will complete this route before creating a local draft.</p>}
			{saveMessage && <p role="status" className="route-inline-success">{saveMessage}</p>}
			{requestPreview && <section className="route-section route-request-preview"><div className="route-section-heading"><div><h2>API contract preview</h2><p>Contract only; this request has not been submitted to the backend or PTV.</p></div></div>
				<pre>{JSON.stringify(requestPreview, null, 2)}</pre>
				{process.env.NODE_ENV === 'development' && <div className="route-mock-panel">
					<div><strong>Development-only PTV lifecycle mock</strong><p>Exercises accepted, running, and terminal job states. It does not call PTV or generate optimized routes.</p></div>
					<button className="btn btn-outline-primary btn-sm" type="button" disabled={mockRunning} onClick={runMockLifecycle}>{mockRunning ? 'Simulating lifecycle…' : 'Run lifecycle mock'}</button>
					{mockLifecycle && <div className="route-mock-result" role="status">{mockLifecycle.error ? <span>{mockLifecycle.error}</span> : <><span>MOCK_ACCEPTED · 202</span><span>MOCK_RUNNING · {mockLifecycle.running.progress}%</span><span>MOCK_COMPLETED · no route result</span><span>Provider calls: 0 · assigned stops: 0</span></>}</div>}
				</div>}
			</section>}
		</main>
	);
}

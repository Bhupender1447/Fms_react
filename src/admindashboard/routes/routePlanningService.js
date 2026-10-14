import { getStopProgress } from './routePlanningModel';

export const ROUTE_API_CONTRACTS = Object.freeze([
	{ method: 'POST', path: '/routes/import/preview', purpose: 'Validate an uploaded workbook and return row errors/warnings.' },
	{ method: 'POST', path: '/routes/optimize', purpose: 'Create a server-owned PTV V2 optimization job.' },
	{ method: 'GET', path: '/routes/optimization/{jobId}', purpose: 'Poll provider job state and progress.' },
	{ method: 'POST', path: '/routes/optimization/{jobId}/stop', purpose: 'Stop an optimization job when supported.' },
	{ method: 'POST', path: '/routes', purpose: 'Persist a reviewed route plan after authorization and schema gates.' },
	{ method: 'GET', path: '/routes', purpose: 'List routes scoped to the authenticated active account.' },
	{ method: 'GET', path: '/routes/{id}', purpose: 'Read an authorized route and its stops.' },
	{ method: 'PUT', path: '/routes/{id}', purpose: 'Update an authorized draft route.' },
	{ method: 'POST', path: '/routes/{id}/assign', purpose: 'Assign an authorized driver/truck with audit history.' },
	{ method: 'POST', path: '/routes/{id}/dispatch', purpose: 'Dispatch only after server authorization and approval.' },
	{ method: 'GET', path: '/routes/{id}/progress', purpose: 'Read verified stop and distance progress.' },
	{ method: 'GET', path: '/routes/{id}/tracking', purpose: 'Read account-scoped verified location data.' },
	{ method: 'POST', path: '/routes/{id}/reoptimize', purpose: 'Request a new provider job for remaining stops.' },
	{ method: 'POST', path: '/routes/{id}/stops/{stopId}/complete', purpose: 'Record verified driver completion evidence.' },
]);

export const PTV_V2_LIFECYCLE = Object.freeze({
	create: 'POST https://api.myptv.com/routeoptimization/optiflow/v1/optimizations (202 + job id)',
	status: 'GET https://api.myptv.com/routeoptimization/optiflow/v1/optimizations/{id}',
	stop: 'POST https://api.myptv.com/routeoptimization/optiflow/v1/optimizations/{id}/stop (202)',
	result: 'Read the final optimization resource after its status is SUCCEEDED.',
	credentials: 'ApiKey is server-side only; no browser call is implemented.',
});

export const ROUTE_MUTATIONS_ENABLED = false;

export function createMockPtvOptimizationClient({ mode = 'success', pollsToComplete = 2 } = {}) {
	const jobs = new Map();
	let sequence = 0;

	return {
		async createOptimization(request) {
			if (request?.mode !== 'CONTRACT_PREVIEW_ONLY') throw new Error('A route contract preview is required.');
			if (request.stopCount > 300) throw new Error('Mock refuses route plans above 300 stops.');
			const id = `MOCK-PTV-JOB-${++sequence}`;
			jobs.set(id, { id, pollCount: 0, request });
			return { httpStatus: 202, id, mode: 'MOCK_ONLY', submittedToProvider: false, status: 'MOCK_ACCEPTED' };
		},

		async getOptimization(id) {
			const job = jobs.get(id);
			if (!job) return { httpStatus: 404, mode: 'MOCK_ONLY', status: 'MOCK_NOT_FOUND' };
			job.pollCount += 1;
			if (mode === 'failure') return { httpStatus: 200, id, mode: 'MOCK_ONLY', status: 'MOCK_FAILED', error: 'MOCK_PROVIDER_FAILURE', routes: [] };
			if (mode === 'timeout') return { httpStatus: 200, id, mode: 'MOCK_ONLY', status: 'MOCK_STILL_RUNNING', timedOut: true, progress: Math.min(90, job.pollCount * 30), routes: [] };
			if (job.pollCount < pollsToComplete) return { httpStatus: 200, id, mode: 'MOCK_ONLY', status: 'MOCK_RUNNING', progress: Math.min(90, job.pollCount * 45), routes: [] };
			return { httpStatus: 200, id, mode: 'MOCK_ONLY', status: 'MOCK_COMPLETED', progress: 100, routes: [], resultAvailable: false, note: 'Lifecycle fixture only; no optimized route or truck assignment was generated.' };
		},

		async stopOptimization(id) {
			if (!jobs.has(id)) return { httpStatus: 404, id, mode: 'MOCK_ONLY', status: 'MOCK_NOT_FOUND' };
			jobs.delete(id);
			return { httpStatus: 202, id, mode: 'MOCK_ONLY', submittedToProvider: false, status: 'MOCK_STOPPED' };
		},
	};
}

export function buildRouteApiPreview({ routeName, stops, vehicles, options, depot }) {
	return {
		method: 'POST',
		path: '/routes/optimize',
		mode: 'CONTRACT_PREVIEW_ONLY',
		submitted: false,
		provider: 'PTV_ROUTE_OPTIMIZATION_V2',
		routeName: String(routeName ?? '').trim(),
		stopCount: stops.length,
		vehicleCount: vehicles.length,
		depot: { ...depot },
		objective: options.objective,
		requiredConstraints: {
			appointmentWindows: Boolean(options.obeyTimeWindows),
			pickupBeforeDelivery: true,
			vehicleCapacity: true,
			equipmentRequirements: true,
		},
		unassignedStopsMustBeReturned: true,
	};
}

export function createLocalRouteDraft({ routeName, driverName, stops, vehicles = [], options, depot }) {
	const id = `LOCAL-DRAFT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
	const routeStops = [...stops];
	const route = {
		id: `${id}-ROUTE`,
		routeNumber: `${id}-ROUTE`,
		vehicle: vehicles[0] ? { ...vehicles[0] } : null,
		driver: driverName?.trim() ? { name: driverName.trim() } : null,
		stops: routeStops,
		progress: getStopProgress(routeStops),
		status: 'DRAFT',
		location: null,
		locationStatus: 'LOCATION_UNAVAILABLE',
	};

	return {
		id,
		routeName: String(routeName ?? '').trim() || 'Untitled route plan',
		createdAt: new Date().toISOString(),
		status: 'DRAFT_NOT_OPTIMIZED',
		source: 'SESSION_ONLY',
		providerStatus: 'NOT_SUBMITTED',
		routes: routeStops.length ? [route] : [],
		stops,
		unassignedStops: [],
		driverName: driverName?.trim() || '',
		vehicles,
		options,
		depot,
		apiPreview: buildRouteApiPreview({ routeName, stops, vehicles, options, depot }),
		operationalMutationEnabled: false,
	};
}

export function summarizeRouteProgress(stops) {
	return getStopProgress(stops);
}

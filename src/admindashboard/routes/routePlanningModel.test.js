import {
	buildRouteRequestPreview,
	calculatePlanningEstimate,
	detectRouteColumnMapping,
	getStopProgress,
	normalizeRouteRows,
	ROUTE_FIELDS,
	reorderRouteStops,
	validateManualAssignments,
	validateRouteStops,
} from './routePlanningModel';

const standardHeaders = [
	'Customer', 'Address', 'City', 'Province/State', 'Postal/ZIP',
	'Stop Type', 'Appointment Start', 'Appointment End', 'Service Time',
	'Weight', 'Pallets', 'Priority', 'Special Instructions',
];

const makeRow = (index, overrides = {}) => ({
	Customer: `Customer ${index}`,
	Address: `${index} Main Street`,
	City: 'London',
	'Province/State': 'Ontario',
	'Postal/ZIP': 'N6A 1A1',
	'Stop Type': 'Delivery',
	'Appointment Start': '2026-10-14T08:00:00',
	'Appointment End': '2026-10-14T10:00:00',
	'Service Time': 20,
	Weight: 100,
	Pallets: 2,
	Priority: 'Normal',
	'Special Instructions': '',
	...overrides,
});

test('accepts 30, 100, 200, and 300 Excel stops without a Stop ID column', () => {
	const mapping = detectRouteColumnMapping(standardHeaders);
	expect(mapping).not.toHaveProperty('stopId');
	expect(mapping.region).toBe('Province/State');

	[30, 100, 200, 300].forEach((count) => {
		const stops = normalizeRouteRows(Array.from({ length: count }, (_, index) => makeRow(index + 1)), mapping);
		expect(stops).toHaveLength(count);
		expect(validateRouteStops(stops)).toMatchObject({ valid: true, errors: [] });
		expect(stops.every((stop) => stop.stopId === '')).toBe(true);
		expect(new Set(stops.map((stop) => stop.previewKey)).size).toBe(count);
		expect(validateRouteStops(stops).errors.some((error) => error.message === 'Stop ID is required.')).toBe(false);
	});
});

test('rejects uploads above the 300-stop planning limit without truncating input', () => {
	const mapping = detectRouteColumnMapping(standardHeaders);
	const stops = normalizeRouteRows(Array.from({ length: 301 }, (_, index) => makeRow(index + 1)), mapping);
	const result = validateRouteStops(stops);

	expect(stops).toHaveLength(301);
	expect(result.valid).toBe(false);
	expect(result.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'stops', message: 'Maximum 300 stops per route plan.' })]));
});

test.each([
	['Customer', 'customer'],
	['Address', 'address'],
	['City', 'city'],
	['Province/State', 'region'],
	['Postal/ZIP', 'postalCode'],
])('rejects a row missing %s without requiring Stop ID', (column, field) => {
	const mapping = detectRouteColumnMapping(standardHeaders);
	const stop = normalizeRouteRows([makeRow(1, { [column]: '' })], mapping)[0];
	const result = validateRouteStops([stop]);

	expect(result.valid).toBe(false);
	expect(result.errors).toEqual(expect.arrayContaining([expect.objectContaining({ field })]));
	expect(result.errors.some((error) => error.message === 'Stop ID is required.')).toBe(false);
});

test('rejects invalid appointment windows and negative capacity values', () => {
	const mapping = detectRouteColumnMapping(standardHeaders);
	const stop = normalizeRouteRows([makeRow(1, { 'Appointment Start': 'not a date', Weight: -10 })], mapping)[0];
	const result = validateRouteStops([stop]);

	expect(result.valid).toBe(false);
	expect(result.errors.map((error) => error.field)).toEqual(expect.arrayContaining(['appointmentStart', 'weight']));
});

test('duplicate addresses warn but do not confuse route preview keys or Stop IDs', () => {
	const mapping = detectRouteColumnMapping(standardHeaders);
	const stops = normalizeRouteRows([makeRow(1), makeRow(2, { Address: '1 Main Street' })], mapping);
	const result = validateRouteStops(stops);

	expect(result.valid).toBe(true);
	expect(result.errors).toEqual([]);
	expect(result.warnings).toEqual(expect.arrayContaining([expect.objectContaining({ field: 'address' })]));
	expect(new Set(stops.map((stop) => stop.previewKey)).size).toBe(2);
	expect(stops.map((stop) => stop.stopId)).toEqual(['', '']);
});

test('carrier route fields contain no broker order or trip identifiers', () => {
	const mapping = detectRouteColumnMapping([...standardHeaders, 'Order ID', 'Trip ID']);
	const stop = normalizeRouteRows([makeRow(1, { 'Order ID': 'ORDER-1', 'Trip ID': 'TRIP-1' })], mapping)[0];

	expect(stop).not.toHaveProperty('orderId');
	expect(stop).not.toHaveProperty('tripId');
	expect(ROUTE_FIELDS.map((field) => field.key)).not.toEqual(expect.arrayContaining(['stopId', 'orderId', 'tripId']));
});

test('progress counts verified stop-completion evidence only', () => {
	const stops = [
		{ stopId: 'A', completionEvidence: { verified: true, source: 'driver' } },
		{ stopId: 'B', completionEvidence: { verified: false, source: 'mock' } },
		{ stopId: 'C', completionEvidence: null },
	];

	expect(getStopProgress(stops)).toEqual({ completed: 1, total: 3, percent: 33 });
	expect(getStopProgress([])).toEqual({ completed: 0, total: 0, percent: 0 });
});

test('reorders the full stop sequence without mutating stop addresses or the input list', () => {
	const stops = [
		{ stopId: '', previewKey: 'a', customer: 'Carrier A', address: '10 Pickup Road', latitude: 42.98, longitude: -81.25 },
		{ stopId: '', previewKey: 'b', customer: 'Carrier B', address: '20 Delivery Road', latitude: 43, longitude: -81.2 },
		{ stopId: '', previewKey: 'c', customer: 'Carrier C', address: '30 Other Road' },
	];
	const reordered = reorderRouteStops(stops, 2, 0);

	expect(reordered.map((stop) => stop.previewKey)).toEqual(['c', 'a', 'b']);
	expect(reordered[1]).toMatchObject({ customer: 'Carrier A', address: '10 Pickup Road', latitude: 42.98, longitude: -81.25 });
	expect(reordered[2]).toMatchObject({ customer: 'Carrier B', address: '20 Delivery Road', latitude: 43, longitude: -81.2 });
	expect(stops.map((stop) => stop.previewKey)).toEqual(['a', 'b', 'c']);
	expect(reorderRouteStops(stops, -1, 0)).toBe(stops);
});

test('calculates a local estimate only from explicit dispatcher assumptions', () => {
	const estimate = calculatePlanningEstimate({
		stops: [{ serviceMinutes: 40 }, { serviceMinutes: null }],
		distanceKm: '120',
		averageSpeedKmh: '60',
		fuelConsumptionLPer100Km: '30',
		fuelPricePerL: '1.5',
		driverCostPerHour: '25',
	});

	expect(estimate).toMatchObject({ valid: true, drivingHours: 2, knownServiceMinutes: 40, stopsWithoutServiceTime: 1, estimatedHours: 2.67, fuelLitres: 36, fuelCost: 54, driverCost: 66.67, totalCost: 120.67 });
});

test('rejects missing estimate assumptions and zero average speed', () => {
	const estimate = calculatePlanningEstimate({ distanceKm: 0, averageSpeedKmh: 0 });
	expect(estimate.valid).toBe(false);
	expect(estimate.errors).toEqual(expect.arrayContaining(['Fuel consumption must be a non-negative number.', 'Average speed must be greater than zero.']));
});

test('manual assignment blocks capacity/equipment violations and reports unassigned stops', () => {
	const stops = [
		{ stopId: 'A', assignedVehicleId: 'TRUCK-1', weight: 900, pallets: 9, equipment: 'Reefer' },
		{ stopId: 'B', assignedVehicleId: '', weight: 10, pallets: 1, equipment: '' },
	];
	const vehicles = [{ id: 'TRUCK-1', maxWeight: '800', maxPallets: '8', equipment: 'Dry Van' }];
	const result = validateManualAssignments(stops, vehicles);

	expect(result.valid).toBe(false);
	expect(result.unassignedStopIds).toEqual(['B']);
	expect(result.errors.map((error) => error.message).join(' ')).toMatch(/exceeds|does not confirm/);
	expect(result.warnings).toEqual(expect.arrayContaining([expect.objectContaining({ message: expect.stringContaining('1 stops remain unassigned') })]));
});

test('request preview is explicitly non-submitted and carries no client authority fields', () => {
	const preview = buildRouteRequestPreview({
		routeName: 'London local draft',
		stops: [normalizeRouteRows([makeRow(1)], detectRouteColumnMapping(standardHeaders))[0]],
		vehicles: [{ id: 'LOCAL-TRUCK-1', maxWeight: 12000, maxPallets: 20 }],
		depot: { address: '10 Depot Road, London, Ontario' },
		options: { objective: 'time', obeyTimeWindows: true },
	});

	expect(preview).toMatchObject({ provider: 'PTV_ROUTE_OPTIMIZATION_V2', mode: 'PREVIEW_ONLY', submitted: false });
	expect(preview).not.toHaveProperty('account_id');
	expect(preview).not.toHaveProperty('user_id');
});

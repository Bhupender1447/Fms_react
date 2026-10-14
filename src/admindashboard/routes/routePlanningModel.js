export const ROUTE_FIELDS = [
	{ key: 'customer', label: 'Customer', aliases: ['customer', 'customer name'], required: true },
	{ key: 'address', label: 'Address', aliases: ['address', 'street address', 'complete address'], required: true },
	{ key: 'city', label: 'City', aliases: ['city'], required: true },
	{ key: 'region', label: 'Province / State', aliases: ['province', 'state', 'province state', 'province/state'], required: true },
	{ key: 'postalCode', label: 'Postal / ZIP', aliases: ['postal', 'postal code', 'zip', 'zip code', 'postal/zip'], required: true },
	{ key: 'stopType', label: 'Stop Type', aliases: ['stop type', 'type'], required: false },
	{ key: 'appointmentStart', label: 'Appointment Start', aliases: ['appointment start', 'earliest arrival', 'window start'], required: false },
	{ key: 'appointmentEnd', label: 'Appointment End', aliases: ['appointment end', 'latest arrival', 'window end'], required: false },
	{ key: 'serviceMinutes', label: 'Service Time (minutes)', aliases: ['service time', 'service minutes', 'duration'], required: false },
	{ key: 'weight', label: 'Weight', aliases: ['weight', 'shipment weight'], required: false },
	{ key: 'pallets', label: 'Pallets', aliases: ['pallets', 'pallet quantity'], required: false },
	{ key: 'priority', label: 'Priority', aliases: ['priority'], required: false },
	{ key: 'instructions', label: 'Special Instructions', aliases: ['special instructions', 'instructions', 'driver instructions'], required: false },
	{ key: 'equipment', label: 'Equipment Requirement', aliases: ['equipment', 'equipment requirement'], required: false },
	{ key: 'latitude', label: 'Latitude (optional)', aliases: ['latitude', 'lat'], required: false },
	{ key: 'longitude', label: 'Longitude (optional)', aliases: ['longitude', 'lng', 'lon'], required: false },
];

let previewStopSequence = 0;

export function createRouteStopPreviewKey() {
	previewStopSequence += 1;
	return `route-preview-${previewStopSequence}`;
}

const normalizeHeader = (value) => String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const cellText = (value) => value instanceof Date ? value.toISOString() : String(value ?? '').trim();

export function detectRouteColumnMapping(headers) {
	const normalizedHeaders = headers.map((header) => ({ original: header, normalized: normalizeHeader(header) }));
	return Object.fromEntries(ROUTE_FIELDS.map((field) => {
		const aliases = field.aliases.map(normalizeHeader);
		const match = normalizedHeaders.find((header) => aliases.includes(header.normalized));
		return [field.key, match?.original ?? ''];
	}));
}

const optionalNumber = (value) => {
	if (value === '' || value === null || value === undefined) return null;
	const number = Number(value);
	return Number.isFinite(number) ? number : Number.NaN;
};

const normalizeStopType = (value) => {
	const type = normalizeHeader(value).toUpperCase();
	if (!type) return 'STOP';
	if (['PU', 'PICK UP', 'PICKUP'].includes(type)) return 'PICKUP';
	if (['DEL', 'DROP', 'DELIVERY'].includes(type)) return 'DELIVERY';
	if (['SERVICE', 'STOP'].includes(type)) return 'SERVICE';
	return type;
};

export function normalizeRouteRows(rows, mapping) {
	return rows
		.map((row, index) => {
			const values = {};
			ROUTE_FIELDS.forEach(({ key }) => {
				const header = mapping[key];
				values[key] = header ? cellText(row[header]) : '';
			});
			return {
				previewKey: createRouteStopPreviewKey(),
				sourceRow: index + 2,
				stopId: '',
				customer: values.customer,
				address: values.address,
				city: values.city,
				region: values.region,
				postalCode: values.postalCode,
				stopType: normalizeStopType(values.stopType),
				appointmentStart: values.appointmentStart,
				appointmentEnd: values.appointmentEnd,
				serviceMinutes: optionalNumber(values.serviceMinutes),
				weight: optionalNumber(values.weight),
				pallets: optionalNumber(values.pallets),
				priority: values.priority.toUpperCase() || 'NORMAL',
				instructions: values.instructions,
				equipment: values.equipment,
				latitude: optionalNumber(values.latitude),
				longitude: optionalNumber(values.longitude),
				assignedVehicleId: '',
				completionEvidence: null,
			};
		})
		.filter((stop) => ROUTE_FIELDS.some(({ key }) => String(stop[key] ?? '').trim() !== ''));
}

const isValidDate = (value) => value === '' || Number.isFinite(Date.parse(value));

export function validateRouteStops(stops, maxStops = 300) {
	const errors = [];
	const warnings = [];
	if (!stops.length) errors.push({ sourceRow: null, field: 'stops', message: 'Add at least one stop.' });
	if (stops.length > maxStops) errors.push({ sourceRow: null, field: 'stops', message: `Maximum ${maxStops} stops per route plan.` });

	const seenIds = new Map();
	const addressRows = new Map();
	stops.forEach((stop, index) => {
		const row = stop.sourceRow ?? index + 1;
		const addError = (field, message) => errors.push({ sourceRow: row, field, message });
		const stopId = String(stop.stopId ?? '').trim();
		const address = String(stop.address ?? '').trim();
		const city = String(stop.city ?? '').trim();
		const region = String(stop.region ?? '').trim();
		const postalCode = String(stop.postalCode ?? '').trim();

		if (stopId && seenIds.has(stopId.toLowerCase())) addError('stopId', `Duplicate Stop ID (first used on row ${seenIds.get(stopId.toLowerCase())}).`);
		else if (stopId) seenIds.set(stopId.toLowerCase(), row);

		if (!String(stop.customer ?? '').trim()) addError('customer', 'Customer is required.');
		if (!address) addError('address', 'Address is required.');
		if (!city) addError('city', 'City is required.');
		if (!region) addError('region', 'Province/State is required.');
		if (!postalCode) addError('postalCode', 'Postal/ZIP is required.');
		if (!['PICKUP', 'DELIVERY', 'SERVICE', 'STOP'].includes(stop.stopType)) addError('stopType', 'Stop Type must be Pickup, Delivery, Service, or Stop.');
		if (!['NORMAL', 'URGENT', 'HIGH', 'LOW'].includes(stop.priority || 'NORMAL')) addError('priority', 'Priority must be Normal, Urgent, High, or Low.');

		if (!isValidDate(stop.appointmentStart)) addError('appointmentStart', 'Appointment Start is not a valid date/time.');
		if (!isValidDate(stop.appointmentEnd)) addError('appointmentEnd', 'Appointment End is not a valid date/time.');
		if (stop.appointmentStart && stop.appointmentEnd && Date.parse(stop.appointmentStart) > Date.parse(stop.appointmentEnd)) {
			addError('appointmentEnd', 'Appointment End must be after Appointment Start.');
		}

		['weight', 'pallets', 'serviceMinutes'].forEach((field) => {
			if (Number.isNaN(stop[field]) || (stop[field] !== null && stop[field] < 0)) addError(field, `${field} must be a non-negative number.`);
		});
		if ((stop.latitude === null) !== (stop.longitude === null)) addError('latitude', 'Latitude and longitude must be supplied together.');
		if (stop.latitude !== null && (Number.isNaN(stop.latitude) || stop.latitude < -90 || stop.latitude > 90)) addError('latitude', 'Latitude must be between -90 and 90.');
		if (stop.longitude !== null && (Number.isNaN(stop.longitude) || stop.longitude < -180 || stop.longitude > 180)) addError('longitude', 'Longitude must be between -180 and 180.');

		const normalizedAddress = [address, city, region, postalCode].join('|').toLowerCase();
		if (addressRows.has(normalizedAddress)) warnings.push({ sourceRow: row, field: 'address', message: `Address duplicates row ${addressRows.get(normalizedAddress)}; verify this is intentional.` });
		else addressRows.set(normalizedAddress, row);
	});

	return { errors, warnings, valid: errors.length === 0 };
}

export function getStopProgress(stops = []) {
	const completed = stops.filter((stop) => stop.completionEvidence?.verified === true).length;
	const total = stops.length;
	return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
}

export function reorderRouteStops(stops, sourceIndex, destinationIndex) {
	if (!Array.isArray(stops) || sourceIndex < 0 || destinationIndex < 0 || sourceIndex >= stops.length || destinationIndex >= stops.length) return stops;
	if (sourceIndex === destinationIndex) return stops;
	const reordered = [...stops];
	const [movedStop] = reordered.splice(sourceIndex, 1);
	reordered.splice(destinationIndex, 0, movedStop);
	return reordered;
}

export function calculatePlanningEstimate(input = {}) {
	const { stops = [], distanceKm, averageSpeedKmh, fuelConsumptionLPer100Km, fuelPricePerL, driverCostPerHour } = input;
	const assumptions = [
		['distanceKm', 'Route distance', 0],
		['averageSpeedKmh', 'Average speed', 0],
		['fuelConsumptionLPer100Km', 'Fuel consumption', 0],
		['fuelPricePerL', 'Fuel price', 0],
		['driverCostPerHour', 'Driver cost per hour', 0],
	];
	const errors = [];
	assumptions.forEach(([key, label, minimum]) => {
		const value = input[key];
		if (value === '' || value === null || value === undefined || !Number.isFinite(Number(value)) || Number(value) < minimum) {
			errors.push(`${label} must be a non-negative number.`);
		}
	});
	if (Number(averageSpeedKmh) <= 0) errors.push('Average speed must be greater than zero.');
	if (errors.length) return { valid: false, errors };

	const distance = Number(distanceKm);
	const speed = Number(averageSpeedKmh);
	const consumption = Number(fuelConsumptionLPer100Km);
	const fuelPrice = Number(fuelPricePerL);
	const driverRate = Number(driverCostPerHour);
	const knownServiceMinutes = stops.reduce((total, stop) => total + (Number.isFinite(stop.serviceMinutes) && stop.serviceMinutes >= 0 ? stop.serviceMinutes : 0), 0);
	const stopsWithoutServiceTime = stops.filter((stop) => !Number.isFinite(stop.serviceMinutes)).length;
	const drivingHours = distance / speed;
	const serviceHours = knownServiceMinutes / 60;
	const estimatedHours = drivingHours + serviceHours;
	const fuelLitres = distance * consumption / 100;
	const fuelCost = fuelLitres * fuelPrice;
	const driverCost = estimatedHours * driverRate;
	const roundMoney = (amount) => Math.round((amount + Number.EPSILON) * 100) / 100;

	return {
		valid: true,
		distanceKm: distance,
		drivingHours: Math.round(drivingHours * 100) / 100,
		knownServiceMinutes,
		stopsWithoutServiceTime,
		estimatedHours: Math.round(estimatedHours * 100) / 100,
		fuelLitres: Math.round(fuelLitres * 100) / 100,
		fuelCost: roundMoney(fuelCost),
		driverCost: roundMoney(driverCost),
		totalCost: roundMoney(fuelCost + driverCost),
	};
}

export function validateManualAssignments(stops, vehicles) {
	const errors = [];
	const warnings = [];
	const unassignedStopIds = [];
	const vehicleById = new Map(vehicles.filter((vehicle) => vehicle.id).map((vehicle) => [vehicle.id, vehicle]));
	const totals = new Map();

	stops.forEach((stop) => {
		if (!stop.assignedVehicleId) {
			unassignedStopIds.push(stop.stopId);
			return;
		}
		const vehicle = vehicleById.get(stop.assignedVehicleId);
		if (!vehicle) {
			errors.push({ stopId: stop.stopId, message: 'Assigned vehicle profile is missing.' });
			return;
		}
		const total = totals.get(vehicle.id) || { weight: 0, pallets: 0 };
		total.weight += Number.isFinite(stop.weight) ? stop.weight : 0;
		total.pallets += Number.isFinite(stop.pallets) ? stop.pallets : 0;
		totals.set(vehicle.id, total);

		const requiredEquipment = String(stop.equipment || '').trim().toLowerCase();
		const vehicleEquipment = String(vehicle.equipment || '').trim().toLowerCase();
		if (requiredEquipment && vehicleEquipment !== requiredEquipment) {
			errors.push({ stopId: stop.stopId, message: `Vehicle ${vehicle.id} does not confirm required equipment: ${stop.equipment}.` });
		}
	});

	totals.forEach((total, vehicleId) => {
		const vehicle = vehicleById.get(vehicleId);
		const maxWeight = vehicle.maxWeight === '' || vehicle.maxWeight === null ? null : Number(vehicle.maxWeight);
		const maxPallets = vehicle.maxPallets === '' || vehicle.maxPallets === null ? null : Number(vehicle.maxPallets);
		if (maxWeight === null || !Number.isFinite(maxWeight)) warnings.push({ vehicleId, message: `Vehicle ${vehicleId} weight capacity is not verified.` });
		else if (total.weight > maxWeight) errors.push({ vehicleId, message: `Assigned weight exceeds ${vehicleId} capacity (${total.weight} > ${maxWeight}).` });
		if (maxPallets === null || !Number.isFinite(maxPallets)) warnings.push({ vehicleId, message: `Vehicle ${vehicleId} pallet capacity is not verified.` });
		else if (total.pallets > maxPallets) errors.push({ vehicleId, message: `Assigned pallets exceed ${vehicleId} capacity (${total.pallets} > ${maxPallets}).` });
	});

	if (unassignedStopIds.length) warnings.push({ message: `${unassignedStopIds.length} stops remain unassigned and will not be included in a vehicle route.` });
	return { errors, warnings, unassignedStopIds, valid: errors.length === 0 };
}

export function buildRouteRequestPreview({ routeName, stops, vehicles, options, depot }) {
	return {
		contractVersion: 1,
		provider: 'PTV_ROUTE_OPTIMIZATION_V2',
		mode: 'PREVIEW_ONLY',
		submitted: false,
		routeName: String(routeName ?? '').trim(),
		stops: stops.map((stop) => ({ ...stop })),
		vehicles: vehicles.map((vehicle) => ({ ...vehicle })),
		depot: { ...depot },
		options: { ...options },
	};
}

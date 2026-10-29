import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MapService from '../../services/MapService';
import CreateRoute from './CreateRoute';
import ManageRoutes from './ManageRoutes';
import RouteDetails from './RouteDetails';
import RouteOverview from './RouteOverview';
jest.mock('./RouteMap', () => ({ __esModule: true, default: () => null }));
jest.mock('../../services/MapService', () => ({
	__esModule: true,
	default: {
		geocode: jest.fn(),
		getRoute: jest.fn(),
		parseRoutePath: jest.fn(),
		optimizeStops: jest.fn(),
	},
}));

beforeEach(() => {
	jest.clearAllMocks();
	MapService.geocode.mockResolvedValue({ lat: 43.01, lng: -81.2 });
	MapService.getRoute.mockResolvedValue({
		status: true,
		distanceKms: 120,
		duration: 7200,
		durationText: '02:00:00',
		tolls: { tollAvailable: false },
		path: [[-81.25, 42.98], [-81.2, 43]],
	});
	MapService.parseRoutePath.mockReturnValue([{ lat: 42.98, lng: -81.25 }, { lat: 43, lng: -81.2 }]);
	MapService.optimizeStops.mockResolvedValue([0]);
});

test('manager finds plans by name and restores results after clearing filters', () => {
	const drafts = [{ id: 'PLAN-1', routeName: 'North deliveries', status: 'DRAFT_NOT_OPTIMIZED', stops: [] }];
	render(<MemoryRouter initialEntries={[{ pathname: '/routes/manage', state: { drafts } }]}><ManageRoutes /></MemoryRouter>);
	fireEvent.change(screen.getByLabelText('Search'), { target: { value: ' North ' } });
	expect(screen.getByText('North deliveries')).toBeInTheDocument();
	fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'South' } });
	expect(screen.getByRole('heading', { name: 'No matching route plans' })).toBeInTheDocument();
	fireEvent.click(screen.getByRole('button', { name: 'Show all routes' }));
	expect(screen.getByText('North deliveries')).toBeInTheDocument();
});

test('create route explains readiness and provides section navigation', () => {
	render(<MemoryRouter><CreateRoute /></MemoryRouter>);
	expect(screen.getByRole('navigation', { name: 'Route planning steps' })).toBeInTheDocument();
	expect(screen.getByRole('region', { name: 'Draft readiness' })).toHaveTextContent('Name your route');
	expect(screen.getByRole('button', { name: /Create local draft/ })).toBeDisabled();
	fireEvent.change(screen.getByLabelText('Route name *'), { target: { value: 'North deliveries' } });
	const checklist = screen.getByRole('region', { name: 'Draft readiness' });
	expect(within(checklist).getByRole('link', { name: /Name your route Complete/ })).toBeInTheDocument();
});

function renderRouteFlow() {
	return render(
		<MemoryRouter initialEntries={['/routes/create']}>
			<Routes>
				<Route path="/routes/create" element={<CreateRoute />} />
				<Route path="/routes/manage" element={<ManageRoutes />} />
				<Route path="/routes/view" element={<RouteOverview />} />
				<Route path="/routes/:routeId" element={<RouteDetails />} />
			</Routes>
		</MemoryRouter>
	);
}

test('creates a session route draft and keeps operational mutations disabled', () => {
	renderRouteFlow();
	fireEvent.change(screen.getByLabelText('Route name *'), { target: { value: 'London day plan' } });
	fireEvent.change(screen.getByLabelText('Driver for this route *'), { target: { value: 'Driver Preview' } });
	fireEvent.change(screen.getByLabelText('Stop ID *'), { target: { value: 'STOP-1' } });
	fireEvent.change(screen.getByLabelText('Customer *'), { target: { value: 'Sample Customer' } });
	fireEvent.change(screen.getByLabelText('Address *'), { target: { value: '10 Main Street' } });
	fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'London' } });
	fireEvent.change(screen.getByLabelText('Province / State *'), { target: { value: 'Ontario' } });
	fireEvent.change(screen.getByLabelText('Postal / ZIP *'), { target: { value: 'N6A 1A1' } });
	fireEvent.click(screen.getByRole('button', { name: 'Add stop' }));
	fireEvent.click(screen.getByRole('button', { name: /Add vehicle/ }));
	fireEvent.change(screen.getByLabelText('Vehicle 1 max weight'), { target: { value: '12000' } });
	fireEvent.change(screen.getByLabelText('Vehicle 1 max pallets'), { target: { value: '24' } });
	fireEvent.click(screen.getByRole('button', { name: /Preview API request/ }));
	expect(screen.getByText(/CONTRACT_PREVIEW_ONLY/)).toBeInTheDocument();
	expect(screen.queryByRole('button', { name: 'Run lifecycle mock' })).not.toBeInTheDocument();
	expect(screen.getByRole('button', { name: 'Save to IFM' })).toBeDisabled();
	expect(screen.getByRole('button', { name: 'Dispatch to Driver App' })).toBeDisabled();
	expect(screen.getByText(/has not been submitted to the backend or PTV/)).toBeInTheDocument();

	fireEvent.click(screen.getByRole('button', { name: /Create local draft/ }));
	expect(screen.getByRole('heading', { name: 'Manage Routes' })).toBeInTheDocument();
	expect(screen.getByText('London day plan')).toBeInTheDocument();
	expect(screen.getByText('LOCATION UNAVAILABLE')).toBeInTheDocument();
	fireEvent.click(screen.getByRole('button', { name: 'Details' }));
	expect(screen.getByRole('heading', { name: /LOCAL-DRAFT-/ })).toBeInTheDocument();
	expect(screen.getByRole('button', { name: 'Assign Driver' })).toBeDisabled();
	expect(screen.getByRole('button', { name: 'Reoptimize remaining' })).toBeDisabled();
	expect(screen.getByText('NOT COMPLETED')).toBeInTheDocument();
});

test('creates a PTV map and estimate, then views and reorders the route preview', async () => {
	renderRouteFlow();
	fireEvent.change(screen.getByLabelText('Route name *'), { target: { value: 'Sequence review' } });
	fireEvent.change(screen.getByLabelText('Driver for this route *'), { target: { value: 'Driver Preview' } });

	const addStop = ({ id, latitude, longitude, serviceMinutes }) => {
		fireEvent.change(screen.getByLabelText('Stop ID *'), { target: { value: id } });
		fireEvent.change(screen.getByLabelText('Customer *'), { target: { value: `Customer ${id}` } });
		fireEvent.change(screen.getByLabelText('Address *'), { target: { value: `${id} Main Street` } });
		fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'London' } });
		fireEvent.change(screen.getByLabelText('Province / State *'), { target: { value: 'Ontario' } });
		fireEvent.change(screen.getByLabelText('Postal / ZIP *'), { target: { value: 'N6A 1A1' } });
		fireEvent.change(screen.getByLabelText('Latitude (optional)'), { target: { value: latitude } });
		fireEvent.change(screen.getByLabelText('Longitude (optional)'), { target: { value: longitude } });
		fireEvent.change(screen.getByLabelText('Service time (minutes)'), { target: { value: serviceMinutes } });
		fireEvent.click(screen.getByRole('button', { name: 'Add stop' }));
	};

	addStop({ id: 'STOP-1', latitude: '42.98', longitude: '-81.25', serviceMinutes: '40' });
	addStop({ id: 'STOP-2', latitude: '43.00', longitude: '-81.20', serviceMinutes: '' });
	fireEvent.change(screen.getByLabelText('PTV routing objective'), { target: { value: 'cost' } });
	fireEvent.click(screen.getByRole('button', { name: 'Create map' }));
	expect(screen.getByRole('heading', { name: 'PTV truck route preview' })).toBeInTheDocument();
	expect(await screen.findByText('PTV returned a truck route for the current stop order.')).toBeInTheDocument();
	expect(MapService.getRoute).toHaveBeenCalledWith(
		{ lat: 42.98, lng: -81.25 },
		{ lat: 43, lng: -81.2 },
		[],
		{ type: 'truck' },
		'economic',
		true
	);
	fireEvent.click(screen.getByRole('button', { name: 'Create estimate' }));
	await waitFor(() => expect(screen.getByLabelText('Route distance (km) *')).toHaveValue(120));
	fireEvent.change(screen.getByLabelText('Route distance (km) *'), { target: { value: '120' } });
	fireEvent.change(screen.getByLabelText('Average speed (km/h) *'), { target: { value: '60' } });
	fireEvent.change(screen.getByLabelText('Fuel consumption (L/100 km) *'), { target: { value: '30' } });
	fireEvent.change(screen.getByLabelText('Fuel price (per L) *'), { target: { value: '1.5' } });
	fireEvent.change(screen.getByLabelText('Driver cost (per hour) *'), { target: { value: '25' } });
	fireEvent.click(screen.getByRole('button', { name: 'Calculate local estimate' }));
	expect(screen.getByText('Total: 120.67 entered units')).toBeInTheDocument();

	fireEvent.click(screen.getByRole('button', { name: 'View route' }));
	expect(await screen.findByRole('heading', { name: 'View Route' })).toBeInTheDocument();
	expect(screen.getByText('PTV truck routing')).toBeInTheDocument();
	fireEvent.click(screen.getByRole('button', { name: 'Move stop 2 up' }));
	const sequence = within(screen.getByRole('list', { name: 'Reorder route stops' })).getAllByRole('listitem');
	expect(within(sequence[0]).getByText(/^STOP-2.*PICKUP$/)).toBeInTheDocument();
	expect(within(sequence[1]).getByText(/^STOP-1.*PICKUP$/)).toBeInTheDocument();
	fireEvent.click(screen.getByRole('button', { name: 'Use this order' }));
	const rows = within(screen.getByRole('region', { name: 'Review stops' })).getAllByRole('row');
	expect(within(rows[1]).getByText('STOP-2')).toBeInTheDocument();
	expect(within(rows[2]).getByText('STOP-1')).toBeInTheDocument();
});

test('Create map geocodes stops without coordinates and reports routing failures', async () => {
	renderRouteFlow();
	const addStop = (id) => {
		fireEvent.change(screen.getByLabelText('Stop ID *'), { target: { value: id } });
		fireEvent.change(screen.getByLabelText('Customer *'), { target: { value: `Customer ${id}` } });
		fireEvent.change(screen.getByLabelText('Address *'), { target: { value: `${id} Main Street` } });
		fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'London' } });
		fireEvent.change(screen.getByLabelText('Province / State *'), { target: { value: 'Ontario' } });
		fireEvent.change(screen.getByLabelText('Postal / ZIP *'), { target: { value: 'N6A 1A1' } });
		fireEvent.click(screen.getByRole('button', { name: 'Add stop' }));
	};

	MapService.getRoute.mockRejectedValueOnce(new Error('PTV service is unavailable'));
	addStop('STOP-A');
	addStop('STOP-B');
	fireEvent.click(screen.getByRole('button', { name: 'Create map' }));

	expect(await screen.findByText(/PTV service is unavailable/)).toBeInTheDocument();
	expect(MapService.geocode).toHaveBeenCalledTimes(2);
	expect(MapService.getRoute).toHaveBeenCalledTimes(1);
});

test('optimizes stop order in preview and keeps first/last stops fixed', async () => {
	renderRouteFlow();
	fireEvent.change(screen.getByLabelText('Route name *'), { target: { value: 'Optimization preview' } });
	fireEvent.change(screen.getByLabelText('Driver for this route *'), { target: { value: 'Driver Preview' } });

	const addStop = (id, latitude, longitude) => {
		fireEvent.change(screen.getByLabelText('Stop ID *'), { target: { value: id } });
		fireEvent.change(screen.getByLabelText('Customer *'), { target: { value: `Customer ${id}` } });
		fireEvent.change(screen.getByLabelText('Address *'), { target: { value: `${id} Main Street` } });
		fireEvent.change(screen.getByLabelText('City *'), { target: { value: 'London' } });
		fireEvent.change(screen.getByLabelText('Province / State *'), { target: { value: 'Ontario' } });
		fireEvent.change(screen.getByLabelText('Postal / ZIP *'), { target: { value: 'N6A 1A1' } });
		fireEvent.change(screen.getByLabelText('Latitude (optional)'), { target: { value: latitude } });
		fireEvent.change(screen.getByLabelText('Longitude (optional)'), { target: { value: longitude } });
		fireEvent.click(screen.getByRole('button', { name: 'Add stop' }));
	};

	addStop('STOP-1', '42.98', '-81.25');
	addStop('STOP-2', '43.00', '-81.20');
	addStop('STOP-3', '43.03', '-81.15');
	addStop('STOP-4', '43.05', '-81.10');
	MapService.optimizeStops.mockResolvedValueOnce([1, 0]);

	fireEvent.click(screen.getByRole('button', { name: 'Optimize stop order' }));
	expect(await screen.findByText(/Stop order was optimized/)).toBeInTheDocument();
	expect(MapService.optimizeStops).toHaveBeenCalledWith(
		{ lat: 42.98, lng: -81.25 },
		{ lat: 43.05, lng: -81.1 },
		[{ lat: 43, lng: -81.2 }, { lat: 43.03, lng: -81.15 }]
	);
	expect(MapService.getRoute).toHaveBeenCalledTimes(2);
	expect(MapService.getRoute).toHaveBeenLastCalledWith(
		{ lat: 42.98, lng: -81.25 },
		{ lat: 43.05, lng: -81.1 },
		[{ lat: 43.03, lng: -81.15 }, { lat: 43, lng: -81.2 }],
		{ type: 'truck' }, 'fast', true
	);
	expect(screen.getByText(/the PTV road route was refreshed/)).toBeInTheDocument();

	const rows = within(screen.getByRole('region', { name: 'Review stops' })).getAllByRole('row');
	expect(within(rows[1]).getByText('STOP-1')).toBeInTheDocument();
	expect(within(rows[2]).getByText('STOP-3')).toBeInTheDocument();
	expect(within(rows[3]).getByText('STOP-2')).toBeInTheDocument();
	expect(within(rows[4]).getByText('STOP-4')).toBeInTheDocument();
});

function renderOptimizationFixture(count = 4) {
	const stops = Array.from({ length: count }, (_, index) => ({
		stopId: `STOP-${index + 1}`, sourceRow: index + 1,
		customer: `Customer ${index}`, address: `${index + 1} Main Street`,
		city: 'London', region: 'Ontario', postalCode: 'N6A 1A1',
		stopType: 'SERVICE', appointmentStart: '', appointmentEnd: '',
		serviceMinutes: 10, weight: null, pallets: null,
		latitude: 43 + index / 100, longitude: -81,
	}));
	render(<MemoryRouter initialEntries={[{
		pathname: '/routes/create', state: { routeFormData: { stops } },
	}]}><CreateRoute /></MemoryRouter>);
}

test.each([
	['duplicate', [0, 0]],
	['negative', [-1, 0]],
	['out of range', [0, 2]],
	['fractional', [0, 0.5]],
	['string', ['0', '1']],
	['incomplete', [0]],
])('rejects %s optimizer indices without changing or losing stops', async (_, order) => {
	renderOptimizationFixture();
	MapService.optimizeStops.mockResolvedValueOnce(order);
	fireEvent.click(screen.getByRole('button', { name: 'Optimize stop order' }));
	expect(await screen.findByText('Backend optimizer returned an invalid stop order.')).toBeInTheDocument();
	const rows = within(screen.getByRole('region', { name: 'Review stops' })).getAllByRole('row');
	expect(rows).toHaveLength(5);
	[1, 2, 3, 4].forEach((id) => expect(within(rows[id]).getByText(`STOP-${id}`)).toBeInTheDocument());
	expect(MapService.getRoute).toHaveBeenCalledTimes(1);
});

test('retains reordered stops and clears old estimate metrics when PTV refresh fails', async () => {
	renderOptimizationFixture();
	MapService.optimizeStops.mockResolvedValueOnce([1, 0]);
	MapService.getRoute.mockResolvedValueOnce({
		status: true, distanceKms: 120, duration: 7200, durationText: '02:00:00',
	}).mockRejectedValueOnce(new Error('PTV is unavailable'));
	fireEvent.click(screen.getByRole('button', { name: 'Create estimate' }));
	await waitFor(() => expect(screen.getByLabelText('Route distance (km) *')).toHaveValue(120));
	fireEvent.click(screen.getByRole('button', { name: 'Optimize stop order' }));
	expect(await screen.findByText(/but PTV route refresh failed/)).toBeInTheDocument();
	expect(screen.getByText('PTV is unavailable', { exact: true })).toBeInTheDocument();
	expect(screen.getByLabelText('Route distance (km) *')).toHaveValue(null);
	expect(screen.getByLabelText('Average speed (km/h) *')).toHaveValue(null);
	const rows = within(screen.getByRole('region', { name: 'Review stops' })).getAllByRole('row');
	expect(within(rows[2]).getByText('STOP-3')).toBeInTheDocument();
	expect(within(rows[3]).getByText('STOP-2')).toBeInTheDocument();
	fireEvent.click(screen.getByRole('button', { name: 'Retry PTV route' }));
	expect(await screen.findByText('PTV returned a truck route for the current stop order.')).toBeInTheDocument();
	expect(MapService.getRoute).toHaveBeenCalledTimes(3);
});

test.each([3, 21])('disables optimizer for unsupported %i-stop plans', (count) => {
	renderOptimizationFixture(count);
	expect(screen.getByRole('button', { name: 'Optimize stop order' })).toBeDisabled();
	expect(MapService.optimizeStops).not.toHaveBeenCalled();
});

test('a delayed PTV response cannot restore a stop removed during calculation', async () => {
	renderOptimizationFixture();
	let finishRoute;
	MapService.getRoute.mockImplementationOnce(() => new Promise((resolve) => { finishRoute = resolve; }));
	fireEvent.click(screen.getByRole('button', { name: 'Create map' }));
	await waitFor(() => expect(MapService.getRoute).toHaveBeenCalledTimes(1));
	fireEvent.click(screen.getByRole('button', { name: 'Remove stop STOP-2' }));
	await act(async () => {
		finishRoute({ status: true, distanceKms: 120, duration: 7200 });
	});
	expect(await screen.findByText(/Route inputs changed while the request was running/)).toBeInTheDocument();
	expect(screen.queryByRole('button', { name: 'Remove stop STOP-2' })).not.toBeInTheDocument();
	expect(within(screen.getByRole('region', { name: 'Review stops' })).getAllByRole('row')).toHaveLength(4);
});

test('a delayed optimizer response cannot overwrite edits or refresh the old sequence', async () => {
	renderOptimizationFixture();
	let finishOptimization;
	MapService.optimizeStops.mockImplementationOnce(() => new Promise((resolve) => { finishOptimization = resolve; }));
	fireEvent.click(screen.getByRole('button', { name: 'Optimize stop order' }));
	await waitFor(() => expect(MapService.optimizeStops).toHaveBeenCalledTimes(1));
	fireEvent.click(screen.getByRole('button', { name: 'Remove stop STOP-2' }));
	await act(async () => { finishOptimization([1, 0]); });
	expect(await screen.findByText(/Route inputs changed during optimization/)).toBeInTheDocument();
	expect(screen.queryByRole('button', { name: 'Remove stop STOP-2' })).not.toBeInTheDocument();
	expect(MapService.getRoute).toHaveBeenCalledTimes(1);
});

test.each([
	{ status: true, duration: 7200 },
	{ status: true, distanceKms: null, duration: 7200 },
	{ status: true, distanceKms: 120, duration: -1 },
	{ status: false, distanceKms: 120, duration: 7200 },
])('rejects incomplete route metrics: %j', async (response) => {
	renderOptimizationFixture();
	MapService.getRoute.mockResolvedValueOnce(response);
	fireEvent.click(screen.getByRole('button', { name: 'Create map' }));
	expect(await screen.findByText(/PTV returned incomplete route distance or duration/)).toBeInTheDocument();
	expect(screen.queryByText('PTV returned a truck route for the current stop order.')).not.toBeInTheDocument();
});

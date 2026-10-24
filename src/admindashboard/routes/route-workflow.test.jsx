import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CreateRoute from './CreateRoute';
import ManageRoutes from './ManageRoutes';
import RouteDetails from './RouteDetails';
import RouteOverview from './RouteOverview';
jest.mock('./RouteMap', () => ({ __esModule: true, default: () => null }));

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

test('creates a coordinate map and estimate, then applies a reordered route to the create form', () => {
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
	fireEvent.click(screen.getByRole('button', { name: 'Create map' }));
	expect(screen.getByRole('heading', { name: 'Coordinate map preview' })).toBeInTheDocument();
	fireEvent.click(screen.getByRole('button', { name: 'Create estimate' }));
	fireEvent.change(screen.getByLabelText('Route distance (km) *'), { target: { value: '120' } });
	fireEvent.change(screen.getByLabelText('Average speed (km/h) *'), { target: { value: '60' } });
	fireEvent.change(screen.getByLabelText('Fuel consumption (L/100 km) *'), { target: { value: '30' } });
	fireEvent.change(screen.getByLabelText('Fuel price (per L) *'), { target: { value: '1.5' } });
	fireEvent.change(screen.getByLabelText('Driver cost (per hour) *'), { target: { value: '25' } });
	fireEvent.click(screen.getByRole('button', { name: 'Calculate local estimate' }));
	expect(screen.getByText('Total: 120.67 entered units')).toBeInTheDocument();

	fireEvent.click(screen.getByRole('button', { name: 'View route' }));
	fireEvent.click(screen.getByRole('button', { name: 'Move stop 2 up' }));
	const sequence = within(screen.getByRole('list', { name: 'Reorder route stops' })).getAllByRole('listitem');
	expect(within(sequence[0]).getByText(/^STOP-2.*PICKUP$/)).toBeInTheDocument();
	expect(within(sequence[1]).getByText(/^STOP-1.*PICKUP$/)).toBeInTheDocument();
	fireEvent.click(screen.getByRole('button', { name: 'Use this order' }));
	const rows = within(screen.getByRole('region', { name: 'Review stops' })).getAllByRole('row');
	expect(within(rows[1]).getByText('STOP-2')).toBeInTheDocument();
	expect(within(rows[2]).getByText('STOP-1')).toBeInTheDocument();
});

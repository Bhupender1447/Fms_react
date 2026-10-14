import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
jest.mock('./RouteMap', () => ({ __esModule: true, default: () => null }));
import CreateRoute from './CreateRoute';
import ManageRoutes from './ManageRoutes';
import RouteDetails from './RouteDetails';
import RouteOverview from './RouteOverview';

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
	fireEvent.click(screen.getByRole('button', { name: 'Run lifecycle mock' }));
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
	const { container } = renderRouteFlow();
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
	expect(Array.from(container.querySelectorAll('.route-sequence-item strong')).map((item) => item.textContent)).toEqual(['STOP-2 · PICKUP', 'STOP-1 · PICKUP']);
	fireEvent.click(screen.getByRole('button', { name: 'Use this order' }));
	expect(Array.from(container.querySelectorAll('.route-table tbody tr strong')).map((item) => item.textContent)).toEqual(['STOP-2', 'STOP-1']);
});

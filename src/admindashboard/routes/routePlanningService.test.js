import { createLocalRouteDraft, createMockPtvOptimizationClient } from './routePlanningService';

const request = { mode: 'CONTRACT_PREVIEW_ONLY', stopCount: 10, vehicleCount: 2 };

test('mock lifecycle reports states without provider calls or route results', async () => {
	const client = createMockPtvOptimizationClient({ pollsToComplete: 2 });
	const accepted = await client.createOptimization(request);
	expect(accepted).toMatchObject({ httpStatus: 202, mode: 'MOCK_ONLY', submittedToProvider: false, status: 'MOCK_ACCEPTED' });
	expect(await client.getOptimization(accepted.id)).toMatchObject({ status: 'MOCK_RUNNING', progress: 45, routes: [] });
	expect(await client.getOptimization(accepted.id)).toMatchObject({ status: 'MOCK_COMPLETED', progress: 100, routes: [], resultAvailable: false });
});

test('mock reports provider failure and timeout distinctly', async () => {
	const failedClient = createMockPtvOptimizationClient({ mode: 'failure' });
	const failedJob = await failedClient.createOptimization(request);
	expect(await failedClient.getOptimization(failedJob.id)).toMatchObject({ status: 'MOCK_FAILED', error: 'MOCK_PROVIDER_FAILURE' });

	const timeoutClient = createMockPtvOptimizationClient({ mode: 'timeout' });
	const timeoutJob = await timeoutClient.createOptimization(request);
	expect(await timeoutClient.getOptimization(timeoutJob.id)).toMatchObject({ status: 'MOCK_STILL_RUNNING', timedOut: true });
});

test('mock stop and size guard are deterministic', async () => {
	const client = createMockPtvOptimizationClient();
	const job = await client.createOptimization(request);
	expect(await client.stopOptimization(job.id)).toMatchObject({ status: 'MOCK_STOPPED', submittedToProvider: false });
	await expect(client.createOptimization({ ...request, stopCount: 301 })).rejects.toThrow('300 stops');
	await expect(client.createOptimization({ ...request, mode: 'LIVE' })).rejects.toThrow('contract preview');
});

test('one workbook becomes one local route with every stop and one driver', () => {
	const stops = [
		{ previewKey: 'p1', address: '10 Carrier Road' },
		{ previewKey: 'p2', address: '20 Carrier Road' },
		{ previewKey: 'p3', address: '30 Carrier Road' },
	];
	const draft = createLocalRouteDraft({
		routeName: 'Workbook route',
		driverName: 'Driver Preview',
		stops,
		vehicles: [{ id: 'LOCAL-1' }],
		options: {},
		depot: {},
	});

	expect(draft.routes).toHaveLength(1);
	expect(draft.routes[0].stops.map((stop) => stop.address)).toEqual(['10 Carrier Road', '20 Carrier Road', '30 Carrier Road']);
	expect(draft.routes[0].driver).toEqual({ name: 'Driver Preview' });
	expect(draft.unassignedStops).toEqual([]);
});

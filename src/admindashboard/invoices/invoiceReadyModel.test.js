import { invoiceReadyEntries } from './invoiceReadyModel';

const source = (type, id, state = 'completed') => ({ type, id, state });
const shipment = (sources, overrides = {}) => ({ accountId: 'A', shipmentId: 'shipment-1', billingState: 'unbilled', sources, ...overrides });

test.each(['order', 'trip', 'route'])('completed %s becomes invoice-ready without changing the source', type => {
  const input = [shipment([source(type, 'source-1')])];
  const before = JSON.stringify(input);
  expect(invoiceReadyEntries(input, 'A')).toHaveLength(1);
  expect(JSON.stringify(input)).toBe(before);
});

test('linked order, trip and route produce one stable shipment entry as each completes', () => {
  const sources = [source('order', 'O', 'in_progress'), source('trip', 'T', 'in_progress'), source('route', 'R', 'in_progress')];
  expect(invoiceReadyEntries([shipment(sources)], 'A')).toEqual([]);
  for (let index = 0; index < sources.length; index++) {
    sources[index] = { ...sources[index], state: 'completed' };
    const entries = invoiceReadyEntries([shipment(sources)], 'A');
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({ shipmentId: 'shipment-1', orderIds: ['O'], tripIds: ['T'], routeIds: ['R'] });
    expect(invoiceReadyEntries([shipment(sources)], 'A')).toEqual(entries);
  }
});

test.each(['draft', 'issued', 'review_required'])('existing %s billing state prevents another candidate', billingState => {
  expect(invoiceReadyEntries([shipment([source('order', 'O')], { billingState })], 'A')).toEqual([]);
});

test.each(['draft', 'in_progress', 'unknown', 'cancelled'])('a %s source alone is not completion', state => {
  expect(invoiceReadyEntries([shipment([source('route', 'R', state)])], 'A')).toEqual([]);
});

test('cancellation blocks conflicting completion and same ID across source types is not a relationship', () => {
  expect(invoiceReadyEntries([shipment([source('order', 'O'), source('trip', 'T', 'cancelled')])], 'A')).toEqual([]);
  const input = [shipment([source('order', '1')]), shipment([source('trip', '1')], { shipmentId: 'standalone' })];
  expect(invoiceReadyEntries(input, 'A')).toHaveLength(2);
});

test('cross-account, duplicate shipment and conflicting source ownership fail the entire projection', () => {
  const item = shipment([source('order', 'O')]);
  expect(() => invoiceReadyEntries([item], 'B')).toThrow(/account/);
  expect(() => invoiceReadyEntries([item], null)).toThrow(/authorized account/);
  expect(() => invoiceReadyEntries([item, item], 'A')).toThrow(/identity/);
  expect(() => invoiceReadyEntries([item, { ...item, shipmentId: 'other' }], 'A')).toThrow(/conflicting/);
  expect(() => invoiceReadyEntries([shipment([source('order', 'O'), source('order', 'O')])], 'A')).toThrow(/repeated/);
  expect(() => invoiceReadyEntries([item, { ...item, shipmentId: 'other', billingState: 'issued' }], 'A')).toThrow(/conflicting/);
});

test('legacy operational arrays, unknown statuses and incomplete identity fail explicitly', () => {
  for (const item of [
    { id: 1, status: 'COMPLETED' },
    shipment([]),
    shipment([source('route', 'R', 'COMPLETED')]),
    shipment([source('route', '')]),
    shipment([source('route', 'R')], { billingState: 'unknown' }),
  ]) expect(() => invoiceReadyEntries([item], 'A')).toThrow();
});

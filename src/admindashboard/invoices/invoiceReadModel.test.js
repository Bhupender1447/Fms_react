import { formatMoney, invoiceBalance, invoiceStatus, matchesView, summarizeInvoices, validateInvoices } from './invoiceReadModel';

const sampleInvoice = {
  id: 'fixture-1', number: 'SYN-001', documentKind: 'invoice', type: 'broker_order',
  customer: 'Synthetic customer', sourceReference: 'ORDER-SYN', invoiceDate: '2026-10-01',
  dueDate: '2026-10-20', documentStatus: 'issued', disputed: false,
  currency: 'CAD', totalMinor: '10001', paidMinor: '2500', creditsMinor: '1',
};
const date = '2026-10-25';
test('balances are exact minor-unit integers, not floating point', () => {
  expect(invoiceBalance(sampleInvoice)).toBe(7500n);
  expect(formatMoney('900719925474099312', 'CAD')).toBe('CAD 9,007,199,254,740,993.12');
  expect(() => validateInvoices([{ ...sampleInvoice, totalMinor: 100.01 }])).toThrow(/minor-unit/);
  expect(() => validateInvoices([{ ...sampleInvoice, paidMinor: '10002' }])).toThrow(/exceed/);
});
test('document state, payment position and derived overdue are not operational status', () => {
  expect(invoiceStatus(sampleInvoice, date)).toBe('overdue');
  expect(invoiceStatus(sampleInvoice, '2026-10-20')).toBe('partial');
  expect(invoiceStatus({ ...sampleInvoice, paidMinor: '10000' }, date)).toBe('paid');
  expect(invoiceStatus({ ...sampleInvoice, disputed: true }, date)).toBe('disputed');
  expect(matchesView({ ...sampleInvoice, disputed: true }, 'overdue', date)).toBe(true);
  expect(invoiceStatus({ ...sampleInvoice, dueDate: null }, date)).toBe('partial');
  expect(invoiceStatus({ ...sampleInvoice, documentStatus: 'approved' }, date)).toBe('approved');
  expect(matchesView(sampleInvoice, 'partial', date)).toBe(true);
  expect(matchesView(sampleInvoice, 'issued', date)).toBe(true);
  expect(matchesView({ ...sampleInvoice, disputed: true }, 'disputed', date)).toBe(true);
  expect(matchesView({ ...sampleInvoice, documentStatus: 'voided' }, 'voided', date)).toBe(true);
});
test('mixed currencies stay separate and credits, drafts and voids do not become receivables', () => {
  const records = [
    sampleInvoice,
    { ...sampleInvoice, id: 'usd', currency: 'USD', totalMinor: '20000', paidMinor: '0', creditsMinor: '0' },
    { ...sampleInvoice, id: 'draft', documentStatus: 'draft', paidMinor: '0', creditsMinor: '0' },
    { ...sampleInvoice, id: 'void', documentStatus: 'voided', paidMinor: '0', creditsMinor: '0' },
    { ...sampleInvoice, id: 'credit', documentKind: 'credit_note', paidMinor: '0', creditsMinor: '0' },
  ];
  validateInvoices(records);
  expect(summarizeInvoices(records, date)).toEqual({ currencies: { CAD: { outstanding: 7500n, overdue: 7500n }, USD: { outstanding: 20000n, overdue: 20000n } }, pending: 2, drafts: 1 });
  expect(matchesView(records[4], 'all', date)).toBe(false);
  expect(matchesView(records[4], 'credit_notes', date)).toBe(true);
});
test('unverified rows, duplicate IDs and invalid dates fail rather than fabricating defaults', () => {
  expect(() => validateInvoices([{ id: 1, gross_amount: '100' }])).toThrow(/projection/);
  expect(() => validateInvoices([sampleInvoice, sampleInvoice])).toThrow(/projection/);
  expect(() => validateInvoices([{ ...sampleInvoice, dueDate: '2026-02-31' }])).toThrow(/projection/);
  expect(() => validateInvoices([{ ...sampleInvoice, documentStatus: 'draft' }])).toThrow(/Unissued/);
  expect(() => invoiceStatus(sampleInvoice, 'invalid')).toThrow(/assessment date/);
});
test('source IDs use explicit lists without treating display references as database joins', () => {
  const sourceIds = { orderIds: ['O-1'], tripIds: ['T-1'], routeIds: ['R-1'] };
  expect(validateInvoices([{ ...sampleInvoice, sourceIds }])[0].sourceIds).toEqual(sourceIds);
  for (const invalid of [null, [], {}, { ...sourceIds, routeIds: ['R-1', 'R-1'] },
    { ...sourceIds, orderIds: [1] }, { ...sourceIds, routeIds: [' '] }, { ...sourceIds, accountId: 'other' }]) {
    expect(() => validateInvoices([{ ...sampleInvoice, sourceIds: invalid }])).toThrow(/source links/);
  }
});

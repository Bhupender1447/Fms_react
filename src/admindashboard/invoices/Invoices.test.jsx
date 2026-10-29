import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Invoices, { InvoiceDashboard } from './Invoices';

jest.mock('axios');
const invoice = {
  id: 'synthetic-ar', number: 'SYN-AR-001', documentKind: 'invoice', type: 'broker_order',
  customer: 'Example customer A', sourceReference: 'ORDER-SYN-A', invoiceDate: '2026-10-01', dueDate: '2026-10-20',
  documentStatus: 'issued', disputed: false, currency: 'CAD', totalMinor: '10000', paidMinor: '2500', creditsMinor: '0',
};
const records = [
  invoice,
  { ...invoice, id: 'usd', number: 'SYN-AR-002', currency: 'USD', type: 'carrier_trip', customer: 'Example customer B', sourceReference: 'STANDALONE-TRIP', dueDate: '2026-11-01', totalMinor: '20000', paidMinor: '0' },
  { ...invoice, id: 'draft', number: 'SYN-DRAFT', documentStatus: 'draft', invoiceDate: null, dueDate: null, paidMinor: '0' },
  { ...invoice, id: 'paid', number: 'SYN-PAID', paidMinor: '10000' },
  { ...invoice, id: 'credit', number: 'SYN-CREDIT', documentKind: 'credit_note', paidMinor: '0' },
];
function renderDashboard(props = {}, route = '/invoices') {
  return render(<MemoryRouter initialEntries={[route]}><InvoiceDashboard records={records} asOf="2026-10-25" {...props} /></MemoryRouter>);
}
beforeEach(() => jest.clearAllMocks());

test('live dashboard requests the opt-in gate and never interprets operational rows as invoices', async () => {
  axios.get.mockResolvedValue({ data: [{ id: 1, customer_orderno: 'DO-NOT-ISSUE', gross_amount: '1000', status: 'PAID' }] });
  render(<MemoryRouter><Invoices /></MemoryRouter>);
  expect(await screen.findByRole('alert')).toHaveTextContent('withheld');
  expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('api/tipsfetchProductData'), expect.objectContaining({ withCredentials: true, params: { invoice_dashboard: '1' } }));
  expect(screen.queryByText('DO-NOT-ISSUE')).not.toBeInTheDocument();
  expect(screen.getByLabelText('Total Outstanding')).toHaveTextContent('Unavailable');
  expect(screen.getByRole('button', { name: 'Prepare draft' })).toBeDisabled();
  expect(screen.getByText('Completion queue not connected')).toBeInTheDocument();
  expect(axios.post).not.toHaveBeenCalled();
});
test('denial is explicit and retry never calls a legacy fallback endpoint', async () => {
  axios.get.mockRejectedValueOnce(new Error('Authentication required')).mockRejectedValueOnce(new Error('Ledger unavailable'));
  render(<MemoryRouter><Invoices /></MemoryRouter>);
  expect(await screen.findByRole('alert')).toHaveTextContent('Authentication required');
  fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Ledger unavailable');
  expect(axios.get).toHaveBeenCalledTimes(2);
  expect(axios.get.mock.calls.every(([url]) => url.endsWith('api/tipsfetchProductData'))).toBe(true);
});
test('summary keeps CAD and USD separate and never invents cash or average payment time', () => {
  renderDashboard();
  const total = screen.getByLabelText('Total Outstanding');
  expect(total).toHaveTextContent('CAD 75.00');
  expect(total).toHaveTextContent('USD 200.00');
  expect(screen.getByLabelText('Paid This Month')).toHaveTextContent('Unavailable');
  expect(screen.getByLabelText('Average Days to Payment')).toHaveTextContent('Not measurable');
  expect(screen.getByLabelText('Draft Invoices')).toHaveTextContent('1');
  expect(screen.queryByRole('rowheader', { name: /SYN-CREDIT/ })).not.toBeInTheDocument();
});
test('one list handles paid, pending, overdue, drafts and credit query views', () => {
  renderDashboard({}, '/invoices?status=paid');
  expect(screen.getByRole('rowheader', { name: 'SYN-PAID' })).toBeInTheDocument();
  expect(screen.queryByRole('rowheader', { name: 'SYN-AR-001' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Pending Invoices' }));
  expect(screen.getByRole('rowheader', { name: 'SYN-AR-001' })).toBeInTheDocument();
  expect(screen.getByRole('rowheader', { name: 'SYN-AR-002' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Overdue Invoices' }));
  expect(screen.queryByRole('rowheader', { name: 'SYN-AR-002' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Draft Invoices' }));
  expect(screen.getByRole('rowheader', { name: 'SYN-DRAFT' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Credit Notes' }));
  expect(screen.getByRole('rowheader', { name: /SYN-CREDIT/ })).toBeInTheDocument();
  expect(screen.getByText('Not a receivable')).toBeInTheDocument();
});
test('search, customer, type, currency and date filters narrow the same ledger', () => {
  renderDashboard();
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search invoices' }), { target: { value: 'STANDALONE-TRIP' } });
  expect(screen.getByRole('rowheader', { name: 'SYN-AR-002' })).toBeInTheDocument();
  expect(screen.queryByRole('rowheader', { name: 'SYN-AR-001' })).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Invoice type'), { target: { value: 'carrier_trip' } });
  fireEvent.change(screen.getByLabelText('Currency'), { target: { value: 'CAD' } });
  expect(screen.getByText('No matching invoices')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Currency'), { target: { value: 'USD' } });
  fireEvent.change(screen.getByLabelText('Customer filter'), { target: { value: 'customer B' } });
  fireEvent.change(screen.getByLabelText('From invoice date'), { target: { value: '2026-10-02' } });
  expect(screen.getByText('No matching invoices')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('From invoice date'), { target: { value: '2026-10-01' } });
  expect(screen.getByRole('rowheader', { name: 'SYN-AR-002' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('To invoice date'), { target: { value: '2026-09-30' } });
  expect(screen.getByRole('alert')).toHaveTextContent('From date must not follow');
});
test('invalid projections and unknown status links fail closed', () => {
  renderDashboard({ records: [{ id: 1, status: 'PAID' }] }, '/invoices?status=arbitrary');
  expect(screen.getAllByRole('alert').map(element => element.textContent).join(' ')).toMatch(/projection.*Unknown invoice view/);
  expect(screen.getByLabelText('Total Outstanding')).toHaveTextContent('Unavailable');
});
test('pagination is bounded and financial actions have no unprotected PDF links', () => {
  renderDashboard({ records: Array.from({ length: 25 }, (_, index) => ({ ...invoice, id: `synthetic-${index}`, number: `SYN-${index}` })) });
  expect(screen.getAllByRole('rowheader')).toHaveLength(12);
  fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search invoices' }), { target: { value: 'SYN-24' } });
  expect(screen.getAllByRole('rowheader')).toHaveLength(1);
  expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  expect(within(screen.getByRole('table', { name: /Invoice documents/ })).getByRole('button', { name: 'View / Edit / PDF / Payment' })).toBeDisabled();
  expect(screen.queryByRole('link', { name: /PDF|Payment/ })).not.toBeInTheDocument();
});

test('invoice source IDs are displayed and searchable without inferring relationships', () => {
  renderDashboard({ records: [{ ...invoice, sourceIds: { orderIds: ['ORDER-A'], tripIds: ['TRIP-A'], routeIds: ['ROUTE-A'] } }] });
  expect(screen.getByText('OrderID: ORDER-A / TripID: TRIP-A / RouteID: ROUTE-A')).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox', { name: 'Search invoices' }), { target: { value: 'ROUTE-A' } });
  expect(screen.getByRole('rowheader', { name: invoice.number })).toBeInTheDocument();
});
test('completion candidates are separate from issued balances and withheld during errors', () => {
  const props = { records: [], accountId: 'A', shipments: [{
    accountId: 'A', shipmentId: 'READY-SHIP', billingState: 'unbilled',
    sources: [{ type: 'route', id: 'R-READY', state: 'completed' }],
  }] };
  const view = renderDashboard(props);
  expect(screen.getByRole('rowheader', { name: 'READY-SHIP' })).toBeInTheDocument();
  expect(screen.getByLabelText('Total Outstanding')).toHaveTextContent('No issued balances');
  expect(screen.getByLabelText('Draft Invoices')).toHaveTextContent('0');
  view.unmount();
  renderDashboard({ ...props, error: 'Account context changed' });
  expect(screen.queryByRole('rowheader', { name: 'READY-SHIP' })).not.toBeInTheDocument();
});

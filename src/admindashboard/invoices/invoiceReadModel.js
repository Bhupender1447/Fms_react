/* eslint-env es2020 */
// Proposed read-only projection, not an adapter for legacy operational rows.
// All financial inputs are currency-tagged integer minor-unit strings.
export const invoiceViews = [
  ['all', 'All Invoices'], ['draft', 'Draft Invoices'], ['pending', 'Pending Invoices'],
  ['overdue', 'Overdue Invoices'], ['paid', 'Paid Invoices'], ['credit_notes', 'Credit Notes'],
];
export const invoiceFilters = [
  ...invoiceViews, ['approved', 'Approved Invoices'], ['issued', 'Issued Invoices'],
  ['partial', 'Partially Paid Invoices'], ['disputed', 'Disputed Invoices'], ['voided', 'Voided Invoices'],
];
export const moneyMinor = value => {
  if (typeof value !== 'string' || !/^(0|[1-9][0-9]*)$/.test(value)) throw new Error('Invoice money must be a nonnegative integer minor-unit string.');
  return BigInt(value);
};
export function isDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '1900-01-01') return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function todayDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}
export function validateInvoices(records) {
  if (!Array.isArray(records)) throw new Error('No authorized invoice ledger projection is available.');
  const ids = new Set();
  records.forEach(record => {
    if (!record || typeof record.id !== 'string' || !record.id || ids.has(record.id)
      || typeof record.number !== 'string' || !record.number || typeof record.customer !== 'string'
      || !['CAD', 'USD'].includes(record.currency)
      || !['invoice', 'credit_note'].includes(record.documentKind)
      || !['broker_order', 'carrier_trip'].includes(record.type)
      || !['draft', 'approved', 'issued', 'voided'].includes(record.documentStatus)
      || typeof record.disputed !== 'boolean'
      || (record.invoiceDate !== null && !isDate(record.invoiceDate))
      || (record.dueDate !== null && !isDate(record.dueDate))
      || (record.documentStatus === 'issued' && !isDate(record.invoiceDate))) throw new Error('Invoice projection is incomplete or invalid. Operational rows cannot be used as invoices.');
    ids.add(record.id);
    if (record.sourceIds !== undefined && (!record.sourceIds || Array.isArray(record.sourceIds)
      || typeof record.sourceIds !== 'object'
      || Object.keys(record.sourceIds).some(key => !['orderIds', 'tripIds', 'routeIds'].includes(key))
      || ['orderIds', 'tripIds', 'routeIds'].some(key => !Array.isArray(record.sourceIds[key])
        || new Set(record.sourceIds[key]).size !== record.sourceIds[key].length
        || record.sourceIds[key].some(id => typeof id !== 'string' || !id.trim() || id !== id.trim())))) {
      throw new Error('Invoice source links must contain explicit OrderID, TripID and RouteID lists.');
    }
    const total = moneyMinor(record.totalMinor);
    const applied = moneyMinor(record.paidMinor) + moneyMinor(record.creditsMinor);
    if (applied > total) throw new Error('Invoice applications exceed the total. A reviewed overpayment/credit policy is required.');
    if (record.documentStatus !== 'issued' && applied !== 0n) throw new Error('Unissued or voided documents cannot have active applications in this projection.');
  });
  return records;
}
export function invoiceSourceReference(record) {
  if (!record.sourceIds) return record.sourceReference || 'Unavailable';
  return [['orderIds', 'OrderID'], ['tripIds', 'TripID'], ['routeIds', 'RouteID']]
    .map(([key, label]) => `${label}: ${record.sourceIds[key].join(', ') || 'Not linked'}`).join(' / ');
}
export const invoiceBalance = record => moneyMinor(record.totalMinor) - moneyMinor(record.paidMinor) - moneyMinor(record.creditsMinor);
export function invoiceStatus(record, asOf) {
  if (!isDate(asOf)) throw new Error('A valid assessment date is required.');
  if (record.documentStatus !== 'issued') return record.documentStatus;
  if (record.documentKind === 'credit_note') return 'issued';
  if (record.disputed) return 'disputed';
  if (invoiceBalance(record) === 0n) return 'paid';
  if (record.dueDate && record.dueDate < asOf) return 'overdue';
  return moneyMinor(record.paidMinor) + moneyMinor(record.creditsMinor) > 0n ? 'partial' : 'pending';
}
export function matchesView(record, view, asOf) {
  if (view === 'credit_notes') return record.documentKind === 'credit_note';
  if (record.documentKind !== 'invoice') return false;
  if (view === 'all') return true;
  if (view === 'draft') return record.documentStatus === 'draft';
  if (view === 'pending') return record.documentStatus === 'issued' && invoiceBalance(record) > 0n;
  if (view === 'overdue') return record.documentStatus === 'issued' && invoiceBalance(record) > 0n && !!record.dueDate && record.dueDate < asOf;
  if (view === 'issued') return record.documentStatus === 'issued';
  if (view === 'partial') return record.documentStatus === 'issued' && invoiceBalance(record) > 0n && moneyMinor(record.paidMinor) + moneyMinor(record.creditsMinor) > 0n;
  if (view === 'disputed') return record.disputed;
  if (view === 'approved' || view === 'voided') return record.documentStatus === view;
  return view === 'paid' && invoiceStatus(record, asOf) === 'paid';
}
export function formatMoney(value, currency) {
  const digits = moneyMinor(value).toString().padStart(3, '0');
  return `${currency} ${digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${digits.slice(-2)}`;
}
export function summarizeInvoices(records, asOf) {
  const currencies = {};
  let pending = 0, drafts = 0;
  records.forEach(record => {
    if (record.documentKind !== 'invoice' || record.documentStatus === 'voided') return;
    if (record.documentStatus === 'draft') drafts++;
    if (record.documentStatus !== 'issued') return;
    const balance = invoiceBalance(record);
    const summary = currencies[record.currency] || { outstanding: 0n, overdue: 0n };
    summary.outstanding += balance;
    if (balance > 0n) {
      pending++;
      if (record.dueDate && record.dueDate < asOf) summary.overdue += balance;
    }
    currencies[record.currency] = summary;
  });
  return { currencies, pending, drafts };
}

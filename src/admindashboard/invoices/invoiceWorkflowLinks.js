export function invoiceOrderUrl(id) {
  const value = String(id ?? '');
  return /^[1-9][0-9]*$/.test(value) ? `/invoices?order_id=${encodeURIComponent(value)}` : '/invoices';
}
export function invoiceTripUrl(key) {
  const value = String(key ?? '').trim();
  return value && !['na', 'n/a', 'null'].includes(value.toLowerCase()) ? `/invoices?trip_key=${encodeURIComponent(value)}` : '/invoices';
}

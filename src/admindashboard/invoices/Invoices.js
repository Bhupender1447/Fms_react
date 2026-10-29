import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiFileText, FiLock, FiRefreshCw } from 'react-icons/fi';
import { Alert, Badge, Button, EmptyState, Input, Select } from '../../design-system/components';
import { BASE_URL } from '../../config';
import { formatMoney, invoiceBalance, invoiceFilters, invoiceSourceReference, invoiceStatus, invoiceViews, isDate, matchesView, summarizeInvoices, todayDate, validateInvoices } from './invoiceReadModel';
import InvoiceReadyQueue from './InvoiceReadyQueue';
import './invoices.css';

const statusNames = { draft: 'Draft', approved: 'Approved', issued: 'Issued', pending: 'Pending', partial: 'Partially Paid', overdue: 'Overdue', paid: 'Paid', disputed: 'Disputed', voided: 'Voided' };
const statusTones = { paid: 'success', overdue: 'danger', disputed: 'warning', partial: 'warning' };
const pageSize = 12;

function CurrencyAmounts({ currencies, field }) {
  const entries = Object.entries(currencies);
  return entries.length ? entries.map(([currency, totals]) => <span key={currency}>{formatMoney(totals[field].toString(), currency)}</span>) : <span>No issued balances</span>;
}

// Only a future authorized ledger adapter may supply records. The live
// container never binds order/trip arrays to this presentation.
export function InvoiceDashboard({ records = null, shipments = null, accountId = null, loading = false, error = '', onRefresh, asOf = todayDate() }) {
  const [params, setParams] = useSearchParams();
  const requestedView = params.get('status') || 'all';
  const knownView = invoiceFilters.some(([value]) => value === requestedView);
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState('');
  const [type, setType] = useState('all');
  const [currency, setCurrency] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(0);
  const projection = useMemo(() => {
    if (records === null) return { rows: [], error: '' };
    try {
      if (!isDate(asOf)) throw new Error('A valid financial assessment date is required.');
      return { rows: validateInvoices(records), error: '' };
    } catch (projectionError) {
      return { rows: [], error: projectionError.message };
    }
  }, [records, asOf]);
  const hasData = records !== null && !loading && !error && !projection.error;
  const rows = hasData ? projection.rows : [];
  const rangeError = (from && !isDate(from)) || (to && !isDate(to)) ? 'Enter valid invoice dates.' : from && to && from > to ? 'From date must not follow To date.' : '';
  const filtered = rows.filter(row => knownView && !rangeError && matchesView(row, requestedView, asOf)
    && `${row.number} ${row.customer} ${row.sourceReference || ''} ${invoiceSourceReference(row)}`.toLowerCase().includes(search.trim().toLowerCase())
    && row.customer.toLowerCase().includes(customer.trim().toLowerCase())
    && (type === 'all' || row.type === type) && (currency === 'all' || row.currency === currency)
    && (!from || (row.invoiceDate && row.invoiceDate >= from)) && (!to || (row.invoiceDate && row.invoiceDate <= to)));
  const summary = summarizeInvoices(rows, asOf);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  useEffect(() => { setPage(0); }, [requestedView]);
  const updateFilter = (setter, value) => { setter(value); setPage(0); };
  const changeView = value => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete('status'); else next.set('status', value);
    setParams(next);
  };

  return <main className="content-wrapper iso-ui ifm-invoices" data-iso-theme="light">
    <header className="billing-header"><div><p className="billing-eyebrow">IFM / Billing & accounts receivable</p><h1>Invoices</h1><p>One place for controlled billing. Orders and trips are sources, not issued invoices.</p></div><div className="billing-actions">
      <Button variant="secondary" disabled={loading || !onRefresh} onClick={onRefresh}><FiRefreshCw aria-hidden="true" />{loading ? 'Refreshing...' : 'Refresh'}</Button>
      <Button disabled title="Authorized draft creation and an approved invoice ledger are required."><FiFileText aria-hidden="true" />Prepare draft</Button>
    </div></header>
    <div className="billing-boundary"><FiLock aria-hidden="true" /><div><strong>Financial actions locked</strong><p>No authorized invoice ledger is connected. Operational orders, route estimates and regenerated PDFs are not treated as issued invoices or payment evidence. Issuance, payments, credits and customer messaging are disabled.</p></div></div>
    <section className="billing-summary" aria-label="Invoice summary">
      {[
        ['Total Outstanding', hasData ? <CurrencyAmounts currencies={summary.currencies} field="outstanding" /> : 'Unavailable', 'Issued AR balances, separated by currency'],
        ['Overdue Amount', hasData ? <CurrencyAmounts currencies={summary.currencies} field="overdue" /> : 'Unavailable', `Past due with an unpaid balance as of ${asOf}`],
        ['Pending Invoices', hasData ? String(summary.pending) : 'Unavailable', 'Issued invoices with an outstanding balance'],
        ['Paid This Month', 'Unavailable', 'Verified dated payment applications required'],
        ['Draft Invoices', hasData ? String(summary.drafts) : 'Unavailable', 'Prepared, not issued'],
        ['Average Days to Payment', 'Not measurable', 'Complete issue and settlement history required'],
      ].map(([label, value, help]) => <div className="billing-stat" key={label} aria-label={label}><span>{label}</span><strong>{value}</strong><small>{help}</small></div>)}
    </section>
    <InvoiceReadyQueue shipments={loading || error ? null : shipments} accountId={accountId} />
    {(error || projection.error) && <Alert tone="danger" title="Invoice data unavailable">{error || projection.error}</Alert>}
    {!knownView && <Alert tone="danger" title="Unknown invoice view">Choose a supported invoice view. No status is inferred from an invalid link.</Alert>}
    <nav className="billing-views" aria-label="Invoice views">{invoiceViews.map(([value, label]) => <Link key={value} to={value === 'all' ? '/invoices' : `/invoices?status=${value}`} aria-current={requestedView === value ? 'page' : undefined}>{label}</Link>)}</nav>
    <section className="billing-ledger" aria-labelledby="invoice-ledger-title">
      <div className="billing-ledger-header"><div><p className="billing-eyebrow">Controlled receivables</p><h2 id="invoice-ledger-title">{invoiceFilters.find(([value]) => value === requestedView)?.[1] || 'Select an invoice view'}</h2></div><p>CAD and USD are never combined. Credit notes are separate documents.</p></div>
      <div className="billing-filters">
        <Input label="Search invoices" type="search" value={search} placeholder="Invoice, customer or source reference" onChange={event => updateFilter(setSearch, event.target.value)} />
        <Input label="Customer filter" value={customer} onChange={event => updateFilter(setCustomer, event.target.value)} />
        <Select label="Invoice type" value={type} onChange={event => updateFilter(setType, event.target.value)}><option value="all">All types</option><option value="broker_order">Broker Order</option><option value="carrier_trip">Carrier Trip</option></Select>
        <Select label="Invoice status" value={knownView ? requestedView : ''} onChange={event => changeView(event.target.value)}>{!knownView && <option value="" disabled>Unknown view</option>}{invoiceFilters.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</Select>
        <Select label="Currency" value={currency} onChange={event => updateFilter(setCurrency, event.target.value)}><option value="all">All currencies (separate totals)</option><option value="CAD">CAD</option><option value="USD">USD</option></Select>
        <Input type="date" label="From invoice date" value={from} onChange={event => updateFilter(setFrom, event.target.value)} />
        <Input type="date" label="To invoice date" value={to} onChange={event => updateFilter(setTo, event.target.value)} />
      </div>
      {rangeError && <Alert tone="danger" title="Date range">{rangeError}</Alert>}
      <p className="billing-count" role="status">{loading ? 'Verifying invoice access...' : hasData ? `${filtered.length} matching documents / ${rows.length} loaded. Summary covers the loaded authorized ledger, not this filtered page.` : 'No verified invoice records loaded. Totals are unavailable, not zero.'}</p>
      <div className="billing-table-wrap"><table className="billing-table"><caption className="billing-sr-only">Invoice documents with separate currency, payment balance and lifecycle labels</caption><thead><tr>{['Invoice #', 'Type', 'Customer', 'OrderID / TripID / RouteID', 'Invoice Date', 'Due Date', 'Amount', 'Paid', 'Credits', 'Balance', 'Status', 'Actions'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>
        {visible.map(row => {
          const status = invoiceStatus(row, asOf);
          const receivable = row.documentKind === 'invoice' && row.documentStatus === 'issued';
          return <tr key={row.id}><th scope="row">{row.number}{row.documentKind === 'credit_note' && <small>Credit note</small>}</th><td>{row.type === 'broker_order' ? 'Broker Order' : 'Carrier Trip'}</td><td>{row.customer || 'Unavailable'}</td><td>{invoiceSourceReference(row)}</td><td>{row.invoiceDate || 'Not issued'}</td><td>{row.dueDate || 'Unavailable'}</td><td>{formatMoney(row.totalMinor, row.currency)}</td><td>{receivable ? formatMoney(row.paidMinor, row.currency) : 'Not applicable'}</td><td>{receivable ? formatMoney(row.creditsMinor, row.currency) : 'Not applicable'}</td><td>{receivable ? formatMoney(invoiceBalance(row).toString(), row.currency) : 'Not a receivable'}</td><td><Badge tone={statusTones[status] || 'neutral'}>{statusNames[status]}</Badge>{row.disputed && status !== 'disputed' && <small>Disputed</small>}</td><td><Button variant="secondary" disabled title="Authorized snapshot, edit and payment workflows are not connected.">View / Edit / PDF / Payment</Button></td></tr>;
        })}
        {!visible.length && <tr><td colSpan={12}>{loading ? <EmptyState loading title="Loading invoice access" /> : <EmptyState title={hasData ? 'No matching invoices' : 'Invoice ledger not connected'}>{hasData ? 'Adjust the selected view or filters.' : 'No order or trip is automatically issued, marked paid or presented as an invoice.'}</EmptyState>}</td></tr>}
      </tbody></table></div>
      {hasData && <nav className="billing-pagination" aria-label="Invoice pages"><Button variant="secondary" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous page</Button><span>Page {currentPage + 1} of {pages}</span><Button variant="secondary" disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)}>Next page</Button></nav>}
    </section>
    <section className="billing-foundations" aria-label="Billing boundaries"><article><h2>Broker order / Carrier trip</h2><p>Each receivable needs a verified source, bill-to party and approved charges. A shared shipment must not create duplicate customer revenue. Carrier bills remain accounts payable.</p></article><article><h2>Route evidence, not billing authority</h2><p>PTV planned mileage, actual distance and contractual billable miles are different. Tolls and estimated operating costs are never automatically invoiced.</p></article><article><h2>SIS Billing & Collections</h2><p>Future functionality. No autonomous invoice issuance, payment adjustment, reminder email or collection action is enabled.</p></article></section>
  </main>;
}

export default function Invoices() {
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, error: '' });
    axios.get(`${BASE_URL}api/tipsfetchProductData`, { withCredentials: true, params: { invoice_dashboard: '1' }, signal: controller.signal })
      .then(() => {
        if (!controller.signal.aborted) setState({ loading: false, error: 'An authorized invoice ledger is not available. Operational order responses are withheld, not converted into invoices.' });
      })
      .catch(requestError => {
        if (!controller.signal.aborted) setState({ loading: false, error: requestError.response?.data?.message || requestError.message || 'Could not verify invoice data access.' });
      });
    return () => controller.abort();
  }, [refresh]);
  return <InvoiceDashboard loading={state.loading} error={state.error} onRefresh={() => setRefresh(value => value + 1)} />;
}

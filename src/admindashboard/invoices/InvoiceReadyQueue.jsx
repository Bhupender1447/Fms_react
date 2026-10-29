import React, { useMemo, useState } from 'react';
import { Alert, Button, EmptyState, Input } from '../../design-system/components';
import { invoiceReadyEntries } from './invoiceReadyModel';

export default function InvoiceReadyQueue({ shipments = null, accountId = null }) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const projection = useMemo(() => {
    if (shipments === null) return { entries: [], error: '' };
    try {
      return { entries: invoiceReadyEntries(shipments, accountId), error: '' };
    } catch (error) {
      return { entries: [], error: error.message };
    }
  }, [shipments, accountId]);
  const connected = shipments !== null && !projection.error;
  const filtered = projection.entries.filter(entry =>
    [entry.shipmentId, ...entry.orderIds, ...entry.tripIds, ...entry.routeIds]
      .some(value => value.toLowerCase().includes(search.trim().toLowerCase())));
  const pages = Math.max(1, Math.ceil(filtered.length / 12));
  const currentPage = Math.min(page, pages - 1);
  return <section className="billing-ledger" aria-labelledby="invoice-ready-title">
    <div className="billing-ledger-header"><div><p className="billing-eyebrow">Completed operations / Billing review</p><h2 id="invoice-ready-title">Invoice-ready queue</h2></div><p>One entry per verified shipment. No automatic invoice issuance.</p></div>
    <p>Completion of a linked order, trip or persisted route makes its shipment eligible for review. All linked IDs remain together; operational records stay in place. Other linked sources may still be in progress.</p>
    {projection.error && <Alert tone="danger" title="Invoice readiness unavailable">{projection.error}</Alert>}
    <Input label="Search invoice-ready IDs" type="search" placeholder="Shipment, OrderID, TripID or RouteID" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} />
    <p className="billing-count" role="status">{connected ? `${filtered.length} invoice-ready shipments. Not issued invoices or receivables.` : 'Unavailable: authorized completion records, source mappings and billing history are not connected. Session-only route drafts are not eligible.'}</p>
    <div className="billing-table-wrap"><table className="billing-table"><caption className="billing-sr-only">Invoice-ready shipments linked to OrderID, TripID and RouteID</caption><thead><tr>{['Shipment', 'OrderID', 'TripID', 'RouteID', 'Source completion', 'Actions'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>
      {filtered.slice(currentPage * 12, (currentPage + 1) * 12).map(entry => <tr key={entry.shipmentId}>
        <th scope="row">{entry.shipmentId}</th>
        {[entry.orderIds, entry.tripIds, entry.routeIds].map((ids, index) => <td key={index}>{ids.length ? ids.join(', ') : 'Not linked'}</td>)}
        <td>{entry.sources.map(source => <small key={`${source.type}:${source.id}`}>{source.type} {source.id}: {source.state.replace('_', ' ')}</small>)}</td>
        <td><Button variant="secondary" disabled title="An approved invoice ledger and authorized draft workflow are required.">Review / Prepare draft</Button></td>
      </tr>)}
      {!filtered.length && <tr><td colSpan={6}><EmptyState title={connected ? 'No matching invoice-ready shipments' : 'Completion queue not connected'}>{connected ? 'Only unbilled shipments with a completed source qualify. Drafted, issued, cancelled or review-blocked shipments are not added again.' : 'No live order, trip or route is moved or converted into an invoice.'}</EmptyState></td></tr>}
    </tbody></table></div>
    {connected && <nav className="billing-pagination" aria-label="Invoice-ready pages"><Button variant="secondary" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>Previous ready page</Button><span>Ready page {currentPage + 1} of {pages}</span><Button variant="secondary" disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)}>Next ready page</Button></nav>}
  </section>;
}

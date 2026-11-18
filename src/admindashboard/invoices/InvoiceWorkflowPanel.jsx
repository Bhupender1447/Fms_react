import InvoiceEmailPanel from './InvoiceEmailPanel';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Input, Select } from '../../design-system/components';
import { BASE_URL } from '../../config';
import { formatMoney, invoiceBalance, todayDate } from './invoiceReadModel';

function newRequestKey() {
  return window.crypto?.randomUUID?.() || `ifm-${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}
const errorMessage = error => error.response?.data?.message || error.message || 'Could not save invoice changes.';
function defaultDueDate() { const date = new Date(`${todayDate()}T12:00:00`); date.setDate(date.getDate() + 30); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }

export default function InvoiceWorkflowPanel({ records, readyOrders = [], readyError = '', initialOrderId = '', initialTripKey = '', capabilities, selectedId, onSelect, onRefresh }) {
  const [orderId, setOrderId] = useState(initialOrderId);
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(todayDate);
  const [reference, setReference] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [history, setHistory] = useState(null);
  const [historyError, setHistoryError] = useState('');
  const manageHeading = useRef(null);
  const requestKey = useRef(newRequestKey());
  const inFlight = useRef(false);
  const choices = initialTripKey ? readyOrders.filter(order => order.tripId === initialTripKey) : readyOrders;
  useEffect(() => {
    if (initialOrderId) setOrderId(initialOrderId);
    else if (initialTripKey) { const linked = readyOrders.filter(order => order.tripId === initialTripKey); setOrderId(linked.length === 1 ? linked[0].id : ''); }
  }, [initialOrderId, initialTripKey, readyOrders]);
  const selected = records?.find(row => row.id === selectedId);
  useEffect(() => { if (selectedId) { manageHeading.current?.focus({ preventScroll: true }); manageHeading.current?.scrollIntoView?.({ block: 'start', behavior: 'auto' }); } }, [selectedId]);
  useEffect(() => { requestKey.current = newRequestKey(); setAmount(''); setReference(''); setReason(''); setError(''); setDueDate(defaultDueDate()); setPaymentDate(todayDate()); }, [selectedId]);
  useEffect(() => {
    if (!selectedId) { setHistory(null); return undefined; }
    const controller = new AbortController(); setHistory(null); setHistoryError('');
    axios.get(`${BASE_URL}api/invoices/${encodeURIComponent(selectedId)}`, { withCredentials: true, signal: controller.signal })
      .then(({ data }) => { if (!controller.signal.aborted) { if (data.status !== true || !Array.isArray(data.payments)) throw new Error('Payment history is unavailable.'); setHistory(data); } })
      .catch(failure => { if (!controller.signal.aborted) setHistoryError(errorMessage(failure)); });
    return () => controller.abort();
  }, [selectedId, records]);
  const save = async (path, body, message, afterSave) => {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(''); setNotice('');
    try {
      const { data } = await axios.post(`${BASE_URL}api/invoices/${path}`, body, { withCredentials: true });
      if (data.status !== true || !data.invoice) throw new Error(data.message || 'Invoice change was not confirmed.');
      setNotice(data.duplicate ? 'This request was already saved. No duplicate was created.' : message);
      afterSave?.(); if (path === 'draft') onSelect(data.invoice.id); onRefresh();
    } catch (failure) { setError(errorMessage(failure)); }
    finally { inFlight.current = false; setBusy(false); }
  };
  const download = async () => {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError('');
    try {
      const response = await axios.get(`${BASE_URL}api/invoices/${encodeURIComponent(selected.id)}/pdf`, { withCredentials: true, responseType: 'blob' });
      if (!response.headers?.['content-type']?.includes('application/pdf')) throw new Error('The server did not return an invoice PDF.');
      const url = URL.createObjectURL(response.data); const link = document.createElement('a'); link.href = url; link.download = `${selected.number}.pdf`; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) { setError(errorMessage(failure)); }
    finally { inFlight.current = false; setBusy(false); }
  };
  return <section className="billing-ledger billing-workflow" aria-label="Invoice workflow" aria-busy={busy}>
    <h2>Prepare & manage invoices</h2>
    {error && <Alert tone="danger" title="Invoice action failed">{error}</Alert>}
    {notice && <p role="status" className="billing-success">{notice}</p>}
    {capabilities.canDraft && <form className="billing-action-form" onSubmit={event => { event.preventDefault(); save('draft', { order_id: orderId }, 'Draft prepared. Review it before issuing.', () => setOrderId('')); }}>
      <h3>Invoice-ready orders and trips</h3>
      <p>Billing amounts are copied from the saved order. A draft does not create a receivable until you issue it.</p>
      {initialTripKey && <p>Billing review for trip {initialTripKey}. Select its linked order; no document is issued automatically.</p>}
      {readyError && <Alert tone="warning" title="Invoice-ready list unavailable">{readyError} You can enter a known order ID below.</Alert>}
      {choices.length > 0 && <Select label="Invoice-ready work" value={choices.some(order => order.id === orderId) ? orderId : ''} onChange={event => setOrderId(event.target.value)}><option value="">Choose a finished order or trip</option>{choices.map(order => <option key={order.id} value={order.id}>Order {order.id} - {order.customer} - {order.currency} {order.total}{order.completionSource === 'TRIP' ? ' - Trip completed' : ' - Order completed'}</option>)}</Select>}
      {!readyError && !choices.length && <p>No unbilled finished orders or linked trips were found in the latest 100 candidates.</p>}
      <Input id="billing-draft-order" label="Order ID to invoice" inputMode="numeric" pattern="[0-9]+" value={orderId} onChange={event => setOrderId(event.target.value)} required />
      <Button type="submit" disabled={busy || !orderId}>Prepare draft</Button>
    </form>}
    {selected && <div className="billing-manage" aria-label={`Manage ${selected.number}`}>
      <div className="billing-manage-heading"><h3 ref={manageHeading} tabIndex={-1}>{selected.number}</h3><Button variant="secondary" disabled={busy} onClick={() => onSelect(null)}>Close invoice</Button></div>
      <p>{selected.customer} - {selected.currency} - {selected.documentStatus === 'issued' ? `Balance ${formatMoney(invoiceBalance(selected).toString(), selected.currency)}` : selected.documentStatus}</p>
      {capabilities.canDownloadPdf && <Button variant="secondary" disabled={busy} onClick={download}>Download PDF</Button>}
      {capabilities.canIssue && ['draft', 'approved'].includes(selected.documentStatus) && <form className="billing-action-form" onSubmit={event => { event.preventDefault(); save(`${selected.id}/issue`, { due_date: dueDate }, 'Invoice issued.'); }}>
        <h4>Review and issue</h4><p>Issuing confirms the saved billing total of {formatMoney(selected.totalMinor, selected.currency)}.</p>
        <Input label="Invoice due date" type="date" value={dueDate} min={todayDate()} required onChange={event => setDueDate(event.target.value)} />
        <Button type="submit" disabled={busy}>Issue invoice</Button>
      </form>}
      {capabilities.canRecordPayment && selected.documentStatus === 'issued' && !selected.disputed && invoiceBalance(selected) > 0n && <form className="billing-action-form" onSubmit={event => { event.preventDefault(); save(`${selected.id}/payment`, { amount, payment_date: paymentDate, reference, request_key: requestKey.current }, 'Payment recorded.', () => { requestKey.current = newRequestKey(); setAmount(''); setReference(''); }); }}>
        <h4>Record a received payment</h4><p>Record money already received. This action does not charge a bank account or card.</p>
        <Input label="Payment amount" inputMode="decimal" pattern="[0-9]+([.][0-9]{1,2})?" required value={amount} onChange={event => { setAmount(event.target.value); requestKey.current = newRequestKey(); }} />
        <Input label="Payment date" type="date" min={selected.invoiceDate} max={todayDate()} required value={paymentDate} onChange={event => { setPaymentDate(event.target.value); requestKey.current = newRequestKey(); }} />
        <Input label="Payment reference" maxLength={120} value={reference} onChange={event => { setReference(event.target.value); requestKey.current = newRequestKey(); }} />
        <Button type="submit" disabled={busy}>Record payment</Button>
      </form>}
      <InvoiceEmailPanel invoiceId={selected.id}/>
      <h4>Recorded payment history</h4>
      {historyError ? <Alert tone="warning" title="History unavailable">{historyError}</Alert> : history ? (history.payments.length ? <ul>{history.payments.map(payment => <li key={payment.id}>{payment.payment_date} - {formatMoney(String(payment.amount_minor), selected.currency)}{payment.reference ? ` - ${payment.reference}` : ''}</li>)}</ul> : <p>No payment entries recorded in this ledger.</p>) : <p role="status">Loading payment history...</p>}
      {capabilities.canVoid && selected.documentStatus !== 'voided' && selected.paidMinor === '0' && selected.creditsMinor === '0' && <form className="billing-action-form" onSubmit={event => { event.preventDefault(); save(`${selected.id}/void`, { reason }, 'Invoice voided.'); }}>
        <h4>Void an unpaid invoice</h4><Input label="Void reason" required maxLength={250} value={reason} onChange={event => setReason(event.target.value)} /><Button type="submit" variant="secondary" disabled={busy || !reason.trim()}>Void invoice</Button>
      </form>}
    </div>}
  </section>;
}

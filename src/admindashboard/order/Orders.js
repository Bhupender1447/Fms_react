import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';
import { getLoadErrorMessage } from '../../services/loadErrors';
import { Alert, Button, Input, PageHeader, Select } from "../../design-system/components";
import WorkspaceSummary from "../../design-system/WorkspaceSummary";

const Orders = () => {
  const [list, setList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [currency, setCurrency] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [postedLoadOrderIds, setPostedLoadOrderIds] = useState(new Set());
  const [postingOrderId, setPostingOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await axios.get(`${BASE_URL}api/orderlist`, { withCredentials: true });
      const orders = Array.isArray(response.data) ? response.data : [];
      setList(orders);
    } catch (error) {
      setLoadError(getLoadErrorMessage(error, 'Orders'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    axios.get(`${BASE_URL}api/loadboard/loads`, { withCredentials: true })
      .then((res) => {
        const loads = Array.isArray(res.data?.data) ? res.data.data : [];
        setPostedLoadOrderIds(new Set(loads.map((load) => String(load.order_id)).filter((id) => id && id !== 'null')));
      })
      .catch(() => {
        // The post endpoint still checks eligibility and prevents duplicate active posts.
      });
  }, []);

  const postOrderAsLoad = async (item) => {
    setPostingOrderId(item.id);
    try {
      await axios.post(`${BASE_URL}api/loadboard/loads`, { order_id: item.id }, { withCredentials: true });
      setPostedLoadOrderIds((current) => new Set([...current, String(item.id)]));
      toast.success(`Order ${item.customer_orderno || item.loadno || item.id} posted to Loadboard.`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not post this order to the Loadboard.');
    } finally {
      setPostingOrderId(null);
    }
  };

  useEffect(() => {
    let filtered = list;
    const query = searchTerm.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((order) => [
        order.customer_orderno,
        order.id,
        order.loadno,
        order.company,
        order.shipment_type,
        order.pickup_address,
        order.delivery_address,
        order.status,
        order.driver_id,
      ].some((value) => String(value || '').toLowerCase().includes(query)));
    }
    if (currency) {
      filtered = filtered.filter(order => order.currency === currency);
    }
    if (pickupDate) {
      filtered = filtered.filter(order => String(order.pickup_date || '').slice(0, 10) === pickupDate);
    }
    if (deliveryDate) {
      filtered = filtered.filter(order => String(order.delivery_date || order.deliver_date || '').slice(0, 10) === deliveryDate);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => {
        const status = String(order.status || '').trim().toUpperCase();
        const driverId = String(order.driver_id ?? '0').trim().toLowerCase();
        const assigned = !['', '0', 'na', 'null'].includes(driverId);
        const closed = ['CANCELLED', 'CANCELED', 'CLOSED', 'DELIVERED', 'COMPLETED'].includes(status);
        if (statusFilter === 'assigned') return assigned && !closed;
        if (statusFilter === 'unassigned') return !assigned && !closed;
        if (statusFilter === 'closed') return closed;
        return true;
      });
    }
    setFilteredOrders(filtered);
    setCurrentPage(0);
  }, [currency, pickupDate, deliveryDate, searchTerm, statusFilter, list]);

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrency('');
    setPickupDate('');
    setDeliveryDate('');
  };

  const orderCounts = useMemo(() => list.reduce((counts, order) => {
    const status = String(order.status || '').trim().toUpperCase();
    const driverId = String(order.driver_id ?? '0').trim().toLowerCase();
    const closed = ['CANCELLED', 'CANCELED', 'CLOSED', 'DELIVERED', 'COMPLETED'].includes(status);
    counts.total += 1;
    if (!closed && !['', '0', 'na', 'null'].includes(driverId)) counts.assigned += 1;
    if (!closed && ['', '0', 'na', 'null'].includes(driverId)) counts.unassigned += 1;
    if (closed) counts.closed += 1;
    return counts;
  }, { total: 0, assigned: 0, unassigned: 0, closed: 0 }), [list]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to remove this order?")) {
      try {
        await axios.post(
          `${BASE_URL}api/remove`,
          new URLSearchParams({
            id: id,
            type: 'fms_orders'
          }).toString(),
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            }
          }
        );
        setList(list.filter(item => item.id !== id));
        toast.success("Order removed successfully");
      } catch (error) {
        console.error("Error removing item:", error);
        toast.error(error.response?.data?.message || "Error removing order");
      }
    }
  };


  const offset = currentPage * itemsPerPage;
  const currentItems = filteredOrders.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="content-wrapper iso-ui iso-workspace" data-iso-theme="light">
      <PageHeader title="Manage Orders" actions={<div className="d-flex gap-2"><Button variant="secondary" onClick={loadOrders} disabled={loading}>Refresh</Button><Link to="/createorder" className="iso-button iso-button--primary">New order</Link></div>}>Track assignments, schedules, and eligible local load postings.</PageHeader>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <WorkspaceSummary items={[["All orders",orderCounts.total],["Needs assignment",orderCounts.unassigned],["Assigned",orderCounts.assigned],["Completed / closed",orderCounts.closed]]} unavailable={loading || Boolean(loadError)} />
            {loadError && <Alert tone="danger" title="Orders unavailable" action={<Button variant="secondary" onClick={loadOrders}>Try again</Button>}>{loadError}</Alert>}
            <div className="box">
              <div className="box-header d-flex flex-wrap align-items-center justify-content-between">
                <div><h3 className="box-title">Order workspace</h3><div className="text-muted small">{filteredOrders.length} matching orders · {orderCounts.unassigned} waiting for assignment</div></div>
              </div>
              <div className="box-body">
                <div className="iso-workspace-filters">
                  <Input label="Search orders" type="search" placeholder="Order, company, pickup or delivery" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
                  <Select label="Assignment / status" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}><option value="all">All orders</option><option value="unassigned">Unassigned</option><option value="assigned">Assigned</option><option value="closed">Completed or closed</option></Select>
                  <Select label="Currency" value={currency} onChange={(e)=>setCurrency(e.target.value)}><option value="">All currencies</option><option value="CAD">CAD</option><option value="USD">USD</option></Select>
                  <Input label="Pickup date" type="date" value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)} />
                  <Input label="Delivery date" type="date" value={deliveryDate} onChange={(e)=>setDeliveryDate(e.target.value)} />
                  <div className="iso-workspace-filter-actions"><span aria-live="polite">{loadError ? 'Results unavailable' : 'Matching orders: ' + filteredOrders.length}</span><Button variant="secondary" onClick={clearFilters} disabled={!searchTerm && statusFilter==='all' && !currency && !pickupDate && !deliveryDate}>Clear filters</Button></div>
                </div>
                <br />
                <div className="table-responsive"><table className="table table-hover table-striped align-middle">
                  <thead>
                    <tr className="active">
                      <th scope="col">Order</th><th scope="col">Customer / shipment</th><th scope="col">Pickup</th><th scope="col">Delivery</th><th scope="col">Schedule</th><th scope="col">Assignment</th><th scope="col">Value currency</th><th style={{ minWidth: 320 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && <tr><td colSpan={8} className="text-center text-muted p-4"><i className="fa fa-spinner fa-spin" /> Loading orders…</td></tr>}
                    {!loading && !loadError && currentItems.length === 0 && (
                      <tr>
                        <td colSpan={8} className="text-center text-muted p-4">No orders match these filters. Adjust the search or clear filters.</td>
                      </tr>
                    )}
                    {!loading && !loadError && currentItems.map((item) => (
                      <tr key={item.id}>
                        <td><strong>{item.customer_orderno || item.loadno || `Order ${item.id}`}</strong><div className="small text-muted">Internal ID {item.id}</div></td>
                        <td>{item.company || '—'}<div className="small text-muted">{item.shipment_type || item.trailortype || 'Shipment type not set'}</div></td>
                        <td style={{ minWidth: 180 }}>{item.pickup_address || 'Address not set'}</td>
                        <td style={{ minWidth: 180 }}>{item.delivery_address || 'Address not set'}</td>
                        <td><div><i className="fa fa-arrow-up text-success" /> {item.pickup_date ? String(item.pickup_date).slice(0, 10) : '—'}</div><div className="small text-muted"><i className="fa fa-arrow-down" /> {item.delivery_date || item.deliver_date ? String(item.delivery_date || item.deliver_date).slice(0, 10) : '—'}</div></td>
                        <td><span className={`label ${['', '0', 'na', 'null'].includes(String(item.driver_id ?? '0').trim().toLowerCase()) ? 'label-warning' : 'label-success'}`}>{['', '0', 'na', 'null'].includes(String(item.driver_id ?? '0').trim().toLowerCase()) ? 'Unassigned' : 'Assigned'}</span><div className="small text-muted">Status: {item.status || 'Open'}</div></td>
                        <td>{item.gross_amount ? `${item.gross_amount} ` : ''}{item.currency || '—'}</td>
                        <td>
                          <Link
                            target="_blank"
                            to={`${BASE_URL}pdf/invoice.php?id=${item.id}`}
                            className="btn btn-danger btn-sm"
                          >
                            Confirmation
                          </Link>
                          {item.tmsTriptId && <Link to={`/tripviewer/${item.tmsTriptId}`} className="btn btn-default btn-xs">
                            Map
                          </Link>}
                          <Link
                            target="_blank"
                            to={`${BASE_URL}pdf/invoice_log.php?id=${item.id}`}
                            className="btn btn-warning btn-xs"
                          >
                            Invoice
                          </Link>
                          <Link
                            aria-label={"Edit order " + item.id} to={"/update/" + item.id}
                            className="btn btn-default btn-sm"
                          >
                            <i className="fa fa-pencil" />
                          </Link>
                          <Link
                            to={"/assign/" + item.id}
                            className="btn btn-success btn-sm"
                          >
                            Assign
                          </Link>
                          {(() => {
                            const orderId = String(item.id);
                            const status = String(item.status || '').toUpperCase();
                            const driverId = String(item.driver_id ?? '0').trim().toLowerCase();
                            const isEligible = String(item.mode || '').toUpperCase() !== 'LOG'
                              && ['0', '', 'na', 'null'].includes(driverId)
                              && !['CANCELLED', 'CANCELED', 'CLOSED', 'DELIVERED'].includes(status)
                              && Boolean(item.pickup_address && item.delivery_address);
                            const isPosted = postedLoadOrderIds.has(orderId);
                            return (
                              <button
                                type="button"
                                className={`btn btn-xs ${isPosted ? 'btn-default' : 'btn-info'}`}
                                onClick={() => postOrderAsLoad(item)}
                                disabled={!isEligible || isPosted || postingOrderId === item.id}
                                title={!isEligible ? 'This order must be unassigned and have pickup and delivery addresses.' : undefined}
                              >
                                <i className={`fa ${isPosted ? 'fa-check' : 'fa-exchange'}`} />{' '}
                                {postingOrderId === item.id ? 'Posting...' : isPosted ? 'Load Posted' : 'Post Load'}
                              </button>
                            );
                          })()}
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            aria-label={"Remove order " + item.id} onClick={() => handleRemove(item.id)}
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>
                <ReactPaginate forcePage={pageCount > 0 ? currentPage : undefined} renderOnZeroPageCount={null}                   previousLabel={'Previous'}
                  nextLabel={'Next'}
                  breakLabel={'...'}
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  containerClassName={'pagination'}
                  activeClassName={'active'}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Orders;

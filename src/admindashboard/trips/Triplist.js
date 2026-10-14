import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import { getLoadErrorMessage } from "../../services/loadErrors";
import { Alert, Button, Input, PageHeader, Select } from "../../design-system/components";
import WorkspaceSummary from "../../design-system/WorkspaceSummary";

const Triplist = () => {
  const [list, setList] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const loadTrips = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await axios.get(`${BASE_URL}api/tipsfetchProductData/1`, { withCredentials: true });
      setList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setLoadError(getLoadErrorMessage(error, 'Trips'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleCancel = async (item) => {
    const currentStatus = (item.status || '').toUpperCase();

    // Prevent cancelling completed trips
    if (currentStatus === 'COMPLETED') {
      toast.error('Cannot cancel a COMPLETED trip. Contact admin for adjustments.');
      return;
    }
    if (currentStatus === 'CANCELLED') {
      toast.info('This trip is already cancelled.');
      return;
    }
    if (currentStatus === 'IN_PROGRESS') {
      toast.warning('Trip is currently IN PROGRESS. Ask the driver to pause it first before cancelling.');
      return;
    }

    const reason = window.prompt(
      `Cancel trip "${item.customer_orderno || item.id}"?\n\nEnter a reason (optional):`
    );
    if (reason === null) return; // user clicked Cancel in prompt

    if (cancellingId === item.id) return;
    setCancellingId(item.id);

    try {
      const res = await axios.post(
        `${BASE_URL}api/remove`,
        new URLSearchParams({ id: item.id, type: 'fms_trips', reason }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      if (res.data.status) {
        // Update local state to reflect CANCELLED status (don't remove from list)
        setList(list.map(t => t.id === item.id ? { ...t, status: 'CANCELLED' } : t));
        toast.success('Trip cancelled successfully. Historical records are preserved.');
      } else {
        toast.error(res.data.message || 'Failed to cancel trip');
      }
    } catch (error) {
      console.error('Error cancelling trip:', error);
      toast.error(error.response?.data?.message || 'Error cancelling trip');
    } finally {
      setCancellingId(null);
    }
  };


  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(0);
  };

  const query = searchTerm.trim().toLowerCase();
  const filteredTrips = list.filter((trip) => {
    const matchesSearch = !query || [
      trip.customer_orderno,
      trip.company,
      trip.pickup_address,
      trip.delivery_address,
      trip.status,
      trip.id,
      trip.tmsTriptId,
      trip.driver_id,
    ].some((value) => String(value || '').toLowerCase().includes(query));
    const status = String(trip.status || 'ACTIVE').trim().toUpperCase();
    const matchesStatus = statusFilter === 'all'
      || (statusFilter === 'active' && ['ACTIVE', 'IN_PROGRESS'].includes(status))
      || (statusFilter === 'paused' && status === 'PAUSED')
      || (statusFilter === 'completed' && status === 'COMPLETED')
      || (statusFilter === 'cancelled' && ['CANCELLED', 'CANCELED'].includes(status));
    return matchesSearch && matchesStatus;
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredTrips.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredTrips.length / itemsPerPage);
  const tripCounts = useMemo(() => list.reduce((counts, trip) => {
    const status = String(trip.status || 'ACTIVE').trim().toUpperCase();
    counts.total += 1;
    if (['ACTIVE', 'IN_PROGRESS'].includes(status)) counts.active += 1;
    else if (status === 'PAUSED') counts.paused += 1;
    else if (status === 'COMPLETED') counts.completed += 1;
    else if (['CANCELLED', 'CANCELED'].includes(status)) counts.cancelled += 1;
    return counts;
  }, { total: 0, active: 0, paused: 0, completed: 0, cancelled: 0 }), [list]);

  return (
    <div className="content-wrapper iso-ui iso-workspace" data-iso-theme="light">
      <PageHeader title="Manage Trips" actions={<div className="d-flex gap-2"><Button variant="secondary" onClick={loadTrips} disabled={loading}>Refresh</Button><Link to="/createtrips" className="iso-button iso-button--primary">Create trip</Link></div>}>Review dispatch status, routes, assignments, and trip documents.</PageHeader>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <WorkspaceSummary items={[["All trips",tripCounts.total],["Active / in progress",tripCounts.active],["Paused",tripCounts.paused],["Completed",tripCounts.completed],["Cancelled",tripCounts.cancelled]]} unavailable={loading || Boolean(loadError)} />
            {loadError && <Alert tone="danger" title="Trips unavailable" action={<Button variant="secondary" onClick={loadTrips}>Try again</Button>}>{loadError}</Alert>}
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Trip board</h3><div className="text-muted small">{filteredTrips.length} matching · {tripCounts.active} active · {tripCounts.paused} paused</div>
              </div>
              <div className="box-body">
                <div className="iso-workspace-filters">
                  <Input label="Search trips" type="search" placeholder="Order, company, address or trip ID" value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value);setCurrentPage(0);}} />
                  <Select label="Trip status" value={statusFilter} onChange={(e)=>{setStatusFilter(e.target.value);setCurrentPage(0);}}><option value="all">All statuses</option><option value="active">Active or in progress</option><option value="paused">Paused</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></Select>
                  <Select label="Rows per page" value={itemsPerPage} onChange={handleItemsPerPageChange}><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></Select>
                  <div className="iso-workspace-filter-actions"><Button variant="secondary" onClick={()=>{setSearchTerm('');setStatusFilter('all');setCurrentPage(0);}} disabled={!searchTerm && statusFilter==='all'}>Clear filters</Button></div>
                </div>
                <div
                  id="manageTable_wrapper"
                  className="dataTables_wrapper form-inline dt-bootstrap no-footer"
                >
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="table-responsive">
                      <table
                        id="manageTable"
                        className="table table-bordered table-striped dataTable no-footer"
                        role="grid"
                        aria-describedby="manageTable_info"
                        style={{ width: '100%', minWidth: 1200 }}
                      >
                        <thead>
                          <tr role="row">
                            <th scope="col">Trip / order</th>
                            <th scope="col">Customer</th>
                            <th scope="col">Route</th>
                            <th scope="col">Driver / schedule</th>
                            <th scope="col">Status</th>
                            <th scope="col">Documents</th>
                            <th style={{ width: 200 }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading && <tr><td colSpan={7} className="text-center text-muted p-4"><i className="fa fa-spinner fa-spin" /> Loading trips…</td></tr>}
                          {!loading && !loadError && currentItems.length === 0 && (
                            <tr><td colSpan={7} className="text-center text-muted p-4">No trips match these filters. Adjust the search or clear filters.</td></tr>
                          )}
                          {!loading && !loadError && currentItems.map((item) => (
                            <tr
                              role="row"
                              key={item.id}
                            >
                              <td><strong>{item.customer_orderno || item.loadno || `Trip ${item.id}`}</strong><div className="small text-muted">Trip ID {item.tmsTriptId || item.id}</div></td>
                              <td>{item.company || '—'}<div className="small text-muted">Shipment {item.shipment_type || item.trailortype || '—'}</div></td>
                              <td style={{ minWidth: 260 }}><div><i className="fa fa-circle text-success" /> {item.pickup_address || 'Pickup not set'}</div><div className="small text-muted mt-1"><i className="fa fa-map-marker text-danger" /> {item.delivery_address || 'Delivery not set'}</div></td>
                              <td>{item.driver_name || item.driver || (item.driver_id && String(item.driver_id) !== '0' ? `Driver ${item.driver_id}` : 'Unassigned')}<div className="small text-muted">{item.pickup_date ? `Pickup ${String(item.pickup_date).slice(0, 10)}` : 'No pickup date'}{item.deliver_date && ` · Delivery ${String(item.deliver_date).slice(0, 10)}`}</div></td>
                              <td>
                                <span className={`label ${String(item.status || 'ACTIVE').toUpperCase() === 'COMPLETED' ? 'label-success' : ['CANCELLED', 'CANCELED'].includes(String(item.status || '').toUpperCase()) ? 'label-danger' : String(item.status || 'ACTIVE').toUpperCase() === 'PAUSED' ? 'label-warning' : 'label-primary'}`}>{item.status || 'ACTIVE'}</span>
                              </td>
                              <td>{item.custom_paper_name || item.custom_paper ? <span className="label label-info">{item.custom_paper_name || item.custom_paper}</span> : <span className="text-muted">No document attached</span>}</td>
                              <td style={{ opacity: item.status === 'CANCELLED' ? 0.5 : 1 }}>
                                <Link
                                  type="button"
                                  className="btn btn-info btn-xs"
                                  to={`/tripsplit/${item.id}`}
                                >
                                  Split
                                </Link>
                                <Link
                                  to={`/trips/update/${item.id}`}
                                  className="btn btn-default btn-xs"
                                >
                                  <i className="fa fa-pencil" />
                                </Link>
                                <Link
                                  target="_blank"
                                  to={`${BASE_URL}pdf/invoice_log.php?id=${item.id}`}
                                  className="btn btn-danger btn-xs"
                                >
                                  Dispatch
                                </Link>
                                {item.tmsTriptId && (
                                  <Link
                                    to={`/tripviewer/${item.tmsTriptId}`}
                                    className="btn btn-default btn-xs"
                                  >
                                    Map
                                  </Link>
                                )}
                                <Link
                                  target="_blank"
                                  to={`${BASE_URL}pdf/invoice_orders.php?id=${item.id}`}
                                  className="btn btn-warning btn-xs"
                                >
                                  Invoice
                                </Link>
                                <Link
                                  to={`/trips/assign/${item.id}`}
                                  className="btn btn-success btn-xs"
                                >
                                  Assign
                                </Link>
                                <Link
                                  to={`/trips/split/${item.id}`}
                                  className="btn btn-xs btn-warning"
                                >
                                  Split Trip
                                </Link>
                                <Link
                                  to={`/trips/add-stop/${item.id}`}
                                  className="btn btn-xs btn-info"
                                >
                                  Add Stop
                                </Link>
                                {/* Safe Cancel — replaces hard delete */}
                                {item.status !== 'CANCELLED' && item.status !== 'COMPLETED' && (
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-xs"
                                    title="Cancel this trip (records preserved)"
                                    onClick={() => handleCancel(item)}
                                    disabled={cancellingId === item.id}
                                  >
                                    <i className={`fa ${cancellingId === item.id ? 'fa-spinner fa-spin' : 'fa-ban'}`} /> Cancel
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-5">
                      <div
                        className="dataTables_info"
                        id="manageTable_info"
                        role="status"
                        aria-live="polite"
                      >
                        Showing {filteredTrips.length ? offset + 1 : 0} to{" "}
                        {Math.min(offset + itemsPerPage, filteredTrips.length)} of{" "}
                        {filteredTrips.length} entries
                      </div>
                    </div>
                    <div className="col-sm-7">
                      <ReactPaginate forcePage={pageCount > 0 ? currentPage : undefined} renderOnZeroPageCount={null}                         previousLabel={"Previous"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* /.box-body */}
            </div>
            {/* /.box */}
          </div>
          {/* col-md-12 */}
        </div>
        {/* /.row */}
      </section>
    </div>
  );
};

export default Triplist;

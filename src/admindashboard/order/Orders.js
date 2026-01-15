import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

const Orders = () => {
  const [list, setList] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [currency, setCurrency] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/orderlist')
      .then(res => {
        setList(res.data);
        setFilteredOrders(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    let filtered = list;
    if (currency) {
      filtered = filtered.filter(order => order.currency === currency);
      console.log(filtered)
    }
    if (pickupDate) {
      filtered = filtered.filter(order => order.pickup_date === pickupDate);
    }
    if (deliveryDate) {
      filtered = filtered.filter(order => order.delivery_date === deliveryDate);
    }
    setFilteredOrders(filtered);
  }, [currency, pickupDate, deliveryDate, list]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };


  const offset = currentPage * itemsPerPage;
  const currentItems = filteredOrders.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className='content-wrapper'>
      <section className="content-header">
        <h1>Manage <small>orders</small></h1>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <Link to={"/createorder"} className="btn btn-primary">Add orders</Link>
            <br /><br />
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Manage Orders</h3>
              </div>
              <div className="box-body">
                <div className="row">
                  <div className="col-md-3">
                    <label>Currency:</label>
                    <select className="form-control" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="">All</option>
                      <option value="CAD">CAD</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label>Pickup Date:</label>
                    <input type="date" className="form-control" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label>Delivery Date:</label>
                    <input type="date" className="form-control" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
                  </div>
                </div>
                <br />
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Company</th>
                      <th>Shipment Type</th>
                      <th>Pickup</th>
                      <th>Delivery</th>
                      <th>Currency</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={index}>
                        <td>{item.customer_orderno}</td>
                        <td>{item.company}</td>
                        <td>{item.shipment_type}</td>
                        <td>{item.pickup_address}</td>
                        <td>{item.delivery_address}</td>
                        <td>{item.currency}</td>
                        <td>
                                <Link
                                  target="_blank"
                                  to={`https://isovia.ca/fms_api/pdf/invoice.php?id=${item.id}`}
                                  className="btn btn-danger btn-sm"
                                >
                                  Confirmation
                                </Link>
                                {item.tmsTriptId&&<Link to={`/tripviewer/${item.tmsTriptId}`} className="btn btn-default btn-xs">
                                  Map
                                </Link>}
                                <Link
                                  target="_blank"
                                  to={`https://isovia.ca/fms_api/pdf/invoice_log.php?id=${item.id}`}
                                  className="btn btn-warning btn-xs"
                                >
                                  Invoice
                                </Link>
                                <Link
                                  to={"/update/"+item.id}
                                  className="btn btn-default btn-sm"
                                >
                                  <i className="fa fa-pencil" />
                                </Link>
                                <Link
                                  to={"/assign/"+item.id}
                                  className="btn btn-success btn-sm"
                                >
                                  Assign
                                </Link>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => console.log('removeFunc', item.id)}
                                  data-toggle="modal"
                                  data-target="#removeModal"
                                >
                                  <i className="fa fa-trash" />
                                </button>
                              </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={'Previous'}
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

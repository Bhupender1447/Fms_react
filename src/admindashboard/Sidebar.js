import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  let navigate = useNavigate();
  const [update, setUpdate] = useState(0);
  const loginData = JSON.parse(localStorage.getItem('logindetail'));

  useEffect(() => {
    const handleMenuClick = (event) => {
      const target = event.currentTarget;
      const dropdownMenu = target.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
      }
    };

    document.querySelectorAll('.dropdown').forEach((item) => {
      item.addEventListener('click', handleMenuClick);
    });

    return () => {
      document.querySelectorAll('.dropdown').forEach((item) => {
        item.removeEventListener('click', handleMenuClick);
      });
    };
  }, []);

  useEffect(() => {
    if (!loginData || (loginData.role !== 'admin' && loginData.role !== 'agent')) {
      navigate('/alllogin');
    }
  }, [update, navigate]);

  const logout = () => {
    setUpdate(update + 1);
    localStorage.removeItem('logindetail');
  };

  return (
    <aside className="main-sidebar">
      <section className="sidebar" style={{ height: 'auto' }}>
        <ul className="sidebar-menu tree" data-widget="tree">
          {/* Dashboard */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-dashboard" /> <span>Dashboard</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/accounting"><i className="fa fa-circle-o" /> Accounting</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/admin"><i className="fa fa-circle-o" /> Control Panel</Link></li>
            </ul>
          </li>

          {/* Live Update Map */}
          <li className="nav-item"><Link className="nav-link" to="/tripsmap"><i className="fa fa-map-marker" /> <span>Live Update Map</span></Link></li>

          {/* Orders */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-file-text-o" /> <span>Orders</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/createorder"><i className="fa fa-circle-o" /> Create Orders</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/orderlist"><i className="fa fa-circle-o" /> Manage Orders</Link></li>
            </ul>
          </li>

          {/* Trips */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-truck" /> <span>Trips</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/createtrips"><i className="fa fa-circle-o" /> Create Trips</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/triplist"><i className="fa fa-circle-o" /> Manage Trips</Link></li>
            </ul>
          </li>

          {/* Dispatch Board */}
          <li className="nav-item"><Link className="nav-link" to="/DispatchBoard"><i className="fa fa-clipboard" /> <span>Dispatch Board / Freight board</span></Link></li>

          {/* Driver */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-user" /> <span>Driver</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/driverpaylist"><i className="fa fa-circle-o" /> Driver pay list</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/driverbulkupload"><i className="fa fa-circle-o" /> Driver Bulk Upload</Link></li>
            </ul>
          </li>

          {/* Truck Bulk Upload */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-truck" /> <span>Truck Bulk Upload</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/truckbulk"><i className="fa fa-circle-o" /> Truck Bulk Upload</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/truckfaults"><i className="fa fa-circle-o" /> Truck Faults</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/truckcompliancechecklist"><i className="fa fa-circle-o" /> Truck Compliance Checklist</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/truckexpirychecklist"><i className="fa fa-circle-o" /> Truck Expiry Checklist</Link></li>
            </ul>
          </li>

          {/* Trailer Bulk Upload */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-truck" /> <span>Trailer Bulk Upload</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/trailerbulk"><i className="fa fa-circle-o" /> Trailer Bulk Upload</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/trailerPerformance"><i className="fa fa-circle-o" /> Trailer Performance</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/addTrailerActivity"><i className="fa fa-circle-o" /> Trailer Location</Link></li>
            </ul>
          </li>

          {/* Owner Fleet Summary */}
          <li className="nav-item"><Link className="nav-link" to="/ownerfleetsummary"><i className="fa fa-users" /> <span>Owner operator Fleet Summary</span></Link></li>

          {/* Accounting */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-money" /> <span>Accounting</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/accountspayablereceivablelist"><i className="fa fa-circle-o" /> Accounts Receivable</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/accountspayablereceivablelist"><i className="fa fa-circle-o" /> Accounts Payable</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/revenuerxpenseslist"><i className="fa fa-circle-o" /> income and expense account</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/accounting"><i className="fa fa-circle-o" /> Balance Sheet</Link></li>
            </ul>
          </li>

          {/* Payroll */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-credit-card" /> <span>Payroll</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/driverpaylist"><i className="fa fa-circle-o" /> Driver Payroll</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/agentpaylist"><i className="fa fa-circle-o" /> Agent Payroll</Link></li>
            </ul>
          </li>

          {/* Carriers */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-ship" /> <span>Carriers</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/carriers"><i className="fa fa-circle-o" /> Carriers</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/carriers/updateupload"><i className="fa fa-circle-o" /> Carriers Upload</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/carriers/autosuspend"><i className="fa fa-circle-o" /> Carriers Autosuspend</Link></li>
            </ul>
          </li>

          {/* eManifest Portal */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-globe" /> <span>eManifest Portal</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/custompage"><i className="fa fa-circle-o" /> Custom Paperwork</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/listcoversheet"><i className="fa fa-circle-o" /> list cover sheet</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/borderconnect/acetripform"><i className="fa fa-circle-o" /> Border Connect ACE</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/borderconnect/acitripform"><i className="fa fa-circle-o" /> Border Connect ACI</Link></li>
            </ul>
          </li>

          {/* ELD */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-clock-o" /> <span>ELD</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/gomotive/vehicletable"><i className="fa fa-circle-o" /> Go Motive Data</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/samsara/samsarausers"><i className="fa fa-circle-o" /> Samsara Data</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/driverdutynotification"><i className="fa fa-circle-o" /> Driver Duty Notification</Link></li>
            </ul>
          </li>

          {/* Invoices */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" /> <span>Invoices</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/invoices"><i className="fa fa-circle-o" /> Paid Invoices</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/invoices"><i className="fa fa-circle-o" /> Pending Invoice</Link></li>
            </ul>
          </li>

          {/* Reports */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-bar-chart" /> <span>Reports</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/iftalist"><i className="fa fa-circle-o" /> IFTA</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/ocrexpensestable"><i className="fa fa-circle-o" /> Ocr Expenses Table</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/netincometable"><i className="fa fa-circle-o" /> Net Income by Location</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/financeManager"><i className="fa fa-circle-o" /> financeManager</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/getOrderincome"><i className="fa fa-circle-o" /> Order Income</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/ordertripIncome"><i className="fa fa-circle-o" /> Order Trip Income</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/getexpense"><i className="fa fa-circle-o" /> Expense</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/gettripIncome"><i className="fa fa-circle-o" /> Trip Income</Link></li>
            </ul>
          </li>

          {/* Trip/Order History */}
          <li className="nav-item"><Link className="nav-link" to="/orderhistory"><i className="fa fa-history" /> <span>Trip/Order History</span></Link></li>

          {/* Profile */}
          <li className="nav-item dropdown">
            <Link to="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-user-circle" /> <span>Profile</span>
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item"><Link className="dropdown-item" to="/users/setting"><i className="fa fa-wrench" /> Settings</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/configurations"><i className="fa fa-cog" /> Configurations</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/agentlist"><i className="fa fa-users" /> Agents</Link></li>
              <li className="nav-item"><Link className="dropdown-item" to="/admin"><i className="fa fa-dashboard" /> Control Panel</Link></li>
            </ul>
          </li>

          {/* Logout */}
          <li className="nav-item">
            <Link className="nav-link" onClick={logout} style={{ cursor: 'pointer' }}>
              <i className="glyphicon glyphicon-log-out" /> <span>Logout</span>
            </Link>
          </li>
        </ul>
      </section>
    </aside>
  );
};

export default Sidebar;

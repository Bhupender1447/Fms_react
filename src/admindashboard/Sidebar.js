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
      navigate('/login');
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
          <li className="dropdown" id="dashboardMainMenu">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-dashboard" /> <span>Dashboard</span>
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li><Link to="/accounting"><i className="fa fa-circle-o" /> Accounting</Link></li>
              <li><Link to="/admin"><i className="fa fa-circle-o" /> Control Panel</Link></li>
            </ul>
          </li>
          <li><Link to="/driverpaylist"><i className="fa fa-user" /> <span>Driver pay list</span></Link></li>
          <li><Link to="/financeManager"><i className="fa fa-user" /> <span>financeManager</span></Link></li>
          <li><Link to="/getOrderincome"><i className="fa fa-user" /> <span>Order Income</span></Link></li>
          <li><Link to="/ordertripIncome"><i className="fa fa-user" /> <span>Order Trip Income</span></Link></li>
          <li><Link to="/expense"><i className="fa fa-user" /> <span>Expense</span></Link></li>
              <li><Link to="/netincometable"><i className="fa fa-user" /> <span>Net Income by Location</span></Link></li>
          <li><Link to="/tripsmap"><i className="fa fa-circle-o" /> Live Update Map</Link></li>
          <li><Link to={'/DispatchBoard'}><i className="fa fa-circle-o" />Dispatch Board /<br/> Freight board </Link></li>
          <li id="iftaMenu">
            <Link to="/ifta">
              <i className="fa fa-file-text" /> <span>IFTA eManifest Portal</span>
            </Link>
          </li>
         
          <li className="dropdown" id="InvoiceMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Invoices</span>
        
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li id="manageInvoiceSubMenu">
                <Link to={'/invoices'}>
                  <i className="fa fa-circle-o" /> Manage Invoices
                </Link>
              </li>
            </ul>
          </li>
          <li className="dropdown" id="InvoiceMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Go Motive Data</span>
        
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li id="manageInvoiceSubMenu">
                <Link to={'/gomotive/vehicletable'}>
                  <i className="fa fa-circle-o" /> Manage Vehicle Data
                </Link>
              </li>
              <li id="manageInvoiceSubMenu">
                <Link to={'/gomotive/gomotiveusers'}>
                  <i className="fa fa-circle-o" /> Manage Driver Behavior
                </Link>
              </li>
              <li id="manageInvoiceSubMenu">
                <Link to={'/gomotive/logtable'}>
                  <i className="fa fa-circle-o" /> Manage Log Table
                </Link>
              </li>
            </ul>
          </li>
          <li className="dropdown" id="InvoiceMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Samsara Data</span>
        
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              {/* <li id="manageInvoiceSubMenu">
                <Link to={'/gomotive/vehicletable'}>
                  <i className="fa fa-circle-o" /> Manage Vehicle Data
                </Link>
              </li> */}
              <li id="manageInvoiceSubMenu">
                <Link to={'/samsara/samsarausers'}>
                  <i className="fa fa-circle-o" /> Manage Driver Behavior
                </Link>
              </li>
              {/* <li id="manageInvoiceSubMenu">
                <Link to={'/gomotive/logtable'}>
                  <i className="fa fa-circle-o" /> Manage Log Table
                </Link>
              </li> */}
            </ul>
          </li>

          {/* Agents */}
          <li className="dropdown" id="agentMainMenu">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-user" /> <span>Agents</span>
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li><Link to="/createagent"><i className="fa fa-circle-o" /> Create Agent</Link></li>
              <li><Link to="/agentlist"><i className="fa fa-circle-o" /> Agent List</Link></li>
            </ul>
          </li>

          {/* Orders */}
          <li className="dropdown" id="OrderMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" /> <span>Orders</span>
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li><Link to="/createorder"><i className="fa fa-circle-o" /> Create Orders</Link></li>
              <li><Link to="/orderlist"><i className="fa fa-circle-o" /> Manage Orders</Link></li>
            </ul>
          </li>

          {/* Trips */}
          <li className="dropdown" id="TripMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-map" /> <span>Trips</span>
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li><Link to="/tripsmap"><i className="fa fa-circle-o" /> Live Update Map</Link></li>
              <li><Link to="/createtrips"><i className="fa fa-circle-o" /> Create Trips</Link></li>
              <li><Link to="/triplist"><i className="fa fa-circle-o" /> Manage Trips</Link></li>
            </ul>
          </li>
                        <li><Link to="/driverdutynotification"><i className="fa fa-user" /> <span>Driver Duty Notification</span></Link></li>

          {/* Reports */}
          <li className="dropdown" id="ReportMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" /> <span>Reports</span>
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li><a href="#"><i className="fa fa-circle-o" /> Product Wise</a></li>
              <li><a href="#"><i className="fa fa-circle-o" /> Total Store Wise</a></li>
            </ul>
          </li>

          {/* Configurations & Profile */}
          {loginData?.role === 'admin' && (
            <>
              <li><Link to="/profile"><i className="fa fa-user" /> <span>Profile</span></Link></li>

              
              <li><Link to="/users/setting"><i className="fa fa-wrench" /> <span>Settings</span></Link></li>
              <li><Link to="/configurations"><i className="fa fa-cog" /> <span>Configurations</span></Link></li>
              <li><Link to="/orderhistory"><i className="fa fa-history" /> <span>Order History</span></Link></li>
            </>
          )}

          {/* Logout */}
          <li>
            <a onClick={logout}><i className="glyphicon glyphicon-log-out" /> <span>Logout</span></a>
          </li>
        </ul>
      </section>
    </aside>
  );
};

export default Sidebar;

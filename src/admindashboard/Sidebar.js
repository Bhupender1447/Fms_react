import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  let navigate = useNavigate();
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    const handleMenuClick = (event) => {
      const target = event.currentTarget;
      const dropdownMenu = target.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
      }
    };

    const attachEventListeners = () => {
      document.querySelectorAll('.dropdown').forEach((item) => {
        item.addEventListener('click', handleMenuClick);
      });
    };

    const detachEventListeners = () => {
      document.querySelectorAll('.dropdown').forEach((item) => {
        item.removeEventListener('click', handleMenuClick);
      });
    };

    attachEventListeners();

    return () => {
      detachEventListeners();
    };
  }, []);

  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem('logindetail'));

    if (loginData && loginData.role === 'admin') {
      // User is admin
    } else {
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
          
          <li id="dashboardMainMenu">
            <Link to="/admin">
              <i className="fa fa-dashboard" /> <span>Control Panel</span>
            </Link>
          </li>
          <li id="dashboardMainMenu">
            <Link to="/createagent">
              <i className="fa fa-user" /> <span>Create  Agent</span>
            </Link>
          </li>
          <li id="dashboardMainMenu">
            <Link to="/agentlist">
              <i className="fa fa-user" /> <span> Agent List</span>
            </Link>
          </li>

          <li className="dropdown" id="OrderMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Orders</span>
     
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li id="createOrderSubMenu">
                <Link to={'/createorder'}>
                  <i className="fa fa-circle-o" /> Create Orders
                </Link>
              </li>
              <li id="manageOrderSubMenu">
                <Link to={'/orderlist'}>
                  <i className="fa fa-circle-o" /> Manage Orders
                </Link>
              </li>
            </ul>
          </li>
          <li className="dropdown" id="TripMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Trips</span>
        
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li id="createTripSubMenu">
                <Link to={'/createtrips'}>
                  <i className="fa fa-circle-o" /> Create Trips
                </Link>
              </li>
              <li id="manageTripSubMenu">
                <Link to={'/triplist'}>
                  <i className="fa fa-circle-o" /> Manage Trips
                </Link>
              </li>
            </ul>
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
          <li className="dropdown" id="ReportMainNav">
            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Reports</span>
     
            </a>
            <ul className="dropdown-menu bg-dark text-light">
              <li id="productReportSubMenu">
                <a href="#">
                  <i className="fa fa-circle-o" /> Product Wise
                </a>
              </li>
              <li id="storeReportSubMenu">
                <a href="#">
                  <i className="fa fa-circle-o" /> Total Store wise
                </a>
              </li>
            </ul>
          </li>
            <li id="companyMainNav">
              <a href="#">
                <i className="fa fa-files-o" /> <span>Company Info</span>
              </a>
            </li>
          <li id="profileMainNav">
            <Link to={"/profile"}>
              <i className="fa fa-files-o" /> <span>Profile</span>
            </Link>
          </li>
          <li id="settingMainNav">
            <Link to="/users/setting">
              <i className="fa fa-wrench" /> <span>Settings</span>
            </Link>
          </li>
          <li id="settingMainNav">
            <a href="#">
              <i className="fa fa-circle-o" />
              Configurations
            </a>
          </li>
          <li>
            <a onClick={logout}>
              <i className="glyphicon glyphicon-log-out" /> <span>Logout</span>
            </a>
          </li>
        </ul>
      </section>
    </aside>
  );
};

export default Sidebar;

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  let navigate = useNavigate();
  const[update,setupdate]=useState(0)
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
  }, [])

useEffect(()=>{
 // Check if login data exists in local storage
 const loginData = JSON.parse(localStorage.getItem("logindetail"));

 if (loginData&&loginData.role=='agent') {
   
 } else {
     // No data, redirect to login page
     navigate('/login');
 }
},[update])


let logout=()=>{
  setupdate(update+1)
  localStorage.removeItem('logindetail')

}
  return (
<aside className="main-sidebar">
  {/* sidebar: style can be found in sidebar.less */}
  <section className="sidebar" style={{ height: "auto" }}>
    {/* sidebar menu: : style can be found in sidebar.less */}
    <ul className="sidebar-menu tree" data-widget="tree">
      {/*
  <li id="dashboardMainMenu">
    <a href="/dashboard">
      <i class="fa fa-dashboard"></i> <span>Dashboard</span>
    </a>
  </li>
  */}
       {/* <li id="manageOrderSubMenu">
            <Link to={'/drivertrip'}>
              <i className="fa fa-circle-o" /> Manage Orders
            </Link>
          </li> */}
           <li id="dashboardMainMenu">
            <Link to="/accounting">
              <i className="fa fa-dashboard" /> <span>Dashboard</span>
            </Link>
          </li>
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
       <li id="manageOrderSubMenu">
            <Link to={'/agentorder'}>
              <i className="fa fa-circle-o" /> Orders 
            </Link>
          </li>
       <li id="manageOrderSubMenu">
            <Link to={'/agentincome'}>
              <i className="fa fa-circle-o" /> Income 
            </Link>
          </li>
          <li>
        <a onClick={logout}>
          <i className="glyphicon glyphicon-log-out" /> <span>Logout</span>
        </a>
      </li>
    </ul>

  </section>
  {/* /.sidebar */}
</aside>


  )
}

export default Sidebar
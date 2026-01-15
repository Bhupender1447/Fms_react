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

 // eslint-disable-next-line eqeqeq
 if (loginData&&loginData.role=='agent') {
   
 } else {
     // No data, redirect to login page
     navigate('/login');
 }
},[navigate, update])


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
  <li className="nav-item" id="dashboardMainMenu">
    <Link to="/dashboard">
      <i class="fa fa-dashboard"></i> <span>Dashboard</span>
    </Link>
  </li>
  */}
       {/* <li className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/drivertrip'}>
              <i className="fa fa-circle-o" /> Manage Orders
            </Link>
          </li> */}
           <li className="nav-item" id="dashboardMainMenu">
            <Link className="dropdown-item"  to="/accounting">
              <i className="fa fa-dashboard" /> <span>Dashboard</span>
            </Link>
          </li>
          <li className="nav-item" id="dashboardMainMenu">
            <Link className="dropdown-item"  to="/admin">
              <i className="fa fa-dashboard" /> <span>Control Panel</span>
            </Link>
          </li>
          <li className="nav-item" id="dashboardMainMenu">
            <Link className="dropdown-item"  to="/createagent">
              <i className="fa fa-user" /> <span>Create  Agent</span>
            </Link>
          </li>
                 <li><Link className="dropdown-item"  to="/agentgetOrderincome"><i className="fa fa-user" /> <span>Order Income</span></Link></li>
                    <li><Link className="dropdown-item"  to="/agentordertripIncome"><i className="fa fa-user" /> <span>Order Trip Income</span></Link></li>
                    <li><Link className="dropdown-item"  to="/agentexpense"><i className="fa fa-user" /> <span>Expense</span></Link></li>
                    <li><Link className="dropdown-item"  to="/gettripIncome"><i className="fa fa-user" /> <span>Trip Income</span></Link></li>
          <li className="nav-item" id="dashboardMainMenu">
            <Link className="dropdown-item"  to="/agentlist">
              <i className="fa fa-user" /> <span> Agent List</span>
            </Link>
          </li>

          <li className="nav-item dropdown"  id="OrderMainNav">
            <Link to="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Orders</span>
     
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item" id="createOrderSubMenu">
                <Link className="dropdown-item"  to={'/createorder'}>
                  <i className="fa fa-circle-o" /> Create Orders
                </Link>
              </li>
              <li className="nav-item" id="manageOrderSubMenu">
                <Link className="dropdown-item"  to={'/orderlist'}>
                  <i className="fa fa-circle-o" /> Manage Orders
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown"  id="TripMainNav">
            <Link to="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Trips</span>
        
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item" id="createTripSubMenu">
                <Link className="dropdown-item"  to={'/createtrips'}>
                  <i className="fa fa-circle-o" /> Create Trips
                </Link>
              </li>
              <li className="nav-item" id="manageTripSubMenu">
                <Link className="dropdown-item"  to={'/triplist'}>
                  <i className="fa fa-circle-o" /> Manage Trips
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown"  id="InvoiceMainNav">
            <Link to="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Invoices</span>
        
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item" id="manageInvoiceSubMenu">
                <Link className="dropdown-item"  to={'/invoices'}>
                  <i className="fa fa-circle-o" /> Manage Invoices
                </Link>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown"  id="ReportMainNav">
            <Link to="#" className="dropdown-toggle" data-toggle="dropdown">
              <i className="fa fa-files-o" />
              <span>Reports</span>
     
            </Link>
            <ul className="dropdown-menu bg-dark text-light">
              <li className="nav-item" id="productReportSubMenu">
                <Link to="#">
                  <i className="fa fa-circle-o" /> Product Wise
                </Link>
              </li>
              <li className="nav-item" id="storeReportSubMenu">
                <Link to="#">
                  <i className="fa fa-circle-o" /> Total Store wise
                </Link>
              </li>
            </ul>
          </li>
       <li className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/agentorder'}>
              <i className="fa fa-circle-o" /> Orders 
            </Link>
          </li>
       <li className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/agentincome'}>
              <i className="fa fa-circle-o" /> Income 
            </Link>
          </li>
          <li>
        <Link onClick={logout}>
          <i className="glyphicon glyphicon-log-out" /> <span>Logout</span>
        </Link>
      </li>
    </ul>

  </section>
  {/* /.sidebar */}
</aside>


  )
}

export default Sidebar
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  let navigate = useNavigate();
  const[update,setupdate]=useState(0)

useEffect(()=>{
 // Check if login data exists in local storage
 const loginData = localStorage.getItem("logindetail");

 if (loginData) {
   
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
    <a href="http://localhost/fms/dashboard">
      <i class="fa fa-dashboard"></i> <span>Dashboard</span>
    </a>
  </li>
  */}
      <li id="dashboardMainMenu">
        <a href="http://localhost/fms/cpanel">
          <i className="fa fa-dashboard" /> <span>Control Panel</span>
        </a>
      </li>
      {/* <li class="header">Settings</li> */}
      <li className="treeview" id="OrderMainNav">
        <a href="#">
          <i className="fa fa-files-o" />
          <span>Orders</span>
          <span className="pull-right-container">
            <i className="fa fa-angle-left pull-right" />
          </span>
        </a>
        <ul className="treeview-menu">
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
      <li className="treeview" id="OrderMainNav">
        <a href="#">
          <i className="fa fa-files-o" />
          <span>Trips</span>
          <span className="pull-right-container">
            <i className="fa fa-angle-left pull-right" />
          </span>
        </a>
        <ul className="treeview-menu">
          <li id="createOrderSubMenu">
            <Link to={'/createtrips'}>
              <i className="fa fa-circle-o" /> Create Trips
            </Link>
          </li>
          <li id="manageOrderSubMenu">
            <Link to={'/triplist'}>
              <i className="fa fa-circle-o" /> Manage Trips
            </Link>
          </li>
        </ul>
      </li>
      <li className="treeview" id="OrderMainNav">
      <a href='#'>
          <i className="fa fa-files-o" />
          <span>Invoices</span>
          <span className="pull-right-container">
            <i className="fa fa-angle-left pull-right" />
          </span>
        </a>
        <ul className="treeview-menu">
          <li id="manageOrderSubMenu">
          <Link to={'/invoices'}>
              <i className="fa fa-circle-o" /> Manage Invoices
              </Link>
          </li>
        </ul>
      </li>
      <li className="treeview" id="ReportMainNav">
        <a href="#">
          <i className="fa fa-files-o" />
          <span>Reports</span>
          <span className="pull-right-container">
            <i className="fa fa-angle-left pull-right" />
          </span>
        </a>
        <ul className="treeview-menu">
          <li id="productReportSubMenu">
            <a href="http://localhost/fms/reports">
              <i className="fa fa-circle-o" /> Product Wise
            </a>
          </li>
          <li id="storeReportSubMenu">
            <a href="http://localhost/fms/reports/storewise">
              <i className="fa fa-circle-o" /> Total Store wise
            </a>
          </li>
        </ul>
      </li>
      <li id="companyMainNav">
        <a href="http://localhost/fms/company/">
          <i className="fa fa-files-o" /> <span>Company Info</span>
        </a>
      </li>
      <li id="profileMainNav">
        <Link to={"/profile"}>
          <i className="fa fa-files-o" /> <span>Profile</span>
        </Link>
      </li>
      <li id="settingMainNav">
        <a href="http://localhost/fms/users/setting/">
          <i className="fa fa-wrench" /> <span>Settings</span>
        </a>
      </li>
      <li id="settingMainNav">
        <a href="http://localhost/fms/parms/update">
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
  {/* /.sidebar */}
</aside>


  )
}

export default Sidebar
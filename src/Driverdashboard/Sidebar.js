import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  let navigate = useNavigate();
  const[update,setupdate]=useState(0)

useEffect(()=>{
 // Check if login data exists in local storage
 const loginData = JSON.parse(localStorage.getItem("logindetail"));

 // eslint-disable-next-line eqeqeq
 if (loginData&&loginData.role=='driver') {
   
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
  <li  className="nav-item" id="dashboardMainMenu">
    <Link to="/dashboard">
      <i class="fa fa-dashboard"></i> <span>Dashboard</span>
    </Link>
  </li>
  */}
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/drivertrip'}>
              <i className="fa fa-circle-o" /> Manage Orders
            </Link>
          </li>
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/driverincome'}>
              <i className="fa fa-circle-o" /> Income 
            </Link>
          </li>
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/startduty'}>
              <i className="fa fa-circle-o" /> start duty 
            </Link>
          </li>
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/stopduty'}>
              <i className="fa fa-circle-o" /> stop duty
            </Link>
          </li>
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/dutylist'}>
              <i className="fa fa-circle-o" />Dutylist
            </Link>
          </li>
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/logs'}>
              <i className="fa fa-circle-o" />Logs
            </Link>
          </li>
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/expense'}>
              <i className="fa fa-circle-o" />Expense
            </Link>
          </li>
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/livelocation'}>
              <i className="fa fa-circle-o" />livelocation
            </Link>
          </li>
       <li  className="nav-item" id="manageOrderSubMenu">
            <Link className="dropdown-item"  to={'/drivercustompaper'}>
              <i className="fa fa-circle-o" />drivercustompaper
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
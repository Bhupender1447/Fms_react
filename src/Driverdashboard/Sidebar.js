import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Sidebar = () => {
  let navigate = useNavigate();
  const[update,setupdate]=useState(0)

useEffect(()=>{
 // Check if login data exists in local storage
 const loginData = JSON.parse(localStorage.getItem("logindetail"));

 if (loginData&&loginData.role=='driver') {
   
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
       <li id="manageOrderSubMenu">
            <Link to={'/drivertrip'}>
              <i className="fa fa-circle-o" /> Manage Orders
            </Link>
          </li>
       <li id="manageOrderSubMenu">
            <Link to={'/driverincome'}>
              <i className="fa fa-circle-o" /> Income 
            </Link>
          </li>
       <li id="manageOrderSubMenu">
            <Link to={'/startduty'}>
              <i className="fa fa-circle-o" /> start duty 
            </Link>
          </li>
       <li id="manageOrderSubMenu">
            <Link to={'/stopduty'}>
              <i className="fa fa-circle-o" /> stop duty
            </Link>
          </li>
       <li id="manageOrderSubMenu">
            <Link to={'/dutylist'}>
              <i className="fa fa-circle-o" />Dutylist
            </Link>
          </li>
       <li id="manageOrderSubMenu">
            <Link to={'/logs'}>
              <i className="fa fa-circle-o" />Logs
            </Link>
          </li>
       <li id="manageOrderSubMenu">
            <Link to={'/expense'}>
              <i className="fa fa-circle-o" />Expense
            </Link>
          </li>
       <li id="manageOrderSubMenu">
            <Link to={'/livelocation'}>
              <i className="fa fa-circle-o" />livelocation
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
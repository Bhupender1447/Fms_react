import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import { Link } from 'react-router-dom';

const Driverheader = () => {
  useEffect(() => {
    const handleMenuClick = (event) => {
      const target = event.currentTarget; 
      console.log(target)
      if (target.classList.contains('treeview')) {
        target.classList.toggle('menu-open');
      }
    };

    document.querySelectorAll('.treeview').forEach((item) => {
      item.addEventListener('click', handleMenuClick);
    });

    return () => {
      document.querySelectorAll('.treeview').forEach((item) => {
        item.removeEventListener('click', handleMenuClick);
      });
    };
  }, []);

  return (<>
<header className="main-header">
  {/* Logo */}
  <Link to="/admin" className="logo">
    {/* mini logo for sidebar mini 50x50 pixels */}
    <span className="logo-mini">
      <b>ADN</b>
    </span>
    {/* logo for regular state and mobile devices */}
    <span className="logo-lg">
      <b>Driver Dashboard</b>
    </span>
  </Link>
  {/* Header Navbar: style can be found in header.less */}
  <nav className="navbar navbar-static-top">
    {/* Sidebar toggle button*/}
    <a
      href="#"
      className="sidebar-toggle"
      data-toggle="push-menu"
      role="button"
    >
      <span className="sr-only">Toggle navigation</span>
    </a>
  </nav>
</header>

<Sidebar/>
</>
  )
}

export default Driverheader
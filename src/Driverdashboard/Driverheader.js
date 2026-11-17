import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiChevronRight, FiMapPin, FiWifi, FiWifiOff } from 'react-icons/fi';
import Sidebar from './Sidebar';
import AutoLiveLocationSender from './dutystatus/AutoLiveLocationSender';
import AdminLayout from '../AdminLayout';
import './driver-portal.css';

const titles = {
  '/driverdashboard': 'Overview', '/drivertrip': 'Assigned trips', '/driverincome': 'My income',
  '/driver/eld': 'ELD & HOS', '/logs': 'Daily logbook', '/expense': 'Expenses', '/livelocation': 'Location',
  '/drivercustompaper': 'Documents', '/startduty': 'Start duty', '/stopduty': 'End duty', '/dutylist': 'Duty history',
};

export default function Driverheader() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  let identity = {};
  try { identity = JSON.parse(localStorage.getItem('logindetail') || '{}') || {}; } catch { /* The navigation guard handles an invalid login. */ }
  const name = identity.name || 'Driver';
  const initials = name.split(/[\s_]+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    const escape = event => { if (event.key === 'Escape') closeMenu(); };
    window.addEventListener('online', update); window.addEventListener('offline', update);
    window.addEventListener('keydown', escape);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); window.removeEventListener('keydown', escape); };
  }, [closeMenu]);

  return <div className="driver-shell">
    <AdminLayout />
    <a className="driver-skip-link" href="#driver-main">Skip to content</a>
    <Sidebar open={menuOpen} onClose={closeMenu} />
    {menuOpen && <button className="driver-nav-scrim" onClick={closeMenu} aria-label="Close navigation overlay" />}
    <header className="driver-topbar">
      <div className="driver-topbar-start"><button className="driver-mobile-menu driver-icon-button" aria-expanded={menuOpen} aria-controls="driver-navigation" onClick={() => setMenuOpen(value => !value)} aria-label="Open navigation"><FiMenu /></button>
        <div className="driver-breadcrumb"><Link to="/driverdashboard">Workspace</Link><FiChevronRight aria-hidden="true" /><span>{titles[pathname] || 'Trip workspace'}</span></div>
      </div>
      <div className="driver-topbar-actions">
        <span className={`driver-device-status${online ? '' : ' is-offline'}`}>{online ? <FiWifi /> : <FiWifiOff />}<span>{online ? 'Device online' : 'Device offline'}</span></span>
        <details className="driver-location"><summary><FiMapPin /><span>Location sharing</span></summary><div className="driver-location-panel"><AutoLiveLocationSender /></div></details>
        <div className="driver-user"><span className="driver-avatar">{initials}</span><span className="driver-user-name">{name}<small>Driver</small></span></div>
      </div>
    </header>
  </div>;
}
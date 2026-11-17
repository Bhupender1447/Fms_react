import React, { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiTruck, FiClock, FiFileText, FiMapPin, FiCreditCard, FiLogOut, FiArrowUpRight, FiX } from 'react-icons/fi';
import { BASE_URL } from '../config';

const groups = [
  { label: 'Workspace', items: [
    ['/driverdashboard', 'Overview', FiGrid], ['/drivertrip', 'Assigned trips', FiTruck],
    ['/driver/eld', 'ELD & HOS', FiClock], ['/drivercustompaper', 'Documents', FiFileText],
    ['/livelocation', 'Location', FiMapPin],
  ] },
  { label: 'Money', items: [['/driverincome', 'My income', FiCreditCard], ['/expense', 'Expenses', FiArrowUpRight]] },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    let identity;
    try { identity = JSON.parse(localStorage.getItem('logindetail') || 'null'); } catch { identity = null; }
    if (identity?.role !== 'driver') navigate('/driver-login', { replace: true });
  }, [navigate]);
  useEffect(() => { onClose(); }, [location.pathname, onClose]);

  async function logout() {
    setLeaving(true);
    try { await fetch(`${BASE_URL}api/logout`, { credentials: 'include' }); }
    catch { /* Browser identity is cleared even when the network is unavailable. */ }
    finally {
      localStorage.removeItem('logindetail');
      localStorage.removeItem('hasJustLoggedIn');
      navigate('/driver-login', { replace: true });
    }
  }

  return <aside className={`driver-sidebar${open ? ' is-open' : ''}`} id="driver-navigation" aria-label="Driver navigation">
    <div className="driver-brand-row"><NavLink to="/driverdashboard" className="driver-brand">isovia<span>DRIVER</span></NavLink>
      <button className="driver-menu-close driver-icon-button" onClick={onClose} aria-label="Close navigation"><FiX /></button>
    </div>
    <div className="driver-workspace-label"><span className="driver-workspace-mark"><FiTruck /></span><div>Driver workspace<small>Your work on the road</small></div></div>
    <nav>{groups.map(group => <div className="driver-nav-group" key={group.label}>
      <p>{group.label}</p><ul>{group.items.map(([to, label, Icon]) => <li key={to}>
        <NavLink to={to} className={({ isActive }) => `driver-nav-link${isActive ? ' is-active' : ''}`}><Icon aria-hidden="true" /><span>{label}</span></NavLink>
      </li>)}</ul>
    </div>)}</nav>
    <div className="driver-sidebar-footer"><span className="driver-sidebar-monogram">i</span><span>Isovia IFM<small>Driver portal</small></span>
      <button onClick={logout} disabled={leaving} className="driver-icon-button" aria-label="Sign out"><FiLogOut /></button>
    </div>
  </aside>;
}
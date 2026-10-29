import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import './sidebar.css';

const sections = [
  { title: 'Workspace', items: [
    { label: 'Control Panel', icon: 'dashboard', to: '/admin' },
    { label: 'Email & Messaging', icon: 'envelope-o', to: '/workspace/email' },
  ] },
  { title: 'Dispatch & Operations', items: [
    { label: 'Loadboard', icon: 'exchange', to: '/loadboard', links: [
      ['Load Board', '/loadboard'], ['Ratex Index', '/loadboard/ratex-index'],
    ] },
    { label: 'Orders', icon: 'file-text-o', links: [['Manage Orders', '/orderlist'], ['Create Orders', '/createorder']] },
    { label: 'Trips', icon: 'truck', links: [['Manage Trips', '/triplist'], ['Create Trips', '/createtrips']] },
    { label: 'Route', icon: 'road', links: [['Manage Routes', '/routes/manage'], ['Create Route', '/routes/create']] },
    { label: 'Live Update Map', icon: 'map-marker', to: '/tripsmap' },
    { label: 'Trip/Order History', icon: 'history', to: '/orderhistory' },
  ] },
  { title: 'Fleet & Partners', items: [
    { label: 'Driver', icon: 'user', to: '/drivers', links: [
      ['Driver Command Center', '/drivers'], ['Driver Listing', '/drivers/listing'],
      ['Driver Bulk Upload', '/driverbulkupload'], ['Driver pay list', '/driverpaylist'],
    ] },
    { label: 'Trucks', icon: 'truck', links: [
      ['Truck Bulk Upload', '/truckbulk'], ['Truck Faults', '/truckfaults'],
      ['Truck Compliance Checklist', '/truckcompliancechecklist'], ['Truck Expiry Checklist', '/truckexpirychecklist'],
    ] },
    { label: 'Trailers', icon: 'truck', links: [
      ['Trailer Bulk Upload', '/trailerbulk'], ['Trailer Performance', '/trailerPerformance'], ['Trailer Location', '/addTrailerActivity'],
    ] },
    { label: 'Owner Operator Fleet Summary', icon: 'users', to: '/ownerfleetsummary' },
    { label: 'Carriers', icon: 'ship', links: [
      ['Carriers', '/carriers'], ['Carriers Upload', '/carriers/updateupload'], ['Carriers Autosuspend', '/carriers/autosuspend'],
    ] },
  ] },
  { title: 'Documents & Customs', items: [
    { label: 'eManifest Portal', icon: 'globe', links: [
      ['Custom Paperwork', '/custompage'], ['Customs Manifest Review', '/customs/review'],
      ['Cover Sheets', '/listcoversheet'], ['Border Connect ACE', '/borderconnect/acetripform'],
      ['Border Connect ACI', '/borderconnect/acitripform'],
    ] },
  ] },
  { title: 'Finance & Reporting', items: [
    { label: 'Invoices', icon: 'files-o', to: '/invoices', links: [
      ['All Invoices', '/invoices'], ['Draft Invoices', '/invoices?status=draft'],
      ['Pending Invoices', '/invoices?status=pending'], ['Overdue Invoices', '/invoices?status=overdue'],
      ['Paid Invoices', '/invoices?status=paid'], ['Credit Notes', '/invoices?status=credit_notes'],
    ] },
    { label: 'Accounting', icon: 'money', links: [
      ['Accounting Overview', '/accounting'], ['Accounts Receivable', '/accountspayablereceivablelist'],
      ['Accounts Payable', '/accountspayablereceivablelist'], ['Income & Expense Account', '/revenuerxpenseslist'],
      ['Balance Sheet', '/accounting'],
    ] },
    { label: 'Payroll', icon: 'credit-card', links: [['Driver Payroll', '/driverpaylist'], ['Agent Payroll', '/agentpaylist']] },
    { label: 'Reports', icon: 'bar-chart', links: [
      ['Order Income', '/getOrderincome'], ['Trip Income', '/gettripIncome'], ['Order Trip Income', '/ordertripIncome'],
      ['Expenses', '/getexpense'], ['OCR Expenses', '/ocrexpensestable'], ['Net Income by Location', '/netincometable'],
      ['Finance Manager', '/financeManager'], ['IFTA', '/iftalist'],
    ] },
  ] },
  { title: 'Safety & Intelligence', items: [
    { label: 'SIS Connections', icon: 'link', to: '/sis/connections' },
    { label: 'SIS Evidence Review', icon: 'search', to: '/sis/review' },
    { label: 'Native ELD Lab', icon: 'microchip', to: '/sis/native-eld' },
    { label: 'World Model', icon: 'cubes', to: '/sis/world-model' },
    { label: 'SIS Safety', icon: 'shield', to: '/sis/safety' },
    { label: 'SIS Driver Onboarding', icon: 'user-plus', to: '/sis/driver-onboarding' },
    { label: 'ELD', icon: 'clock-o', links: [
      ['Driver & Truck HOS Links', '/hos-fleet'], ['Driver Duty Notification', '/driverdutynotification'],
      ['Company HOS Settings', '/hos/company-settings'],
      ['Go Motive Data', '/gomotive/vehicletable'], ['Samsara Data', '/samsara/samsarausers'],
    ] },
  ] },
  { title: 'Administration', items: [
    { label: 'Profile', icon: 'user-circle', links: [
      ['Settings', '/users/setting'], ['Configurations', '/configurations'], ['Agents', '/agentlist'],
    ] },
  ] },
];

function isCurrent(to, pathname, search) {
  const [targetPath, targetSearch = ''] = to.split('?');
  return (targetPath === pathname || (targetPath === '/workspace/email' && pathname.startsWith('/workspace/email/'))) && (pathname !== '/invoices'
    || (new URLSearchParams(targetSearch).get('status') || 'all') === (new URLSearchParams(search).get('status') || 'all'));
}

function itemIsCurrent(item, pathname, search) {
  return Boolean((item.to && isCurrent(item.to, pathname, search))
    || item.links?.some(([, to]) => isCurrent(to, pathname, search)));
}

function SidebarItem({ item, pathname, search }) {
  const routeKey = `${pathname}${search}`;
  const active = itemIsCurrent(item, pathname, search);
  const [disclosure, setDisclosure] = useState(null);
  // A manual toggle applies on this route only; navigation reveals its group.
  const expanded = disclosure?.routeKey === routeKey ? disclosure.expanded : Boolean(active);
  const menuId = `ifm-menu-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const toggle = () => setDisclosure({ routeKey, expanded: !expanded });
  const label = <><i className={`fa fa-${item.icon}`} aria-hidden="true" /><span className="ifm-sidebar-label">{item.label}</span></>;
  return <li className={`nav-item ifm-sidebar-item${active ? ' active' : ''}`}>
    <div className="ifm-sidebar-row">
      {item.to ? <Link to={item.to} className="ifm-sidebar-link" aria-current={isCurrent(item.to, pathname, search) ? 'page' : undefined} title={item.label}>{label}</Link>
        : <button type="button" className="ifm-sidebar-link" aria-expanded={expanded} aria-controls={menuId} onClick={toggle} title={item.label}>{label}<i className={`fa fa-angle-${expanded ? 'up' : 'down'} ifm-sidebar-chevron`} aria-hidden="true" /></button>}
      {item.to && item.links && <button type="button" className="ifm-sidebar-toggle" aria-label={`${item.label} menu`} aria-expanded={expanded} aria-controls={menuId} onClick={toggle}><i className={`fa fa-angle-${expanded ? 'up' : 'down'}`} aria-hidden="true" /></button>}
    </div>
    {item.links && <ul id={menuId} className="ifm-sidebar-submenu" aria-label={`${item.label} links`} hidden={!expanded}>
      {item.links.map(([name, to]) => <li key={name} className={isCurrent(to, pathname, search) ? 'active' : undefined}>
        <Link to={to} aria-current={isCurrent(to, pathname, search) ? 'page' : undefined}>{name}</Link>
      </li>)}
    </ul>}
  </li>;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const [update, setUpdate] = useState(0);
  const [categoryDisclosure, setCategoryDisclosure] = useState(null);
  const routeKey = `${pathname}${search}`;
  const activeCategory = sections.find(section => section.items.some(item => itemIsCurrent(item, pathname, search)))?.title;
  const openCategory = categoryDisclosure?.routeKey === routeKey ? categoryDisclosure.title : activeCategory;
  const loginData = JSON.parse(localStorage.getItem('logindetail'));
  const role = loginData?.role;

  useEffect(() => {
    if (role !== 'admin' && role !== 'agent') navigate('/alllogin');
  }, [role, update, navigate]);

  const logout = async () => {
    try { await fetch(`${BASE_URL}api/logout`, { credentials: 'include' }); } catch (error) { /* Clear local state below. */ }
    localStorage.removeItem('logindetail');
    setUpdate(value => value + 1);
  };

  return <aside className="main-sidebar ifm-sidebar">
    <section className="sidebar" style={{ height: 'auto' }}>
      <nav aria-label="IFM workspace navigation">
        <ul className="sidebar-menu">
          {sections.map(section => {
            const expanded = openCategory === section.title;
            const categoryId = `ifm-category-${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            return <li key={section.title} className={`ifm-sidebar-category${activeCategory === section.title ? ' active' : ''}`}>
              <div className="ifm-sidebar-row">
                <button type="button" className="ifm-sidebar-link ifm-sidebar-category-button" aria-expanded={expanded} aria-controls={categoryId}
                  title={section.title} onClick={() => setCategoryDisclosure({ routeKey, title: expanded ? null : section.title })}>
                  <i className={`fa fa-${section.items[0].icon}`} aria-hidden="true" />
                  <span className="ifm-sidebar-label">{section.title}</span>
                  <i className={`fa fa-angle-${expanded ? 'up' : 'down'} ifm-sidebar-chevron`} aria-hidden="true" />
                </button>
              </div>
              <ul id={categoryId} className="ifm-sidebar-category-items" aria-label={`${section.title} categories`} hidden={!expanded}>
                {section.items.map(item => <SidebarItem key={item.label} item={item} pathname={pathname} search={search} />)}
              </ul>
            </li>;
          })}
          <li className="nav-item ifm-sidebar-item ifm-sidebar-logout"><div className="ifm-sidebar-row">
            <Link className="ifm-sidebar-link" to="/alllogin" onClick={logout} title="Logout"><i className="fa fa-sign-out" aria-hidden="true" /><span className="ifm-sidebar-label">Logout</span></Link>
          </div></li>
        </ul>
      </nav>
    </section>
  </aside>;
};

export default Sidebar;

import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiGrid, FiLayers, FiLock, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { Alert, Button, EmptyState, Input, Select } from '../../design-system/components';
import { BASE_URL } from '../../config';
import DriverCard from './DriverCard';
import DriverProfile from './DriverProfile';
import { dateAttention, driverName } from './driverCommandData';
import './driver-command-center.css';

const PAGE_SIZE = 12;

function storedView() {
  try {
    const value = localStorage.getItem('ifm.driver-command.view');
    if (value === null || value === 'carousel' || value === 'grid') return { view: value || 'carousel', warning: '' };
    return { view: 'carousel', warning: 'The stored view preference was invalid. Carousel view is selected.' };
  } catch (error) {
    return { view: 'carousel', warning: 'View preference storage is unavailable. Your selection will last for this visit only.' };
  }
}

// Presentation callbacks are reserved for a future authorized adapter. There is
// no demo fleet or save adapter in the live container below.
export function DriverCommandCenter({ drivers = null, loading = false, error = '', onRefresh, permissions = {}, onSave, onReloadDriver }) {
  const [preference, setPreference] = useState(storedView);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('all');
  const [assignment, setAssignment] = useState('all');
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [updates, setUpdates] = useState({});
  const listRef = useRef(null);
  const cardRefs = useRef({});
  const leaveGuard = useRef(() => true);
  const hasData = Array.isArray(drivers) && !loading && !error;
  const fleet = useMemo(() => hasData ? drivers.map(driver => updates[String(driver.id)] || driver) : [], [hasData, drivers, updates]);
  useEffect(() => { setUpdates({}); }, [drivers]);

  const filtered = useMemo(() => fleet.filter(driver => {
    const matches = `${driverName(driver)} ${driver.id} ${driver.employeecode || ''}`.toLowerCase().includes(search.trim().toLowerCase());
    // No availability/current-assignment contract has been verified.
    return matches && (availability === 'all' || availability === 'unknown') && (assignment === 'all' || assignment === 'unverified');
  }), [fleet, search, availability, assignment]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages - 1);
  const visible = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const selected = fleet.find(driver => String(driver.id) === selectedId);
  const alerts = fleet.map(driver => permissions.view_compliance === true ? dateAttention(driver) : null);
  const knownAlerts = alerts.filter(value => value === true).length;
  const attentionValue = !hasData ? 'Unavailable' : alerts.every(value => value !== null) ? String(knownAlerts) : `${knownAlerts} known`;

  const leaveProfile = () => {
    if (!leaveGuard.current()) return false;
    setSelectedId(null);
    return true;
  };
  const changeFilter = (setter, value) => {
    if (!leaveProfile()) return;
    setter(value);
    setPage(0);
    if (listRef.current) listRef.current.scrollLeft = 0;
  };
  const selectDriver = (id) => {
    if (String(id) === selectedId || !leaveGuard.current()) return;
    setSelectedId(String(id));
  };
  const closeProfile = () => {
    const id = selectedId;
    if (leaveProfile()) cardRefs.current[id]?.focus();
  };
  const setView = (view) => {
    let warning = '';
    try { localStorage.setItem('ifm.driver-command.view', view); }
    catch (storageError) { warning = 'View preference could not be saved. Your selection will last for this visit only.'; }
    setPreference({ view, warning });
  };
  const scrollCards = (direction) => {
    const list = listRef.current;
    if (!list) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    list.scrollBy({ left: direction * list.clientWidth * .8, behavior: reduced ? 'auto' : 'smooth' });
  };
  const keyboardCards = (event) => {
    if (preference.view !== 'carousel' || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = visible.map(driver => cardRefs.current[String(driver.id)]).filter(Boolean);
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : Math.max(0, Math.min(buttons.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
    buttons[next]?.focus();
  };
  const drag = useRef(null);
  const dragStart = (event) => {
    if (preference.view !== 'carousel' || event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('a,button,input,select')) return;
    drag.current = { x: event.clientX, left: event.currentTarget.scrollLeft };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const dragMove = (event) => {
    if (drag.current) event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
  };

  return <main className="content-wrapper iso-ui dcc" data-iso-theme="light">
    <header className="dcc-header">
      <div><p className="dcc-eyebrow">IFM / People & operations</p><h1>Driver Command Center<span aria-hidden="true">∞</span></h1><p>Your fleet, in focus. People first. Every handoff visible.</p></div>
      <div className="dcc-header-actions">
        <Button variant="secondary" disabled={loading || !onRefresh} onClick={() => { if (leaveProfile()) { setUpdates({}); onRefresh(); } }}><FiRefreshCw aria-hidden="true" />{loading ? 'Refreshing...' : 'Refresh'}</Button>
        <Button disabled title="Account-scoped driver creation permissions are not verified."><FiPlus aria-hidden="true" />Add Driver</Button>
      </div>
    </header>
    <div className="dcc-boundary"><FiLock aria-hidden="true" /><div><strong>Verified data only</strong><p>Live records and changes are locked until driver ownership and permissions are verified. HOS is not assessed. SIS recommendations and automated dispatch are disabled.</p></div></div>
    <section className="dcc-summary" aria-label="Fleet summary">
      {[
        ['Total drivers', hasData ? String(fleet.length) : 'Unavailable', 'Authorized roster only'],
        ['Available drivers', 'Unavailable', 'Availability source not verified'],
        ['Drivers assigned to trips', 'Unavailable', 'Assignment scope not verified'],
        ['Drivers requiring attention', attentionValue, 'Recorded date alerts only; other checks not assessed'],
        ['ELD/HOS coverage', 'Not connected', 'No verified provider coverage'],
      ].map(([label, value, help]) => <div className="dcc-stat" key={label} aria-label={label}><span>{label}</span><strong>{value}</strong><small>{help}</small></div>)}
    </section>
    {error && <Alert tone="danger" title="Driver data unavailable">{error}</Alert>}
    {preference.warning && <Alert tone="warning" title="View preference">{preference.warning}</Alert>}
    <section className="dcc-workspace" aria-labelledby="dcc-roster-title">
      <div className="dcc-roster-heading"><div><p className="dcc-eyebrow">The driver workspace</p><h2 id="dcc-roster-title">People behind every move</h2></div><div className="dcc-views" role="group" aria-label="Driver view">
        <Button variant="secondary" aria-label="Carousel view" aria-pressed={preference.view === 'carousel'} onClick={() => setView('carousel')}><FiLayers aria-hidden="true" />Carousel</Button>
        <Button variant="secondary" aria-label="Grid view" aria-pressed={preference.view === 'grid'} onClick={() => setView('grid')}><FiGrid aria-hidden="true" />Grid</Button>
      </div></div>
      <div className="dcc-filters">
        <Input type="search" label="Search drivers" value={search} placeholder="Name, employee code or driver ID" onChange={event => changeFilter(setSearch, event.target.value)} />
        <Select label="Availability filter" value={availability} onChange={event => changeFilter(setAvailability, event.target.value)}><option value="all">All availability</option><option value="available">Verified available only</option><option value="unknown">Availability unavailable</option></Select>
        <Select label="Assignment filter" value={assignment} onChange={event => changeFilter(setAssignment, event.target.value)}><option value="all">All assignments</option><option value="assigned">Verified assigned only</option><option value="unverified">Assignment unverified</option></Select>
      </div>
      <div className="dcc-list-toolbar"><p role="status">{loading ? 'Loading authorized roster...' : hasData ? `${filtered.length} matching drivers / ${fleet.length} loaded` : 'No authorized roster loaded'}</p>
        {preference.view === 'carousel' && <div className="dcc-carousel-actions"><Button variant="secondary" aria-label="Previous drivers" disabled={!visible.length} onClick={() => scrollCards(-1)}><FiArrowLeft aria-hidden="true" /></Button><Button variant="secondary" aria-label="Next drivers" disabled={!visible.length} onClick={() => scrollCards(1)}><FiArrowRight aria-hidden="true" /></Button></div>}
      </div>
      {loading ? <EmptyState loading title="Loading drivers">Waiting for the account-scoped data gate.</EmptyState> : !hasData ? <EmptyState title="Your fleet workspace is ready"><FiLock className="dcc-empty-icon" aria-hidden="true" />No personal records are exposed. Verified driver ownership and role permissions are required before this view can connect.</EmptyState> : !visible.length ? <EmptyState title="No matching drivers">Adjust search or filters. Missing availability is never treated as available.</EmptyState> :
        <div ref={listRef} className={`dcc-list dcc-list--${preference.view}`} role="group" aria-label={preference.view === 'carousel' ? 'Driver carousel' : 'Driver grid'} onKeyDown={keyboardCards} onPointerDown={dragStart} onPointerMove={dragMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>
          {visible.map(driver => <DriverCard key={driver.id} driver={driver} selected={selectedId === String(driver.id)} canViewCompliance={permissions.view_compliance === true} onOpen={() => selectDriver(driver.id)} buttonRef={element => { cardRefs.current[String(driver.id)] = element; }} />)}
        </div>}
      {hasData && <nav className="dcc-pagination" aria-label="Driver pages"><Button variant="secondary" disabled={currentPage === 0} onClick={() => { if (leaveProfile()) { setPage(currentPage - 1); if (listRef.current) listRef.current.scrollLeft = 0; } }}>Previous page</Button><span>Page {currentPage + 1} of {pages}</span><Button variant="secondary" disabled={currentPage + 1 >= pages} onClick={() => { if (leaveProfile()) { setPage(currentPage + 1); if (listRef.current) listRef.current.scrollLeft = 0; } }}>Next page</Button></nav>}
    </section>
    {selected && <DriverProfile key={selectedId} driver={selected} permissions={permissions} onClose={closeProfile} leaveGuard={leaveGuard} onSave={onSave} onReloadDriver={onReloadDriver} onUpdated={driver => setUpdates(current => ({ ...current, [String(driver.id)]: driver }))} />}
    <footer className="dcc-footer"><span>Human-led operations. No compliance or dispatch clearance implied.</span><Button variant="secondary" disabled={!hasData} onClick={() => window.print()}>Print loaded view</Button></footer>
  </main>;
}

export default function Drivers() {
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState({ loading: true, error: '' });
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, error: '' });
    axios.get(`${BASE_URL}api/fetchdriversProductData`, { params: { command_center: '1' }, withCredentials: true, signal: controller.signal })
      .then(() => {
        // No authorized driver projection exists yet. A legacy array is not
        // evidence of ownership, even if a misconfigured server returns 200.
        if (!controller.signal.aborted) setState({ loading: false, error: 'Driver ownership is not verified. The roster is withheld; an unscoped response cannot unlock this screen.' });
      })
      .catch(requestError => {
        if (!controller.signal.aborted) setState({ loading: false, error: requestError.response?.data?.message || requestError.message || 'Could not verify access to driver records.' });
      });
    return () => controller.abort();
  }, [refresh]);
  return <DriverCommandCenter loading={state.loading} error={state.error} onRefresh={() => setRefresh(value => value + 1)} />;
}

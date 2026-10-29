import React, { useEffect, useState } from 'react';
import { FiArrowUpRight, FiMapPin, FiPhone, FiTruck } from 'react-icons/fi';
import { driverName, dateAttention, photoUrl } from './driverCommandData';

export function DriverAvatar({ driver }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [driver.image]);
  const name = driverName(driver);
  const src = photoUrl(driver.image);
  return <span className="dcc-avatar">{src && !failed
    ? <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
    : <span aria-label={`${name} initials`}>{name.split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase()}</span>}</span>;
}

export default function DriverCard({ driver, selected, canViewCompliance, onOpen, buttonRef }) {
  const name = driverName(driver);
  const alert = canViewCompliance ? dateAttention(driver) : null;
  return <article className={`dcc-driver${selected ? ' dcc-driver--selected' : ''}`} aria-label={`${name} driver tile`}>
    <div className="dcc-driver-top"><DriverAvatar driver={driver} /><span className="dcc-driver-symbol" aria-hidden="true">∞</span></div>
    <p className="dcc-driver-id">DRIVER {driver.id}{driver.employeecode ? ` / ${driver.employeecode}` : ''}</p>
    <h3><button ref={buttonRef} type="button" onClick={onOpen} aria-label={`Open profile for ${name}`} aria-expanded={selected} aria-controls={selected ? `dcc-profile-${driver.id}` : undefined}>{name}<FiArrowUpRight aria-hidden="true" /></button></h3>
    <p className="dcc-driver-phone"><FiPhone aria-hidden="true" />{driver.phone || 'Phone unavailable'}</p>
    <span className="dcc-driver-status">Availability unavailable</span>
    <dl className="dcc-driver-facts">
      <div><dt><FiTruck aria-hidden="true" />Truck</dt><dd>Unverified</dd></div><div><dt>Trailer</dt><dd>Unverified</dd></div>
      <div><dt>Current trip</dt><dd>Unverified</dd></div><div><dt><FiMapPin aria-hidden="true" />Last location</dt><dd>Unavailable</dd></div>
      <div><dt>Location update</dt><dd>Unavailable</dd></div>
    </dl>
    <div className="dcc-driver-foot"><span>ELD: Not connected</span><span>HOS: Not assessed</span></div>
    <p className={`dcc-driver-alert${alert === true ? ' dcc-driver-alert--attention' : ''}`}>{alert === true ? 'Recorded document date needs review' : 'Document verification not assessed'}</p>
  </article>;
}

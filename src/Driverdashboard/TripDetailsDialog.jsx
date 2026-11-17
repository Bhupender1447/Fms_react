import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiArrowRight, FiTruck } from 'react-icons/fi';

export default function TripDetailsDialog({ trip, controlsAvailable, onClose }) {
  const reference = useRef(null);
  useEffect(() => {
    const dialog = reference.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  return <dialog ref={reference} className="driver-trip-dialog" aria-labelledby="driver-trip-dialog-title"
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === reference.current) onClose(); }}>
    <div className="driver-dialog-content">
      <header><div><span>Assignment details</span><h2 id="driver-trip-dialog-title">{trip.reference || trip.trip_id}</h2></div>
        <button className="driver-icon-button" aria-label="Close trip details" onClick={onClose}><FiX /></button></header>
      <div className="driver-dialog-route"><FiTruck /><div><span>Pickup</span><strong>{trip.pickup_address || 'Address pending'}</strong><small>{[trip.pickup_date, trip.pickup_time].filter(Boolean).join(' · ') || 'Schedule pending'}</small></div>
        <FiArrowRight /><div><span>Delivery</span><strong>{trip.delivery_address || 'Address pending'}</strong><small>{[trip.delivery_date, trip.delivery_time].filter(Boolean).join(' · ') || 'Schedule pending'}</small></div></div>
      <dl className="driver-dialog-facts">
        {[['Trip status', trip.status], ['Truck', trip.truckunitnumber || trip.truck_id], ['Trailer', trip.trailor_id], ['Equipment', trip.equipment]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not specified'}</dd></div>)}
      </dl>
      {trip.instructions && <section className="driver-dialog-instructions"><h3>Instructions</h3><p>{trip.instructions}</p></section>}
      <footer>{controlsAvailable ? <Link className="driver-button driver-button-primary" to={`/tripstatus/${encodeURIComponent(trip.trip_id)}`}>Open trip controls <FiArrowRight /></Link>
        : <p>Trip controls are currently unavailable. Your assignment details are available here.</p>}
        <button className="driver-button driver-button-light" onClick={onClose}>Close</button></footer>
    </div>
  </dialog>;
}
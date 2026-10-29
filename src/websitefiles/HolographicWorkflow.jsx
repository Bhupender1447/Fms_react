import React, { useEffect, useState } from 'react';
import { FiDatabase, FiUsers, FiTruck, FiMapPin, FiFileText, FiCheckCircle, FiDollarSign, FiMonitor, FiPlay, FiPause, FiRotateCcw, FiNavigation, FiPackage, FiClipboard } from 'react-icons/fi';
import './holographic-workflow.css';

const stages = [
  ['Load creation', 'Capture the order, freight details, and delivery requirements.', FiDatabase],
  ['Dispatch', 'Assign the carrier, equipment, and driver for the move.', FiUsers],
  ['Pickup', 'Connect the driver with the pickup location and shipment.', FiTruck],
  ['In transit', 'Follow the journey and coordinate the next handoff.', FiNavigation],
  ['Delivery', 'Complete the delivery and confirm the receiving details.', FiMapPin],
  ['Proof of delivery', 'Bring delivery records and supporting documents together.', FiFileText],
  ['Trip closeout', 'Review the completed trip and its operational records.', FiCheckCircle],
  ['Invoice', 'Prepare the shipment paperwork for billing.', FiClipboard],
  ['Payment', 'Connect the financial closeout with the completed move.', FiDollarSign],
  ['Next move', 'Bring the context forward into the next dispatch cycle.', FiPackage],
];

export default function HolographicWorkflow() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return undefined;
    const timer = setInterval(() => setActive(value => (value + 1) % stages.length), 3000);
    return () => clearInterval(timer);
  }, [playing]);
  const [name, description, Icon] = stages[active];
  return <div className={`iso-holo${playing ? ' is-playing' : ''}`}>
    <div className="iso-holo-top"><span><i />ISOVIA / CONNECTED OPERATIONS</span><span>WORKFLOW CONCEPT · 01—10</span></div>
    <div className="iso-holo-layout">
      <div className="iso-holo-display">
        <div className="iso-holo-disc">
          <div className="iso-holo-ring ring-one" /><div className="iso-holo-ring ring-two" /><div className="iso-holo-ring ring-three" />
          <div className="iso-holo-sweep" style={{ transform: `rotate(${active * 36}deg)` }} />
          <svg className="iso-holo-links" viewBox="0 0 600 600" aria-hidden="true">{stages.map((stage, i) => { const angle = (i * 36 - 90) * Math.PI / 180; return <line key={stage[0]} x1="300" y1="300" x2={300 + 232 * Math.cos(angle)} y2={300 + 232 * Math.sin(angle)} className={i === active ? 'active' : ''} />; })}</svg>
          <div className="iso-holo-core"><FiMonitor aria-hidden="true" /><strong>ISOVIA</strong><span>IFM PLATFORM</span><small>One connected journey</small></div>
          {stages.map(([title, , StageIcon], i) => { const angle = (i * 36 - 90) * Math.PI / 180; return <button type="button" key={title} className={`iso-holo-node${active === i ? ' active' : ''}`} style={{ left: `${50 + 39 * Math.cos(angle)}%`, top: `${50 + 39 * Math.sin(angle)}%` }} aria-label={`Stage ${i + 1}: ${title}`} aria-pressed={active === i} onClick={() => { setActive(i); setPlaying(false); }}><span><StageIcon aria-hidden="true" /></span><small>{title}</small></button>; })}
        </div>
        <div className="iso-holo-projection" aria-hidden="true" />
        <span className="iso-holo-coordinate" aria-hidden="true">IFM / PROCESS VISUALIZATION</span>
      </div>
      <div className="iso-holo-details">
        <p className="iso-holo-kicker">THE DISPATCH & DELIVERY CYCLE</p>
        <h3>Every handoff.<br /><em>In orbit.</em></h3>
        <p className="iso-holo-intro">A connected view of the journey, from the first order to the next move.</p>
        <div className="iso-holo-stage" aria-live={playing ? 'off' : 'polite'} aria-atomic="true"><div className="iso-holo-stage-label"><span>STAGE {String(active + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /></div><h4>{name}</h4><p>{description}</p><div className="iso-holo-progress" aria-hidden="true">{stages.map((s, i) => <span key={s[0]} className={i === active ? 'active' : ''} />)}</div></div>
        <div className="iso-holo-controls"><button type="button" onClick={() => setPlaying(value => !value)}>{playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}{playing ? 'Pause cycle' : 'Play cycle'}</button><button type="button" aria-label="Restart workflow cycle" onClick={() => { setActive(0); setPlaying(false); }}><FiRotateCcw aria-hidden="true" /></button><span>Select any stage to explore</span></div>
      </div>
    </div>
    <div className="iso-holo-bottom"><span>ISOVIA FREIGHT MANAGEMENT</span><span>Concept animation, not live tracking or proof of implemented automation.</span></div>
  </div>;
}

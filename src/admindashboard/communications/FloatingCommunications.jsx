import React, { useEffect, useRef, useState } from 'react';
import { FiMessageSquare, FiX } from 'react-icons/fi';
import './communications.css';

export default function FloatingCommunications() {
  const [open, setOpen] = useState(false);
  const trigger = useRef(null);
  const closeButton = useRef(null);
  useEffect(() => { if (open) closeButton.current?.focus(); }, [open]);
  const close = () => { setOpen(false); trigger.current?.focus(); };
  return <div className="ifm-comms-floating">
    {open && <section id="ifm-communications-panel" aria-label="Quick communications" onKeyDown={event => {
      if (event.key === 'Escape') { event.stopPropagation(); close(); }
    }}>
      <header><div><strong>Communications</strong><small>Stay with your current work</small></div><button ref={closeButton} type="button" aria-label="Close communications panel" onClick={close}><FiX /></button></header>
      <FiMessageSquare className="ifm-comms-panel-icon" aria-hidden="true" />
      <h2>No authorized mailbox connected</h2>
      <p>Unread conversations, replies and attachments are unavailable until secure provider integration is connected.</p>
      <p role="status">Opening this panel does not navigate or submit your current form.</p>
      <button type="button" disabled>Reply unavailable</button>
    </section>}
    <button ref={trigger} type="button" className="ifm-comms-launcher" aria-label="Toggle communications panel" aria-expanded={open} aria-controls={open ? 'ifm-communications-panel' : undefined} onClick={() => open ? close() : setOpen(true)}><FiMessageSquare aria-hidden="true" /><span>Communications</span></button>
  </div>;
}

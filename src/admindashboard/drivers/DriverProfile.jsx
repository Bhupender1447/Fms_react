import React, { useEffect, useRef, useState } from 'react';
import { FiPhone, FiX } from 'react-icons/fi';
import { Alert, Button, Input } from '../../design-system/components';
import { DriverAvatar } from './DriverCard';
import { contactDraft, contactFields, dateLabel, driverName, validateContact } from './driverCommandData';

const tabs = ['Overview', 'Licence & Compliance', 'Assignments', 'HOS & ELD', 'Documents', 'Safety & Performance'];
function Facts({ values }) {
  return <dl className="dcc-profile-facts">{values.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Unavailable'}</dd></div>)}</dl>;
}

export default function DriverProfile({ driver, permissions, onClose, leaveGuard, onSave, onReloadDriver, onUpdated }) {
  const [tab, setTab] = useState(0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => contactDraft(driver));
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const heading = useRef(null);
  const tabRefs = useRef([]);
  const mounted = useRef(true);
  const name = driverName(driver);
  const dirty = editing && JSON.stringify(draft) !== JSON.stringify(contactDraft(driver));
  const canEdit = permissions.edit_profile === true && typeof onSave === 'function' && typeof onReloadDriver === 'function';
  const compliance = permissions.view_compliance === true;
  const canViewLicence = compliance && permissions.view_licence_number === true;
  const phone = typeof driver.phone === 'string' && /^\+?[\d\s().-]+$/.test(driver.phone) && /\d/.test(driver.phone) ? driver.phone.replace(/[^\d+]/g, '') : null;

  useEffect(() => { heading.current?.focus(); mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => {
    leaveGuard.current = () => !saving && (!dirty || window.confirm('Discard unsaved driver profile changes?'));
    const beforeUnload = event => { if (dirty || saving) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', beforeUnload);
    return () => { leaveGuard.current = () => true; window.removeEventListener('beforeunload', beforeUnload); };
  }, [dirty, saving, leaveGuard]);

  const cancel = () => {
    if (!leaveGuard.current()) return;
    setDraft(contactDraft(driver));
    setErrors({});
    setError('');
    setEditing(false);
  };
  const save = async event => {
    event.preventDefault();
    if (!canEdit || saving) return;
    const validation = validateContact(draft);
    setErrors(validation);
    if (Object.keys(validation).length) {
      document.getElementById(`dcc-edit-${Object.keys(validation)[0]}`)?.focus();
      return;
    }
    setSaving(true);
    setError('');
    setMessage('');
    let submitted = false;
    try {
      await onSave(String(driver.id), Object.fromEntries(contactFields.map(([field]) => [field, draft[field].trim()])));
      submitted = true;
      const fresh = await onReloadDriver(String(driver.id));
      if (!fresh || String(fresh.id) !== String(driver.id)) throw new Error('Refresh returned a different driver. The record was not replaced.');
      if (!mounted.current) return;
      onUpdated(fresh);
      setDraft(contactDraft(fresh));
      setEditing(false);
      setMessage('Profile refreshed after the save request.');
    } catch (saveError) {
      if (mounted.current) setError(`${submitted ? 'The save request completed, but refreshing failed. Verify the server record before retrying. ' : ''}${saveError.message || 'Unable to save this driver. Changes remain in the form.'}`);
    } finally {
      if (mounted.current) setSaving(false);
    }
  };
  const changeTabWithKeyboard = event => {
    const index = tabRefs.current.indexOf(event.target);
    if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return <section className="dcc-profile" id={`dcc-profile-${driver.id}`} aria-labelledby={`dcc-profile-title-${driver.id}`}>
    <div className="dcc-profile-header"><DriverAvatar driver={driver} /><div><p className="dcc-eyebrow">Expanded driver workspace / ID {driver.id}</p><h2 ref={heading} tabIndex={-1} id={`dcc-profile-title-${driver.id}`}>{name} <span className="dcc-sr-only">profile</span></h2><p>Availability unavailable / Assignments unverified</p></div><Button variant="secondary" aria-label="Close profile" disabled={saving} onClick={onClose}><FiX aria-hidden="true" /></Button></div>
    <div className="dcc-profile-actions">
      <Button disabled={!canEdit || editing} title={!canEdit ? 'Verified driver edit permission and an authorized save adapter are required.' : undefined} onClick={() => { setDraft(contactDraft(driver)); setEditing(true); setError(''); setMessage(''); }}>Edit Profile</Button>
      <Button variant="secondary" disabled title="No account-scoped driver-to-trip assignment workflow is verified.">Assign Trip</Button>
      {phone && !editing ? <a className="iso-button iso-button--secondary" href={`tel:${phone}`}><FiPhone aria-hidden="true" />Call Driver</a> : <Button variant="secondary" disabled>Call Driver</Button>}
      <Button variant="secondary" disabled={editing || saving} onClick={() => setTab(4)}>View Documents</Button>
    </div>
    <div className="dcc-tabs" role="tablist" aria-label="Driver profile sections" onKeyDown={changeTabWithKeyboard}>
      {tabs.map((label, index) => <button type="button" role="tab" key={label} ref={element => { tabRefs.current[index] = element; }} id={`dcc-tab-${driver.id}-${index}`} aria-controls={`dcc-panel-${driver.id}`} aria-selected={tab === index} tabIndex={tab === index ? 0 : -1} disabled={editing} onClick={() => setTab(index)}>{label}</button>)}
    </div>
    {error && <Alert tone="danger" title="Profile action failed">{error}</Alert>}
    {message && <Alert tone="success" title="Profile refreshed">{message}</Alert>}
    {editing ? <form className="dcc-editor" onSubmit={save} noValidate aria-label="Edit driver contact profile">
      <div><h3>Contact profile</h3><p>Only contact fields are editable. Driver IDs, employment status, licence details, ELD measurements and compliance results are read-only.</p></div>
      <div className="dcc-edit-fields">{contactFields.map(([field, label, max]) => <Input id={`dcc-edit-${field}`} key={field} label={label} type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'} required={field === 'fname'} maxLength={max} value={draft[field]} disabled={saving} error={errors[field]} onChange={event => setDraft(current => ({ ...current, [field]: event.target.value }))} />)}</div>
      <div className="dcc-edit-actions"><Button type="submit" disabled={saving || !canEdit}>{saving ? 'Saving and refreshing...' : 'Save Changes'}</Button><Button variant="secondary" disabled={saving} onClick={cancel}>Cancel</Button><span role="status">{dirty ? 'Unsaved changes' : 'No unsaved changes'}</span></div>
    </form> : <div className="dcc-tab-panel" id={`dcc-panel-${driver.id}`} role="tabpanel" aria-labelledby={`dcc-tab-${driver.id}-${tab}`} tabIndex={0}>
      {tab === 0 && <><h3>At a glance</h3><Facts values={[
        ['Driver ID', driver.id], ['Employee code', driver.employeecode], ['Phone', driver.phone], ['Email', driver.email],
        ['Address', [driver.address1, driver.address2, driver.city, driver.state, driver.zip, driver.country].filter(Boolean).join(', ')],
        ['Hire date', dateLabel(driver.hiredate)], ['Termination date', dateLabel(driver.termdate)],
        ['Employment / availability', 'Unavailable (status semantics not verified)'], ['Current truck / trailer', 'Unverified'], ['Current trip / dispatch', 'Unverified'],
      ]} /></>}
      {tab === 1 && <><h3>Licence & compliance</h3><p>Recorded dates are not document verification, regulatory compliance, or dispatch clearance.</p><Facts values={[
        ['Licence number', canViewLicence ? driver.documentno : 'Restricted'],
        ['Licence class', 'Unavailable'], ['Issuing authority', compliance ? driver.issuingauthority : 'Restricted'],
        ['Licence expiration', compliance ? dateLabel(driver.expiarydate) : 'Restricted'],
        ['FAST expiration', compliance ? dateLabel(driver.fastexpdate) : 'Restricted'],
        ['Medical documents', 'Unavailable (source semantics not verified)'], ['Verification status', 'Not assessed'],
      ]} /></>}
      {tab === 2 && <><h3>Assignments</h3><Facts values={['Current truck', 'Current trailer', 'Current trip', 'Previous assignments'].map(label => [label, 'Unverified'])} /><p>Trip references and roster fields alone do not establish an authorized or current assignment. No automatic driver selection is enabled.</p></>}
      {tab === 3 && <><h3>HOS & ELD</h3><Facts values={[['ELD provider', 'Not connected'], ['Last successful sync', 'Unavailable'], ['Verified duty status', 'Unavailable'], ['HOS assessment', 'Not assessed'], ['HOS remaining', 'Unavailable']]} /><p>No remaining-hours calculation, compliance clearance or automated dispatch decision is enabled.</p></>}
      {tab === 4 && <><h3>Documents</h3><p>File access is unavailable until parent ownership and document permissions are verified. No personal document URLs are exposed.</p><Facts values={[['Licence expiration (recorded date)', compliance ? dateLabel(driver.expiarydate) : 'Restricted'], ['FAST expiration (recorded date)', compliance ? dateLabel(driver.fastexpdate) : 'Restricted'], ['Document verification', 'Not assessed']]} /><Button variant="secondary" disabled>Upload document</Button></>}
      {tab === 5 && <><h3>Safety & performance</h3><Facts values={[['Verified safety events', 'Unavailable'], ['Performance data', 'Unavailable']]} /><div className="dcc-future"><strong>Future SIS insights</strong><p>Unavailable. Assignment recommendations, availability predictions, HOS-aware suggestions and safety summaries are not implemented or enabled.</p></div></>}
    </div>}
  </section>;
}

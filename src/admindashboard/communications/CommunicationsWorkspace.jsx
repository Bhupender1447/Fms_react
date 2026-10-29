import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiInbox, FiMail, FiMessageSquare, FiPlus, FiSearch, FiShield, FiX } from 'react-icons/fi';
import { filterMessages, mailViews, projectCommunications } from './communicationsModel';
import './communications.css';

const providerNames = { gmail: 'Gmail', outlook: 'Outlook' };

export function ConnectionOptions({ onClose }) {
  const close = useRef(null);
  useEffect(() => { close.current?.focus(); }, []);
  return <section className="ifm-comms-connect" aria-label="Connect an email account" onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); onClose(); }
  }}>
    <header><h2>Bring your business inbox into IFM</h2><button ref={close} type="button" onClick={onClose} aria-label="Close account connection"><FiX /></button></header>
    <p>Use your existing provider account. Isovia will never ask for your Gmail or Microsoft password.</p>
    <div className="ifm-comms-provider-grid">
      {['gmail', 'outlook'].map(provider => <article key={provider}>
        <span className={`ifm-comms-provider ${provider}`} aria-hidden="true">{provider === 'gmail' ? 'G' : 'O'}</span>
        <h3>{providerNames[provider]}</h3>
        <p>{provider === 'gmail' ? 'Google Workspace and Gmail via official Google OAuth.' : 'Microsoft 365 and Outlook via Microsoft identity and Graph.'}</p>
        <button type="button" disabled>Connect {providerNames[provider]}</button>
      </article>)}
    </div>
    <p role="status">Connection unavailable: server-side OAuth, authorized mailbox ownership and encrypted token storage are not connected yet. No authentication request will be sent.</p>
    <p>IMAP/SMTP, WhatsApp Business, Teams, SMS and internal messaging require separate access and permission verification.</p>
  </section>;
}

export default function CommunicationsWorkspace({ accounts = null, messages = null, accountId = null, loading = false, error = '' }) {
  const { pathname } = useLocation();
  const view = pathname.replace(/^\/workspace\/email\/?/, '') || 'inbox';
  const title = mailViews.find(([id]) => id === view)?.[1];
  const [search, setSearch] = useState('');
  const [contact, setContact] = useState('');
  const [provider, setProvider] = useState('');
  const [mailboxId, setMailboxId] = useState('');
  const [selection, setSelection] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const connectButton = useRef(null);
  const projection = useMemo(() => {
    if (accounts === null && messages === null) return { accounts: [], messages: [], unavailable: true };
    try { return projectCommunications(accounts, messages, accountId); }
    catch (failure) { return { accounts: [], messages: [], error: failure.message }; }
  }, [accounts, messages, accountId]);
  const blocked = loading || error || projection.error || projection.unavailable;
  const rows = blocked ? [] : filterMessages(projection.messages, { view, search, provider, mailboxId, contact });
  const selected = rows.find(message => message.key === selection);
  const closeConnection = () => { setConnecting(false); connectButton.current?.focus(); };
  const messageView = ['inbox', 'sent', 'drafts', 'starred', 'attachments'].includes(view);
  return <main className="content-wrapper ifm-comms">
    <div className="ifm-comms-heading">
      <div><p className="ifm-comms-eyebrow">ISOVIA WORKSPACE / COMMUNICATIONS</p><h1>Email &amp; Messaging</h1><p>Your freight conversations. One focused workspace.</p></div>
      <button className="ifm-comms-primary" ref={connectButton} type="button" onClick={() => setConnecting(true)}><FiPlus /> Connect Account</button>
    </div>
    <div className="ifm-comms-notice" role={error || projection.error ? 'alert' : 'status'}><FiShield aria-hidden="true" /><div>
      <strong>{error || projection.error ? 'Communications unavailable' : loading ? 'Loading authorized communications' : 'Provider connections are not active'}</strong>
      <p>{error || projection.error || 'This is the workspace foundation. No mailbox is connected, no live synchronization is running, and sending and operational changes are disabled.'}</p>
    </div></div>
    {connecting && <ConnectionOptions onClose={closeConnection} />}
    <div className="ifm-comms-shell">
      <nav className="ifm-comms-folders" aria-label="Communications folders">
        <div className="ifm-comms-brand"><FiMail aria-hidden="true" /> Business communications</div>
        <label>Mailbox<select value={mailboxId} onChange={event => setMailboxId(event.target.value)}>
          <option value="">All authorized accounts</option>
          {!blocked && projection.accounts.map(account => <option key={account.id} value={account.id}>{account.label}</option>)}
        </select></label>
        <button type="button" className="ifm-comms-primary" disabled title="Connect an authorized mailbox and verified send service first.">Compose</button>
        {mailViews.map(([id, label]) => <Link key={id} to={`/workspace/email/${id}`} aria-current={view === id ? 'page' : undefined}>
          {id === 'channels' ? <FiMessageSquare aria-hidden="true" /> : <FiMail aria-hidden="true" />}<span>{label}</span>
        </Link>)}
        <div className="ifm-comms-labels"><strong>Provider labels</strong><p>Available after an authorized connection. Gmail labels and Outlook folders will retain their provider-specific meaning.</p></div>
        <div className="ifm-comms-provider-key"><span>G Gmail</span><span>O Outlook</span><small>Not connected</small></div>
      </nav>
      <section className="ifm-comms-list" aria-label="Message list">
        <header><h2>{title || 'Workspace page unavailable'}</h2><span>{blocked ? 'Count unavailable' : `${rows.length} messages`}</span></header>
        <label className="ifm-comms-search"><FiSearch aria-hidden="true" /><span className="sr-only">Search messages</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search sender, subject or message" /></label>
        <div className="ifm-comms-filters">
          <label>Provider<select value={provider} onChange={event => setProvider(event.target.value)}><option value="">All providers</option><option value="gmail">Gmail</option><option value="outlook">Outlook</option></select></label>
          <label>Contact<input value={contact} onChange={event => setContact(event.target.value)} placeholder="Filter sender" /></label>
        </div>
        {messageView ? rows.length ? <ul className="ifm-comms-messages">{rows.map(message => <li key={message.key}>
          <button type="button" aria-pressed={selected?.key === message.key} onClick={() => setSelection(message.key)}>
            <span className={`ifm-comms-provider ${message.provider}`}>{providerNames[message.provider]}</span>
            <span className="ifm-comms-message-from">{message.from}{message.unread && <span className="ifm-comms-unread">Unread</span>}</span>
            <strong>{message.subject || '(No subject)'}</strong><span className="ifm-comms-preview">{message.bodyText.slice(0, 110)}</span>
            <small>{new Date(message.receivedAt).toLocaleString()}{message.hasAttachments ? ' / Attachment' : ''}{message.starred ? ' / Starred' : ''}</small>
          </button>
        </li>)}</ul> : <div className="ifm-comms-empty"><FiInbox aria-hidden="true" /><h3>{blocked ? 'Your inbox belongs here' : 'No matching messages'}</h3>
          <p>{blocked ? 'Connect an authorized business account when provider integration is available. No sample messages are shown as real mail.' : 'Try another folder, account or search.'}</p></div>
          : <div className="ifm-comms-empty"><FiMessageSquare aria-hidden="true" /><h3>{view === 'assistant' ? 'Human-led. SIS-assisted.' : view === 'accounts' ? 'Your accounts stay yours.' : view === 'channels' ? 'Business channels, clearly connected.' : 'Unknown workspace view'}</h3>
            <p>{view === 'assistant' ? 'Summaries, draft replies and document suggestions are future capabilities. SIS has no mailbox access and cannot send or change operational records.' : view === 'accounts' ? 'Gmail and Microsoft 365 connection, reconnect and revoke workflows are pending secure backend integration.' : 'No messaging API access has been verified. Consumer WhatsApp and personal Teams chats are not assumed accessible.'}</p>
          </div>}
      </section>
      <section className="ifm-comms-reader" aria-label="Conversation reader">
        {selected ? <><div className="ifm-comms-reader-meta"><span className={`ifm-comms-provider ${selected.provider}`}>{providerNames[selected.provider]}</span><span>Read-only projection</span></div>
          <h2>{selected.subject || '(No subject)'}</h2><p><strong>From:</strong> {selected.from}</p><time dateTime={selected.receivedAt}>{new Date(selected.receivedAt).toLocaleString()}</time>
          <div className="ifm-comms-body">{selected.bodyText}</div>
          <p>Plain-text message only. Full provider thread and attachment retrieval are not connected.</p>
        </> : <div className="ifm-comms-reader-intro"><span className="ifm-comms-orbit"><FiMail aria-hidden="true" /></span><h2>Keep the conversation in context.</h2><p>Select an authorized message to review it alongside your freight operations.</p></div>}
        <div className="ifm-comms-actions" aria-label="Message actions">
          {['Reply', 'Reply All', 'Forward', 'Archive', 'Mark read / unread', 'Star', 'View attachments', 'Download attachments'].map(action => <button key={action} type="button" disabled>{action}</button>)}
        </div>
        <aside className="ifm-comms-context"><p className="ifm-comms-eyebrow">FREIGHT CONTEXT</p><h3>Reviewed first. Linked second.</h3><p>Original messages and documents must be verified before they affect an order, trip or invoice.</p>
          <div className="ifm-comms-actions">{['Link to Order', 'Link to Trip', 'Link to Customer', 'Link to Carrier', 'Link to Invoice', 'Create Order from Email', 'Save Attachment', 'Create Follow-up Reminder'].map(action => <button key={action} type="button" disabled>{action}</button>)}</div>
          <small>Unavailable until account-authorized linking, private documents and dispatcher review are connected.</small>
        </aside>
      </section>
    </div>
  </main>;
}

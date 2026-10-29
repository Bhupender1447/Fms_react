export const mailViews = [
  ['inbox', 'Unified Inbox', 'inbox'], ['sent', 'Sent', 'send'], ['drafts', 'Drafts', 'file-text'],
  ['starred', 'Starred', 'star'], ['attachments', 'Attachments', 'paperclip'],
  ['channels', 'Messaging channels', 'message-square'], ['assistant', 'SIS Assistant', 'sparkles'],
  ['accounts', 'Connected Accounts', 'link'],
];

const text = value => typeof value === 'string' && value.trim().length > 0;
const providers = ['gmail', 'outlook'];
function validTimestamp(value) {
  if (typeof value !== 'string') return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:Z|([+-])(\d{2}):(\d{2}))$/.exec(value);
  if (!match) return false;
  const [, year, month, day, hours, minutes, seconds, , offsetHours, offsetMinutes] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  return Number.isFinite(Date.parse(value)) && Number.isFinite(date.getTime())
    && date.toISOString().slice(0, 10) === `${year}-${month}-${day}`
    && Number(hours) < 24 && Number(minutes) < 60 && Number(seconds) < 60
    && (!offsetHours || (Number(offsetHours) < 24 && Number(offsetMinutes) < 60));
}

// Consistency checks for a future already-authorized read adapter, not authorization.
export function projectCommunications(accounts, messages, accountId) {
  if (!Array.isArray(accounts) || !Array.isArray(messages) || !text(accountId)) {
    throw new Error('An authorized account and complete mailbox projection are required.');
  }
  const mailboxes = new Map();
  const safeAccounts = accounts.map(account => {
    if (!account || account.accountId !== accountId || !text(account.id) || !text(account.label)
      || !providers.includes(account.provider) || mailboxes.has(account.id)) {
      throw new Error('Mailbox identity or account scope could not be verified.');
    }
    mailboxes.set(account.id, account);
    return { id: account.id, label: account.label, provider: account.provider };
  });
  const seen = new Set();
  const safeMessages = messages.map(message => {
    const mailbox = mailboxes.get(message?.mailboxId);
    const key = JSON.stringify([message?.mailboxId, message?.id]);
    if (!message || message.accountId !== accountId || !mailbox || mailbox.provider !== message.provider
      || !text(message.id) || seen.has(key) || !text(message.from) || typeof message.subject !== 'string'
      || typeof message.bodyText !== 'string' || !['inbox', 'sent', 'drafts', 'archive'].includes(message.folder)
      || typeof message.unread !== 'boolean' || typeof message.starred !== 'boolean'
      || typeof message.hasAttachments !== 'boolean'
      || !validTimestamp(message.receivedAt)) {
      throw new Error('Message identity, source or account scope could not be verified.');
    }
    seen.add(key);
    return { id: message.id, key, mailboxId: message.mailboxId, provider: message.provider,
      from: message.from, subject: message.subject, bodyText: message.bodyText,
      receivedAt: message.receivedAt, folder: message.folder, unread: message.unread,
      starred: message.starred, hasAttachments: message.hasAttachments };
  });
  return { accounts: safeAccounts, messages: safeMessages };
}

export function filterMessages(messages, { view, search, provider, mailboxId, contact }) {
  const query = search.trim().toLowerCase();
  return messages.filter(message => (
    (view === 'starred' ? message.starred : view === 'attachments' ? message.hasAttachments : message.folder === view)
    && (!provider || message.provider === provider) && (!mailboxId || message.mailboxId === mailboxId)
    && message.from.toLowerCase().includes(contact.trim().toLowerCase())
    && `${message.from} ${message.subject} ${message.bodyText}`.toLowerCase().includes(query)
  ));
}

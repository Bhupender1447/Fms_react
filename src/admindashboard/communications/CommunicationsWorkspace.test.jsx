import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import CommunicationsWorkspace from './CommunicationsWorkspace';
import FloatingCommunications from './FloatingCommunications';
import { filterMessages, projectCommunications } from './communicationsModel';

const accounts = [
  { id: 'mailbox-a', accountId: 'synthetic-A', provider: 'gmail', label: 'Synthetic Gmail' },
  { id: 'mailbox-b', accountId: 'synthetic-A', provider: 'outlook', label: 'Synthetic Outlook' },
];
const message = { id: 'synthetic-message', accountId: 'synthetic-A', mailboxId: 'mailbox-a', provider: 'gmail',
  from: 'Synthetic dispatcher', subject: 'Synthetic rate confirmation', bodyText: 'Review this synthetic rate before creating an order.',
  receivedAt: '2026-10-25T10:00:00Z', folder: 'inbox', unread: true, starred: true, hasAttachments: true };
const outlook = { ...message, mailboxId: 'mailbox-b', provider: 'outlook', from: 'Synthetic customer', subject: 'Synthetic appointment' };
const props = { accounts, messages: [message, outlook], accountId: 'synthetic-A' };
function mount(initial = '/workspace/email', extra = {}) {
  return render(<MemoryRouter initialEntries={[initial]}><CommunicationsWorkspace {...extra} /></MemoryRouter>);
}

test('default workspace shows honest unavailable states, not invented messages or unread counts', () => {
  mount();
  expect(screen.getByRole('heading', { name: 'Email & Messaging' })).toBeInTheDocument();
  expect(screen.getByText('Count unavailable')).toBeInTheDocument();
  expect(screen.getByText(/No sample messages are shown as real mail/)).toBeInTheDocument();
  for (const name of ['Compose', 'Reply', 'Forward', 'Create Order from Email', 'Link to Trip', 'Link to Invoice', 'Download attachments']) {
    expect(screen.getByRole('button', { name, exact: true })).toBeDisabled();
  }
});

test('connection chooser never asks for passwords and provider buttons cannot initiate OAuth', () => {
  mount();
  const button = screen.getByRole('button', { name: 'Connect Account' });
  fireEvent.click(button);
  const chooser = screen.getByRole('region', { name: 'Connect an email account' });
  expect(within(chooser).getByRole('button', { name: 'Connect Gmail' })).toBeDisabled();
  expect(within(chooser).getByRole('button', { name: 'Connect Outlook' })).toBeDisabled();
  expect(within(chooser).queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Close account connection' })).toHaveFocus();
  fireEvent.keyDown(chooser, { key: 'Escape' });
  expect(screen.queryByRole('region', { name: 'Connect an email account' })).not.toBeInTheDocument();
  expect(button).toHaveFocus();
});

test.each(['inbox', 'sent', 'drafts', 'starred', 'attachments', 'assistant', 'accounts', 'channels'])('folder %s supports direct route and current navigation', view => {
  mount(`/workspace/email/${view}`);
  const nav = screen.getByRole('navigation', { name: 'Communications folders' });
  expect(within(nav).getAllByRole('link').find(link => link.getAttribute('href') === `/workspace/email/${view}`)).toHaveAttribute('aria-current', 'page');
});

test('search, provider, contact and account filters operate on consistent synthetic projections', () => {
  mount('/workspace/email/inbox', props);
  expect(screen.getByText('2 messages')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Provider'), { target: { value: 'gmail' } });
  expect(screen.getByText('1 messages')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Search messages'), { target: { value: 'not-present' } });
  expect(screen.getByRole('heading', { name: 'No matching messages' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Search messages'), { target: { value: 'rate' } });
  fireEvent.change(screen.getByLabelText('Contact'), { target: { value: 'dispatcher' } });
  fireEvent.change(screen.getByLabelText('Mailbox'), { target: { value: 'mailbox-b' } });
  expect(screen.getByRole('heading', { name: 'No matching messages' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Mailbox'), { target: { value: 'mailbox-a' } });
  fireEvent.click(screen.getByRole('button', { name: /Synthetic rate confirmation/ }));
  expect(within(screen.getByRole('region', { name: 'Conversation reader' })).getByRole('heading', { name: message.subject })).toBeInTheDocument();
});

test('starred and attachments preserve filters and selected conversation stays within visible results', () => {
  mount('/workspace/email/starred', props);
  fireEvent.click(screen.getByRole('button', { name: /Synthetic rate confirmation/ }));
  fireEvent.click(screen.getByRole('link', { name: 'Attachments' }));
  expect(screen.getByRole('heading', { name: message.subject })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Provider'), { target: { value: 'outlook' } });
  expect(screen.queryByRole('heading', { name: message.subject })).not.toBeInTheDocument();
});

test('HTML content is shown as text, never rendered as active provider markup', () => {
  const unsafe = { ...message, bodyText: '<img src="https://example.invalid/tracker" onerror="alert(1)"><script>bad()</script>' };
  mount('/workspace/email', { ...props, messages: [unsafe] });
  fireEvent.click(screen.getByRole('button', { name: /Synthetic rate confirmation/ }));
  const reader = screen.getByRole('region', { name: 'Conversation reader' });
  expect(within(reader).getByText(unsafe.bodyText)).toBeInTheDocument();
  expect(within(reader).queryByRole('img')).not.toBeInTheDocument();
});

test.each([
  { messages: [{ ...message, accountId: 'other-tenant' }] },
  { messages: [{ ...message, provider: 'outlook' }] },
  { messages: [message, message] },
  { accounts: [accounts[0], accounts[0]] },
])('bad projection is explicitly rejected and no messages escape', override => {
  mount('/workspace/email', { ...props, ...override });
  expect(screen.getByRole('alert')).toHaveTextContent('Communications unavailable');
  expect(screen.queryByRole('button', { name: /Synthetic rate confirmation/ })).not.toBeInTheDocument();
});

test('provider errors and loading cannot display cached messages as current mail', () => {
  const { unmount } = mount('/workspace/email', { ...props, error: 'Synthetic provider outage' });
  expect(screen.getByRole('alert')).toHaveTextContent('Synthetic provider outage');
  expect(screen.queryByRole('button', { name: /Synthetic rate confirmation/ })).not.toBeInTheDocument();
  unmount();
  mount('/workspace/email', { ...props, loading: true });
  expect(screen.getByRole('status')).toHaveTextContent('Loading authorized communications');
  expect(screen.getByText('Count unavailable')).toBeInTheDocument();
});

test('projection strips extra fields and scopes provider message identity to each mailbox', () => {
  const projected = projectCommunications(accounts, [{ ...message, accessToken: 'never-copy' }, outlook], 'synthetic-A');
  expect(projected.messages).toHaveLength(2);
  expect(projected.messages[0]).not.toHaveProperty('accessToken');
  expect(filterMessages(projected.messages, { view: 'attachments', search: '', provider: '', mailboxId: '', contact: '' })).toHaveLength(2);
});

test.each(['2026-02-31T10:00:00Z', '2026-10-25T10:00:00', '2026-10-25T25:00:00Z', 'not-a-time'])('projection rejects invalid or ambiguous source time %s', receivedAt => {
  expect(() => projectCommunications(accounts, [{ ...message, receivedAt }], 'synthetic-A')).toThrow(/Message identity/);
});

test('floating panel preserves current form and URL, restores focus and supports Escape', () => {
  function Form() {
    const location = useLocation();
    return <><label>Order reference<input defaultValue="Unsaved reference" /></label><output aria-label="Current route">{location.pathname}</output><FloatingCommunications /></>;
  }
  render(<MemoryRouter initialEntries={['/createorder']}><Form /></MemoryRouter>);
  const trigger = screen.getByRole('button', { name: 'Toggle communications panel' });
  fireEvent.click(trigger);
  expect(screen.getByRole('region', { name: 'Quick communications' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Close communications panel' })).toHaveFocus();
  expect(screen.getByLabelText('Current route')).toHaveTextContent('/createorder');
  expect(screen.getByLabelText('Order reference')).toHaveValue('Unsaved reference');
  fireEvent.keyDown(screen.getByRole('region', { name: 'Quick communications' }), { key: 'Escape' });
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByLabelText('Order reference')).toHaveValue('Unsaved reference');
});

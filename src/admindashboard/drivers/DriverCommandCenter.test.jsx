import React from 'react';
import axios from 'axios';
import { act, fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import Drivers, { DriverCommandCenter } from './Drivers';

jest.mock('axios');

const userEvent = {
  click: fireEvent.click,
  type: (target, text) => fireEvent.change(target, { target: { value: target.value + text } }),
  clear: target => fireEvent.change(target, { target: { value: '' } }),
  selectOptions: (target, value) => fireEvent.change(target, { target: { value } }),
};

const fleet = [
  { id: '11', fname: 'Alex', lname: 'North', employeecode: 'D-A11', phone: '+1 555 010 0011', email: 'alex@example.test', image: '/missing-photo.jpg', expiarydate: '2020-02-02' },
  { id: '22', fname: 'Sam', lname: 'West', employeecode: 'D-B22', phone: '', email: '', fastexpdate: '2099-01-01' },
];
const permissions = { edit_profile: true, view_compliance: true };
function renderFleet(props = {}) {
  return render(<DriverCommandCenter drivers={fleet} permissions={permissions} onRefresh={jest.fn()} {...props} />);
}
async function expand(name = 'Alex North') {
  await userEvent.click(screen.getByRole('button', { name: `Open profile for ${name}` }));
  return screen.getByRole('region', { name: `${name} profile` });
}
beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  jest.spyOn(window, 'confirm').mockReturnValue(true);
});
afterEach(() => jest.restoreAllMocks());

test('production requests the gated existing API and shows unavailable rather than fake totals', async () => {
  axios.get.mockRejectedValueOnce({ response: { status: 503, data: { message: 'Driver records are locked until ownership is verified.' } } });
  render(<Drivers />);
  expect(await screen.findByRole('alert')).toHaveTextContent('ownership is verified');
  expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('api/fetchdriversProductData'), expect.objectContaining({ withCredentials: true, params: { command_center: '1' } }));
  expect(screen.getByLabelText('Total drivers')).toHaveTextContent('Unavailable');
  expect(screen.getByRole('button', { name: 'Add Driver' })).toBeDisabled();
  expect(axios.post).not.toHaveBeenCalled();
});

test('a legacy success response cannot bypass the safe data gate', async () => {
  axios.get.mockResolvedValueOnce({ data: fleet });
  render(<Drivers />);
  expect(await screen.findByRole('alert')).toHaveTextContent('withheld');
  expect(screen.queryByText('Alex North')).not.toBeInTheDocument();
});

test('cards, search, availability and assignment filters stay consistent between views', async () => {
  renderFleet();
  expect(screen.getByLabelText('Total drivers')).toHaveTextContent('2');
  expect(screen.getByLabelText('Available drivers')).toHaveTextContent('Unavailable');
  expect(screen.getByLabelText('Drivers assigned to trips')).toHaveTextContent('Unavailable');
  expect(screen.getByLabelText('ELD/HOS coverage')).toHaveTextContent('Not connected');
  await userEvent.type(screen.getByRole('searchbox', { name: 'Search drivers' }), 'D-A11');
  expect(screen.getByRole('button', { name: 'Open profile for Alex North' })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Open profile for Sam West' })).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Grid view' }));
  expect(screen.getByRole('button', { name: 'Grid view' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('searchbox')).toHaveValue('D-A11');
  await userEvent.selectOptions(screen.getByLabelText('Availability filter'), 'available');
  expect(screen.getByText('No matching drivers')).toBeInTheDocument();
  await userEvent.selectOptions(screen.getByLabelText('Availability filter'), 'unknown');
  await userEvent.selectOptions(screen.getByLabelText('Assignment filter'), 'unverified');
  expect(screen.getByRole('button', { name: 'Open profile for Alex North' })).toBeInTheDocument();
  expect(localStorage.getItem('ifm.driver-command.view')).toBe('grid');
});

test('fallback avatars, tabs and unavailable intelligence never imply HOS clearance', async () => {
  renderFleet();
  fireEvent.error(screen.getByRole('img', { name: 'Alex North' }));
  expect(screen.getByLabelText('Alex North initials')).toHaveTextContent('AN');
  const profile = await expand();
  await userEvent.click(within(profile).getByRole('tab', { name: 'HOS & ELD' }));
  expect(within(profile).getByRole('tabpanel')).toHaveTextContent('Not connected');
  expect(within(profile).getByRole('tabpanel')).toHaveTextContent('Not assessed');
  expect(within(profile).getByRole('tabpanel')).toHaveTextContent('No remaining-hours calculation');
  await userEvent.click(within(profile).getByRole('tab', { name: 'Safety & Performance' }));
  expect(within(profile).getByRole('tabpanel')).toHaveTextContent('Future SIS insights');
  expect(within(profile).getByRole('button', { name: 'Assign Trip' })).toBeDisabled();
  await userEvent.click(within(profile).getByRole('button', { name: 'Close profile' }));
  expect(screen.queryByRole('region', { name: 'Alex North profile' })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Open profile for Alex North' })).toHaveFocus();
});

test('editing validates, waits for save and refetch, and does not modify identifiers', async () => {
  const onSave = jest.fn().mockResolvedValue(undefined);
  const onReloadDriver = jest.fn().mockResolvedValue({ ...fleet[0], fname: 'Avery' });
  renderFleet({ onSave, onReloadDriver });
  let profile = await expand();
  await userEvent.click(within(profile).getByRole('button', { name: 'Edit Profile' }));
  await userEvent.clear(screen.getByLabelText('First name'));
  await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  expect(screen.getByText('First name is required.')).toBeInTheDocument();
  expect(onSave).not.toHaveBeenCalled();
  await userEvent.type(screen.getByLabelText('First name'), 'Avery');
  await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  await waitFor(() => expect(onReloadDriver).toHaveBeenCalledWith('11'));
  expect(onSave).toHaveBeenCalledWith('11', expect.objectContaining({ fname: 'Avery' }));
  expect(onSave.mock.calls[0][1]).not.toHaveProperty('id');
  expect(onSave.mock.calls[0][1]).not.toHaveProperty('documentno');
  profile = await screen.findByRole('region', { name: 'Avery North profile' });
  expect(profile).toHaveTextContent('Profile refreshed');
});

test('cancel and close confirm unsaved changes and never save', async () => {
  const onSave = jest.fn();
  renderFleet({ onSave, onReloadDriver: jest.fn() });
  const profile = await expand();
  await userEvent.click(within(profile).getByRole('button', { name: 'Edit Profile' }));
  await userEvent.type(screen.getByLabelText('First name'), ' changed');
  window.confirm.mockReturnValueOnce(false);
  await userEvent.click(screen.getByRole('button', { name: 'Close profile' }));
  expect(screen.getByLabelText('First name')).toHaveValue('Alex changed');
  window.confirm.mockReturnValueOnce(true);
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
  expect(profile).toHaveTextContent('Alex North');
  expect(onSave).not.toHaveBeenCalled();
});

test('failed saves preserve draft and a mismatched refetch is rejected', async () => {
  const onSave = jest.fn().mockRejectedValueOnce(new Error('Permission revoked')).mockResolvedValueOnce(undefined);
  renderFleet({ onSave, onReloadDriver: jest.fn().mockResolvedValue(fleet[1]) });
  await expand();
  await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
  await userEvent.type(screen.getByLabelText('First name'), ' draft');
  await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Permission revoked');
  expect(screen.getByLabelText('First name')).toHaveValue('Alex draft');
  await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('different driver');
  expect(screen.getByLabelText('First name')).toHaveValue('Alex draft');
});

test('missing permissions prevent edit, licence exposure and document actions', async () => {
  renderFleet({ drivers: [{ ...fleet[0], documentno: 'PRIVATE-LICENCE' }], permissions: {}, onSave: jest.fn(), onReloadDriver: jest.fn() });
  const profile = await expand();
  expect(within(profile).getByRole('button', { name: 'Edit Profile' })).toBeDisabled();
  await userEvent.click(within(profile).getByRole('tab', { name: 'Licence & Compliance' }));
  expect(profile).not.toHaveTextContent('PRIVATE-LICENCE');
  expect(within(profile).getByRole('tabpanel')).toHaveTextContent('Restricted');
  await userEvent.click(within(profile).getByRole('button', { name: 'View Documents' }));
  expect(within(profile).getByRole('tabpanel')).toHaveTextContent('File access is unavailable');
  expect(within(profile).getByRole('button', { name: 'Upload document' })).toBeDisabled();
});

test('pagination bounds both views and keyboard navigation moves among carousel profiles', async () => {
  const drivers = Array.from({ length: 27 }, (_, i) => ({ id: String(i + 1), fname: `Driver ${i + 1}`, lname: '' }));
  renderFleet({ drivers });
  expect(screen.getAllByRole('button', { name: /Open profile for/ })).toHaveLength(12);
  const first = screen.getByRole('button', { name: 'Open profile for Driver 1' });
  first.focus();
  fireEvent.keyDown(first, { key: 'ArrowRight' });
  expect(screen.getByRole('button', { name: 'Open profile for Driver 2' })).toHaveFocus();
  await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByRole('button', { name: 'Open profile for Driver 13' })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Grid view' }));
  expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  await userEvent.type(screen.getByRole('searchbox'), 'Driver 27');
  expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /Open profile for/ })).toHaveLength(1);
});

test('profile tabs support arrow keys and close restores the originating card', async () => {
  renderFleet();
  const profile = await expand();
  const overview = within(profile).getByRole('tab', { name: 'Overview' });
  overview.focus();
  fireEvent.keyDown(overview, { key: 'ArrowRight' });
  expect(within(profile).getByRole('tab', { name: 'Licence & Compliance' })).toHaveFocus();
  expect(within(profile).getByRole('tabpanel')).toHaveAccessibleName('Licence & Compliance');
  fireEvent.keyDown(within(profile).getByRole('tab', { name: 'Licence & Compliance' }), { key: 'End' });
  expect(within(profile).getByRole('tab', { name: 'Safety & Performance' })).toHaveFocus();
});

test('refresh and driver changes cannot discard dirty edits without confirmation', async () => {
  const onRefresh = jest.fn();
  renderFleet({ onRefresh, onSave: jest.fn(), onReloadDriver: jest.fn() });
  await expand();
  await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
  await userEvent.type(screen.getByLabelText('First name'), ' unsaved');
  window.confirm.mockReturnValue(false);
  const unload = new Event('beforeunload', { cancelable: true });
  window.dispatchEvent(unload);
  expect(unload.defaultPrevented).toBe(true);
  await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  await userEvent.click(screen.getByRole('button', { name: 'Open profile for Sam West' }));
  expect(onRefresh).not.toHaveBeenCalled();
  expect(screen.getByLabelText('First name')).toHaveValue('Alex unsaved');
  window.confirm.mockReturnValue(true);
  await userEvent.click(screen.getByRole('button', { name: 'Refresh' }));
  expect(onRefresh).toHaveBeenCalledTimes(1);
  expect(screen.queryByLabelText('First name')).not.toBeInTheDocument();
});

test('aborted responses cannot replace a newer authorization error', async () => {
  let firstRequest;
  axios.get.mockImplementationOnce(() => new Promise(resolve => { firstRequest = resolve; }));
  const { unmount } = render(<Drivers />);
  const signal = axios.get.mock.calls[0][1].signal;
  unmount();
  expect(signal.aborted).toBe(true);
  await act(async () => firstRequest({ data: fleet }));
  axios.get.mockRejectedValueOnce(new Error('Authentication required'));
  render(<Drivers />);
  expect(await screen.findByRole('alert')).toHaveTextContent('Authentication required');
  expect(screen.queryByText('Alex North')).not.toBeInTheDocument();
});

test('carousel supports mouse dragging and honors reduced motion for navigation', () => {
  renderFleet();
  const list = screen.getByRole('group', { name: 'Driver carousel' });
  list.setPointerCapture = jest.fn();
  list.scrollBy = jest.fn();
  Object.defineProperty(list, 'clientWidth', { value: 900 });
  const previousMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  try {
    fireEvent.click(screen.getByRole('button', { name: 'Next drivers' }));
    expect(list.scrollBy).toHaveBeenCalledWith({ left: 720, behavior: 'auto' });
    fireEvent(list, Object.assign(new Event('pointerdown', { bubbles: true }), { pointerType: 'mouse', button: 0, clientX: 200, pointerId: 1 }));
    fireEvent(list, Object.assign(new Event('pointermove', { bubbles: true }), { clientX: 120 }));
    expect(list.scrollLeft).toBe(80);
    fireEvent.pointerUp(list);
    fireEvent(list, Object.assign(new Event('pointermove', { bubbles: true }), { clientX: 0 }));
    expect(list.scrollLeft).toBe(80);
  } finally {
    window.matchMedia = previousMatchMedia;
  }
});

test('pending saves prevent duplicate writes and switching to another driver', async () => {
  let finishSave;
  const onSave = jest.fn(() => new Promise(resolve => { finishSave = resolve; }));
  const onReloadDriver = jest.fn().mockResolvedValue({ ...fleet[0], fname: 'Avery' });
  renderFleet({ onSave, onReloadDriver });
  await expand();
  await userEvent.click(screen.getByRole('button', { name: 'Edit Profile' }));
  fireEvent.change(screen.getByLabelText('First name'), { target: { value: 'Avery' } });
  await userEvent.click(screen.getByRole('button', { name: 'Save Changes' }));
  expect(screen.getByRole('button', { name: 'Close profile' })).toBeDisabled();
  expect(screen.getByLabelText('First name')).toBeDisabled();
  await userEvent.click(screen.getByRole('button', { name: 'Open profile for Sam West' }));
  expect(screen.queryByRole('region', { name: 'Sam West profile' })).not.toBeInTheDocument();
  expect(onSave).toHaveBeenCalledTimes(1);
  await act(async () => finishSave());
  expect(await screen.findByRole('region', { name: 'Avery North profile' })).toBeInTheDocument();
});

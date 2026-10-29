import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Adminlogin from './Adminlogin';

jest.mock('axios');
const staff = { status: 'success', user_id: '7', username: 'Test Dispatcher', email: 'staff@example.test', role: 'admin' };
function setup() {
  render(<MemoryRouter initialEntries={['/admin-login']}><Routes>
    <Route path="/admin-login" element={<Adminlogin />} />
    <Route path="/accounting" element={<h1>Staff accounting</h1>} />
  </Routes></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'staff@example.test' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'synthetic-password' } });
}
function submit() { fireEvent.click(screen.getByRole('button', { name: 'Login' })); }
beforeEach(() => { jest.resetAllMocks(); localStorage.clear(); });

test('enters existing staff destination only after cookie-backed session verification', async () => {
  axios.post.mockResolvedValue({ data: staff });
  axios.get.mockResolvedValue({ data: staff });
  setup(); submit();
  expect(await screen.findByText('Staff accounting')).toBeInTheDocument();
  expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('api/login'), expect.any(FormData), { withCredentials: true });
  expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('api/staff-session'), { withCredentials: true });
  expect(JSON.parse(localStorage.getItem('logindetail'))).toEqual({ name: staff.username, id: '7', email: staff.email, role: 'admin' });
  expect(localStorage.getItem('logindetail')).not.toContain('synthetic-password');
});

test('blocks duplicate submissions while pending and does not store identity before verification', async () => {
  let complete;
  axios.post.mockReturnValue(new Promise(resolve => { complete = resolve; }));
  axios.get.mockResolvedValue({ data: staff });
  setup(); submit();
  fireEvent.submit(screen.getByRole('form', { name: 'Staff sign-in' }));
  expect(axios.post).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Verifying session...' })).toBeDisabled();
  expect(localStorage.getItem('logindetail')).toBeNull();
  complete({ data: staff });
  expect(await screen.findByText('Staff accounting')).toBeInTheDocument();
});

test('surfaces unmapped-role backend error and removes stale browser identity', async () => {
  axios.post.mockRejectedValue({ response: { data: { message: 'Staff portal access is not configured.' } } });
  localStorage.setItem('logindetail', '{"role":"admin"}');
  setup(); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('not configured');
  expect(localStorage.getItem('logindetail')).toBeNull();
  expect(axios.get).not.toHaveBeenCalled();
});

test('does not enter workspace when session cookie is missing or expired', async () => {
  axios.post.mockResolvedValue({ data: staff });
  axios.get.mockRejectedValue({ response: { data: { message: 'Authentication required' } } });
  setup(); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('Authentication required');
  expect(localStorage.getItem('logindetail')).toBeNull();
});

test.each([
  { ...staff, user_id: '9' }, { ...staff, role: 'driver' },
  { ...staff, status: 'error' }, { ...staff, username: null }, { ...staff, user_id: null },
])('rejects malformed or mismatched authoritative session %j', async session => {
  axios.post.mockResolvedValue({ data: staff });
  axios.get.mockResolvedValue({ data: session });
  setup(); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('session could not be verified');
  expect(localStorage.getItem('logindetail')).toBeNull();
});

test('recognized user role does not navigate to nonexistent /user or receive admin access', async () => {
  axios.post.mockResolvedValue({ data: { ...staff, role: 'user' } });
  axios.get.mockResolvedValue({ data: { ...staff, role: 'user' } });
  setup(); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('workspace for this role is not connected');
  expect(localStorage.getItem('logindetail')).toBeNull();
});

test('handles malformed login and permits retry after provider failure', async () => {
  axios.post.mockResolvedValueOnce({ data: '1{"status":"success"}' }).mockRejectedValueOnce(new Error('Network unavailable'));
  setup(); submit();
  expect(await screen.findByRole('alert')).toHaveTextContent('invalid response');
  submit();
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable'));
  expect(axios.get).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled();
});

test('password visibility is keyboard-operable and does not submit credentials', () => {
  setup();
  expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text');
  fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
  expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  expect(axios.post).not.toHaveBeenCalled();
});

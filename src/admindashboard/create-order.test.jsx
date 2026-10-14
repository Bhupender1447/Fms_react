import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import Createorder from './order/Createorder';

jest.mock('axios');
jest.mock('./Distancepopup', () => () => null);
jest.mock('../components/Map/AddressAutocomplete', () => () => null);

beforeEach(() => {
  localStorage.setItem('logindetail', JSON.stringify({ id: 1 }));
});
afterEach(() => jest.clearAllMocks());

test('shows reference loading failure instead of silently hiding it', async () => {
  axios.get.mockRejectedValue(new Error('offline'));
  render(<MemoryRouter><Createorder /></MemoryRouter>);
  expect(await screen.findByRole('alert')).toHaveTextContent('Order reference data could not be loaded');
  expect(screen.getByLabelText('Company')).toHaveAttribute('name', 'company');
  expect(screen.getByLabelText('Upload Document (OCR Auto-fill)')).toHaveAttribute('aria-describedby', 'order-ocr-help');
  expect(axios.post).not.toHaveBeenCalled();
});

test('renders the create-order workspace and document review guidance', () => {
  axios.get.mockReturnValue(new Promise(() => {}));
  render(<MemoryRouter><Createorder /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /Create order/ })).toBeInTheDocument();
  expect(screen.getByText(/review every extracted field/)).toBeInTheDocument();
});

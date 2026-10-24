import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
  expect(screen.getByRole('button', { name: 'Enter Manually' })).toBeVisible();
  expect(screen.getByLabelText('Upload rate confirmation document')).toHaveAttribute('aria-describedby', 'order-ocr-document-help');
  expect(screen.getByLabelText('Company')).not.toBeVisible();
  expect(axios.post).not.toHaveBeenCalled();
});

test('renders the create-order workspace and document review guidance', () => {
  axios.get.mockReturnValue(new Promise(() => {}));
  render(<MemoryRouter><Createorder /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /Create order/ })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Rate Confirmation PDF' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Scan & Autofill' })).toBeDisabled();
  expect(screen.getByLabelText('Company')).not.toBeVisible();
});

test('keeps order extraction and ordered stops below the upload without saving', async () => {
  axios.get.mockReturnValue(new Promise(() => {}));
  axios.post.mockResolvedValue({
    data: {
      success: true,
      data: {},
      gpt_response: {
        structured_json: {
          loadno: 'LOAD-21',
          stops: [
            { stoptype: 'Pickup', name: 'Origin', address: '10 First St', date: '2026-11-02' },
            { stoptype: 'Delivery', name: 'Destination', address: '20 Second St', reference: 'REF-21' },
          ],
        },
      },
    },
  });
  render(<MemoryRouter><Createorder /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Upload rate confirmation document'), {
    target: { files: [new File(['pdf'], 'order-rate.pdf', { type: 'application/pdf' })] },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Scan & Autofill' }));

  expect(await screen.findByRole('heading', { name: 'Order Review' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Rate Confirmation PDF' })).toBeInTheDocument();
  expect(screen.getByText('Stop 1')).toBeInTheDocument();
  expect(screen.getByText('Stop 2')).toBeInTheDocument();
  expect(screen.getByText('10 First St')).toBeInTheDocument();
  expect(screen.getByText('20 Second St')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Review & Save Order' })).toBeInTheDocument();
  expect(axios.post.mock.calls.some(([url]) => String(url).includes('api/create'))).toBe(false);
  expect(screen.getByLabelText('Company')).not.toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Edit Information' }));
  expect(screen.getByLabelText('Company')).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Apply Changes / Back to Review' }));
  expect(screen.getByRole('heading', { name: 'Order Review' })).toBeInTheDocument();
});

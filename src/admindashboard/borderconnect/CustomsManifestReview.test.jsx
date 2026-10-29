import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomsManifestReview from './CustomsManifestReview';
import AceTripForm from './AceTripForm';
import AciTripForm from './AciTripForm';

jest.mock('axios');
const fixture = () => ({
  snapshot: {
    account_id: 'A', manifest_id: 'SYN-MANIFEST', trip_id: 'SYN-TRIP', order_id: 'SYN-ORDER',
    revision: 1, source_revision: 2, ocr_revision: 3, direction: 'CA_US', state: 'PENDING_VERIFICATION',
    documents: [{ id: 'SYN-BOL', name: 'Synthetic BOL', version: 1, sha256: 'a'.repeat(64) }],
    extracted_fields: { weight: '1000', commodity: null }, fields: { weight: '100', commodity: '' },
  },
  assessment: { manifest_type: 'ACE', approval_current: false, submission_enabled: false, blocking_issues: ['Commodity missing'], warnings: ['Compare corrected weight'] },
});
beforeEach(() => jest.clearAllMocks());

test('live page does not load legacy documents or invent manifest/clearance states', () => {
  render(<CustomsManifestReview />);
  expect(screen.getByText('Authorized customs review not connected')).toBeInTheDocument();
  expect(axios.get).not.toHaveBeenCalled();
  expect(axios.post).not.toHaveBeenCalled();
});
test('side-by-side review keeps original OCR and proposed corrections separate', () => {
  const review = fixture();
  render(<CustomsManifestReview review={review} canReview />);
  const originals = screen.getByRole('region', { name: 'Original shipment documents' });
  expect(within(originals).getByText('1000')).toBeInTheDocument();
  expect(screen.getByText('Not provided')).toBeInTheDocument();
  expect(screen.getByText('SYN-TRIP / SYN-ORDER')).toBeInTheDocument();
  expect(screen.getByText('Pending Dispatcher Verification')).toBeInTheDocument();
  expect(screen.getByText('Commodity missing')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('weight'), { target: { value: '900' } });
  expect(within(originals).getByText('1000')).toBeInTheDocument();
  expect(review.snapshot.fields.weight).toBe('100');
  expect(screen.getByText(/local proposed corrections only/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Save corrections' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Approve and Submit' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'View original document' })).toBeDisabled();
  expect(axios.post).not.toHaveBeenCalled();
});
test('reset requires confirmation and rejected reset preserves local corrections', () => {
  const confirm = jest.spyOn(window, 'confirm').mockReturnValueOnce(false).mockReturnValueOnce(true);
  render(<CustomsManifestReview review={fixture()} canReview />);
  fireEvent.change(screen.getByLabelText('weight'), { target: { value: '900' } });
  fireEvent.click(screen.getByRole('button', { name: 'Reset proposed corrections' }));
  expect(screen.getByLabelText('weight')).toHaveValue('900');
  fireEvent.click(screen.getByRole('button', { name: 'Reset proposed corrections' }));
  expect(screen.getByLabelText('weight')).toHaveValue('100');
  expect(confirm).toHaveBeenCalledTimes(2);
  confirm.mockRestore();
});
test('read-only reviewers cannot change fields and stale approval is clearly invalid', () => {
  const review = fixture();
  review.snapshot.state = 'APPROVED';
  render(<CustomsManifestReview review={review} />);
  expect(screen.getByLabelText('weight')).toBeDisabled();
  expect(screen.getByText(/prior approval does not match/)).toBeInTheDocument();
});
test('manifest acceptance is distinct from verified release and cannot be edited', () => {
  const review = fixture();
  review.snapshot.state = 'ACCEPTED';
  render(<CustomsManifestReview review={review} canReview />);
  expect(screen.getByText('Accepted')).toBeInTheDocument();
  expect(screen.getByText('Not verified')).toBeInTheDocument();
  expect(screen.getByLabelText('weight')).toBeDisabled();
});
test('ACI direction and malformed projections never infer a filing or show unverified data', () => {
  const review = fixture();
  review.snapshot.direction = 'US_CA';
  review.assessment.manifest_type = 'ACI';
  const view = render(<CustomsManifestReview review={review} />);
  expect(screen.getByText(/United States to Canada \/ ACI/)).toBeInTheDocument();
  view.rerender(<CustomsManifestReview review={{ snapshot: { id: 1, status: 'approved' } }} />);
  expect(screen.getByText(/Legacy trip or OCR responses/)).toBeInTheDocument();
  expect(screen.queryByText('SYN-TRIP / SYN-ORDER')).not.toBeInTheDocument();
});
test.each([['ACE', AceTripForm], ['ACI', AciTripForm]])('%s manual form allows editing but cannot post even through a form submit event', (type, Component) => {
  render(<MemoryRouter><Component /></MemoryRouter>);
  const form = screen.getByRole('form', { name: `Manual ${type} form (live sending unavailable)` });
  expect(screen.getByText('Manual customs entry enabled')).toBeInTheDocument();
  expect(screen.getByText(/Values are local to this form/)).toBeInTheDocument();
  for (const name of ['tripNumber', 'shipmentControlNumber', 'commodityWeight']) {
    const input = form.elements.namedItem(name);
    expect(input).toBeEnabled();
    fireEvent.change(input, { target: { value: '123' } });
    expect(input.value).toBe('123');
    fireEvent.change(input, { target: { value: '456' } });
    expect(input.value).toBe('456');
  }
  const arrival = form.elements.namedItem('estimatedArrivalDateTime');
  fireEvent.change(arrival, { target: { value: '2026-10-25T14:30' } });
  expect(arrival).toHaveValue('2026-10-25T14:30');
  fireEvent.change(arrival, { target: { value: '' } });
  expect(arrival).toHaveValue('');
  expect(screen.getByRole('button', { name: 'Submission unavailable' })).toBeDisabled();
  fireEvent.submit(form);
  expect(axios.post).not.toHaveBeenCalled();
  expect(screen.getByRole('link', { name: 'Open Customs Manifest Review' })).toHaveAttribute('href', '/customs/review');
});

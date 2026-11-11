import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TripDriverlist from './Triplist';
import { dispatchRequest } from '../../admindashboard/drivers/dispatchApi';
jest.mock('../../admindashboard/drivers/dispatchApi',()=>({dispatchRequest:jest.fn(),dispatchError:error=>error.message}));
const assignment={assignment_id:12,tms_trip_id:'P4B-A',dispatch_status:'SENT',trip:{customer_orderno:'Load A',pickup_address:'Pickup',delivery_address:'Delivery',trailortype:'Dry van',status:'ACTIVE'}};
beforeEach(()=>jest.resetAllMocks());
async function setup(value=assignment) {
 dispatchRequest.mockResolvedValue({assignments:[value]});render(<MemoryRouter><TripDriverlist /></MemoryRouter>);
 await screen.findByRole('button',{name:'Review dispatch'});fireEvent.click(screen.getByRole('button',{name:'Review dispatch'}));
}
test('driver reviews operational details; rejection requires a reason and uses assignment id',async()=>{
 await setup();expect(screen.getByText('Pickup', { selector: 'dd' })).toBeInTheDocument();expect(screen.getByText('Dry van')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Reject Dispatch'}));expect(screen.getByRole('alert')).toHaveTextContent('Enter a rejection reason');
 expect(dispatchRequest.mock.calls.some(([path])=>path==='respond')).toBe(false);
 fireEvent.change(screen.getByLabelText('Rejection reason'),{target:{value:'Equipment unavailable'}});await act(async()=>fireEvent.click(screen.getByRole('button',{name:'Reject Dispatch'})));
 await waitFor(()=>expect(dispatchRequest).toHaveBeenCalledWith('respond',expect.objectContaining({body:{tms_trip_id:'P4B-A',assignment_id:12,action:'reject',reason:'Equipment unavailable'}})));
});
test('duplicate accepts are suppressed and stale denial clears the obsolete dispatch',async()=>{
 await setup();let reject;dispatchRequest.mockImplementation(()=>new Promise((_,fail)=>{reject=fail;}));
 fireEvent.click(screen.getByRole('button',{name:'Accept Dispatch'}));fireEvent.click(screen.getByRole('button',{name:'Accept Dispatch'}));expect(dispatchRequest.mock.calls.filter(([path])=>path==='respond')).toHaveLength(1);
 await act(async()=>reject(new Error('Assignment changed; reload')));expect(screen.getByRole('alert')).toHaveTextContent('Assignment changed');expect(screen.queryByText('Dry van')).not.toBeInTheDocument();
});
test('accepted trip links to separate trip controls without an automatic start',async()=>{
 await setup({...assignment,dispatch_status:'ACCEPTED'});expect(screen.getByRole('link',{name:'Start accepted trip'})).toHaveAttribute('href','/tripstatus/P4B-A');expect(screen.queryByRole('button',{name:'Accept Dispatch'})).not.toBeInTheDocument();
});

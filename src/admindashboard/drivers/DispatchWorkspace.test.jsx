import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import DispatchWorkspace from './DispatchWorkspace';
import { dispatchRequest } from './dispatchApi';
jest.mock('./dispatchApi', () => ({ dispatchRequest: jest.fn(), dispatchError: error => error.message }));
const drivers=[{id:'900001',fname:'Alice',login_user_id:'3'},{id:'901001',fname:'Unlinked'}];
const trip={tmsTriptId:'P4B-A',customer_orderno:'Load A',status:'ACTIVE'};
const detail={status:true,account_id:'900',trip,assignment:null,history:[]};
beforeEach(()=>jest.resetAllMocks());
function setup(value=detail) {
 dispatchRequest.mockImplementation((path,options)=>Promise.resolve(path==='trips'?{trips:[trip]}:path.startsWith('status/')?value:{status:true}));
 render(<DispatchWorkspace accountId="900" drivers={drivers} />);
}
async function choose() { await screen.findByRole('option',{name:'Load A / ACTIVE'}); fireEvent.change(screen.getByLabelText('Dispatch trip'),{target:{value:'P4B-A'}}); await screen.findByText('Not assigned'); }
test('only bound authorized roster drivers can be selected and assignment sends record identity', async()=>{
 setup(); await choose();
 expect(screen.getByRole('option',{name:'Unlinked (login not linked)'})).toBeDisabled();
 fireEvent.change(screen.getByLabelText('Assign driver'),{target:{value:'900001'}});
 fireEvent.click(screen.getByRole('button',{name:'Assign Driver'}));
 await waitFor(()=>expect(dispatchRequest).toHaveBeenCalledWith('assign',expect.objectContaining({body:{tms_trip_id:'P4B-A',driver_record_id:900001,expected_assignment_id:0,confirm_reassignment:false}})));
});
test('reassignment requires confirmation; rejection reason and immutable history display',async()=>{
 const confirm=jest.spyOn(window,'confirm').mockReturnValue(false);
 setup({...detail,assignment:{id:'12',dispatch_status:'REJECTED',reject_reason:'Equipment unavailable'},history:[{id:'1',new_status:'REJECTED',created_at:'2026-11-11',note:'Driver rejected'}]});
 await screen.findByRole('option',{name:'Load A / ACTIVE'});fireEvent.change(screen.getByLabelText('Dispatch trip'),{target:{value:'P4B-A'}});
 await screen.findByText('Rejection reason: Equipment unavailable');expect(screen.getByText('Driver rejected')).toBeInTheDocument();
 fireEvent.change(screen.getByLabelText('Assign driver'),{target:{value:'900001'}});fireEvent.click(screen.getByRole('button',{name:'Reassign Driver'}));
 expect(confirm).toHaveBeenCalled();expect(dispatchRequest.mock.calls.some(([path])=>path==='assign')).toBe(false);confirm.mockRestore();
});
test('double click produces one write while assignment request is pending',async()=>{
 setup();await choose();fireEvent.change(screen.getByLabelText('Assign driver'),{target:{value:'900001'}});
 let resolve;dispatchRequest.mockImplementation(()=>new Promise(done=>{resolve=done;}));
 fireEvent.click(screen.getByRole('button',{name:'Assign Driver'}));fireEvent.click(screen.getByRole('button',{name:'Assign Driver'}));
 expect(dispatchRequest.mock.calls.filter(([path])=>path==='assign')).toHaveLength(1);
 await act(async()=>resolve({status:true}));
});

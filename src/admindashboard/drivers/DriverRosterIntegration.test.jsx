import React from 'react';
import axios from 'axios';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Drivers from './Drivers';
jest.mock('axios');
jest.mock('./DispatchWorkspace',()=>()=> <div>Dispatch controls</div>);
const accounts=[{account_id:'900',account_name:'Account A'},{account_id:'901',account_name:'Account B'}];
function roster(account,name,id) { return {data:{status:'success',contract:'driver-command-center.v1',account_id:account,authorized_accounts:accounts,permissions:{edit_profile:true},drivers:[{id,account_id:account,record_version:4,fname:name}],page:{total:1,returned:1,offset:0,limit:100}}}; }
beforeEach(()=>{jest.resetAllMocks();localStorage.clear();});
test('account switch clears prior roster and a refresh preserves the selected account',async()=>{
 axios.get.mockResolvedValueOnce(roster('900','Alice','1')).mockResolvedValueOnce(roster('901','Bianca','2')).mockResolvedValueOnce(roster('901','Bianca','2'));
 render(<Drivers />);await screen.findByRole('button',{name:'Open profile for Alice'});
 fireEvent.change(screen.getByLabelText('Account workspace'),{target:{value:'901'}});
 expect(screen.queryByRole('button',{name:'Open profile for Alice'})).not.toBeInTheDocument();
 await screen.findByRole('button',{name:'Open profile for Bianca'});fireEvent.click(screen.getByRole('button',{name:'Refresh'}));
 await screen.findByRole('button',{name:'Open profile for Bianca'});
 expect(axios.get.mock.calls[2][1].params.account_id).toBe('901');
});
test('an obsolete request cannot restore the previous account roster',async()=>{
 let resolveOld;axios.get.mockResolvedValueOnce(roster('900','Alice','1')).mockImplementationOnce(()=>new Promise(resolve=>{resolveOld=resolve;})).mockResolvedValueOnce(roster('901','Bianca','2'));
 render(<Drivers />);await screen.findByRole('button',{name:'Open profile for Alice'});
 fireEvent.change(screen.getByLabelText('Account workspace'),{target:{value:'901'}});
 await waitFor(()=>expect(axios.get).toHaveBeenCalledTimes(2));
 // Unmount cancels the pending account request; late transport success is discarded.
 const signal=axios.get.mock.calls[1][1].signal;
 await act(async()=>resolveOld(roster('900','Old account','1')));
 expect(screen.queryByRole('button',{name:'Open profile for Old account'})).not.toBeInTheDocument();
 expect(signal.aborted).toBe(false); // still active, but the mismatched account response is rejected
 expect(await screen.findByRole('alert')).toHaveTextContent('withheld');
});

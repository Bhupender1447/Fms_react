import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import NativeEldCaptures from './NativeEldCaptures';
import { exampleNativeBatch } from './nativeEldModel';
const reply=(body,status=200)=>({ok:status>=200&&status<300,status,json:async()=>body});
const flags={status:'success',account_id:'3',mode:'PROTOTYPE_ONLY',official_log:false,device_authenticated:false,hos_assessed:false,dispatch_authorized:false};
const choice={account_id:'3',name:'Synthetic lab account',can_write:true};
const capture={record_id:'1',session_ref:'a'.repeat(32),event_count:9,recorded_at:'2026-10-25 20:00:00.000000'};
const list=(captures=[],overrides={})=>reply({...flags,captures,next_cursor:null,...overrides});
let originalFetch,cryptoDescriptor;
beforeEach(()=>{originalFetch=global.fetch;global.fetch=jest.fn();cryptoDescriptor=Object.getOwnPropertyDescriptor(window,'crypto');Object.defineProperty(window,'crypto',{configurable:true,value:{getRandomValues:array=>{array.fill(1);return array;}}});});
afterEach(()=>{global.fetch=originalFetch;if(cryptoDescriptor)Object.defineProperty(window,'crypto',cryptoDescriptor);else delete window.crypto;});
const show=(props={})=>render(<NativeEldCaptures raw={exampleNativeBatch()} schemaValid onLoad={jest.fn()} {...props}/>);
test('no authorized lab account never fetches or writes global captures',async()=>{
  global.fetch.mockResolvedValue(reply({status:'success',accounts:[]}));show();
  expect(await screen.findByText(/No native ELD lab permissions/)).toBeVisible();expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button',{name:'Save encrypted lab capture'})).toBeDisabled();
});
test('read-only account may list and load but cannot save',async()=>{
  global.fetch.mockResolvedValueOnce(reply({status:'success',accounts:[{...choice,can_write:false}]})).mockResolvedValueOnce(list([capture]));show();
  await screen.findByText('9 prototype events');expect(screen.getByRole('button',{name:'Save encrypted lab capture'})).toBeDisabled();
});
test('save uses credentials and CSRF and reports a persisted lab capture without official authority',async()=>{
  global.fetch.mockResolvedValueOnce(reply({status:'success',accounts:[choice]})).mockResolvedValueOnce(list())
    .mockResolvedValueOnce(reply({status:'success',token:'b'.repeat(64)}))
    .mockResolvedValueOnce(reply({...flags,session_ref:capture.session_ref,event_count:9,replayed:false,persisted_lab_capture:true})).mockResolvedValueOnce(list([capture]));
  show();const save=screen.getByRole('button',{name:'Save encrypted lab capture'});await waitFor(()=>expect(save).toBeEnabled());fireEvent.click(save);
  await waitFor(()=>expect(global.fetch.mock.calls.some(([url])=>url.endsWith('/append'))).toBe(true));
  expect(await screen.findByText(/Encrypted lab capture saved/)).toBeVisible();
  await screen.findByText('9 prototype events');
  const request=global.fetch.mock.calls.find(([url])=>url.endsWith('/append'));expect(request[1].credentials).toBe('include');expect(request[1].headers['X-SIS-CSRF']).toBe('b'.repeat(64));
  expect(JSON.parse(request[1].body)).toMatchObject({account_id:'3',request_id:'01'.repeat(16),batch:{mode:'PROTOTYPE_ONLY'}});
});
test('ambiguous transport failure retries the same request key for unchanged input',async()=>{
  global.fetch.mockResolvedValueOnce(reply({status:'success',accounts:[choice]})).mockResolvedValueOnce(list())
    .mockResolvedValueOnce(reply({status:'success',token:'b'.repeat(64)})).mockRejectedValueOnce(new Error('Response interrupted'))
    .mockResolvedValueOnce(reply({status:'success',token:'b'.repeat(64)})).mockResolvedValueOnce(reply({...flags,session_ref:capture.session_ref,event_count:9,replayed:true,persisted_lab_capture:true})).mockResolvedValueOnce(list([capture]));
  show();const save=screen.getByRole('button',{name:'Save encrypted lab capture'});await waitFor(()=>expect(save).toBeEnabled());fireEvent.click(save);
  await screen.findByText(/Response interrupted/);await waitFor(()=>expect(save).toBeEnabled());fireEvent.click(save);
  await screen.findByText(/no duplicate events saved/);const writes=global.fetch.mock.calls.filter(([url])=>url.endsWith('/append'));expect(writes).toHaveLength(2);expect(JSON.parse(writes[0][1].body).request_id).toBe(JSON.parse(writes[1][1].body).request_id);
});
test('missing CSRF never submits a batch',async()=>{
  global.fetch.mockResolvedValueOnce(reply({status:'success',accounts:[choice]})).mockResolvedValueOnce(list()).mockResolvedValueOnce(reply({status:'error'},401));show();
  const save=screen.getByRole('button',{name:'Save encrypted lab capture'});await waitFor(()=>expect(save).toBeEnabled());fireEvent.click(save);await screen.findByText(/valid staff session and request token/);
  expect(global.fetch.mock.calls.some(([url])=>url.endsWith('/append'))).toBe(false);
});
test('saved source batch is validated again before loading editor',async()=>{
  const onLoad=jest.fn();global.fetch.mockResolvedValueOnce(reply({status:'success',accounts:[choice]})).mockResolvedValueOnce(list([capture]))
    .mockResolvedValueOnce(reply({...flags,session_ref:capture.session_ref,event_count:9,persisted_lab_capture:true,batch:JSON.parse(exampleNativeBatch())}));show({onLoad});
  fireEvent.click(await screen.findByRole('button',{name:`Load capture ${capture.session_ref.slice(0,6)}`}));await waitFor(()=>expect(onLoad).toHaveBeenCalledTimes(1));expect(JSON.parse(onLoad.mock.calls[0][0]).context.device_id).toBe('EXAMPLE-DEVICE');
});
test.each(['foreign-account','authority','bad-count'])('rejects %s save response without a success notice',async kind=>{
  const result={...flags,session_ref:capture.session_ref,event_count:9,replayed:false,persisted_lab_capture:true};if(kind==='foreign-account')result.account_id='4';if(kind==='authority')result.official_log=true;if(kind==='bad-count')result.event_count=99;
  global.fetch.mockResolvedValueOnce(reply({status:'success',accounts:[choice]})).mockResolvedValueOnce(list()).mockResolvedValueOnce(reply({status:'success',token:'b'.repeat(64)})).mockResolvedValueOnce(reply(result));show();
  const save=screen.getByRole('button',{name:'Save encrypted lab capture'});await waitFor(()=>expect(save).toBeEnabled());fireEvent.click(save);await screen.findByRole('alert');expect(screen.queryByText(/Encrypted lab capture saved/)).not.toBeInTheDocument();
});
test('late account list cannot display captures for the previous account',async()=>{
  let resolveFirst;const pending=new Promise(resolve=>{resolveFirst=resolve;});
  global.fetch.mockResolvedValueOnce(reply({status:'success',accounts:[choice,{account_id:'4',name:'Other lab account',can_write:false}]})).mockReturnValueOnce(pending).mockResolvedValueOnce(list([],{account_id:'4'}));show();
  await screen.findByRole('option',{name:'Other lab account'});fireEvent.change(screen.getByLabelText('Native ELD operating account'),{target:{value:'3'}});await waitFor(()=>expect(global.fetch).toHaveBeenCalledTimes(2));
  fireEvent.change(screen.getByLabelText('Native ELD operating account'),{target:{value:'4'}});await screen.findByText('No saved captures on this page.');
  await act(async()=>{resolveFirst(list([capture]));});expect(screen.queryByText('9 prototype events')).not.toBeInTheDocument();
});

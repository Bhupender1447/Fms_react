import React, { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '../../config';
import { Alert, Button, Select } from '../../design-system/components';
import { readAccountResponse } from '../sis/snapshotResponse';
import { validateNativePrototype } from './nativeEldModel';

const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const ref = value => typeof value === 'string' && /^[a-f0-9]{32}$/.test(value);
async function responseBody(response, account) {
  let body; try { body = await response.json(); } catch { throw new Error('The native ELD service did not return valid JSON.'); }
  if (!response.ok || body?.status !== 'success') throw new Error(body?.message || 'Native ELD capture service is unavailable.');
  if (body.account_id !== account || body.mode !== 'PROTOTYPE_ONLY'
    || body.official_log !== false || body.device_authenticated !== false || body.hos_assessed !== false || body.dispatch_authorized !== false) throw new Error('The saved capture response could not be verified.');
  return body;
}
function requestId() {
  if (!window.crypto?.getRandomValues) throw new Error('Secure browser randomness is unavailable.');
  return [...window.crypto.getRandomValues(new Uint8Array(16))].map(value => value.toString(16).padStart(2, '0')).join('');
}

export default function NativeEldCaptures({ raw, schemaValid, onLoad, onBusyChange }) {
  const [accounts,setAccounts]=useState([]); const [account,setAccount]=useState(''); const [loading,setLoading]=useState(true);
  const [captures,setCaptures]=useState([]); const [cursor,setCursor]=useState(null); const [more,setMore]=useState(null);
  const [error,setError]=useState(''); const [notice,setNotice]=useState(''); const [reload,setReload]=useState(0);
  const [accountRetry,setAccountRetry]=useState(0); const [saving,setSaving]=useState(false); const [opening,setOpening]=useState(false);
  const [accountsLoading,setAccountsLoading]=useState(true);
  const pending = useRef(null); const idempotency = useRef(null); const selected = useRef(account); selected.current=account;
  useEffect(()=>{ idempotency.current=null; },[raw,account]);
  useEffect(()=>{onBusyChange?.(saving||opening);},[saving,opening,onBusyChange]);
  useEffect(()=>()=>onBusyChange?.(false),[onBusyChange]);
  useEffect(()=>{
    const controller=new AbortController(); setAccountsLoading(true); setError('');setNotice(''); setAccounts([]); setAccount('');setCursor(null); setCaptures([]);
    (async()=>{try{
      const response=await fetch(`${BASE_URL}api/sis/native-eld/accounts`,{credentials:'include',signal:controller.signal,headers:{Accept:'application/json'}});
      const values=await readAccountResponse(response);if(values.some(value=>typeof value.can_write!=='boolean'))throw new Error('Lab permissions could not be verified.'); if(controller.signal.aborted)return;
      setAccounts(values); if(values.length===1)setAccount(values[0].account_id);
    }catch(failure){if(!controller.signal.aborted)setError(failure.message);}finally{if(!controller.signal.aborted)setAccountsLoading(false);}})();
    return()=>controller.abort();
  },[accountRetry]);
  useEffect(()=>{
    pending.current?.abort(); setCaptures([]); setMore(null); setError('');
    if(!account){setLoading(false);return undefined;}
    const controller=new AbortController();pending.current=controller;setLoading(true);
    (async()=>{try{
      const query=new URLSearchParams({account_id:account});if(cursor)query.set('after_id',cursor);
      const response=await fetch(`${BASE_URL}api/sis/native-eld/captures?${query}`,{credentials:'include',signal:controller.signal,headers:{Accept:'application/json'}});
      const body=await responseBody(response,account);
      if(!Array.isArray(body.captures)||body.captures.length>25||!(body.next_cursor===null||(typeof body.next_cursor==='string'&&/^[1-9][0-9]*$/.test(body.next_cursor))))throw new Error('The capture list is invalid.');
      const ids=new Set();for(const capture of body.captures){if(!object(capture)||!ref(capture.session_ref)||ids.has(capture.session_ref)||!Number.isInteger(capture.event_count)||capture.event_count<1||typeof capture.recorded_at!=='string')throw new Error('The capture list contains invalid records.');ids.add(capture.session_ref);}
      if(controller.signal.aborted)return;setCaptures(body.captures);setMore(body.next_cursor);
    }catch(failure){if(!controller.signal.aborted)setError(failure.message);}finally{if(!controller.signal.aborted)setLoading(false);}})();
    return()=>controller.abort();
  },[account,cursor,reload]);
  useEffect(()=>()=>pending.current?.abort(),[]);
  const save=async()=>{
    if(!account||!accounts.find(value=>value.account_id===account)?.can_write||!schemaValid||loading||saving||opening)return;
    const current=account;setSaving(true);setError('');setNotice('');const controller=new AbortController();pending.current?.abort();pending.current=controller;
    try{
      const validated=validateNativePrototype(raw);if(!validated.schema_valid)throw new Error('Validate this batch before saving.');
      if(!idempotency.current)idempotency.current=requestId();
      const tokenResponse=await fetch(`${BASE_URL}api/sis/csrf-token`,{credentials:'include',signal:controller.signal,headers:{Accept:'application/json'}});
      const token=await tokenResponse.json();if(!tokenResponse.ok||token.status!=='success'||typeof token.token!=='string'||!/^[a-f0-9]{64}$/.test(token.token))throw new Error('A valid staff session and request token are required.');
      if(controller.signal.aborted||selected.current!==current)return;
      const response=await fetch(`${BASE_URL}api/sis/native-eld/captures/append`,{method:'POST',credentials:'include',signal:controller.signal,headers:{'Content-Type':'application/json','X-SIS-CSRF':token.token,Accept:'application/json'},body:JSON.stringify({account_id:current,request_id:idempotency.current,batch:JSON.parse(raw)})});
      const body=await responseBody(response,current);
      if(!ref(body.session_ref)||body.persisted_lab_capture!==true||typeof body.replayed!=='boolean'||body.event_count!==validated.summary.event_count)throw new Error('The save result could not be verified. Refresh saved captures before retrying.');
      if(controller.signal.aborted||selected.current!==current)return;
      setCursor(null);setReload(value=>value+1);setNotice(body.replayed?'Existing capture returned; no duplicate events saved.':'Encrypted lab capture saved. It is not an official ELD log.');
    }catch(failure){if(!controller.signal.aborted&&selected.current===current)setError(`${failure.message} If the response was interrupted, refresh saved captures or retry the same unchanged batch.`);}
    finally{setSaving(false);}
  };
  const open=async reference=>{
    if(opening||saving||!account)return;const current=account;setOpening(true);setError('');const controller=new AbortController();pending.current?.abort();pending.current=controller;
    try{
      const response=await fetch(`${BASE_URL}api/sis/native-eld/captures/${reference}?account_id=${encodeURIComponent(current)}`,{credentials:'include',signal:controller.signal,headers:{Accept:'application/json'}});
      const body=await responseBody(response,current);const text=JSON.stringify(body.batch,null,2);const validated=validateNativePrototype(text);
      if(body.session_ref!==reference||body.persisted_lab_capture!==true||!validated.schema_valid||body.event_count!==validated.summary.event_count)throw new Error('Saved event evidence failed validation.');
      if(controller.signal.aborted||selected.current!==current)return;onLoad(text);setNotice('Saved lab capture loaded. Validate to inspect its timeline; device evidence remains unverified.');
    }catch(failure){if(!controller.signal.aborted&&selected.current===current)setError(failure.message);}finally{setOpening(false);}
  };
  return <section className="iso-native-saved" aria-label="Saved native ELD lab captures"><h3>Account-scoped saved captures</h3><p>Encrypted server storage for lab evidence. Saving a capture does not verify a device or create an official log.</p>
    <Select label="Native ELD operating account" value={account} disabled={accountsLoading||saving||opening} onChange={event=>{pending.current?.abort();setCaptures([]);setNotice('');setCursor(null);setAccount(event.target.value);}}><option value="">Choose an authorized account</option>{accounts.map(value=><option key={value.account_id} value={value.account_id}>{value.name}</option>)}</Select>
    {!accountsLoading&&!accounts.length&&!error&&<p>No native ELD lab permissions are available for your session.</p>}
    <div className="iso-native-actions"><Button disabled={!account||accounts.find(value=>value.account_id===account)?.can_write!==true||!schemaValid||loading||saving||opening} onClick={save}>{saving?'Saving capture…':'Save encrypted lab capture'}</Button><Button variant="secondary" disabled={!account||saving||opening} onClick={()=>setReload(value=>value+1)}>Refresh saved captures</Button></div>
    {error&&<Alert tone="danger" title="Saved captures unavailable" action={<Button variant="secondary" onClick={()=>setAccountRetry(value=>value+1)} disabled={saving||opening}>Retry account access</Button>}>{error}</Alert>}
    {notice&&<p role="status">{notice}</p>}{(accountsLoading||loading)&&<p role="status">Loading lab access…</p>}
    <ul className="iso-native-capture-list">{captures.map(capture=><li key={capture.session_ref}><div><strong>{capture.event_count} prototype events</strong><small>{capture.recorded_at} UTC · {capture.session_ref.slice(0,10)}</small></div><Button variant="secondary" disabled={saving||opening} onClick={()=>open(capture.session_ref)}>Load capture {capture.session_ref.slice(0,6)}</Button></li>)}</ul>
    {!loading&&account&&!error&&!captures.length&&<p>No saved captures on this page.</p>}
    <div className="iso-native-actions"><Button variant="secondary" disabled={!cursor||saving||opening} onClick={()=>setCursor(null)}>First page</Button><Button variant="secondary" disabled={!more||saving||opening} onClick={()=>setCursor(more)}>Older captures</Button></div>
  </section>;
}

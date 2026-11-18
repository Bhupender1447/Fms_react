import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../config';
import { Alert, Button, Input, Select } from '../../design-system/components';
const errorOf = error => error.response?.data?.message || error.message || 'Email action failed.';
const key = () => `invoice-mail-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const addresses = text => text.split(/[;,\n]/).map(value=>value.trim()).filter(Boolean);
const labels = {POD:'Signed proof of delivery (POD)',BOL:'Bill of lading (BOL)',RATE_CONFIRMATION:'Load / rate confirmation',OTHER:'Other required document'};
export default function InvoiceEmailPanel({ invoiceId }) {
  return <EmailPacket key={invoiceId} invoiceId={invoiceId}/>;
}
function EmailPacket({ invoiceId }) {
  const [open,setOpen]=useState(false),[data,setData]=useState(null),[error,setError]=useState(''),[notice,setNotice]=useState(''),[busy,setBusy]=useState(false),[reload,setReload]=useState(0);
  const [dirty,setDirty]=useState(false),[draft,setDraft]=useState(null),[form,setForm]=useState(null),[profile,setProfile]=useState(null),[checks,setChecks]=useState(null),[approved,setApproved]=useState(false);
  const [file,setFile]=useState(null),[type,setType]=useState('RATE_CONFIRMATION'),[reviewNotes,setReviewNotes]=useState({});
  const inFlight=useRef(false),mounted=useRef(true),sendKey=useRef(key());
  const base=`${BASE_URL}api/invoices/${encodeURIComponent(invoiceId)}/communications`;
  useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
  useEffect(()=>{if(!open)return undefined;const controller=new AbortController();axios.get(base,{withCredentials:true,signal:controller.signal}).then(({data:reply})=>{if(reply.status!==true||!Array.isArray(reply.attachments))throw new Error(reply.message||'Invoice packet is unavailable.');if(!controller.signal.aborted){setData(reply);setProfile(reply.profile);}}).catch(failure=>{if(!controller.signal.aborted)setError(errorOf(failure));});return()=>controller.abort();},[base,open,reload]);
  const edit = message => {setDirty(false);setDraft(message);setForm({to:message.to.join(', '),cc:message.cc.join(', '),bcc:message.bcc.join(', '),subject:message.subject,body:message.body_text,signature:message.signature_text,connection_id:String(message.connection_id||''),attachment_ids:message.attachments.filter(a=>a.document_type!=='INVOICE_PDF').map(a=>String(a.id))});setChecks(null);setApproved(false);sendKey.current=key();};
  const change=(field,value)=>{setDirty(true);setForm(current=>({...current,[field]:value}));setChecks(null);setApproved(false);};
  const action=async(path,body,success,after)=>{if(inFlight.current)return;inFlight.current=true;setBusy(true);setError('');setNotice('');try{const {data:reply}=await axios.post(`${base}/${path}`,body,{withCredentials:true});if(reply.status!==true)throw new Error(reply.message||'Email action was not confirmed.');if(mounted.current){setNotice(success);setReload(value=>value+1);after?.(reply);}return reply;}catch(failure){if(mounted.current)setError(errorOf(failure));return null;}finally{inFlight.current=false;if(mounted.current)setBusy(false);}};
  const save = () => action('draft',{id:draft.id,version:draft.version,message_kind:draft.message_kind,...form,to:addresses(form.to),cc:addresses(form.cc),bcc:addresses(form.bcc)},'Email draft saved. Review the current attachment packet.',reply=>edit(reply.message));
  const connect=async()=>{if(inFlight.current||!data)return;inFlight.current=true;setBusy(true);setError('');try{const {data:reply}=await axios.post(`${BASE_URL}api/invoice-mail/accounts/${data.account_id}/connect`,{},{withCredentials:true});if(reply.status!==true||!reply.authorization_url?.startsWith('https://accounts.google.com/'))throw new Error(reply.message||'Could not start Google authorization.');window.location.assign(reply.authorization_url);}catch(failure){setError(errorOf(failure));}finally{inFlight.current=false;setBusy(false);}};
  return <section className="billing-email-packet" aria-label="Invoice email packet">
    <h4>Invoice email & supporting paperwork</h4><p>Prepare one reviewed email with the invoice PDF, load confirmation, POD, BOL and other required documents.</p>
    <Button variant="secondary" disabled={busy} onClick={()=>{setOpen(value=>!value);setError('');}}>{open?'Hide email packet':'Open invoice email packet'}</Button>
    {error&&<Alert tone="danger" title="Invoice email action failed">{error}</Alert>}{notice&&<p role="status">{notice}</p>}
    {open&&!data&&!error&&<p role="status">Loading invoice documents and Gmail setup...</p>}
    {open&&data&&<>
      <div className="billing-email-section"><h5>Company Gmail / Google Workspace</h5>
        <p>{data.connections.length?data.connections.map(c=>`${c.sender_email} (${c.status})`).join(' / '):'No company mailbox connected.'}</p>
        {!data.gmail_setup.configured&&<p>Configure the private Google web OAuth client on the API server.</p>}
        {!data.gmail_setup.send_enabled&&<p>Real Gmail sending is disabled in server configuration.</p>}
        <p>Google OAuth callback: <code>{data.gmail_setup.redirect_uri}</code></p>
        <p>Register this exact callback in your Google web OAuth client and enable Gmail API, then connect the company mailbox.</p>
        {data.can_configure_mailbox&&<Button variant="secondary" disabled={busy||!data.gmail_setup.configured} onClick={connect}>Connect Gmail / Google Workspace</Button>}
      </div>
      <details className="billing-email-section"><summary>Customer billing details & email signature</summary><form className="billing-action-form" onSubmit={event=>{event.preventDefault();action('profile',{...profile,reminders_enabled:!!Number(profile.reminders_enabled),auto_prepare:!!Number(profile.auto_prepare),expected_version:profile.version},'Billing contact and payment instructions saved.');}}>
        <Input label="Customer billing name" required value={profile.billing_name} onChange={e=>setProfile({...profile,billing_name:e.target.value})}/>
        <Input label="Customer billing email" type="email" required value={profile.billing_email} onChange={e=>setProfile({...profile,billing_email:e.target.value})}/>
        <label>Customer billing address<textarea required value={profile.billing_address} onChange={e=>setProfile({...profile,billing_address:e.target.value})}/></label>
        <label>Approved payment instructions<textarea required value={profile.payment_instructions} onChange={e=>setProfile({...profile,payment_instructions:e.target.value})}/></label>
        <label>Company email signature<textarea value={profile.signature} onChange={e=>setProfile({...profile,signature:e.target.value})}/></label>
        <Button type="submit" disabled={busy||!data.can_send}>Save billing email details</Button>
      </form></details>
      <div className="billing-email-section"><h5>Required invoice packet</h5><p>Invoice PDF is generated automatically. POD and BOL come from the driver's trip uploads after dispatch approval. Missing or unapproved paperwork blocks sending.</p>
        <ul>{data.profile.invoice_documents.map(t=><li key={t}>{labels[t]||t}: {data.attachments.some(a=>a.document_type===t&&a.review_status==='APPROVED')?'Approved document available':'Missing / awaiting review'}</li>)}</ul>
        <form className="billing-action-form" onSubmit={event=>{event.preventDefault();const body=new FormData();body.append('document',file);body.append('document_type',type);action('upload',body,'Supporting document uploaded for review.',()=>setFile(null));}}>
          <Select label="Billing attachment type" value={type} onChange={e=>setType(e.target.value)}>{Object.entries(labels).map(([value,label])=><option key={value} value={value}>{label}</option>)}</Select>
          <Input label="Supporting document file" type="file" accept="application/pdf,image/jpeg,image/png,image/gif" required onChange={e=>setFile(e.target.files[0]||null)}/><Button type="submit" disabled={busy||!file}>Upload billing document</Button>
        </form>
        {data.trip_documents.length>0&&<><h5>Driver trip uploads</h5><p>Review driver documents in the trip workflow before importing them. BOL, POD and load confirmations are included automatically when preparing a packet.</p><ul>{data.trip_documents.map(doc=><li key={doc.id}>{doc.imagetype} / {doc.review_status}{['POD','BOL','RATE_CONFIRMATION','PICKUP_DOCS'].includes(doc.imagetype)&&<Button variant="secondary" disabled={busy||doc.review_status!=='APPROVED'} onClick={()=>action('import',{document_id:doc.id,document_type:doc.imagetype==='PICKUP_DOCS'?'BOL':doc.imagetype},'Driver document linked to the invoice packet.')}>Link document {doc.id}</Button>}</li>)}</ul></>}
        {data.attachments.length>0&&<ul className="billing-document-list">{data.attachments.map(a=><li key={a.id}><a href={`${BASE_URL}${a.download_url}`} target="_blank" rel="noreferrer">{a.original_name}</a> / {a.document_type} / {a.review_status}
          {data.can_send&&!a.source_document_id&&a.document_type!=='INVOICE_PDF'&&<><Input label={`Review note for ${a.original_name}`} value={reviewNotes[a.id]||''} onChange={e=>setReviewNotes({...reviewNotes,[a.id]:e.target.value})}/><Button variant="secondary" disabled={busy||!reviewNotes[a.id]?.trim()} onClick={()=>action('review',{attachment_id:a.id,decision:'APPROVED',note:reviewNotes[a.id]},'Document approved for the email packet.')}>Approve document {a.id}</Button><Button variant="secondary" disabled={busy||!reviewNotes[a.id]?.trim()} onClick={()=>action('review',{attachment_id:a.id,decision:'REJECTED',note:reviewNotes[a.id]},'Document rejected; sending will require corrected paperwork.')}>Reject document {a.id}</Button></>}
        </li>)}</ul>}
      </div>
      <Button disabled={busy} onClick={()=>action('prepare',{connection_id:data.connections.find(c=>c.status==='CONNECTED'&&c.provider==='GMAIL')?.id||null},'Email draft prepared with the invoice PDF and approved supporting paperwork.',reply=>edit(reply.message))}>Prepare complete invoice email</Button>
      {draft&&form&&<div className="billing-email-section"><h5>Email draft / revision {draft.version}</h5><p>Status: {draft.status}. Save changes before checking readiness.</p>{dirty&&<p role="status">Unsaved changes. Save this draft before checking or sending it.</p>}
        {draft.status==='DRAFT'?<><form className="billing-action-form" onSubmit={event=>{event.preventDefault();save();}}>
          <Select label="Send invoice from" value={form.connection_id} onChange={e=>change('connection_id',e.target.value)}><option value="">Choose a connected mailbox</option>{data.connections.map(c=><option key={c.id} value={c.id}>{c.sender_email} / {c.status}</option>)}</Select>
          {['to','cc','bcc'].map(field=><Input key={field} label={field.toUpperCase()} required={field==='to'} value={form[field]} onChange={e=>change(field,e.target.value)}/>)}
          <Input label="Invoice email subject" required value={form.subject} onChange={e=>change('subject',e.target.value)}/>
          <label>Invoice email body<textarea required rows={10} value={form.body} onChange={e=>change('body',e.target.value)}/></label><label>Email signature<textarea value={form.signature} onChange={e=>change('signature',e.target.value)}/></label>
          <fieldset><legend>Supporting attachments</legend><p>Current invoice PDF is always attached.</p>{data.attachments.filter(a=>a.document_type!=='INVOICE_PDF'&&a.document_type!=='PAYMENT_EVIDENCE').map(a=><label key={a.id}><input type="checkbox" checked={form.attachment_ids.includes(String(a.id))} onChange={e=>change('attachment_ids',e.target.checked?[...form.attachment_ids,String(a.id)]:form.attachment_ids.filter(id=>id!==String(a.id)))}/>{a.original_name} / {a.document_type} / {a.review_status}</label>)}</fieldset>
          <Button type="submit" disabled={busy}>Save email draft</Button></form>
          <Button variant="secondary" disabled={busy||dirty} onClick={()=>action('preflight',{message_id:draft.id},'Saved draft checked.',reply=>{setChecks(reply);setApproved(false);})}>Check saved email & attachments</Button>
          {checks&&<div role="status">{checks.ready?'Saved packet is ready for dispatch review.':<ul>{checks.blockers.map(reason=><li key={reason}>{reason}</li>)}</ul>}</div>}
          {data.can_send&&<><label className="billing-email-approval"><input type="checkbox" disabled={busy||!checks?.ready} checked={approved} onChange={e=>setApproved(e.target.checked)}/>I reviewed the saved recipients, invoice amount, email and supporting documents.</label><Button disabled={busy||dirty||!approved||!checks?.ready} onClick={()=>action('send',{message_id:draft.id,version:draft.version,approve:true,request_key:sendKey.current},'Send request processed. Review the recorded result below.',reply=>{setDraft(reply.message);setChecks(null);setApproved(false);})}>Send invoice email</Button></>}
        </>:<p>{draft.status==='SENT'?'Gmail accepted this email. Customer receipt is not yet confirmed.':draft.status==='LOCAL_CAPTURED'?'Local test capture only; no email was delivered.':draft.error_message||'Refresh history to review the send result.'}</p>}
      </div>}
      <div className="billing-email-section"><h5>Email history</h5><Button variant="secondary" disabled={busy} onClick={()=>setReload(value=>value+1)}>Refresh email history</Button><ul>{data.messages.map(m=><li key={m.id}>{m.subject} / {m.status} / {m.to.join(', ')} / {m.created_at} UTC{m.error_message&&<p>{m.error_message}</p>}{m.status==='UNKNOWN'&&data.can_send&&<Button variant="secondary" disabled={busy} onClick={()=>action('reconcile',{message_id:m.id},'Gmail sent-history check completed. Review the recorded message status.')}>Check Gmail acceptance {m.id}</Button>}{m.status==='DRAFT'&&<Button variant="secondary" disabled={busy} onClick={()=>edit(m)}>Review draft {m.id}</Button>}{m.status==='SENT'&&<p>Provider accepted; customer receipt not confirmed.</p>}</li>)}</ul>{!data.messages.length&&<p>No invoice emails prepared yet.</p>}</div>
    </>}
  </section>;
}

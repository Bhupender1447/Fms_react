import React, { useState } from 'react';

const fields = [['trailer_length_ft','Trailer length (ft)'],['total_length_ft','Total tractor + trailer length (ft)'],['height_ft','Maximum loaded height (ft)'],['width_ft','Maximum width (ft)'],['gross_weight_lb','Actual gross loaded weight (lb)'],['axles','Total axles']];
export default function TruckRoutingProfile({ profile, onSave, busy, requireNorthAmerica = false }) {
  const [draft,setDraft]=useState({...profile?.measurements,trailer_length_ft:profile?.measurements?.trailer_length_ft??53,measurements_confirmed:false,hazmat:profile?.measurements?.hazmat??''});
  return <section className="workflow-card"><h2>53-foot trailer · truck routing profile</h2><p>Trailer length is separate from the complete tractor-and-trailer length. Enter actual loaded measurements; a 53-foot trailer does not determine height, width or gross weight.</p>
    {profile&&<p className="workflow-source-state">Confirmed profile v{profile.version} · truck {profile.truck_id} / trailer {profile.trailer_id}</p>}
    <form onSubmit={event=>{event.preventDefault();onSave({...draft,expected_profile_version:profile?.version??0});}}><div className="workflow-form">{fields.map(([key,label])=><label key={key}>{label}<input required type="number" min={key==='axles'?2:0.1} step={key==='axles'?1:'any'} value={draft[key]??''} disabled={busy} onChange={event=>setDraft({...draft,[key]:event.target.value})}/></label>)}
      <div className="workflow-span"><h3 className="truck-profile-weight-title">Canada & cross-border weight details</h3><p>Use scale and registration records. Enter the heaviest loaded axle; do not divide gross weight by axle count.</p></div>
      {[['empty_weight_lb','Empty tractor + trailer weight (lb)'],['permitted_weight_lb','Registered gross weight (lb)'],['max_axle_weight_lb','Heaviest loaded axle weight (lb)']].map(([key,label])=><label key={key}>{label}<input required={requireNorthAmerica} type="number" min="1" step="any" value={draft[key]??''} disabled={busy} onChange={event=>setDraft({...draft,[key]:event.target.value})}/></label>)}
      <label>Load classification<select required value={draft.hazmat} disabled={busy} onChange={event=>setDraft({...draft,hazmat:event.target.value})}><option value="">Confirm load type</option><option value="NONE">Non-hazardous load</option><option value="HAZMAT">Hazardous goods · specialist profile required</option></select></label>
      <label className="workflow-checkbox workflow-span"><input type="checkbox" required checked={draft.measurements_confirmed} disabled={busy} onChange={event=>setDraft({...draft,measurements_confirmed:event.target.checked})}/>I checked these measurements for the actual loaded vehicle and assigned equipment.</label></div>
      {draft.hazmat==='HAZMAT'&&<p role="alert">Hazardous goods need a separately verified routing profile. This profile cannot calculate a hazardous-load route.</p>}
      <button className="driver-button driver-button-primary" disabled={busy||draft.hazmat!=='NONE'}>Confirm truck dimensions</button></form>
  </section>;
}

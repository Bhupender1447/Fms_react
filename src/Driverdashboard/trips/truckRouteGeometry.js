export function truckNavigationPath(tripId, target = 'pickup') {
  return `/driver/navigation/${encodeURIComponent(tripId)}?target=${encodeURIComponent(target)}`;
}

export function decodeTruckPolyline(encoded) {
  if (typeof encoded !== 'string' || encoded.length > 150000) return [];
  let index=0,lat=0,lng=0;const points=[];
  function delta(){let result=0,shift=0,byte;do{if(index>=encoded.length||shift>30)throw new Error('Invalid route geometry');byte=encoded.charCodeAt(index++)-63;if(byte<0||byte>63)throw new Error('Invalid route geometry');result|=(byte&31)<<shift;shift+=5;}while(byte>=32);return result&1?~(result>>1):result>>1;}
  try {while(index<encoded.length){lat+=delta();lng+=delta();const point={lat:lat/1e5,lng:lng/1e5};if(Math.abs(point.lat)>90||Math.abs(point.lng)>180||points.length>=20000)return [];points.push(point);}}catch{return [];}
  return points.length>=2?points:[];
}

export function distanceFromTruckRoute(position,path) {
  if(!position||path.length<2)return Infinity;
  const scaleX=111320*Math.cos(position.lat*Math.PI/180),scaleY=111320;
  let minimum=Infinity;
  for(let i=1;i<path.length;i++){
    const ax=(path[i-1].lng-position.lng)*scaleX,ay=(path[i-1].lat-position.lat)*scaleY;
    const bx=(path[i].lng-position.lng)*scaleX,by=(path[i].lat-position.lat)*scaleY;
    const dx=bx-ax,dy=by-ay;const t=Math.max(0,Math.min(1,-(ax*dx+ay*dy)/(dx*dx+dy*dy||1)));
    minimum=Math.min(minimum,Math.hypot(ax+t*dx,ay+t*dy));
  }
  return minimum;
}
export function truckNavigationContextChanged(previous, next, target = 'pickup') {
  if (next?.status !== true || next.workflow?.safety_blocked || next.workflow?.safety_holds?.length || !['ACTIVE','IN_PROGRESS','PAUSED'].includes(next.trip_status)) return true;
  const identity = value => [value?.assignment_id,value?.driver_id,value?.truck_id,value?.trailer_id,value?.workflow?.routing_profile?.version,value?.pickup_address,value?.delivery_address].map(item=>String(item??'')).join('|');
  if (identity(previous)!==identity(next)) return true;
  if (target.startsWith('stop:')) {
    const id=target.slice(5),before=previous?.stops?.find(stop=>String(stop.id)===id),after=next.stops?.find(stop=>String(stop.id)===id);
    if (!before || !after || after.execution_status==='COMPLETED') return true;
    return ['location','address1','address2','city','state','zip','country','stoptype'].some(key=>String(before[key]??'')!==String(after[key]??''));
  }
  return false;
}

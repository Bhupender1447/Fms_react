import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { GoogleMap, MarkerF, PolylineF, useJsApiLoader } from '@react-google-maps/api';
import { BASE_URL } from '../../config';
import { GOOGLE_MAPS_API_KEY, GOOGLE_MAPS_LIBRARIES } from '../../mapConfig';
import { decodeTruckPolyline, distanceFromTruckRoute, truckNavigationContextChanged } from './truckRouteGeometry';
import './trip-workflow.css';
import './truck-navigation.css';

function TruckMap({ path, position, destination, usable, follow, route, paused }) {
  const {isLoaded,loadError}=useJsApiLoader({id:'isovia-google-maps-script',googleMapsApiKey:GOOGLE_MAPS_API_KEY,libraries:GOOGLE_MAPS_LIBRARIES});
  const map=useRef(null);
  const fit=useCallback(instance=>{map.current=instance;const bounds=new window.google.maps.LatLngBounds();path.forEach(point=>bounds.extend(point));if(path.length)instance.fitBounds(bounds);},[path]);
  useEffect(()=>{if(map.current&&follow&&position)map.current.panTo(position);},[position,follow]);
  useEffect(()=>{if(map.current&&path.length)fit(map.current);},[path,fit]);
  if(loadError)return <><p role="alert">Interactive map unavailable. Showing the route map instead.</p><ServerTruckMap route={route} position={position} follow={follow} paused={paused}/></>;
  if(!isLoaded)return <p role="status">Loading Google Maps…</p>;
  const center=position||path[0]||destination;
  return <GoogleMap mapContainerClassName="truck-navigation-map" center={center} zoom={14} onLoad={fit} options={{streetViewControl:false,mapTypeControl:false,fullscreenControl:true}}>
    {path.length>1&&<PolylineF path={path} options={{strokeColor:usable?'#710d2d':'#ad3049',strokeWeight:6,strokeOpacity:0.9}}/>}
    {position&&<MarkerF position={position} label="You"/>}{destination&&<MarkerF position={destination} label="Stop"/>}
  </GoogleMap>;
}

function ServerTruckMap({ route, position, follow, paused = false }) {
  const [point,setPoint]=useState(follow?position:null),[failed,setFailed]=useState(false),[refresh,setRefresh]=useState(0),[zoom,setZoom]=useState(15);
  const latest=useRef(position);latest.current=position;
  useEffect(()=>{
    if(paused)return;
    setFailed(false);setPoint(follow?latest.current:null);
    if(!follow)return;
    const timer=window.setInterval(()=>{const next=latest.current;if(!next||Date.now()-next.timestamp*1000>120000||next.accuracy>100)return;setPoint(prior=>!prior||Math.hypot((next.lat-prior.lat)*111320,(next.lng-prior.lng)*111320*Math.cos(next.lat*Math.PI/180))>30?next:prior);},20000);
    return()=>window.clearInterval(timer);
  },[route.route_id,follow,paused]);
  if(!route.route_id)return <p role="status">Route map is unavailable. Recalculate the saved truck route.</p>;
  const query=point?`?lat=${encodeURIComponent(point.lat)}&lng=${encodeURIComponent(point.lng)}&v=${refresh}&zoom=${zoom}`:`?v=${refresh}`;
  return <><div className="truck-map-controls"><button className="driver-button driver-button-light" aria-label="Zoom out" disabled={paused||!follow||!point||zoom<=10} onClick={()=>setZoom(value=>value-1)}>−</button><span>{follow?`Zoom ${zoom}`:'Route overview'}</span><button className="driver-button driver-button-light" aria-label="Zoom in" disabled={paused||!follow||!point||zoom>=18} onClick={()=>setZoom(value=>value+1)}>+</button></div><p className="truck-map-mode">{follow?'Following device location · map refreshes as you move':'Full truck route overview'}</p>{failed?<p role="alert">The route map could not load. Route instructions remain available; refresh the map or recalculate.</p>:<img className="truck-server-map" src={`${BASE_URL}api/maps/trip/truck-map/${route.route_id}${query}`} alt="Google map showing the calculated truck route and your device position" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>}<button className="driver-button driver-button-light" disabled={paused} onClick={()=>{setFailed(false);setPoint(follow?latest.current:null);setRefresh(value=>value+1);}}>Refresh map</button></>;
}

export default function TruckNavigation() {
  const {tripId}=useParams();
  return <TruckNavigationContent key={tripId} tripId={tripId}/>;
}

function TruckNavigationContent({tripId}) {
  const [parameters]=useSearchParams();const initial=parameters.get('target')||'pickup';
  const [data,setData]=useState(null),[target,setTarget]=useState(initial),[position,setPosition]=useState(null),[route,setRoute]=useState(null),[error,setError]=useState(''),[gpsError,setGpsError]=useState(''),[busy,setBusy]=useState(false),[follow,setFollow]=useState(true),[voice,setVoice]=useState(false),[step,setStep]=useState(0),[clock,setClock]=useState(Date.now()),[gpsRevision,setGpsRevision]=useState(0),[online,setOnline]=useState(navigator.onLine!==false),[reload,setReload]=useState(0),[pageVisible,setPageVisible]=useState(document.visibilityState!=='hidden');
  const gate=useRef(false),request=useRef(null),mounted=useRef(true),initialRoute=useRef(false),latestPosition=useRef(null),hiddenAt=useRef(null);
  const path=useMemo(()=>decodeTruckPolyline(route?.encoded_polyline),[route]);
  const stale=!position||clock-position.timestamp*1000>120000||position.accuracy>100;
  const offRoute=route?.usable&&position&&path.length>1&&distanceFromTruckRoute(position,path)>Math.max(75,position.accuracy*2);
  const profile=data?.workflow?.routing_profile;
  const safetyHeld=!!data?.workflow?.safety_blocked||!!data?.workflow?.safety_holds?.length;
  const guidanceActive=pageVisible&&online&&data?.trip_status==='IN_PROGRESS'&&!safetyHeld;
  const canCalculate=pageVisible&&online&&!gpsError&&!safetyHeld&&!!profile&&data?.workflow?.truck_routing?.configured&&['ACTIVE','IN_PROGRESS','PAUSED'].includes(data?.trip_status)&&!stale&&!busy;
  const clearRoute=()=>{request.current?.abort();gate.current=false;setBusy(false);setRoute(null);setStep(0);window.speechSynthesis?.cancel();};

  useEffect(()=>{
    mounted.current=true;const controller=new AbortController();setData(null);setRoute(null);setPosition(null);latestPosition.current=null;setGpsError('');setError('');initialRoute.current=false;
    axios.get(`${BASE_URL}api/maps/trip/status/${encodeURIComponent(tripId)}`,{withCredentials:true,signal:controller.signal}).then(response=>{if(response.data.status!==true)throw new Error(response.data.message||'Trip unavailable');if(!controller.signal.aborted)setData(response.data);}).catch(failure=>{if(!controller.signal.aborted)setError(failure.response?.data?.message||failure.message);});
    return()=>{mounted.current=false;controller.abort();request.current?.abort();window.speechSynthesis?.cancel();};
  },[tripId,reload]);
  useEffect(()=>{
    if(!data)return;
    if(!navigator.geolocation){setGpsError('GPS is unavailable on this device.');return;}
    let active=true;setGpsError('');
    const watch=navigator.geolocation.watchPosition(location=>{if(!active)return;const point={lat:location.coords.latitude,lng:location.coords.longitude,accuracy:location.coords.accuracy,timestamp:location.timestamp/1000};latestPosition.current=point;setPosition(point);setGpsError('');},failure=>{if(!active)return;setGpsError(failure?.code===1?'Location permission is blocked. Allow location for this site, then retry GPS.':failure?.code===3?'GPS timed out. Move to a clearer location and retry.':'Your location is unavailable. Enable device GPS and retry.');},{enableHighAccuracy:true,maximumAge:0,timeout:15000});
    const timer=window.setInterval(()=>setClock(Date.now()),5000);
    return()=>{active=false;navigator.geolocation.clearWatch(watch);window.clearInterval(timer);};
  },[data,gpsRevision]);
  // Check the shared assignment/profile while the map remains open; changed equipment invalidates guidance.
  useEffect(()=>{
    if(!data)return;
    const controller=new AbortController();
    let loading=false;
    const timer=window.setInterval(async()=>{if(loading||!navigator.onLine)return;loading=true;try{const response=await axios.get(`${BASE_URL}api/maps/trip/status/${encodeURIComponent(tripId)}`,{withCredentials:true,signal:controller.signal});if(controller.signal.aborted)return;const next=response.data;
      if(truckNavigationContextChanged(data,next,target)){clearRoute();setError('The trip, equipment or profile changed. Reopen the trip workspace and calculate a fresh route.');setData(null);}
      else if(next.trip_status!==data.trip_status)setData(next);
    }catch(failure){if(!controller.signal.aborted){clearRoute();setData(null);setError('Trip authorization could not be refreshed. Reopen the workspace before using guidance.');}}finally{loading=false;}},15000);
    return()=>{controller.abort();window.clearInterval(timer);};
    // The interval compares the confirmed context from this page load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data,tripId,profile?.version,target]);

  const calculate=useCallback(async()=>{
    if(gate.current||!canCalculate||!profile||!latestPosition.current)return;
    gate.current=true;setBusy(true);setError('');setRoute(null);setStep(0);window.speechSynthesis?.cancel();
    const controller=new AbortController();request.current=controller;
    try{const response=await axios.post(`${BASE_URL}api/maps/trip/truck-route`,{tmsTripId:tripId,target,origin:latestPosition.current},{withCredentials:true,signal:controller.signal});
      if(response.data.status!==true)throw new Error(response.data.message||'Truck route unavailable');
      if(!decodeTruckPolyline(response.data.encoded_polyline).length)throw new Error('Truck route geometry is invalid. Guidance is unavailable.');
      if(!controller.signal.aborted&&mounted.current)setRoute(response.data);
    }catch(failure){if(!controller.signal.aborted&&mounted.current)setError(failure.response?.data?.message||failure.message);}
    finally{if(!controller.signal.aborted&&mounted.current){gate.current=false;setBusy(false);}}
  },[tripId,target,profile,canCalculate]);
  useEffect(()=>{
    const offline=()=>{setOnline(false);request.current?.abort();gate.current=false;setBusy(false);window.speechSynthesis?.cancel();};
    const reconnect=()=>{setOnline(true);clearRoute();setReload(value=>value+1);};
    const visibility=()=>{const visible=document.visibilityState!=='hidden';setPageVisible(visible);setClock(Date.now());if(!visible){hiddenAt.current=Date.now();window.speechSynthesis?.cancel();}else if(hiddenAt.current!==null&&Date.now()-hiddenAt.current>=15000){hiddenAt.current=null;clearRoute();setReload(value=>value+1);}};
    document.addEventListener('visibilitychange',visibility);
    window.addEventListener('offline',offline);window.addEventListener('online',reconnect);
    return()=>{document.removeEventListener('visibilitychange',visibility);window.removeEventListener('offline',offline);window.removeEventListener('online',reconnect);};
    // The refs and setters survive for this trip-keyed page instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  useEffect(()=>{if(canCalculate&&latestPosition.current&&!initialRoute.current){initialRoute.current=true;calculate();}},[canCalculate,calculate]);
  useEffect(()=>{
    if(!guidanceActive||!route?.usable||stale||offRoute||gpsError||!position)return;
    const end=route.steps[step]?.end;
    if(end&&Math.hypot((position.lat-end.latitude)*111320,(position.lng-end.longitude)*111320*Math.cos(position.lat*Math.PI/180))<30&&step<route.steps.length-1)setStep(value=>value+1);
  },[position,route,step,stale,offRoute,gpsError,guidanceActive]);
  const instruction=route?.steps?.[step]?.instruction;
  useEffect(()=>{if(guidanceActive&&voice&&instruction&&route?.usable&&!stale&&!offRoute&&!gpsError&&window.speechSynthesis&&window.SpeechSynthesisUtterance){window.speechSynthesis.cancel();window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(instruction));}else window.speechSynthesis?.cancel();},[voice,instruction,route?.usable,stale,offRoute,gpsError,guidanceActive]);

  const state = !online ? ['Offline · guidance paused','warning'] : !pageVisible ? ['Guidance paused while page is hidden','warning'] : safetyHeld ? ['Equipment safety hold','blocked'] : gpsError ? ['GPS unavailable','warning'] : busy ? ['Calculating truck route','info'] : !profile ? ['Confirm vehicle dimensions','warning'] : !position ? ['Waiting for GPS','info'] : stale ? ['Fresh GPS fix required','warning'] : route?.restriction_warning ? ['Route requires company review','blocked'] : offRoute ? ['Off route · guidance paused','warning'] : route && !guidanceActive ? ['Route preview','info'] : route ? ['GPS guidance active','ready'] : ['Ready to calculate','ready'];
  const routeAge = route?.created_at ? Math.max(0,Math.floor((clock-new Date(route.created_at).getTime())/60000)) : null;
  const controls = <div className="workflow-actions"><button className="driver-button driver-button-primary" disabled={!canCalculate} onClick={calculate}>{busy?'Calculating truck route…':route?'Recalculate truck route':'Calculate truck route'}</button><label className="workflow-checkbox"><input type="checkbox" disabled={!online||stale||!!gpsError} checked={follow} onChange={event=>setFollow(event.target.checked)}/>Follow my location</label><label className="workflow-checkbox"><input type="checkbox" checked={voice} disabled={!guidanceActive||!route?.usable||!window.speechSynthesis} onChange={event=>setVoice(event.target.checked)}/>Read maneuver instructions</label></div>;
  const settings = data && <details className="truck-route-settings" open={!route}><summary>Trip & vehicle settings{profile ? ' · '+profile.measurements.trailer_length_ft+' ft trailer' : ''}</summary><section className="workflow-card"><h2>{data.reference||tripId}</h2><p>{data.pickup_address} → {data.delivery_address}</p>
      <div className={`workflow-alert${data.workflow?.truck_routing?.configured?'':' is-warning'}`}>{data.workflow?.truck_routing?.providers?.ptv_truck?'Canada and cross-border truck routes use PTV. Supported US-only truck routes use Google.':data.workflow?.truck_routing?.configured?'Google truck routes are enabled for supported contiguous-US locations. Canadian truck routing is not connected.':'Google Large Vehicle Routing access is not enabled. A standard Google Maps key does not provide truck routes.'}</div>
      {safetyHeld&&<p className="workflow-alert is-error" role="alert">This equipment has an unresolved safety hold. Truck guidance is blocked.</p>}
      {!profile?<p role="alert">Confirm the loaded truck dimensions in the trip workspace first. A 53-foot trailer length alone is not a complete vehicle profile.</p>:<dl className="workflow-facts">{[['Trailer',`${profile.measurements.trailer_length_ft} ft`],['Full combination',`${profile.measurements.total_length_ft} ft`],['Height / width',`${profile.measurements.height_ft} / ${profile.measurements.width_ft} ft`],['Gross loaded weight',`${Number(profile.measurements.gross_weight_lb).toLocaleString()} lb`],['Axles',profile.measurements.axles],['Empty combination',profile.measurements.empty_weight_lb?Number(profile.measurements.empty_weight_lb).toLocaleString()+' lb':'Not confirmed'],['Registered gross',profile.measurements.permitted_weight_lb?Number(profile.measurements.permitted_weight_lb).toLocaleString()+' lb':'Not confirmed'],['Heaviest loaded axle',profile.measurements.max_axle_weight_lb?Number(profile.measurements.max_axle_weight_lb).toLocaleString()+' lb':'Not confirmed'],['Profile version',profile.version]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>}
      <div className="workflow-form"><label>Navigate to<select value={target} disabled={busy} onChange={event=>{clearRoute();setTarget(event.target.value);initialRoute.current=true;}}><option value="pickup">Assigned pickup</option><option value="delivery">Assigned delivery</option>{data.stops.filter(stop=>stop.execution_status!=='COMPLETED').map(stop=><option key={stop.id} value={`stop:${stop.id}`}>{stop.location||stop.address1||`Stop ${stop.id}`}</option>)}</select></label><div className="truck-navigation-gps">{position?`GPS accuracy ${Math.round(position.accuracy)} m${stale?' · waiting for a fresh precise fix':''}`:'Waiting for device GPS…'}</div></div>
      {!route&&controls}
    </section></details>;

  return <main id="driver-main" className="content-wrapper driver-dashboard"><div className="trip-workflow truck-navigation"><header className="workflow-top"><div><p>Canada & United States · truck routing</p><h1>Truck navigation</h1></div><Link className="driver-button driver-button-light" to={`/tripstatus/${encodeURIComponent(tripId)}`}>Back to trip</Link></header>
    {error&&<div className="workflow-alert is-error" role="alert">{error}{!data&&<button className="driver-button driver-button-light" onClick={()=>setReload(value=>value+1)}>Reload trip</button>}</div>}{gpsError&&<div className="workflow-alert is-error" role="alert">{gpsError}<button className="driver-button driver-button-light" onClick={()=>{latestPosition.current=null;setPosition(null);setGpsRevision(value=>value+1);}}>Retry GPS</button></div>}
    {!online&&<div className="workflow-alert is-warning" role="alert">You are offline. Guidance is paused. Reconnect to verify the trip and calculate a fresh truck route.</div>}
    {data&&<><section className="truck-status-rail" aria-label="Navigation status"><span className={`truck-signal is-${state[1]}`} role="status">{state[0]}</span><span>{position?`GPS ±${Math.round(position.accuracy)} m`:'No GPS fix'}</span>{routeAge!==null&&Number.isFinite(routeAge)&&<span>Calculated {routeAge===0?'just now':routeAge+' min ago'}</span>}{route&&<span>{route.provider==='ptv_truck'?'PTV truck route':'Google truck route'}</span>}</section>{!route&&settings}

    {route&&<><section className="workflow-card truck-active-route" aria-label="Calculated truck route"><div className="workflow-top"><div><h2>{route.destination_address}</h2><p>{(route.distance_m/1609.344).toFixed(1)} mi · {Math.ceil(route.duration_s/60)} min estimated at calculation</p></div><span className="driver-state">{route.provider==='ptv_truck'?'PTV':'Google'} · TRUCK · v{route.profile_version}</span></div>
      {route.restriction_warning&&<div className="workflow-alert is-error" role="alert">The provider could not meet every vehicle restriction. Guidance is blocked. Ask dispatch for an alternative route.</div>}
      {!guidanceActive&&<div className="workflow-alert is-warning">Route preview only. Live guidance is available after this trip starts and is not paused.</div>}
      {(stale||gpsError)&&<div className="workflow-alert is-error" role="alert">Live guidance is paused until a fresh GPS fix is available.</div>}
      {offRoute&&<div className="workflow-alert is-error" role="alert">You are away from the calculated truck route. Guidance is paused. Stop safely and recalculate before following another road.</div>}
      {!!route.border_crossings?.length&&<div className="truck-border-notice"><h3>International border ahead</h3>{route.border_crossings.map((border,index)=><p key={index}>{border.from} → {border.to} · customs status unverified</p>)}<p>Follow the dispatched border instructions. A calculated crossing does not confirm customs release.</p></div>}
      {(route.warnings||[]).map((warning,index)=><p key={index} className="workflow-alert">{warning}</p>)}
      {controls}
      {guidanceActive&&route.usable&&!stale&&!offRoute&&!gpsError&&instruction&&<div className="truck-current-maneuver"><span>Current route instruction</span><strong>{instruction}</strong></div>}
      {GOOGLE_MAPS_API_KEY?<TruckMap route={route} path={path} position={position} destination={route.destination} usable={route.usable} follow={follow&&pageVisible&&online&&!stale&&!gpsError} paused={!pageVisible||!online||stale||!!gpsError}/>:<ServerTruckMap route={route} position={position} follow={follow} paused={!pageVisible||!online||stale||!!gpsError}/>}
      <p>Follow road signs, posted clearances and dispatched instructions. Keep this page open for guidance. Background guidance and automatic rerouting are unavailable.</p>
    </section>{route.usable&&<details className="workflow-card truck-directions"><summary>Truck route directions · {route.steps.length} maneuvers</summary><ol className="truck-route-directions">{route.steps.map((item,index)=><li key={index} aria-current={index===step?'step':undefined}><span>{item.instruction||item.maneuver?.replaceAll('_',' ')||'Continue along the truck route'}</span><small>{Math.round(item.distance_m)} m</small></li>)}</ol></details>}</>}
    {route&&settings}</>}{!data&&!error&&<p role="status">Loading authorized trip…</p>}
  </div></main>;
}

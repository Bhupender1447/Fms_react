import React, { useState, useEffect, useRef, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GoogleMap, PolylineF, MarkerF } from '@react-google-maps/api';
import MapService from "../services/MapService";
import { GOOGLE_MAPS_LIBRARIES } from "../mapConfig";

const expenseOptions = [
  "Layover", "Detention", "Driver Assist", "Driver Load/Unload", "Driver Count",
  "TONU (Truck Ordered Not Used)", "Redelivery", "Reconsignment / Diversion",
  "Stop-Off Charges (Multiple Stops)", "Deadhead / Empty Miles", "Tarping Fee (Flatbed)",
  "Lumper Fee", "Liftgate Service", "Pallet Jack Service", "Inside Delivery",
  "Residential Delivery", "Limited Access Delivery", "Border Crossing Fee",
  "Customs Clearance Fee", "Hazardous Materials (HAZMAT) Handling",
  "Refrigeration (Reefer Fuel Surcharge)", "Clean Truck / Washout Fee",
  "Storage / Warehouse Fee", "Border Wait Time", "Inbound Handling Fee",
  "Appointment Scheduling Fee", "Escort / Pilot Car Fee (Oversize Loads)",
  "Permits (Oversize / Overweight)", "Scale Ticket Fee", "Toll Reimbursement",
  "Ferry Fee", "Fuel Surcharge", "Excess Mileage Fee", "Parking Fee",
  "After-Hours / Weekend Delivery", "Holiday Delivery Surcharge",
];

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '600px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const center = {
  lat: 43.710513,
  lng: -79.828695
};

const Distancepopup = ({ places1, places2, places3 = [] }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const checkGoogle = setInterval(() => {
      if (window.google && window.google.maps) {
        setIsLoaded(true);
        clearInterval(checkGoogle);
      }
    }, 100);
    return () => clearInterval(checkGoogle);
  }, []);

  const [place1, setPlace1] = useState(places1 || "");
  const [place2, setPlace2] = useState(places2 || "");
  const [place3, setPlace3] = useState(Array.isArray(places3) ? places3 : []);
  const [provider, setProvider] = useState('google');
  const [routeChoice, setRouteChoice] = useState('fast');
  const [routeInfo, setRouteInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [routePath, setRoutePath] = useState([]);
  const [markers, setMarkers] = useState([]);

  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  const fitBounds = useCallback((map, path, markList) => {
    if (!map || !window.google || !window.google.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    let hasPoints = false;
    if (path && path.length > 0) {
      const step = Math.max(1, Math.floor(path.length / 200));
      for (let i = 0; i < path.length; i += step) {
        bounds.extend(path[i]);
        hasPoints = true;
      }
      bounds.extend(path[path.length - 1]);
    }
    if (markList && markList.length > 0) {
      markList.forEach(m => {
        bounds.extend(m);
        hasPoints = true;
      });
    }
    if (hasPoints) {
      map.fitBounds(bounds, 50);
    }
  }, []);

  const drawPolylineOnMap = useCallback((map, path, currentProvider) => {
    if (!map || !window.google || !window.google.maps) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (path && path.length > 0) {
      const polyline = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: currentProvider === 'ptv' ? '#28a745' : '#0055ff',
        strokeOpacity: 0.85,
        strokeWeight: 6,
        map: map
      });
      polylineRef.current = polyline;
    }
  }, []);

  const onLoadMap = useCallback((map) => {
    mapRef.current = map;
    if (routePath && routePath.length > 0) {
      drawPolylineOnMap(map, routePath, provider);
      fitBounds(map, routePath, markers);
    } else if (markers && markers.length > 0) {
      fitBounds(map, [], markers);
    }
  }, [routePath, markers, provider, drawPolylineOnMap, fitBounds]);

  useEffect(() => {
    if (mapRef.current) {
      drawPolylineOnMap(mapRef.current, routePath, provider);
      if (routePath.length > 0 || markers.length > 0) {
        fitBounds(mapRef.current, routePath, markers);
      }
    }
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [routePath, markers, provider, drawPolylineOnMap, fitBounds]);

  // Expenses state
  const [expenses, setExpenses] = useState([{ type: "", amount: "" }]);

  const handleExpenseChange = (index, field, value) => {
    const newExpenses = [...expenses];
    newExpenses[index][field] = value;
    setExpenses(newExpenses);
  };

  const addExpense = () => {
    setExpenses([...expenses, { type: "", amount: "" }]);
  };

  const removeExpense = (index) => {
    const newExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(newExpenses);
  };

  const calculateDistance = async () => {
    if (!place1 || !place2) return;
    setError(null);
    setRouteInfo(null);
    setIsLoading(true);

    try {
      // 1. Geocode all locations using MapService
      const coords1 = await MapService.geocode(place1);
      const coords2 = await MapService.geocode(place2);
      
      const coords3 = [];
      for (let stop of place3) {
        if (stop.location) {
           const c = await MapService.geocode(stop.location);
           coords3.push(c);
        }
      }

      // 2. Fetch Route Data
      const waypoints = coords3.map(c => ({ lat: parseFloat(c.lat), lng: parseFloat(c.lng) }));
      const origin = { lat: parseFloat(coords1.lat), lng: parseFloat(coords1.lng) };
      const destination = { lat: parseFloat(coords2.lat), lng: parseFloat(coords2.lng) };

      const vehicleProfile = provider === 'ptv' ? { type: 'truck' } : { type: 'car' };
      const routeResult = await MapService.getRoute(origin, destination, waypoints, vehicleProfile, routeChoice);
      
      let extractedToll = 0;
      let hasTolls = false;
      
      // Attempt to extract toll from various common PTV / Trimble formats
      if (routeResult.tolls?.amount !== undefined) { extractedToll = routeResult.tolls.amount; hasTolls = true; }
      else if (routeResult.tolls?.costs?.prices) {
        const usdPrice = routeResult.tolls.costs.prices.find(p => p.currency === 'USD');
        extractedToll = usdPrice ? usdPrice.price : (routeResult.tolls.costs.prices[0]?.price || 0);
        hasTolls = true;
      }
      else if (routeResult.toll?.amount !== undefined) { extractedToll = routeResult.toll.amount; hasTolls = true; }
      else if (routeResult.tollPrice !== undefined) { extractedToll = routeResult.tollPrice; hasTolls = true; }
      else if (routeResult.tolls?.cost !== undefined) { extractedToll = routeResult.tolls.cost; hasTolls = true; }
      else if (typeof routeResult.tolls === 'number') { extractedToll = routeResult.tolls; hasTolls = true; }
      else if (routeResult.toll?.costs?.length > 0) { extractedToll = routeResult.toll.costs[0].amount || 0; hasTolls = true; }

      // Log routeResult to console so user can inspect if tolls are missing
      console.log("Map Routing Response:", routeResult);

      setRouteInfo({
        distance: routeResult.distance,
        distanceMiles: routeResult.distanceMiles,
        distanceKms: routeResult.distanceKms,
        stateMileage: routeResult.stateMileage || [],
        distanceUnit: routeResult.distanceUnit,
        durationText: routeResult.durationText,
        durationHours: (routeResult.duration / 3600).toFixed(2),
        cost: extractedToll,
        tollAvailable: hasTolls || routeResult.tolls?.tollAvailable !== false
      });

      // 3. Render Route path
      const fullRoadPath = MapService.parseRoutePath(routeResult?.path);
      if (fullRoadPath.length < 2) {
        throw new Error("Road route geometry is unavailable or invalid.");
      }
      
      setRoutePath(fullRoadPath);
      setMarkers([origin, ...waypoints, destination]);

    } catch (err) {
      console.error(err);
      setRoutePath([]);
      setError(err.message || "Failed to calculate route or fetch coordinates");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (places1 && places2 && isLoaded) {
      const timeoutId = setTimeout(() => {
        calculateDistance();
      }, 900);
      return () => clearTimeout(timeoutId);
    }
  }, [places1, places2, isLoaded]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(place3);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setPlace3(items);
    calculateDistance();
  };

  return (
    <div className="container-fluid py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Distance & Expenses Calculator</h1>
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold m-0">Map Provider:</label>
          <select className="form-select form-select-sm w-auto" value={provider} onChange={(e) => setProvider(e.target.value)}>
            <option value="google">Google Maps (Car)</option>
            <option value="ptv">PTV Maps (Truck)</option>
          </select>
          {provider === 'ptv' && (
            <>
              <label className="fw-bold m-0 ms-2">Route:</label>
              <select className="form-select form-select-sm w-auto" value={routeChoice} onChange={(e) => setRouteChoice(e.target.value)}>
                <option value="fast">Fastest</option>
                <option value="shortest">Shortest</option>
                <option value="economic">Economic</option>
              </select>
            </>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div>
            <label className="w-100 fw-bold">
              Origin:
              <input
                type="text"
                className="form-control mt-1"
                value={place1}
                onChange={(e) => setPlace1(e.target.value)}
              />
            </label>
          </div>
          <div className="mt-3">
            <label className="w-100 fw-bold">
              Destination:
              <input
                type="text"
                className="form-control mt-1"
                value={place2}
                onChange={(e) => setPlace2(e.target.value)}
              />
            </label>
          </div>

          <div className="mt-4">
            <label className="w-100 fw-bold">
              Additional Stops (Drag to Reorder):
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="stops">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="mt-2">
                      {place3.map((stop, index) => (
                        <Draggable key={`stop-${index}`} draggableId={`stop-${index}`} index={index}>
                          {(provided) => (
                            <div
                              className="mb-2 d-flex align-items-center bg-white border p-1 rounded"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <span className="me-2 text-muted px-2">☰</span>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={stop.location}
                                onChange={(e) => {
                                  const newStops = [...place3];
                                  newStops[index].location = e.target.value;
                                  setPlace3(newStops);
                                }}
                              />
                              <button 
                                className="btn btn-danger btn-sm ms-2"
                                onClick={() => {
                                  const newStops = [...place3];
                                  newStops.splice(index, 1);
                                  setPlace3(newStops);
                                }}
                              >
                                &times;
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              <button
                className="btn btn-success btn-sm mt-2 w-100"
                onClick={() => setPlace3([...place3, { stoptype: "Intermediate", location: "" }])}
              >
                + Add Stop
              </button>
            </label>
          </div>

          <button onClick={calculateDistance} className="btn btn-primary w-100 mt-4 py-2 fw-bold" disabled={isLoading}>
            {isLoading ? "Calculating Route..." : "Calculate Route"}
          </button>

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          {routeInfo && (
            <div className="mt-4 border p-3 rounded" style={{ background: '#f8f9fa' }}>
              <h4 className="mb-3 border-bottom pb-2">Route Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-muted">Distance:</span> 
                <span className="fw-bold">
                  {routeInfo.distanceMiles ? `${routeInfo.distanceMiles} Miles | ` : ''}
                  {routeInfo.distanceKms ? `${routeInfo.distanceKms} Km` : `${routeInfo.distance} ${routeInfo.distanceUnit}`}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-muted">ETA:</span> 
                <span className="fw-bold">{routeInfo.durationHours} Hrs ({routeInfo.durationText})</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="fw-bold text-muted">Tolls:</span> 
                <span className="fw-bold">{routeInfo.tollAvailable ? `$${routeInfo.cost}` : 'N/A'}</span>
              </div>
              {routeInfo.stateMileage && routeInfo.stateMileage.length > 0 && (
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold text-muted">State Legs:</span> 
                  <span className="fw-bold">{routeInfo.stateMileage.length} segments</span>
                </div>
              )}
              {routeInfo.distance > 0 && routeInfo.tollAvailable && routeInfo.cost > 0 && (
                <div className="d-flex justify-content-between">
                  <span className="fw-bold text-muted">Cost/Mile:</span> 
                  <span className="fw-bold">${(routeInfo.cost / (routeInfo.distanceMiles || (routeInfo.distance / 1609.34))).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <h3 className="mt-5 border-bottom pb-2">Expenses</h3>
          {expenses.map((exp, index) => (
            <div key={index} className="d-flex mb-2 gap-2">
              <select
                className="form-select form-select-sm"
                value={exp.type}
                onChange={(e) => handleExpenseChange(index, "type", e.target.value)}
              >
                <option value="">Select Expense</option>
                {expenseOptions.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
              <input
                type="number"
                className="form-control form-control-sm"
                placeholder="Amount"
                value={exp.amount}
                onChange={(e) => handleExpenseChange(index, "amount", e.target.value)}
              />
              <button className="btn btn-outline-danger btn-sm" onClick={() => removeExpense(index)}>
                &times;
              </button>
            </div>
          ))}
          <button className="btn btn-outline-secondary btn-sm mt-2" onClick={addExpense}>
            + Add Expense
          </button>
        </div>

        <div className="col-md-8">
          <div className="bg-white p-2 rounded border" style={{ height: '100%', minHeight: '600px' }}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={markers.length > 0 ? markers[0] : center}
                zoom={markers.length > 0 ? 5 : 4}
                onLoad={onLoadMap}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false
                }}
              >
                {routePath.length > 0 && (
                  <PolylineF 
                    key={`poly-${provider}-${routePath.length}`}
                    path={routePath} 
                    options={{ 
                      strokeColor: provider === 'ptv' ? '#28a745' : '#0055ff', 
                      strokeWeight: 6,
                      strokeOpacity: 0.85
                    }} 
                  />
                )}
                {markers.map((mark, index) => (
                  <MarkerF 
                    key={`marker-${index}-${mark.lat}-${mark.lng}`} 
                    position={mark} 
                    label={{
                      text: index === 0 ? "A" : index === markers.length - 1 ? "B" : index.toString(),
                      color: "white"
                    }} 
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100 bg-light rounded">
                <span className="fs-5 text-muted">Loading Map...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Distancepopup;

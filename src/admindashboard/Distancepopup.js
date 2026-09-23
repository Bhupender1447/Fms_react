import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const api_key = process.env.REACT_APP_TRIMBLE_API_KEY;

const expenseOptions = [
  "Layover",
  "Detention",
  "Driver Assist",
  "Driver Load/Unload",
  "Driver Count",
  "TONU (Truck Ordered Not Used)",
  "Redelivery",
  "Reconsignment / Diversion",
  "Stop-Off Charges (Multiple Stops)",
  "Deadhead / Empty Miles",
  "Tarping Fee (Flatbed)",
  "Lumper Fee",
  "Liftgate Service",
  "Pallet Jack Service",
  "Inside Delivery",
  "Residential Delivery",
  "Limited Access Delivery",
  "Border Crossing Fee",
  "Customs Clearance Fee",
  "Hazardous Materials (HAZMAT) Handling",
  "Refrigeration (Reefer Fuel Surcharge)",
  "Clean Truck / Washout Fee",
  "Storage / Warehouse Fee",
  "Border Wait Time",
  "Inbound Handling Fee",
  "Appointment Scheduling Fee",
  "Escort / Pilot Car Fee (Oversize Loads)",
  "Permits (Oversize / Overweight)",
  "Scale Ticket Fee",
  "Toll Reimbursement",
  "Ferry Fee",
  "Fuel Surcharge",
  "Excess Mileage Fee",
  "Parking Fee",
  "After-Hours / Weekend Delivery",
  "Holiday Delivery Surcharge",
];

const Distancepopup = ({ places1, places2, places3 = [] }) => {
  const [place1, setPlace1] = useState(places1 || "");
  const [place2, setPlace2] = useState(places2 || "");
  const [place3, setPlace3] = useState(Array.isArray(places3) ? places3 : []);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null);
  const mapContainerRef = useRef(null);

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

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://maps-sdk.trimblemaps.com/v3/trimblemaps-3.17.0.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const TrimbleMaps = window.TrimbleMaps;
      TrimbleMaps.APIKey = api_key;

      const mapInstance = new TrimbleMaps.Map({
        container: mapContainerRef.current,
        style: TrimbleMaps.Common.Style.TRANSPORTATION,
        center: new TrimbleMaps.LngLat(-79.828695, 43.710513),
        zoom: 8,
      });

      setMap(mapInstance);
    };

    script.onerror = () => {
      setError("Failed to load Trimble Maps SDK");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const searchPlace = async (query) => {
    const searchEndpoint = `https://singlesearch.alk.com/NA/api/search?query=${encodeURIComponent(query)}`;

    try {
      const response = await axios.get(searchEndpoint, {
        headers: {
          authorization: api_key,
          accept: "application/json",
        },
      });

      if (response.status === 200 && response.data.Locations?.length > 0) {
        const { Lat, Lon } = response.data.Locations[0].Coords;
        return { lat: Lat, lon: Lon };
      } else {
        throw new Error(`No valid locations found for ${query}`);
      }
    } catch (error) {
      setError(`Failed to fetch coordinates for ${query}`);
      return null;
    }
  };

  const calculateDistance = async () => {
    setError(null);
    setDistance(null);

    const coords1 = await searchPlace(place1);
    const coords2 = await searchPlace(place2);
    const coords3 = await Promise.all(
      place3.map(async (stop) => await searchPlace(stop.location))
    );

    if (coords1 && coords2) {
      let stops = `${coords1.lon},${coords1.lat};`;

      if (coords3.length > 0) {
        stops += coords3.map((c) => `${c.lon},${c.lat}`).join(";") + ";";
      }

      stops += `${coords2.lon},${coords2.lat}`;

      const url = `https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/route/routeReports?stops=${stops}&reports=Mileage&openBorders=true`;

      try {
        const response = await axios.get(url, {
          headers: {
            authorization: api_key,
            accept: "application/json",
          },
        });

        if (response.status === 200) {
          setDistance(response.data);

          if (map) {
            const TrimbleMaps = window.TrimbleMaps;
            if (route) route.remove();

            const newRoute = new TrimbleMaps.Route({
              routeId: "myRoute",
              stops: [
                new TrimbleMaps.LngLat(coords1.lon, coords1.lat),
                ...coords3.map((c) => new TrimbleMaps.LngLat(c.lon, c.lat)),
                new TrimbleMaps.LngLat(coords2.lon, coords2.lat),
              ],
            });

            newRoute.addTo(map);
            setRoute(newRoute);
          }
        }
      } catch (error) {
        setError("Failed to fetch route distance");
      }
    }
  };

  useEffect(() => {
    if (places1 && places2 && map) {
      const timeoutId = setTimeout(() => {
        calculateDistance();
      }, 900);
      return () => clearTimeout(timeoutId);
    }
  }, [places1, places2, map]);

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(place3);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setPlace3(items);
    calculateDistance(); // re-calc after reorder
  };

  return (
    <div>
      <h1>Distance Calculator</h1>

      <button onClick={calculateDistance} className="btn btn-primary">
        Calculate Distance
      </button>

      <div className="row">
        <div className="col-md-3">
          {/* Input fields for places */}
          <div>
            <label>
              To place:
              <input
                type="text"
                className="form-control"
                value={place1}
                onChange={(e) => setPlace1(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              From place:
              <input
                type="text"
                className="form-control"
                value={place2}
                onChange={(e) => setPlace2(e.target.value)}
              />
            </label>
          </div>

          {/* Drag-and-drop stops */}
          <div>
            <label>
              Additional Stops (Drag to Reorder):
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="stops">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {place3.map((stop, index) => (
                        <Draggable
                          key={index}
                          draggableId={`stop-${index}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="mb-2 d-flex"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <input
                                type="text"
                                className="form-control"
                                value={stop.location}
                                onChange={(e) => {
                                  const newStops = [...place3];
                                  newStops[index].location = e.target.value;
                                  setPlace3(newStops);
                                }}
                              />
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
                className="btn btn-success btn-sm mt-2"
                onClick={() =>
                  setPlace3([
                    ...place3,
                    { stoptype: "Intermediate", location: "" },
                  ])
                }
              >
                Add Stop
              </button>
            </label>
          </div>

          {/* Expenses Section */}
          <h3 className="mt-4">Expenses</h3>
          {expenses.map((exp, index) => (
            <div key={index} className="d-flex mb-2 gap-2">
              <select
                className="form-control"
                value={exp.type}
                onChange={(e) =>
                  handleExpenseChange(index, "type", e.target.value)
                }
              >
                <option value="">Select Expense</option>
                {expenseOptions.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                value={exp.amount}
                onChange={(e) =>
                  handleExpenseChange(index, "amount", e.target.value)
                }
              />
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeExpense(index)}
              >
                X
              </button>
            </div>
          ))}
          <button className="btn btn-secondary btn-sm" onClick={addExpense}>
            + Add Expense
          </button>

          {/* Distance result */}
          {distance ? (
            (() => {
              const lastReportLine =
                distance[0]?.ReportLines?.[
                distance[0].ReportLines.length - 1
                ];

              if (!lastReportLine) return <p>No valid distance data found.</p>;

              const miles = parseFloat(lastReportLine.TMiles);
              const cost = parseFloat(lastReportLine.TCostMile);
              const perMileCost =
                miles > 0 ? (cost / miles).toFixed(2) : "0.00";

              return (
                <div>
                  <h2>Distance Results</h2>
                  <pre>Total Distance: {miles} Miles</pre>
                  <pre>Total Cost: ${cost}</pre>
                  <pre>Total Hours: {lastReportLine.THours} Hrs</pre>
                  <pre>Per Mile Cost: ${perMileCost}</pre>
                </div>
              );
            })()
          ) : (
            "Progress..."
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div className="col-md-9">
          <div
            ref={mapContainerRef}
            style={{ width: "100%", height: "400px" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Distancepopup;

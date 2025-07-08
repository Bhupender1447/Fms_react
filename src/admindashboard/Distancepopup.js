import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

const api_key = "D487078091664D428AA781953AE84DF1";

const Distancepopup = ({ places1, places2, places3 = [] }) => {
  const [place1, setPlace1] = useState(places1 || "");
  const [place2, setPlace2] = useState(places2 || "");
  const [place3, setPlace3] = useState(Array.isArray(places3) ? places3 : []);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [map, setMap] = useState(null);
  const [route, setRoute] = useState(null);
  const mapContainerRef = useRef(null);

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
          console.log(response.data)
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

  return (
    <div>
      <h1>Distance Calculator</h1>
     
      <button onClick={calculateDistance} className="btn btn-primary">
        Calculate Distance
      </button>
      <div className="row">
        <div className="col-md-3">
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
      <div>
        <label>
          Additional Stops (Optional):
          {place3.map((stop, index) => (
            <div key={index} className="mb-2">
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
          ))}
          <button
            className="btn btn-success btn-sm"
            onClick={() =>
              setPlace3([...place3, { stoptype: "Intermediate", location: "" }])
            }
          >
            Add Stop
          </button>
        </label>
      </div>
{distance ? (
  (() => {
    const lastReportLine = distance[0]?.ReportLines?.[distance[0].ReportLines.length - 1];

    if (!lastReportLine) return <p>No valid distance data found.</p>;

    const miles = parseFloat(lastReportLine.TMiles);
    const cost = parseFloat(lastReportLine.TCostMile);
    const perMileCost = miles > 0 ? (cost / miles).toFixed(2) : "0.00";

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
          <div ref={mapContainerRef} style={{ width: "100%", height: "400px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default Distancepopup;

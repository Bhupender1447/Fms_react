import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';

const api_key = "D487078091664D428AA781953AE84DF1";

const TripDetails = (props) => {
    const [tripData,setdata] = useState({
        "id": "264",
        "tmsTriptId": "",
        "mode": "LOG",
        "company": "Adonis Freight Inc.",
        "customer_orderno": "ISV_TRIP-1231",
        "customer_id": "19",
        "shipment_type": "Regular",
        "shipment_for": "",
        "commission": "Order",
        "company_desc": null,
        "carriers": null,
        "load_type": "FTL",
        "frieght_on": "Order",
        "salesman": "24",
        "scale_ticketno": "ISV_TRIP-1231",
        "carrier_desc": null,
        "commodity": null,
        "equipments": null,
        "weight": null,
        "applicable_on": "",
        "L": null,
        "B": null,
        "H": null,
        "measurement": null,
        "shipment_desc": "",
        "no_of_packkages": null,
        "carr_weight": null,
        "tap": null,
        "hazmat": "YES",
        "addl_charge": "",
        "appt": "",
        "promiles": "",
        "manifest": "YES",
        "refer": null,
        "temprature": null,
        "pip": "YES",
        "ctpat": "YES",
        "pickup": "57",
        "pickup_address": "50 Royal Group Crescent",
        "pickup_refno": "ISV_TRIP-1231",
        "pickup_date": "07/11/2024",
        "pickuptime": "",
        "pickup_tap": null,
        "pickup_desc": "  ",
        "delivery": "46",
        "delivery_address": "5555 78 Ave SE, Calgary, AB T2C 4M4, Canada",
        "delivery_refno": "ISV_TRIP-1231",
        "deliver_date": "07/26/2024",
        "deliverytime": "",
        "appointment": "YES",
        "delivery_desc": "                                    ",
        "distance": null,
        "createdat": "2024-07-07 21:06:55",
        "status": "ACTIVE",
        "gross_amount": "5500",
        "hst": "0",
        "hst_amount": "0",
        "cst": "0",
        "cst_amount": "0",
        "net_amount": "5500",
        "active": "active",
        "store_id": "",
        "carrier": "",
        "remarks": "Quaerat aute et maxi",
        "msg": "Quod nulla aspernatu",
        "rate": "16",
        "currency": "CAD",
        "truck_id": "5",
        "trailor_id": "8",
        "trailortype": "Refirigrated Trailors/Reefers Vn 53",
        "driver_id": "10007",
        "codriver_id": "10006",
        "city_driver_id": "10006",
        "lat": "50.98247000000001",
        "lng": "-113.9533779",
        "source_lat": "",
        "source_lng": "",
        "report_url": "",
        "logistic_assigned": "1",
        "loadno": "",
        "pickuplocation": "5555 Av. Royalmount, Mont-Royal, QC H4P 1J3, Canada",
        "deliverylocation": "5555 Av. Royalmount, Mont-Royal, QC H4P 1J3, Canada"
    });

    const [place1, setPlace1] = useState(tripData.pickup_address);
    const [place2, setPlace2] = useState(tripData.delivery_address);
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState(null);
    const [map, setMap] = useState(null);
    const [route, setRoute] = useState(null);
    const mapContainerRef = useRef(null);
  
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://maps-sdk.trimblemaps.com/v3/trimblemaps-3.17.0.js';
      script.async = true;
      document.body.appendChild(script);
  
      script.onload = () => {
        const TrimbleMaps = window.TrimbleMaps;
        TrimbleMaps.APIKey = api_key; // Ensure the API key is set here
  
        const mapInstance = new TrimbleMaps.Map({
          container: mapContainerRef.current,
          style: TrimbleMaps.Common.Style.TRANSPORTATION,
          center: new TrimbleMaps.LngLat(-79.828695, 43.710513),
          zoom: 8
        });
  
        setMap(mapInstance);
      };
  
      script.onerror = () => {
        setError('Failed to load Trimble Maps SDK');
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
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': api_key,
            'content-type': 'application/json',
          }
        });
  
        if (response.status === 200 && response.data.Locations && response.data.Locations.length > 0) {
          const location = response.data.Locations[0];
          const { Lat, Lon } = location.Coords;
          return { lat: Lat, lon: Lon };
        } else {
          throw new Error(`No valid locations found for ${query}`);
        }
      } catch (error) {
        console.error(error);
        setError(`Failed to fetch coordinates for ${query}`);
        return null;
      }
    };
  
    const fetchRouteDistance = async (lat1, lon1, lat2, lon2) => {
      const url = `https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/route/routeReports?stops=${lon1}%2C${lat1}%3B${lon2}%2C${lat2}&reports=Mileage`;
  
      try {
        const response = await axios.get(url, {
          headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': api_key,
            'content-type': 'application/json',
            'origin': 'https://developer.trimblemaps.com',
            'sec-fetch-mode': 'cors',
          }
        });
  
        if (response.status === 200) {
          return response.data;
        } else {
          throw new Error(`Failed to fetch route distance`);
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch route distance');
        return null;
      }
    };
  
    const calculateDistance = async () => {
      setError(null);
      setDistance(null);
  
      const coords1 = await searchPlace(place1);
      const coords2 = await searchPlace(place2);

      if (coords1 && coords2) {
        const routeDistance = await fetchRouteDistance(coords1.lat, coords1.lon, coords2.lat, coords2.lon);
        if (routeDistance) {
          setDistance(routeDistance);
  
          if (map) {
            const TrimbleMaps = window.TrimbleMaps;
            if (route) {
              route.remove(); // Remove the existing route if any
            }
            const newRoute = new TrimbleMaps.Route({
              routeId: 'myRoute',
              stops: [
                new TrimbleMaps.LngLat(coords1.lon, coords1.lat),
                new TrimbleMaps.LngLat(coords2.lon, coords2.lat)
              ]
            });
            newRoute.addTo(map);
            setRoute(newRoute);
          }
        }
      }
    };
  
    return (
        <div className='content-wrapper'>
        <div className="container">
            <div className="card mt-4">
                <div className="card-header">
                    <h2 className="card-title">Order Details</h2>
                </div>
                <div className="card-body">
                    <p className="card-text"><strong>Trip ID:</strong> {tripData.id}</p>
                    <p className="card-text"><strong>Company:</strong> {tripData.company}</p>
                    <p className="card-text"><strong>Pickup Address:</strong> {tripData.pickup_address}</p>
                    <p className="card-text"><strong>Delivery Address:</strong> {tripData.delivery_address}</p>
                    <p className="card-text"><strong>Pickup Date:</strong> {tripData.pickup_date}</p>
                    <p className="card-text"><strong>Delivery Date:</strong> {tripData.deliver_date}</p>
                    <p className="card-text"><strong>Gross Amount:</strong> {tripData.gross_amount} {tripData.currency}</p>
                    <p className="card-text"><strong>Remarks:</strong> {tripData.remarks}</p>
                    <p className="card-text"><strong>Status:</strong> {tripData.status}</p>
                    {/* Add more details as needed */}
                </div>
            </div>
            <div>
      <h1>Distance</h1>
      <div>
        <label>
          To place:
          <input type="text" className="form-control" value={place1} onChange={(e) => setPlace1(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          From place:
          <input type="text" className="form-control" value={place2} onChange={(e) => setPlace2(e.target.value)} />
        </label>
      </div>
      <button onClick={calculateDistance} className="btn btn-primary">Calculate Distance</button>
      {distance && (
        <div>
          <h2>Distance Results</h2>
          <pre>Total Distance: {distance[0].ReportLines[1].TMiles}.Miles</pre>
          <pre>Total Cost per Mile:${distance[0].ReportLines[1].TCostMile}</pre>
          <pre>Total Hours: {distance[0].ReportLines[1].THours}.Hrs</pre>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }}></div>
    </div>
        </div>
        </div>
    );
};

export default TripDetails;

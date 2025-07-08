import React, { useState } from 'react';

const TripMap = () => {
  // Your provided JSON trip data
  const tripData = {
    "accountName": "Isovia (IFM TMS)",
    "tripStatus": "Planned",
    "modifiedOn": "2025-02-10T18:20:46+00:00",
    "tripDistance": 3172.828,
    "tripDriveDuration": 3114.217,
    "tripDuration": 3294.217,
    "hoursOfServiceRemaining": null,
    "url": "https://tripmanagement.alk.com/trip-viewer/token/4wkyvvp0j2padmvslu4njv9kx49vprwa9unlvr5xx0/details/240564192?region=NA",
    "tripCost": 6400.55,
    "tripTolls": 0,
    "actualTripTolls": null,
    "warningMessage": "",
    "planned": {
      "tripDuration": 3294.217,
      "tripCost": 6400.55,
      "tripDistance": 3172.828
    },
    "remainingLegDistance": 0,
    "remainingLegDriveDuration": 0,
    "tmsTripId": "TMS-Trip-Identifier",
    "name": "Trip-Name",
    "stops": [
      {
        "plannedETA": "2025-02-10T13:39:05-05:00",
        "currentETA": "2025-02-10T13:39:05-05:00",
        "currentETD": "2025-02-10T14:39:05-05:00",
        "earliestArrivalTime": "2023-09-19T16:45:00-05:00",
        "latestArrivalTime": "2023-09-19T18:00:00-05:00",
        "plannedDuration": 60,
        "actualDuration": 0,
        "plannedDepartureTime": "2025-02-10T14:39:05-05:00",
        "stopStatus": "Open",
        "stopArrivalStatus": "Late",
        "atRiskThreshold": 15,
        "tooEarlyThreshold": null,
        "legDistance": 4.813,
        "legDriveDuration": 18.317,
        "metadata": null,
        "amenities": null,
        "truckServices": false,
        "alternateRestStops": null,
        "poiId": 0,
        "setId": 0,
        "persistentId": 0,
        "activeDriver": 1,
        "stopId": 1905959046,
        "slackTime": null,
        "location": {
          "address": {
            "streetAddress": "26 Jersey Street",
            "city": "Boston",
            "state": "MA",
            "zip": "02215",
            "county": "Suffolk",
            "country": "United States"
          },
          "coords": {
            "lat": "42.346689",
            "lon": "-71.09886"
          },
          "label": "Fenway Park"
        },
        "waypoint": false,
        "stopSequence": 0,
        "stopType": "Origin"
      },
      {
        "plannedETA": "2025-02-11T00:18:59-05:00",
        "currentETA": "2025-02-11T00:18:59-05:00",
        "currentETD": "2025-02-11T02:18:59-05:00",
        "earliestArrivalTime": "2023-09-20T17:00:00-05:00",
        "latestArrivalTime": "2023-09-20T18:00:00-05:00",
        "plannedDuration": 120,
        "actualDuration": 0,
        "plannedDepartureTime": "2025-02-11T02:18:59-05:00",
        "stopStatus": "Open",
        "stopArrivalStatus": "Late",
        "atRiskThreshold": 30,
        "tooEarlyThreshold": null,
        "legDistance": 569.97,
        "legDriveDuration": 579.9,
        "metadata": null,
        "amenities": null,
        "truckServices": false,
        "alternateRestStops": null,
        "poiId": 0,
        "setId": 0,
        "persistentId": 0,
        "activeDriver": 1,
        "stopId": 1905959047,
        "slackTime": null,
        "location": {
          "address": {
            "streetAddress": "116 Federal Street",
            "city": "Pittsburgh",
            "state": "PA",
            "zip": "15212",
            "county": "Allegheny",
            "country": "United States"
          },
          "coords": {
            "lat": "40.448111",
            "lon": "-80.003865"
          },
          "label": "PNC Park"
        },
        "waypoint": false,
        "stopSequence": 1,
        "stopType": "Work"
      },
      {
        "plannedETA": "2025-02-12T17:14:59-08:00",
        "currentETA": "2025-02-12T17:14:59-08:00",
        "currentETD": "2025-02-12T17:14:59-08:00",
        "earliestArrivalTime": null,
        "latestArrivalTime": null,
        "plannedDuration": 0,
        "actualDuration": 0,
        "plannedDepartureTime": "2025-02-12T17:14:59-08:00",
        "stopStatus": "Open",
        "stopArrivalStatus": "OnTime",
        "atRiskThreshold": 15,
        "tooEarlyThreshold": null,
        "legDistance": 2598.045,
        "legDriveDuration": 2516,
        "metadata": null,
        "amenities": null,
        "truckServices": false,
        "alternateRestStops": null,
        "poiId": 0,
        "setId": 0,
        "persistentId": 0,
        "activeDriver": 1,
        "stopId": 1905959048,
        "slackTime": null,
        "location": {
          "address": {
            "streetAddress": "4900 Marie P. DeBartolo Way",
            "city": "Santa Clara",
            "state": "CA",
            "zip": "95054",
            "county": "Santa Clara",
            "country": "United States"
          },
          "coords": {
            "lat": "37.403658",
            "lon": "-121.96851"
          },
          "label": "Levi's Stadium"
        },
        "waypoint": false,
        "stopSequence": 2,
        "stopType": "Work"
      }
    ],
    "routingProfile": {
      "routingProfileId": 326934041,
      "vehicleType": "Truck",
      "tollRoadType": "Use",
      "truckDimensions": "TrailerOrTwins53",
      "maxHeight": 0,
      "maxWidth": 0,
      "totalLength": 0,
      "totalWeight": 0,
      "maxWeightPerAxleGroup": null,
      "totalWeightPerAxle": 0,
      "congestionZone": 0,
      "environmentalZone": 0,
      "ultraLowEmissionZone": null,
      "hazmatType": "None",
      "tunnelRestriction": null,
      "displayRestrictions": "BasedOnTruckRestrictions",
      "nationalNetwork": true,
      "fiftyThreeFootTrailer": true,
      "overrideRestrictions": false,
      "propane": false,
      "ferryClosed": false,
      "vehicleGroups": [],
      "revision": "February 2025",
      "statusDeleted": false,
      "unitsOfMeasure": "English",
      "numAxles": 5,
      "lcv": false,
      "distanceUnits": "Miles",
      "tollDiscouraged": false,
      "classOverrides": "None",
      "highwayOnly": false,
      "includeFerryDistance": false,
      "tollCurrency": 0,
      "exchangeRate": null,
      "fuelUnits": "Gallons",
      "costGHG": "1.00",
      "costPerFuelUnit": "1.00",
      "fuelEconomyLoad": "1.00",
      "fuelEconomyEmpty": "1.00",
      "costMaintLoad": "1.00",
      "costMaintEmpty": "1.00",
      "costTimeLoad": "1.00",
      "costTimeEmpty": "1.00",
      "dataVersion": "",
      "hubRouting": false,
      "tollDiscountPlans": null,
      "includeTollData": false,
      "default": false,
      "roadPreferencesFreewaysAFType": null,
      "roadPreferencesFreewaysSpeed": null,
      "roadPreferencesDividedHighwaysAFType": null,
      "roadPreferencesDividedHighwaysSpeed": null,
      "roadPreferencesPrimaryRoadsAFType": null,
      "roadPreferencesPrimaryRoadsSpeed": null,
      "roadPreferencesSecondaryRoadsAFType": null,
      "roadPreferencesSecondaryRoadsSpeed": null,
      "roadPreferencesLocalStreetsAFType": null,
      "roadPreferencesLocalStreetsSpeed": null,
      "isFerryDiscouraged": false,
      "elevationLimit": null,
      "governorSpeedLimit": null,
      "sideOfStreetAdherence": "Off",
      "useAvoidFavors": false,
      "useTraffic": null,
      "useSites": null,
      "name": "",
      "routingType": "Practical",
      "bordersOpen": true,
      "euProfile": {
        "hasTrailer": null,
        "isHybrid": null,
        "minPoll": null,
        "refrigerated": null,
        "trailerType": null,
        "emiType": null,
        "fuelType": null,
        "trailerCount": null,
        "trailerMaxAxles": null,
        "trailerMaxHt": null,
        "trailerMaxWt": null,
        "fuelConsumption": null,
        "co2Class": null
      }
    },
    "tspDriverId": null,
    "tspDriverId2": null,
    "vehicle": null,
    "plannedStartTime": "2025-02-10T18:20:45+00:00",
    "plannedStartLocation": {
      "address": {
        "streetAddress": "42 North Beacon Street  (US-20)",
        "city": "Watertown",
        "state": "MA",
        "zip": "02472",
        "county": "Middlesex",
        "country": "United States"
      },
      "coords": {
        "lat": "42.364551",
        "lon": "-71.180604"
      },
      "label": null
    },
    "allowDriverToDeclineTrip": true,
    "oocThreshold": 1,
    "hosSolution": "None",
    "sendOptions": {
      "adherenceLevel": "None",
      "offRouteThreshold": 2,
      "originThreshold": 1
    },
    "driverHoursOfService": null,
    "afSetIds": null,
    "afSetNames": null,
    "costPerMile": null,
    "tripOptions": [],
    "region": "NA",
    "externalOrderIds": [],
    "alkTripId": 240564192
  };

  // State to control whether the popup modal is visible
  const [showModal, setShowModal] = useState(false);

  // Handlers for opening/closing the modal
  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <h2>Trip Details</h2>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}
        border="1"
      >
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Status</th>
            <th>Modified On</th>
            <th>Distance</th>
            <th>Drive Duration</th>
            <th>Total Duration</th>
            <th>Cost</th>
            <th># Stops</th>
            <th>Map</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{tripData.accountName}</td>
            <td>{tripData.tripStatus}</td>
            <td>{new Date(tripData.modifiedOn).toLocaleString()}</td>
            <td>{tripData.tripDistance}</td>
            <td>{tripData.tripDriveDuration}</td>
            <td>{tripData.tripDuration}</td>
            <td>{tripData.tripCost}</td>
            <td>{tripData.stops.length}</td>
            <td>
              <button onClick={openModal}>View Map</button>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Popup Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button onClick={closeModal} style={closeButtonStyle}>
              Close
            </button>
            {/* The iframe loads the map URL */}
            <iframe
              src={tripData.url}
              width="100%"
              height="600"
              frameBorder="0"
              title="Trip Map"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline styles for the modal overlay and content
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '80%',
  maxWidth: '800px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.26)',
};

const closeButtonStyle = {
  display: 'block',
  marginBottom: '10px',
};

export default TripMap;

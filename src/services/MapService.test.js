import MapService from './MapService';

describe('MapService routing and PTV truck options', () => {
  beforeEach(() => {
    // Setup mock window.google.maps.DirectionsService
    window.google = {
      maps: {
        DirectionsService: jest.fn().mockImplementation(() => ({
          route: jest.fn((req, callback) => {
            // Provide 2 routes to test fastest vs shortest selection
            const routeFastest = {
              legs: [
                {
                  distance: { value: 160934 }, // 100 miles
                  duration: { value: 3600, text: '1 hr' }, // 1 hour
                  steps: [{ path: [{ lat: () => 43.65, lng: () => -79.38 }, { lat: () => 44.0, lng: () => -79.5 }] }]
                }
              ]
            };
            const routeShortest = {
              legs: [
                {
                  distance: { value: 128747 }, // 80 miles
                  duration: { value: 4500, text: '1 hr 15 mins' }, // 1 hr 15 mins
                  steps: [{ path: [{ lat: () => 43.65, lng: () => -79.38 }, { lat: () => 43.9, lng: () => -79.4 }] }]
                }
              ]
            };

            callback(
              {
                routes: [routeFastest, routeShortest]
              },
              'OK'
            );
          })
        })),
        TravelMode: { DRIVING: 'DRIVING' }
      }
    };
  });

  afterEach(() => {
    delete window.google;
  });

  test('parses route path from GeoJSON and lat/lng objects correctly', () => {
    const geoJsonPath = [
      [-79.3832, 43.6532],
      [-79.3840, 43.6540]
    ];
    const parsedGeoJson = MapService.parseRoutePath(geoJsonPath);
    expect(parsedGeoJson).toEqual([
      { lat: 43.6532, lng: -79.3832 },
      { lat: 43.654, lng: -79.384 }
    ]);

    const latLngPath = [
      { lat: 43.6532, lng: -79.3832 },
      { lat: 43.6540, lng: -79.3840 }
    ];
    const parsedLatLng = MapService.parseRoutePath(latLngPath);
    expect(parsedLatLng).toEqual(latLngPath);
  });

  test('calculates fastest route with car profile', async () => {
    const origin = { lat: 43.65, lng: -79.38 };
    const destination = { lat: 44.0, lng: -79.5 };

    const route = await MapService.calculateClientRoute(origin, destination, [], { type: 'car' }, 'fast');
    expect(route.status).toBe(true);
    expect(route.routeChoice).toBe('fast');
    expect(route.isTruckProfile).toBe(false);
    expect(route.distanceMiles).toBe('100.0');
    expect(route.duration).toBe(3600);
  });

  test('calculates shortest route choosing lower distance', async () => {
    const origin = { lat: 43.65, lng: -79.38 };
    const destination = { lat: 44.0, lng: -79.5 };

    const route = await MapService.calculateClientRoute(origin, destination, [], { type: 'car' }, 'shortest');
    expect(route.status).toBe(true);
    expect(route.routeChoice).toBe('shortest');
    expect(route.distanceMiles).toBe('80.0');
  });

  test('calculates PTV commercial truck route with duration and toll adjustments', async () => {
    const origin = { lat: 43.65, lng: -79.38 };
    const destination = { lat: 44.0, lng: -79.5 };

    const route = await MapService.calculateClientRoute(origin, destination, [], { type: 'truck' }, 'fast', true);
    expect(route.status).toBe(true);
    expect(route.provider).toBe('ptv');
    expect(route.isTruckProfile).toBe(true);
    // Adjusted by 1.18x for truck
    expect(route.duration).toBe(Math.round(3600 * 1.18));
    expect(route.tolls.tollAvailable).toBe(true);
    expect(route.tolls.amount).toBeGreaterThan(0);
  });

  test('calculates economic route avoiding tolls', async () => {
    const origin = { lat: 43.65, lng: -79.38 };
    const destination = { lat: 44.0, lng: -79.5 };

    const route = await MapService.calculateClientRoute(origin, destination, [], { type: 'truck' }, 'economic');
    expect(route.status).toBe(true);
    expect(route.routeChoice).toBe('economic');
    expect(route.tolls.amount).toBe(0);
  });
});

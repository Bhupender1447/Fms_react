/* eslint-disable jsx-a11y/no-redundant-roles */
import axios from 'axios';
import  { useEffect, useRef, useState } from 'react';
import { useParams,Link } from 'react-router-dom';

const UpdateLocation = () => {
  const nameRef = useRef(null);
  const [zip, setZip] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [country, setCountry] = useState('');

  const {id} = useParams();
  useEffect(() => {
    // Fetch existing location data
    const fetchLocationData = async () => {
      try {
        const response = await axios.get(`https://isovia.ca/fms_api/api/updatelocations/${id}`);
        const locationData = response.data.product_data;

        setZip(locationData.zip);
        setState(locationData.state);
        setCity(locationData.city);
        setAddress1(locationData.address1);
        setAddress2(locationData.address2);
        setLat(locationData.lat);
        setLng(locationData.lng);
        setCountry(locationData.country);
      } catch (error) {
        console.error('Error fetching location data', error);
      }
    };

    fetchLocationData();

    const initializeAutocomplete = () => {
      const input = nameRef.current;
      const autocomplete = new window.google.maps.places.Autocomplete(input);

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        place.address_components.forEach(component => {
          const types = component.types;
          types.forEach(type => {
            if (type === 'postal_code') {
              setZip(component.long_name);
            }
            if (type === 'administrative_area_level_1') {
              setState(component.long_name);
            }
            if (type === 'locality') {
              setCity(component.long_name);
            }
          });
        });

        const addressArray = place.formatted_address.split(',');
        const country = addressArray[addressArray.length - 1].trim();

        setAddress1(place.formatted_address);
        setAddress2(place.formatted_address);
        setLat(place.geometry.location.lat());
        setLng(place.geometry.location.lng());
        setCountry(country);
      });
    };

    if (window.google && window.google.maps) {
      initializeAutocomplete();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDiMQK2Czy_Dqw8lymFu8wCzVuLh27fRwA&libraries=places`;
      script.async = true;
      script.onload = () => initializeAutocomplete();
      document.body.appendChild(script);
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', nameRef.current?.value);
    formData.append('address1', address1);
    formData.append('address2', address2);
    formData.append('lat', lat);
    formData.append('long', lng);
    formData.append('country', country);
    formData.append('state', state);
    formData.append('city', city);
    formData.append('zip', zip);

    try {
      alert('Successfully updated');
    } catch (error) {
      console.error('Error updating location', error);
      alert('Error occurred!!');
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Manage
          <small>Customers</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="#">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Locations</li>
        </ol>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Update Location</h3>
              </div>

              <form role="form" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="box-body">
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <br />
                    <br />
                    <br />
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="username">Search Location </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="form-control pac-target-input"
                          placeholder="Search"
                          autoComplete="off"
                          ref={nameRef}
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="address1">First Line of Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address1"
                          name="address1"
                          placeholder="Enter Address"
                          value={address1}
                          onChange={(e) => setAddress1(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-12 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="address2">Second Line of Address</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address2"
                          name="address2"
                          placeholder="Enter Address"
                          value={address2}
                          onChange={(e) => setAddress2(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="lat">Latitude</label>
                        <input
                          type="text"
                          className="form-control"
                          id="lat"
                          name="lat"
                          value={lat}
                          onChange={(e) => setLat(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-3 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="long">Longitude</label>
                        <input
                          type="text"
                          className="form-control"
                          id="long"
                          name="long"
                          value={lng}
                          onChange={(e) => setLng(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="country">Country</label>
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          name="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          name="state"
                          placeholder="Enter State"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          placeholder="Enter City"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-xs-12 pull pull-left">
                      <div className="form-group">
                        <label htmlFor="zip">Postal/Zip Code</label>
                        <input
                          type="text"
                          className="form-control"
                          id="zip"
                          name="zip"
                          placeholder="Enter Postal/Zip Code"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="box-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <Link to="/locations/" className="btn btn-warning">
                    Back
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdateLocation;

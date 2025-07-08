import React, { useRef, useEffect, useState } from 'react';

const Addstop = ({ setpopup1, popup1 }) => {
  const locationRef = useRef(null);
  const [formData, setFormData] = useState({
    stoptype: 'Delivery',
    locationDetails: {
      address1: '',
      address2: '',
      stop_lat: '',
      stop_long: '',
      country: '',
      state: '',
      city: '',
      zip: 'NA',
    },
  });

  useEffect(() => {
    const initializeAutocomplete = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(locationRef.current);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        // Extract location details
        const addressComponents = {};
        place.address_components.forEach((component) => {
          const types = component.types;
          if (types.includes('postal_code')) addressComponents.zip = component.long_name;
          if (types.includes('administrative_area_level_1')) addressComponents.state = component.long_name;
          if (types.includes('locality')) addressComponents.city = component.long_name;
          if (types.includes('country')) addressComponents.country = component.long_name;
        });

        setFormData((prev) => ({
          ...prev,
          locationDetails: {
            address1: place.formatted_address,
            address2: place.formatted_address,
            stop_lat: place.geometry.location.lat(),
            stop_long: place.geometry.location.lng(),
            ...addressComponents,
          },
        }));
      });
    };

    if (window.google && window.google.maps) {
      initializeAutocomplete();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBM3VgKsX8mEGsVYpSic7VLNKwEmZ7IABc&libraries=places`;
      script.async = true;
      script.onload = initializeAutocomplete;
      document.body.appendChild(script);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    setpopup1(false);
  };

  return (
    <div className={popup1 ? 'modal show' : ''} id="removeModal2" tabIndex={-1}>
      <div className="modal-dialog custom-modal" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" aria-label="Close" onClick={() => setpopup1(false)}>
              <span aria-hidden="true">×</span>
            </button>
            <h4 className="modal-title">Pickup Stop</h4>
          </div>
          <form id="my-form" onSubmit={handleSubmit}>
            <div className="col-md-4 col-xs-12 pull pull-left">
              <div className="form-group">
                <label htmlFor="stoptype">Stop Type</label>
                <select
                  className="form-control"
                  id="stoptype"
                  name="stoptype"
                  value={formData.stoptype}
                  onChange={handleInputChange}
                >
                  <option value="Delivery">Delivery</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>
            </div>
            <input type="hidden" name="address1" value={formData.locationDetails.address1} />
            <input type="hidden" name="address2" value={formData.locationDetails.address2} />
            <input type="hidden" name="stop_lat" value={formData.locationDetails.stop_lat} />
            <input type="hidden" name="stop_long" value={formData.locationDetails.stop_long} />
            <input type="hidden" name="country" value={formData.locationDetails.country} />
            <input type="hidden" name="state" value={formData.locationDetails.state} />
            <input type="hidden" name="city" value={formData.locationDetails.city} />
            <input type="hidden" name="zip" value={formData.locationDetails.zip} />

            <div className="col-md-12 col-xs-12 pull pull-left" style={{ marginBottom: '15px' }}>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  id="pac-container"
                  name="pac-container"
                  type="text"
                  ref={locationRef}
                  className="form-control"
                  placeholder="Enter Location Name, Address etc."
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" data-dismiss="modal"
          aria-label="Close" className="btn btn-primary" onClick={() => setpopup1(false)}>
                Close
              </button>
              <button type="button" data-dismiss="modal"
          aria-label="Close" onClick={() => setpopup1(false)} className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addstop;

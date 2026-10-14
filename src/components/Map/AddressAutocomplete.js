import React, { useEffect, useRef, useState } from 'react';
import MapService from '../../services/MapService';

const newSessionToken = () => window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function AddressAutocomplete({ id, name, label, value, onChange }) {
  const [sessionToken, setSessionToken] = useState(newSessionToken);
  const [predictions, setPredictions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState(null);
  const [error, setError] = useState('');
  const selectionRef = useRef(false);

  useEffect(() => {
    const query = String(value || '').trim();
    if (selectionRef.current) {
      selectionRef.current = false;
      return undefined;
    }
    if (query.length < 3) {
      setPredictions([]);
      return undefined;
    }
    let active = true;
    const timeout = window.setTimeout(async () => {
      setSearching(true);
      setError('');
      try {
        const result = await MapService.getPlaces(query, sessionToken);
        if (active) setPredictions(result.predictions || []);
      } catch (searchError) {
        if (active) setError(searchError.message || 'Address suggestions are unavailable.');
      } finally {
        if (active) setSearching(false);
      }
    }, 300);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [value, sessionToken]);

  const selectPrediction = async (prediction) => {
    setSearching(true);
    setError('');
    try {
      const place = await MapService.getPlaceDetails(prediction.place_id, sessionToken);
      const selectedAddress = place.formattedAddress || prediction.description;
      selectionRef.current = true;
      onChange({ target: { name, value: selectedAddress } });
      setPredictions([]);
      setValidation(null);
      setSessionToken(newSessionToken());
    } catch (selectionError) {
      setError(selectionError.message || 'Could not load the selected place.');
    } finally {
      setSearching(false);
    }
  };

  const validateCurrentAddress = async () => {
    if (!String(value || '').trim()) return;
    setValidating(true);
    setError('');
    try {
      const result = await MapService.validateAddress(value);
      setValidation(result);
    } catch (validationError) {
      setError(validationError.message || 'Address validation is unavailable.');
    } finally {
      setValidating(false);
    }
  };

  const verdict = validation?.result?.verdict;
  const canonicalAddress = validation?.result?.address?.formattedAddress;
  const needsReview = verdict && (!verdict.addressComplete || verdict.hasInferredComponents || verdict.hasReplacedComponents);

  return (
    <div className="form-group" style={{ position: 'relative' }}>
      <label htmlFor={id}>{label}</label>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          id={id}
          name={name}
          autoComplete="off"
          value={value || ''}
          onChange={(event) => { onChange(event); setValidation(null); }}
          aria-autocomplete="list"
          aria-expanded={predictions.length > 0}
          aria-controls={`${id}-suggestions`}
        />
        <span className="input-group-btn">
          <button type="button" className="btn btn-default" onClick={validateCurrentAddress} disabled={validating || !String(value || '').trim()} title="Check address completeness and deliverability">
            {validating ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-check-circle" />} Validate
          </button>
        </span>
      </div>
      {(searching || predictions.length > 0) && <div id={`${id}-suggestions`} role="listbox" className="list-group" style={{ position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 1050, boxShadow: '0 4px 12px rgba(0,0,0,.15)' }}>
        {searching && <div className="list-group-item text-muted small">Searching addresses…</div>}
        {predictions.map((prediction) => <button key={prediction.place_id} type="button" role="option" className="list-group-item list-group-item-action" onClick={() => selectPrediction(prediction)}>
          <strong>{prediction.structured_formatting?.main_text || prediction.description}</strong>
          {prediction.structured_formatting?.secondary_text && <span className="d-block small text-muted">{prediction.structured_formatting.secondary_text}</span>}
        </button>)}
      </div>}
      {error && <div className="small text-danger mt-1" role="alert">{error}</div>}
      {verdict && <div className={`small mt-1 ${needsReview ? 'text-warning' : 'text-success'}`} role="status">
        <i className={`fa ${needsReview ? 'fa-exclamation-circle' : 'fa-check-circle'}`} />{' '}
        {needsReview ? 'Review this address before dispatch.' : `Address check: ${verdict.validationGranularity || 'complete'}.`}
        {canonicalAddress && canonicalAddress !== value && <div className="mt-1">Suggested: {canonicalAddress} <button type="button" className="btn btn-link btn-xs p-0" onClick={() => onChange({ target: { name, value: canonicalAddress } })}>Use suggested address</button></div>}
      </div>}
    </div>
  );
}

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BASE_URL } from '../../config';
import './WorldModel.css';
import { readAccountResponse, readSnapshotResponse } from './snapshotResponse';
import { Alert, Badge, Button, Card, EmptyState, Input, PageHeader, Select } from '../../design-system/components';

const PAGE_SIZE = 50;
const EMPTY_ENTITIES = [];
const EMPTY_RELATIONSHIPS = [];
const TYPE_LABELS = {
  order: 'Order',
  trip: 'Trip',
  trip_stop: 'Trip stop',
  driver: 'Driver',
  truck: 'Truck',
};

const displayValue = (value, fallback = '—') => (
  value === null || value === undefined || value === '' ? fallback : String(value)
);

function describeEntity(entity) {
  const attributes = entity.attributes || {};
  switch (entity.entity_type) {
    case 'order':
      return [
        `Order ${displayValue(attributes.order_number, entity.source?.record_id)}`,
        [attributes.pickup?.name, attributes.delivery?.name].filter(Boolean).join(' → '),
        [attributes.status, attributes.mode].filter(Boolean).join(' · '),
        attributes.revenue?.amount !== null && attributes.revenue?.amount !== undefined
          ? `${attributes.revenue.amount} ${attributes.revenue.currency || ''}`.trim()
          : '',
      ].filter(Boolean).join('  |  ');
    case 'trip':
      return [
        `Trip ${displayValue(attributes.trip_reference, entity.source?.record_id)}`,
        [attributes.origin?.name, attributes.destination?.name].filter(Boolean).join(' → '),
        [attributes.status, attributes.driver_id ? `Driver ${attributes.driver_id}` : '', attributes.truck_id ? `Truck ${attributes.truck_id}` : ''].filter(Boolean).join(' · '),
      ].filter(Boolean).join('  |  ');
    case 'trip_stop':
      return [
        displayValue(attributes.stop_type, 'Stop'),
        displayValue(attributes.name),
        displayValue(attributes.address),
        attributes.trip_reference ? `Trip ${attributes.trip_reference}` : '',
      ].filter(Boolean).join('  |  ');
    case 'driver':
      return displayValue(attributes.name, `Driver ${entity.source?.record_id}`);
    case 'truck':
      return [attributes.name, attributes.unit_number ? `Unit ${attributes.unit_number}` : '', attributes.plate_number ? `Plate ${attributes.plate_number}` : ''].filter(Boolean).join(' · ')
        || `Truck ${entity.source.record_id}`;
    default:
      return JSON.stringify(attributes);
  }
}

function formatDate(value) {
  if (!value) return 'Not supplied';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

function AttributeList({ attributes, prefix = '', entityType }) {
  return <dl className="sis-world-attributes">{Object.entries(attributes).map(([key, value]) => {
    const customerLabel = entityType === 'trip' ? 'Broker / carrier customer reference' : 'Customer / company reference';
    const label = [prefix, key === 'customer_id' ? customerLabel : key.replace(/_/g, ' ')].filter(Boolean).join(' / ');
    return value && typeof value === 'object'
      ? <div key={key}><AttributeList attributes={value} prefix={label} entityType={entityType} /></div>
      : <div key={key}><dt>{label}</dt><dd>{displayValue(value, 'Not supplied')}</dd></div>;
  })}</dl>;
}

export default function WorldModel() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountError, setAccountError] = useState('');
  const [accountReload, setAccountReload] = useState(0);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [relationshipScope, setRelationshipScope] = useState('all');
  const [offset, setOffset] = useState(0);
  const requestRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    requestRef.current?.abort();
    setAccountsLoading(true);
    setAccountError('');
    setAccounts([]);
    setAccountId('');
    setSnapshot(null);
    async function loadAccounts() {
      try {
        const response = await fetch(`${BASE_URL}api/sis/accounts`, {
          credentials: 'include', signal: controller.signal, headers: { Accept: 'application/json' },
        });
        const choices = await readAccountResponse(response);
        if (controller.signal.aborted) return;
        setAccounts(choices);
        // Only a single unambiguous, server-authorized choice is preselected.
        if (choices.length === 1) setAccountId(choices[0].account_id);
      } catch (loadError) {
        if (!controller.signal.aborted) setAccountError(loadError.message || 'Authorized accounts are unavailable.');
      } finally {
        if (!controller.signal.aborted) setAccountsLoading(false);
      }
    }
    loadAccounts();
    return () => controller.abort();
  }, [accountReload]);

  const loadSnapshot = useCallback(async () => {
    requestRef.current?.abort();
    if (!accountId) {
      setSnapshot(null);
      setError('');
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);
    setSnapshot(null);
    setError('');
    try {
      const query = new URLSearchParams({ account_id: accountId, limit: String(PAGE_SIZE), offset: String(offset) });
      const response = await fetch(`${BASE_URL}api/sis/world-model?${query.toString()}`, {
        credentials: 'include',
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      const nextSnapshot = await readSnapshotResponse(response, accountId);
      if (!controller.signal.aborted) setSnapshot(nextSnapshot);
    } catch (loadError) {
      if (controller.signal.aborted) return;
      setError(loadError.message || 'Could not load the World Model snapshot.');
      setSnapshot(null);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [accountId, offset]);

  useEffect(() => {
    loadSnapshot();
    return () => requestRef.current?.abort();
  }, [loadSnapshot]);

  const entities = snapshot?.entities || EMPTY_ENTITIES;
  const relationships = snapshot?.relationships || EMPTY_RELATIONSHIPS;
  const entityNames = useMemo(() => Object.fromEntries(
    entities.map((entity) => [entity.entity_key, `${TYPE_LABELS[entity.entity_type] || entity.entity_type} ${entity.source.record_id}`])
  ), [entities]);

  const filteredEntities = useMemo(() => entities.filter((entity) => {
    const matchesType = typeFilter === 'all' || entity.entity_type === typeFilter;
    const text = `${entity.entity_key} ${entity.entity_type} ${describeEntity(entity)}`.toLowerCase();
    const attributes = entity.attributes || {};
    const missingAssignment = entity.entity_type === 'trip' && (!attributes.driver_id || String(attributes.driver_id) === '0' || !attributes.truck_id || String(attributes.truck_id) === '0');
    const matchesReview = reviewFilter === 'all' || (reviewFilter === 'timestamp' && !entity.source?.updated_at) || (reviewFilter === 'assignment' && missingAssignment);
    return matchesType && matchesReview && text.includes(search.trim().toLowerCase());
  }), [entities, search, typeFilter, reviewFilter]);

  const visibleEntityKeys = useMemo(() => new Set(filteredEntities.map((entity) => entity.entity_key)), [filteredEntities]);
  const visibleRelationships = useMemo(() => relationships.filter((relationship) => relationshipScope === 'all' || visibleEntityKeys.has(relationship.from) || visibleEntityKeys.has(relationship.to)), [relationships, relationshipScope, visibleEntityKeys]);

  const typeCounts = useMemo(() => entities.reduce((counts, entity) => {
    counts[entity.entity_type] = (counts[entity.entity_type] || 0) + 1;
    return counts;
  }, {}), [entities]);
  const canAdvance = Object.values(typeCounts).some((count) => count === PAGE_SIZE);
  const timestampCount = entities.filter((entity) => entity.source?.updated_at).length;
  const trips = entities.filter((entity) => entity.entity_type === 'trip');
  const missingDriverCount = trips.filter((entity) => !entity.attributes?.driver_id || String(entity.attributes.driver_id) === '0').length;
  const missingTruckCount = trips.filter((entity) => !entity.attributes?.truck_id || String(entity.attributes.truck_id) === '0').length;
  const entityKeys = new Set(entities.map((entity) => entity.entity_key));
  const unresolvedLinks = relationships.filter((link) => !entityKeys.has(link.from) || !entityKeys.has(link.to)).length;

  return (
    <main className="iso-ui sis-world-page" data-iso-theme="dark" aria-busy={loading}>
      <PageHeader eyebrow="SIS FOUNDATION / UNDER DEVELOPMENT" title="World Model" actions={
        <Button onClick={loadSnapshot} disabled={loading || accountsLoading || !accountId}>{loading ? 'Refreshing' : 'Refresh snapshot'}</Button>
      }>A traceable operational snapshot projected from IFM orders, trips, stops, drivers, and trucks.</PageHeader>

      <Alert tone="warning" title="Freshness is not assessed." className="sis-world-notice">
        Source timestamps may be absent. This view does not certify live or regulatory data.
      </Alert>
      <Card className="sis-world-account">
        <Select label="Authorized account" value={accountId} disabled={accountsLoading || accounts.length === 0} onChange={(event) => {
          requestRef.current?.abort();
          setSnapshot(null);
          setError('');
          setOffset(0);
          setAccountId(event.target.value);
        }}>
          <option value="">{accountsLoading ? 'Checking authorized accounts...' : 'Select an account'}</option>
          {accounts.map((account) => <option key={account.account_id} value={account.account_id}>{account.name}</option>)}
        </Select>
        <p>This account identifies the operating company. For a trip, the broker is the carrier’s customer. For an order or route, the customer is a customer or company. Each snapshot rechecks your account read permissions.</p>
      </Card>
      {accountError && <Alert tone="danger" title="Account access unavailable" className="sis-world-notice" action={<Button variant="secondary" onClick={() => setAccountReload((value) => value + 1)}>Retry account access</Button>}>{accountError}</Alert>}
      {!accountsLoading && !accountError && accounts.length === 0 && <Alert tone="warning" title="No authorized accounts" className="sis-world-notice">A verified account, active membership and order/trip read permissions are required. Legacy unassigned records are excluded.</Alert>}
      {!accountsLoading && accounts.length > 1 && !accountId && <Alert title="Select an authorized account" className="sis-world-notice">Choose which account to inspect. Records from different accounts are not combined.</Alert>}
      {snapshot?.source_status === 'partial' && <Alert tone="warning" title="Partial account coverage" className="sis-world-notice">Only authorized orders and trips are included. Stops, drivers, trucks and linked master-record references are withheld pending verified ownership. Their absence does not mean zero records or missing assignments.</Alert>}
      {error && <Alert tone="danger" title="Snapshot unavailable" className="sis-world-notice" action={<Button variant="secondary" onClick={loadSnapshot}>Retry</Button>}>
        <p>{error}</p><p>Check the API connection and administrator access, then retry.</p>
      </Alert>}

      <section className="sis-world-summary" aria-label="Snapshot summary">
        <Card as="article"><span>Entities on page</span><strong>{loading || !snapshot ? '—' : entities.length}</strong></Card>
        <Card as="article"><span>Relationships on page</span><strong>{loading || !snapshot ? '—' : relationships.length}</strong></Card>
        <Card as="article"><span>Source status</span><strong className="sis-world-source">{snapshot?.source_status || (loading ? 'Loading' : 'Unavailable')}</strong></Card>
        <Card as="article"><span>Snapshot generated</span><strong className="sis-world-time">{formatDate(snapshot?.generated_at)}</strong></Card>
      </section>

      {snapshot && !loading && <Card className="sis-world-panel sis-world-quality">
        <h2>Page coverage and review</h2>
        <p>These counts describe this page only, including historical trips. References may be withheld while ownership is unverified; absence does not prove a missing assignment or dispatch violation.</p>
        <dl>
          <div><dt>Source timestamps supplied</dt><dd>{timestampCount} of {entities.length}</dd></div>
          <div><dt>Trips without a visible driver reference</dt><dd>{missingDriverCount} of {trips.length}</dd></div>
          <div><dt>Trips without a visible truck reference</dt><dd>{missingTruckCount} of {trips.length}</dd></div>
          <div><dt>Authorized account</dt><dd>{snapshot.account_id}</dd></div>
          <div><dt>Relationship endpoints outside this page</dt><dd>{unresolvedLinks}</dd></div>
          <div><dt>Snapshot scope</dt><dd>{displayValue(snapshot.scope, 'Not supplied')}</dd></div>
          <div><dt>Projection schema</dt><dd>{displayValue(snapshot.schema_version, 'Not supplied')}</dd></div>
        </dl>
      </Card>}

      <Card className="sis-world-panel">
        <div className="sis-world-toolbar">
          <div><h2>Operational entities</h2><p>Source IDs are preserved for traceability.</p></div>
          <div className="sis-world-filters">
            <Input label="Search current page" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search entities" />
            <Select label="Entity type" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
              <option value="all">All types</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}{typeCounts[value] ? ` (${typeCounts[value]})` : ''}</option>)}
            </Select>
            <Select label="Review filter" value={reviewFilter} onChange={(event) => setReviewFilter(event.target.value)}>
              <option value="all">All records</option>
              <option value="timestamp">Source timestamp absent</option>
              <option value="assignment">Trip assignment absent</option>
            </Select>
            <Button variant="secondary" onClick={() => { setSearch(''); setTypeFilter('all'); setReviewFilter('all'); }}>Clear filters</Button>
          </div>
        </div>
        {snapshot && !loading && <p className="sis-world-result-count" role="status">Showing {filteredEntities.length} of {entities.length} entities on this page. Filters do not search the entire database.</p>}

        {loading && !snapshot ? <EmptyState loading title="Loading the current snapshot..." /> : null}
        {!loading && snapshot && !error && filteredEntities.length === 0 ? <EmptyState title="No entities match this page and filter." /> : null}

        {filteredEntities.length > 0 && (
          <div className="sis-world-table-wrap">
            <table className="sis-world-table">
              <caption className="sis-world-sr-only">Operational entities on the current snapshot page</caption>
              <thead><tr><th scope="col">Type</th><th scope="col">Source record</th><th scope="col">Operational summary</th><th scope="col">Source updated</th><th scope="col">Freshness</th></tr></thead>
              <tbody>{filteredEntities.map((entity) => (
                <tr key={entity.entity_key}>
                  <td><Badge>{TYPE_LABELS[entity.entity_type] || entity.entity_type}</Badge></td>
                  <td><code>{entity.source?.system}:{entity.source.record_id}</code></td>
                  <td className="sis-world-summary-cell">
                    {describeEntity(entity)}
                    <details className="sis-world-details">
                      <summary>Inspect {TYPE_LABELS[entity.entity_type] || entity.entity_type} {displayValue(entity.source?.record_id)} details</summary>
                      <dl><dt>Entity key</dt><dd>{entity.entity_key}</dd><dt>Observed by projection</dt><dd>{formatDate(entity.observed_at)}</dd></dl>
                      <AttributeList attributes={entity.attributes || {}} entityType={entity.entity_type} />
                    </details>
                  </td>
                  <td>{formatDate(entity.source?.updated_at)}</td>
                  <td><Badge tone="warning">{(entity.freshness || 'not_assessed').replace(/_/g, ' ')}</Badge></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        <div className="sis-world-pagination">
          <span>Page {Math.floor(offset / PAGE_SIZE) + 1} · up to {PAGE_SIZE} records per source</span>
          <div>
            <Button variant="secondary" onClick={() => setOffset((current) => Math.max(0, current - PAGE_SIZE))} disabled={loading || offset === 0}>Previous</Button>
            <Button variant="secondary" onClick={() => setOffset((current) => current + PAGE_SIZE)} disabled={loading || !canAdvance}>Next</Button>
          </div>
        </div>
      </Card>

      <Card className="sis-world-panel sis-world-relations">
        <div className="sis-world-toolbar"><div><h2>Source relationships</h2><p>Links are limited to records loaded on this page.</p></div><Select label="Relationship scope" value={relationshipScope} onChange={(event) => setRelationshipScope(event.target.value)}>
          <option value="all">All page relationships</option>
          <option value="filtered">Connected to filtered entities</option>
        </Select></div>
        {loading ? <EmptyState loading title="Loading source relationships..." /> : error ? <EmptyState title="Relationships unavailable." /> : visibleRelationships.length === 0 ? <EmptyState title="No relationships match this page and scope." /> : (
          <ul>{visibleRelationships.map((relationship, index) => (
            <li key={`${relationship.relationship_type}-${relationship.from}-${relationship.to}-${index}`}>
              <span>{entityNames[relationship.from] || relationship.from}{!entityKeys.has(relationship.from) && <Badge tone="warning">Outside page</Badge>}</span>
              <i className="fa fa-long-arrow-right" aria-hidden="true" />
              <strong>{relationship.relationship_type.replace(/_/g, ' ')}</strong>
              <i className="fa fa-long-arrow-right" aria-hidden="true" />
              <span>{entityNames[relationship.to] || relationship.to}{!entityKeys.has(relationship.to) && <Badge tone="warning">Outside page</Badge>}</span>
            </li>
          ))}</ul>
        )}
      </Card>
    </main>
  );
}

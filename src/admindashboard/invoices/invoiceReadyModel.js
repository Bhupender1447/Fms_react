// Proposed authorized shipment projection, not a legacy order/trip adapter.
const sourceTypes = ['order', 'trip', 'route'];
const sourceStates = ['draft', 'in_progress', 'completed', 'cancelled', 'unknown'];
const billingStates = ['unbilled', 'draft', 'issued', 'review_required'];
const identifier = value => typeof value === 'string' && value.trim() === value && value.length > 0;

export function invoiceReadyEntries(shipments, accountId) {
  if (!identifier(accountId) || !Array.isArray(shipments)) {
    throw new Error('An authorized account and shipment projection are required for invoice readiness.');
  }
  const identities = new Set();
  const sourceOwners = new Map();
  const entries = [];
  shipments.forEach(shipment => {
    if (!shipment || shipment.accountId !== accountId || !identifier(shipment.shipmentId)
      || identities.has(shipment.shipmentId) || !billingStates.includes(shipment.billingState)
      || !Array.isArray(shipment.sources) || shipment.sources.length === 0) {
      throw new Error('Invoice-ready shipment identity, account or billing state is invalid.');
    }
    identities.add(shipment.shipmentId);
    const sources = [];
    const seen = new Set();
    shipment.sources.forEach(source => {
      if (!source || !sourceTypes.includes(source.type) || !identifier(source.id)
        || !sourceStates.includes(source.state)) {
        throw new Error('Invoice-ready source ID, type or completion state is invalid.');
      }
      const key = JSON.stringify([source.type, source.id]);
      if (seen.has(key) || sourceOwners.has(key)) {
        throw new Error('A source is repeated or linked to conflicting shipments. Billing review is required.');
      }
      seen.add(key);
      sourceOwners.set(key, shipment.shipmentId);
      sources.push({ type: source.type, id: source.id, state: source.state });
    });
    // The server must resolve a stable economic shipment identity before this
    // projection is supplied; matching display IDs never establishes a link.
    if (shipment.billingState === 'unbilled' && sources.some(source => source.state === 'completed')
      && !sources.some(source => source.state === 'cancelled')) {
      entries.push({
        shipmentId: shipment.shipmentId,
        sources,
        orderIds: sources.filter(source => source.type === 'order').map(source => source.id),
        tripIds: sources.filter(source => source.type === 'trip').map(source => source.id),
        routeIds: sources.filter(source => source.type === 'route').map(source => source.id),
      });
    }
  });
  return entries;
}

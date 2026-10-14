const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isText = (value) => typeof value === 'string' && value.trim().length > 0;

export async function readSnapshotResponse(response) {
  if (response.status === 401) throw new Error('Your session has expired. Sign in again to view the World Model.');
  if (response.status === 403) throw new Error('Administrator access is required to view this snapshot.');
  if (!response.ok) throw new Error(`The snapshot service returned HTTP ${response.status}. Check API and database availability.`);
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error('The snapshot service did not return valid JSON. Check the API URL and PHP server response.');
  }
  if (!isObject(result) || result.status !== 'success' || !isObject(result.world_model)) {
    throw new Error('The snapshot service did not return a successful World Model response.');
  }
  const snapshot = result.world_model;
  if (!Array.isArray(snapshot.entities) || !Array.isArray(snapshot.relationships)) {
    throw new Error('The snapshot is missing its entity or relationship collections.');
  }
  const keys = new Set();
  for (const entity of snapshot.entities) {
    if (!isObject(entity) || !isText(entity.entity_key) || !isText(entity.entity_type)
      || !isObject(entity.source) || !isObject(entity.attributes)
      || (entity.freshness != null && typeof entity.freshness !== 'string')
      || keys.has(entity.entity_key)) {
      throw new Error('The snapshot contains invalid or duplicate entities. Check the backend projection.');
    }
    keys.add(entity.entity_key);
  }
  if (snapshot.relationships.some((link) => !isObject(link) || !isText(link.from) || !isText(link.to) || !isText(link.relationship_type))) {
    throw new Error('The snapshot contains invalid relationship references. Check the backend projection.');
  }
  return snapshot;
}

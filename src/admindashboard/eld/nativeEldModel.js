const VERSION = 'isovia-native-eld-prototype-1.0';
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const token = value => typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,79}$/.test(value);
const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const statuses = ['OFF_DUTY', 'SLEEPER_BERTH', 'DRIVING', 'ON_DUTY'];
const types = ['DUTY_STATUS', 'ENGINE_TELEMETRY', 'POWER_UP', 'POWER_DOWN', 'ANNOTATION'];
const keys = (value, allowed) => Object.keys(value).every(key => allowed.includes(key));

function instant(value) {
  if (typeof value !== 'string') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day, hour, minute, second, zone] = match;
  const calendar = new Date(Date.UTC(+year, +month - 1, +day));
  if (+year < 2000 || calendar.getUTCFullYear() !== +year || calendar.getUTCMonth() !== +month - 1 || calendar.getUTCDate() !== +day || +hour > 23 || +minute > 59 || +second > 59
    || (zone !== 'Z' && (+zone.slice(1, 3) > 14 || +zone.slice(4) > 59 || (+zone.slice(1, 3) === 14 && +zone.slice(4) !== 0)))) return null;
  const result = Date.parse(value); return Number.isFinite(result) ? result : null;
}

export function validateNativePrototype(raw) {
  const issues = [];
  const fail = (code, detail, sequence = null) => issues.push({ code, detail, sequence });
  const result = { schema_version: VERSION, mode: 'PROTOTYPE_ONLY', schema_valid: false, issues, authentication_verified: false, signature_verified: false,
    persisted: false, official_log: false, dispatch_authorized: false, hos_assessed: false, normalized_events: [], timeline: [], summary: null };
  let batch;
  if (typeof raw !== 'string' || raw.length > 256000) { fail('INPUT_BOUND', 'Paste JSON of at most 256,000 characters.'); return result; }
  try { batch = JSON.parse(raw); } catch { fail('INVALID_JSON', 'The event batch is not valid JSON.'); return result; }
  if (!object(batch) || batch.schema_version !== VERSION || batch.mode !== 'PROTOTYPE_ONLY' || !keys(batch, ['schema_version', 'mode', 'context', 'window', 'previous_sequence', 'events'])
    || !object(batch.context) || !keys(batch.context, ['device_id', 'vehicle_id', 'driver_id']) || !['device_id', 'vehicle_id', 'driver_id'].every(key => token(batch.context[key]))
    || !Number.isSafeInteger(batch.previous_sequence) || batch.previous_sequence < 0 || !object(batch.window) || !keys(batch.window, ['start', 'end'])
    || !Array.isArray(batch.events) || !batch.events.length || batch.events.length > 2000) {
    fail('BATCH_SCHEMA', 'Use the prototype schema, explicit identities, prior sequence, window and 1–2,000 events. Authority flags and undeclared fields are rejected.'); return result;
  }
  const start = instant(batch.window.start); const end = instant(batch.window.end);
  if (start === null || end === null || end <= start || end - start > 48 * 3600000) { fail('WINDOW_INVALID', 'Use timezone-aware start/end values for a positive window of at most 48 hours.'); return result; }
  const ids = new Set(); const sequences = new Set();
  for (const event of batch.events) {
    if (!object(event) || !keys(event, ['event_id', 'sequence', 'occurred_at', 'received_at', 'device_id', 'vehicle_id', 'driver_id', 'type', 'data'])
      || !token(event.event_id) || !Number.isSafeInteger(event.sequence) || event.sequence < 1 || !types.includes(event.type) || !object(event.data)) { fail('EVENT_SCHEMA', 'An event has an unsupported shape, type, ID or sequence.'); continue; }
    if (ids.has(event.event_id) || sequences.has(event.sequence)) fail('DUPLICATE_EVENT', 'IDs and sequence numbers must be unique within this batch.', event.sequence);
    ids.add(event.event_id); sequences.add(event.sequence);
    if (!['device_id', 'vehicle_id', 'driver_id'].every(key => event[key] === batch.context[key])) fail('IDENTITY_MISMATCH', 'Each event must match this session’s explicit device, vehicle and driver.', event.sequence);
    const at = instant(event.occurred_at); const received = instant(event.received_at);
    if (at === null || received === null || at < start || at > end || received < at) fail('EVENT_TIME', 'Require valid timezone-aware dates, occurrence inside the window and receipt no earlier than occurrence.', event.sequence);
    if (event.type === 'DUTY_STATUS' && (!keys(event.data, ['status']) || !statuses.includes(event.data.status))) fail('DUTY_STATUS', 'Supply an explicit supported duty status; telemetry never invents one.', event.sequence);
    if (event.type === 'ENGINE_TELEMETRY') {
      if (!keys(event.data, ['engine_on', 'speed_kph', 'odometer_km', 'engine_hours']) || typeof event.data.engine_on !== 'boolean'
        || !['speed_kph', 'odometer_km', 'engine_hours'].every(key => number(event.data[key]))) fail('TELEMETRY_SCHEMA', 'Telemetry needs engine state and nonnegative numeric speed (km/h), odometer (km) and engine hours.', event.sequence);
      else if (!event.data.engine_on && event.data.speed_kph > 0) fail('ENGINE_STATE_CONFLICT', 'Movement and engine-off evidence conflict; neither is silently corrected.', event.sequence);
    }
    if (['POWER_UP', 'POWER_DOWN'].includes(event.type) && Object.keys(event.data).length) fail('POWER_EVENT_SCHEMA', 'Power event data is empty in this prototype format.', event.sequence);
    if (event.type === 'ANNOTATION' && (!keys(event.data, ['text', 'refers_to']) || typeof event.data.text !== 'string' || !event.data.text.trim() || event.data.text.length > 500 || !token(event.data.refers_to))) fail('ANNOTATION_SCHEMA', 'Annotations need an event reference and 1–500 characters; originals are not replaced.', event.sequence);
  }
  if (issues.length) return result;
  const events = [...batch.events].sort((a, b) => a.sequence - b.sequence);
  const byId = new Map(events.map(event => [event.event_id, event])); const dutyTimes = new Set();
  let sequence = batch.previous_sequence; let previousTime = null; let telemetry = null;
  for (const event of events) {
    const at = instant(event.occurred_at);
    if (event.sequence !== sequence + 1) fail('SEQUENCE_GAP', 'Events do not continue the declared sequence without gaps.', event.sequence);
    sequence = event.sequence;
    if (previousTime !== null && at < previousTime) fail('SOURCE_TIME_REVERSED', 'Occurrence times run backwards in device sequence.', event.sequence);
    previousTime = at;
    if (event.type === 'DUTY_STATUS') { if (dutyTimes.has(at)) fail('DUTY_TIME_CONFLICT', 'Multiple duty statuses at one instant need review.', event.sequence); dutyTimes.add(at); }
    if (event.type === 'ENGINE_TELEMETRY') {
      if (telemetry && (event.data.odometer_km < telemetry.odometer_km || event.data.engine_hours < telemetry.engine_hours)) fail('COUNTER_DECREASE', 'Odometer/engine-hour counters decreased; reset semantics are not supported.', event.sequence);
      telemetry = event.data;
    }
    if (event.type === 'ANNOTATION' && (!byId.has(event.data.refers_to) || byId.get(event.data.refers_to).sequence >= event.sequence)) fail('ANNOTATION_REFERENCE', 'An annotation must reference an earlier event in this batch.', event.sequence);
  }
  const duties = events.filter(event => event.type === 'DUTY_STATUS');
  if (!duties.length || instant(duties[0].occurred_at) !== start) fail('INITIAL_DUTY_REQUIRED', 'An explicit duty status at the window start is required; prior state is not guessed.');
  if (issues.length) return result;
  result.schema_valid = true; result.context = batch.context; result.window = batch.window; result.normalized_events = events;
  result.timeline = duties.map((event, i) => ({ status: event.data.status, start: event.occurred_at, end: duties[i + 1]?.occurred_at || batch.window.end,
    seconds: ((duties[i + 1] ? instant(duties[i + 1].occurred_at) : end) - instant(event.occurred_at)) / 1000, event_id: event.event_id }));
  result.summary = { event_count: events.length, telemetry_points: events.filter(event => event.type === 'ENGINE_TELEMETRY').length, sequence_start: events[0].sequence, sequence_end: events[events.length - 1].sequence, window_seconds: (end - start) / 1000 };
  return result;
}

export function exampleNativeBatch() {
  const context = { device_id: 'EXAMPLE-DEVICE', vehicle_id: 'EXAMPLE-VEHICLE', driver_id: 'EXAMPLE-DRIVER' };
  const event = (sequence, time, type, data) => ({ ...context, event_id: `EXAMPLE-EVENT-${sequence}`, sequence, occurred_at: `2026-10-25T${time}:00-04:00`, received_at: '2026-10-25T10:30:00-04:00', type, data });
  return JSON.stringify({ schema_version: VERSION, mode: 'PROTOTYPE_ONLY', context, window: { start: '2026-10-25T08:00:00-04:00', end: '2026-10-25T10:00:00-04:00' }, previous_sequence: 0, events: [
    event(1, '08:00', 'DUTY_STATUS', { status: 'OFF_DUTY' }), event(2, '08:10', 'POWER_UP', {}),
    event(3, '08:11', 'ENGINE_TELEMETRY', { engine_on: true, speed_kph: 0, odometer_km: 1000, engine_hours: 100 }),
    event(4, '08:15', 'DUTY_STATUS', { status: 'ON_DUTY' }), event(5, '08:30', 'DUTY_STATUS', { status: 'DRIVING' }),
    event(6, '09:00', 'ENGINE_TELEMETRY', { engine_on: true, speed_kph: 55, odometer_km: 1020, engine_hours: 100.8 }),
    event(7, '09:30', 'DUTY_STATUS', { status: 'OFF_DUTY' }), event(8, '09:31', 'ANNOTATION', { text: 'Synthetic example annotation; not an official driver record.', refers_to: 'EXAMPLE-EVENT-7' }), event(9, '09:45', 'POWER_DOWN', {}),
  ] }, null, 2);
}

import { exampleNativeBatch, validateNativePrototype } from './nativeEldModel';
const fixture = () => JSON.parse(exampleNativeBatch());
const validate = value => validateNativePrototype(JSON.stringify(value));

test('synthetic session preserves sequence, telemetry and explicit duty intervals without trust or HOS claims', () => {
  const report = validate(fixture());
  expect(report.schema_valid).toBe(true);
  expect(report.summary).toMatchObject({ event_count: 9, telemetry_points: 2, window_seconds: 7200, sequence_start: 1, sequence_end: 9 });
  expect(report.timeline.reduce((total, interval) => total + interval.seconds, 0)).toBe(7200);
  expect(report.timeline.map(interval => interval.status)).toEqual(['OFF_DUTY', 'ON_DUTY', 'DRIVING', 'OFF_DUTY']);
  ['authentication_verified', 'signature_verified', 'persisted', 'official_log', 'dispatch_authorized', 'hos_assessed'].forEach(key => expect(report[key]).toBe(false));
});
test('out-of-order offline receipt is sorted by device sequence while originals remain unchanged', () => {
  const batch = fixture(); batch.events.reverse(); const before = JSON.stringify(batch);
  const report = validate(batch);
  expect(report.schema_valid).toBe(true);
  expect(report.normalized_events.map(event => event.sequence)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  expect(JSON.stringify(batch)).toBe(before);
});
test.each(['device_id', 'vehicle_id', 'driver_id'])('rejects cross-session %s without any timeline', key => {
  const batch = fixture(); batch.events[2][key] = 'OTHER'; const report = validate(batch);
  expect(report.issues.map(issue => issue.code)).toContain('IDENTITY_MISMATCH');
  expect(report.timeline).toEqual([]); expect(report.schema_valid).toBe(false);
});
test.each(['duplicate-id', 'duplicate-sequence', 'gap', 'backwards', 'counter', 'engine', 'annotation', 'initial', 'authority', 'extra-field', 'bad-status'])('invalid %s evidence fails closed', kind => {
  const batch = fixture();
  if (kind === 'duplicate-id') batch.events[1].event_id = batch.events[0].event_id;
  if (kind === 'duplicate-sequence') batch.events[1].sequence = 1;
  if (kind === 'gap') batch.events.splice(2, 1);
  if (kind === 'backwards') batch.events[4].occurred_at = '2026-10-25T08:05:00-04:00';
  if (kind === 'counter') batch.events[5].data.odometer_km = 999;
  if (kind === 'engine') batch.events[5].data.engine_on = false;
  if (kind === 'annotation') batch.events[7].data.refers_to = 'UNKNOWN-EVENT';
  if (kind === 'initial') batch.events[0].occurred_at = '2026-10-25T08:01:00-04:00';
  if (kind === 'authority') batch.dispatch_authorized = true;
  if (kind === 'extra-field') batch.events[0].data.verified = true;
  if (kind === 'bad-status') batch.events[0].data.status = 'LEGAL_TO_DISPATCH';
  const report = validate(batch);
  expect(report.schema_valid).toBe(false); expect(report.issues.length).toBeGreaterThan(0);
  expect(report.timeline).toEqual([]); expect(report.normalized_events).toEqual([]);
});
test.each(['2026-02-30T08:00:00-04:00', '2026-10-25 08:00:00', '2026-10-25T08:00:00+15:00', '2026-10-25T25:00:00Z'])('invalid or timezone-free timestamp %s is rejected', time => {
  const batch = fixture(); batch.events[0].occurred_at = time;
  expect(validate(batch).schema_valid).toBe(false);
});
test('fall-back daylight saving hour uses supplied offsets rather than wall-clock guesses', () => {
  const batch = fixture(); batch.window = { start: '2026-11-01T01:30:00-04:00', end: '2026-11-01T02:30:00-05:00' };
  batch.events = [batch.events[0], batch.events[3]];
  batch.events[0].occurred_at = batch.window.start; batch.events[1].occurred_at = '2026-11-01T01:30:00-05:00'; batch.events[1].sequence = 2;
  batch.events.forEach(event => { event.received_at = '2026-11-01T10:00:00-05:00'; });
  const report = validate(batch); expect(report.schema_valid).toBe(true);
  expect(report.timeline.map(interval => interval.seconds)).toEqual([3600, 3600]);
});
test('telemetry never invents a driver duty status or calculates remaining hours', () => {
  const batch = fixture(); batch.events.filter(event => event.type === 'DUTY_STATUS').forEach(event => { event.data.status = 'OFF_DUTY'; });
  const report = validate(batch); expect(report.schema_valid).toBe(true);
  expect(report.timeline.every(interval => interval.status === 'OFF_DUTY')).toBe(true);
  expect(report).not.toHaveProperty('remaining_hours'); expect(report.hos_assessed).toBe(false);
});
test.each(['', '{invalid', 'x'.repeat(256001)])('rejects malformed or oversized input', input => { expect(validateNativePrototype(input).schema_valid).toBe(false); });

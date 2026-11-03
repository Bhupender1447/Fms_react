import { validateNativePrototype } from './nativeEldModel';

export const MAX_QUEUED_CAPTURES = 10;
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;

// This is a bounded, in-memory staff-upload queue, not a device recording buffer.
export function enqueueCapture(queue, account, raw, requestId) {
  if (typeof account !== 'string' || !/^[1-9][0-9]*$/.test(account)) throw new Error('Choose an authorized operating account.');
  const report = validateNativePrototype(raw);
  if (!report.schema_valid) throw new Error('Validate this batch before queueing.');
  const batch = JSON.parse(raw);
  batch.events = report.normalized_events;
  const source = JSON.stringify(stable(batch));
  if (queue.some(entry => entry.account_id === account && entry.raw === source)) throw new Error('This batch is already queued.');
  if (queue.length >= MAX_QUEUED_CAPTURES) throw new Error('The queue is full. Upload or discard a queued batch first.');
  if (typeof requestId !== 'string' || !/^[a-f0-9]{32}$/.test(requestId) || queue.some(entry => entry.request_id === requestId)) throw new Error('A unique secure request identifier is required. Try again.');
  const stream = queue.filter(entry => entry.account_id === account && entry.device_id === batch.context.device_id);
  const prior = stream[stream.length - 1];
  if (prior && (prior.driver_id !== batch.context.driver_id || prior.vehicle_id !== batch.context.vehicle_id)) throw new Error('Queued batches for this device must keep the same driver and vehicle.');
  if (prior && batch.previous_sequence !== prior.sequence_end) throw new Error(`This device's next queued batch must follow sequence ${prior.sequence_end}.`);
  if (prior && Date.parse(report.normalized_events[0].occurred_at) < Date.parse(prior.last_at)) throw new Error('Queued occurrence times must not move backwards.');
  return [...queue, { account_id: account, request_id: requestId, raw: source, ...batch.context,
    event_count: report.summary.event_count, sequence_start: report.summary.sequence_start,
    sequence_end: report.summary.sequence_end, last_at: report.normalized_events[report.normalized_events.length - 1].occurred_at }];
}

export function canDiscardCapture(queue, requestId) {
  const index = queue.findIndex(entry => entry.request_id === requestId);
  if (index < 0) return false;
  const entry = queue[index];
  return !queue.slice(index + 1).some(later => later.account_id === entry.account_id && later.device_id === entry.device_id);
}

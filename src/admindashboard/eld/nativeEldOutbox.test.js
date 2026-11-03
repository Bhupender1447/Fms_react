import { canDiscardCapture, enqueueCapture, MAX_QUEUED_CAPTURES } from './nativeEldOutbox';
import { exampleNativeBatch } from './nativeEldModel';
const key = n => n.toString(16).padStart(32,'0');
function nextBatch(raw=exampleNativeBatch()) {
  const batch=JSON.parse(raw),end=batch.events.length+batch.previous_sequence;
  batch.previous_sequence=end;
  const later=time=>new Date(Date.parse(time)+7200000).toISOString();
  batch.window={start:later(batch.window.start),end:later(batch.window.end)};
  batch.events.forEach(event=>{event.sequence+=9;event.event_id+='-NEXT';event.occurred_at=later(event.occurred_at);event.received_at=later(event.received_at);if(event.type==='ANNOTATION')event.data.refers_to+='-NEXT';if(event.type==='ENGINE_TELEMETRY'){event.data.odometer_km+=100;event.data.engine_hours+=2;}});
  return JSON.stringify(batch);
}
test('queue snapshots source, does not change its input and adds no authority',()=>{
  const initial=[],queue=enqueueCapture(initial,'3',exampleNativeBatch(),key(1));expect(initial).toEqual([]);expect(queue[0]).toMatchObject({account_id:'3',request_id:key(1),event_count:9,sequence_start:1,sequence_end:9});expect(JSON.parse(queue[0].raw).mode).toBe('PROTOTYPE_ONLY');expect(queue[0]).not.toHaveProperty('official_log');
});
test('normalizes event order and formatting to prevent duplicate queue entries',()=>{
  const queue=enqueueCapture([],'3',exampleNativeBatch(),key(1)),batch=JSON.parse(exampleNativeBatch());batch.events.reverse();
  expect(()=>enqueueCapture(queue,'3',JSON.stringify(batch),'2'.repeat(32))).toThrow('already queued');
});
test('requires consecutive batches per device and preserves dependency on discard',()=>{
  let queue=enqueueCapture([],'3',exampleNativeBatch(),key(1));queue=enqueueCapture(queue,'3',nextBatch(),key(2));
  expect(queue[1].sequence_start).toBe(10);expect(canDiscardCapture(queue,key(1))).toBe(false);expect(canDiscardCapture(queue,key(2))).toBe(true);expect(canDiscardCapture(queue,'unknown')).toBe(false);
  const gap=JSON.parse(nextBatch());gap.previous_sequence=18;gap.events.forEach(event=>{event.sequence+=9;});expect(()=>enqueueCapture(queue.slice(0,1),'3',JSON.stringify(gap),key(3))).toThrow('follow sequence 9');
});
test('same raw evidence can be queued for a separately authorized account',()=>{
  const queue=enqueueCapture([],'3',exampleNativeBatch(),key(1));expect(enqueueCapture(queue,'4',exampleNativeBatch(),key(2))).toHaveLength(2);
});
test('rejects changed stream identities and reversed cross-batch time',()=>{
  const queue=enqueueCapture([],'3',exampleNativeBatch(),key(1));let batch=JSON.parse(nextBatch());batch.context.driver_id='OTHER';batch.events.forEach(event=>{event.driver_id='OTHER';});
  expect(()=>enqueueCapture(queue,'3',JSON.stringify(batch),key(2))).toThrow('same driver and vehicle');
  batch=JSON.parse(exampleNativeBatch());batch.previous_sequence=9;batch.events.forEach(event=>{event.sequence+=9;event.event_id+='-NEXT';if(event.type==='ANNOTATION')event.data.refers_to+='-NEXT';});
  expect(()=>enqueueCapture(queue,'3',JSON.stringify(batch),key(2))).toThrow('must not move backwards');
});
test('bounds retained memory and rejects malformed batch, account and request ID',()=>{
  let queue=[];for(let i=0;i<MAX_QUEUED_CAPTURES;i++)queue=enqueueCapture(queue,String(i+1),exampleNativeBatch(),key(i+1));
  expect(()=>enqueueCapture(queue,'99',exampleNativeBatch(),key(99))).toThrow('queue is full');expect(()=>enqueueCapture([],'3','{}',key(1))).toThrow('Validate');expect(()=>enqueueCapture([],'0',exampleNativeBatch(),key(1))).toThrow('authorized');expect(()=>enqueueCapture([],'3',exampleNativeBatch(),'unsafe')).toThrow('secure request');expect(()=>enqueueCapture(queue.slice(0,1),'99',exampleNativeBatch(),key(1))).toThrow('unique secure');
});

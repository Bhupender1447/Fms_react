import { readReview } from './reviewResponse';
const fixture = () => {
  const entity = { entity_key: 'ifm:order:10', source: { system: 'ifm', record_id: '10' } };
  const page = { offset: 0, limit: 50 }; const at = '2026-10-25T23:00:00Z';
  return { account_id: '3', page, generated_at: at, entities: [entity], review: { schema_version: 'sis-review-1.0', account_id: '3', generated_at: at, snapshot_digest: 'b'.repeat(64), page, findings: [{ finding_id: 'a'.repeat(64), code: 'SOURCE_TIME_UNVERIFIED', priority: 'review', title: 'Time', detail: 'Unknown', next_step: 'Inspect', entity_key: entity.entity_key, source: entity.source }], finding_count: 1, reviewed_entity_count: 1, status: 'INFORMATIONAL_ONLY', execution_enabled: false, dispatch_authorized: false, legal_feasibility_evaluated: false, persisted: false, page_only: true } };
};
test('valid review binds account page evidence and explicit limits', () => { expect(readReview(fixture(), '3', 0).finding_count).toBe(1); });
test.each(['foreign-account', 'wrong-page', 'foreign-source', 'foreign-entity', 'duplicate', 'unknown-code', 'wrong-count', 'missing-review'])('rejects invalid %s responses', kind => {
  const snapshot = fixture(); const review = snapshot.review;
  if (kind === 'foreign-account') review.account_id = '4';
  if (kind === 'wrong-page') review.page = { offset: 50, limit: 50 };
  if (kind === 'foreign-source') review.findings[0].source = { system: 'ifm', record_id: '99' };
  if (kind === 'foreign-entity') review.findings[0].entity_key = 'ifm:order:99';
  if (kind === 'duplicate') { review.findings.push(review.findings[0]); review.finding_count = 2; }
  if (kind === 'unknown-code') review.findings[0].code = 'DISPATCH_NOW';
  if (kind === 'wrong-count') review.finding_count = 9;
  if (kind === 'missing-review') delete snapshot.review;
  expect(() => readReview(snapshot, '3', 0)).toThrow();
});

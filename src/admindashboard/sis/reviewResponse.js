const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const codes = new Set(['SOURCE_COVERAGE_PARTIAL', 'EMPTY_PAGE', 'SOURCE_TIME_UNVERIFIED', 'STATUS_UNSPECIFIED', 'FRESHNESS_NOT_VERIFIED']);
const text = value => typeof value === 'string' && value.trim().length > 0;

export function readReview(snapshot, accountId, offset) {
  const review = snapshot.review;
  if (!object(review) || review.schema_version !== 'sis-review-1.0' || review.account_id !== accountId
    || review.generated_at !== snapshot.generated_at || !Number.isFinite(Date.parse(review.generated_at))
    || !/^[a-f0-9]{64}$/.test(review.snapshot_digest || '')
    || !object(review.page) || review.page.offset !== offset || review.page.limit !== 50
    || !object(snapshot.page) || snapshot.page.offset !== offset || snapshot.page.limit !== 50
    || review.status !== 'INFORMATIONAL_ONLY' || review.execution_enabled !== false
    || review.dispatch_authorized !== false || review.legal_feasibility_evaluated !== false
    || review.persisted !== false || review.page_only !== true
    || !Array.isArray(review.findings) || review.findings.length > 1002
    || review.finding_count !== review.findings.length || review.reviewed_entity_count !== snapshot.entities.length) {
    throw new Error('The evidence review response could not be verified. No findings were displayed.');
  }
  const keys = new Set(snapshot.entities.map(entity => entity.entity_key));
  const ids = new Set();
  for (const finding of review.findings) {
    if (!object(finding) || !/^[a-f0-9]{64}$/.test(finding.finding_id || '') || ids.has(finding.finding_id)
      || !codes.has(finding.code) || !['review', 'information'].includes(finding.priority)
      || ![finding.title, finding.detail, finding.next_step].every(text)
      || (finding.entity_key !== null && !keys.has(finding.entity_key))) {
      throw new Error('The evidence review contains invalid findings. No findings were displayed.');
    }
    if (finding.entity_key !== null) {
      const entity = snapshot.entities.find(value => value.entity_key === finding.entity_key);
      if (!object(finding.source) || finding.source.system !== entity.source.system || finding.source.record_id !== entity.source.record_id) {
        throw new Error('A finding does not match its source evidence. No findings were displayed.');
      }
    } else if (finding.source !== null) throw new Error('The review contains unverified source references.');
    ids.add(finding.finding_id);
  }
  return review;
}

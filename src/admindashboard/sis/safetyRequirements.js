// Reference content only. This module does not calculate legal availability,
// read operational records, establish applicability, or authorize dispatch.
export const SAFETY_REFERENCE_DATE = 'October 22, 2026';
export const SAFETY_AREAS = [
  {
    id: 'hos', icon: 'clock-o', title: 'Hours of service', label: 'HOS & ELD',
    description: 'Review driving, duty windows, breaks, cycles and applicable exceptions together.',
    evidence: ['Verified driver, vehicle and provider-account mapping', 'Complete duty history, source timestamps and upload coverage', 'Applicable jurisdiction, exceptions and reviewed rule-set version', 'Trip driving estimates, stops, service time and appointment timezones'],
    boundary: 'Legal availability stays unknown until history, applicability and the deterministic rules engine are verified. Crossing a border does not reset a clock.',
    sources: [
      { title: '49 CFR 395.3 — Property-carrying HOS', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-395/subpart-A/section-395.3' },
      { title: 'FMCSA — HOS summary and exceptions', url: 'https://www.fmcsa.dot.gov/regulations/hours-service/summary-hours-service-regulations' },
    ],
  },
  {
    id: 'vehicle', icon: 'truck', title: 'Vehicle inspections & maintenance', label: 'Vehicle',
    description: 'Bring inspection, defect and repair evidence into one review context.',
    evidence: ['Assigned truck and trailer identity', 'Applicable driver inspection and previous DVIR review', 'Reported defects, repair certification and authorized follow-up', 'Periodic inspection and maintenance evidence with valid dates'],
    boundary: 'An uploaded inspection file alone does not establish safe operating condition. Review reporting exceptions and unresolved defects before use.',
    sources: [
      { title: '49 CFR 396.13 — Driver inspection', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-396/section-396.13' },
      { title: 'FMCSA — Driver vehicle inspection reports', url: 'https://www.fmcsa.dot.gov/safety/driver-vehicle-inspection-reports' },
    ],
  },
  {
    id: 'driver', icon: 'id-card-o', title: 'Driver qualifications', label: 'Driver',
    description: 'Review the qualification evidence applicable to the driver and operation.',
    evidence: ['Verified license class, endorsements and restrictions', 'Applicable qualification and medical certification status', 'Authorized qualification-file review and expiry evidence', 'Operation-specific eligibility reviewed by the carrier'],
    boundary: 'Keep medical and qualification records permission-restricted. A displayed document date does not grant eligibility or replace a qualified review.',
    sources: [
      { title: 'FMCSA — Qualification and medical regulations', url: 'https://www.fmcsa.dot.gov/regulations/medical/medical-regulations-rules-notices' },
    ],
  },
  {
    id: 'route', icon: 'map-signs', title: 'Route, cargo & road conditions', label: 'Route & cargo',
    description: 'Review truck restrictions, cargo security and current operating conditions.',
    evidence: ['Verified truck dimensions, weight, cargo and restrictions', 'PTV route version and supported truck-routing estimates', 'Cargo securement and applicable inspection evidence', 'Current weather, road restrictions and suitable stopping options'],
    boundary: 'Route geometry and ETA must come from verified tools. A route suggestion does not establish HOS feasibility or confirm a safe stopping place.',
    sources: [
      { title: '49 CFR 392.9 — Cargo and securement inspection', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-392/subpart-A/section-392.9' },
      { title: '49 CFR 392.14 — Hazardous conditions', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-392/subpart-B/section-392.14' },
    ],
  },
  {
    id: 'fatigue', icon: 'heartbeat', title: 'Fatigue & driver communication', label: 'Driver wellbeing',
    description: 'Keep fatigue concerns visible and driver interactions appropriate to motion state.',
    evidence: ['Driver-reported concerns and an authorized escalation contact', 'Trusted motion state before enabling driver interactions', 'Parked-only detailed review and minimal permitted hands-free interaction', 'Delivery and acknowledgement evidence for future advisories'],
    boundary: 'Available HOS does not prove fitness to drive. The dispatcher workspace is for use away from driving; a future Driver App must restrict interaction while moving.',
    sources: [
      { title: '49 CFR 392.3 — Ill or fatigued operator', url: 'https://www.ecfr.gov/current/title-49/subtitle-B/chapter-III/subchapter-B/part-392/subpart-A/section-392.3' },
      { title: 'FMCSA — Distracted driving restrictions', url: 'https://www.fmcsa.dot.gov/driver-safety/distracted-driving' },
    ],
  },
  {
    id: 'records', icon: 'files-o', title: 'ELD integrity & review history', label: 'Records',
    description: 'Preserve source evidence and distinguish recommendations from official records.',
    evidence: ['Original provider references and correction/supersession history', 'Driver confirmation where required by the applicable ELD workflow', 'Evidence, policy and rule versions bound to each future recommendation', 'Authorized retention, access, export and human decision history'],
    boundary: 'SIS does not edit official logs. Any later permitted ELD correction workflow must preserve originals and satisfy the applicable driver-confirmation requirements.',
    sources: [
      { title: 'FMCSA — ELD editing and annotations', url: 'https://eld.fmcsa.dot.gov/FAQ/Topics?name=Editing_and_Annotations' },
    ],
  },
];

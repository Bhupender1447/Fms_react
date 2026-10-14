export const products = [
  { id: 'ifm', name: 'IFM', subtitle: 'Fleet & Freight Manager', description: 'Bring orders, trips, drivers, equipment, documents, and financial closeout into one operational workspace.', status: 'Existing IFM work areas', tone: 'info', to: '/freightmanagement', action: 'Explore IFM' },
  { id: 'ilb', name: 'ILB', subtitle: 'Isovia Load Board', description: 'Review local truck and load postings, and post eligible unassigned broker orders from IFM.', status: 'Local IFM board', tone: 'info', to: '/alllogin', action: 'Choose your workspace', note: 'External publication, live load feeds, matching, and bidding are not connected.' },
  { id: 'driver', name: 'Driver App', subtitle: 'The field work area', description: 'Access assigned trips, stops, duty records, and trip paperwork through the existing driver workspace.', status: 'Existing driver work area', tone: 'info', to: '/driver-login', action: 'Driver access', note: 'Stored duty records do not establish a certified ELD or verified HOS calculation.' },
  { id: 'visibility', name: 'Visibility', subtitle: 'The operational picture', description: 'Bring map and routing views alongside trip and fleet records so dispatch can review the whole move.', status: 'Integration verification needed', tone: 'warning', to: '/fleetmanagement', action: 'Explore fleet workflows', note: 'Location freshness, provider connectivity, route restrictions, and ETA need runtime verification.' },
  { id: 'sis', name: 'SIS', subtitle: 'Freight intelligence foundations', description: 'Develop a shared operational model with traceable events, explicit governance, decision history, and human supervision.', status: 'Under development', tone: 'warning', href: '#sis-foundations', action: 'See the foundations', note: 'A World Model source implementation exists; autonomous agent execution is not implemented.' },
  { id: 'ira', name: 'IRA', subtitle: 'Roadside Assist', description: 'A proposed support experience for organizing roadside incidents, relevant vehicle records, and human escalation.', status: 'Planned concept', tone: 'neutral', href: 'mailto:Isoviafreightmanagement@gmail.com?subject=Isovia%20Roadside%20Assist', action: 'Discuss the concept', note: 'Repair dispatch, towing services, and AI diagnostics are not available through IFM today.' },
];

export const sisFoundations = [
  { name: 'World Model', status: 'Source foundation', description: 'A shared representation of IFM orders, trips, stops, drivers, and vehicles, retaining source IDs, observation times, and data-quality limits.' },
  { name: 'Event Engine', status: 'Planned', description: 'A durable account of meaningful operational changes, with source identity and duplicate handling so downstream work can follow what happened.' },
  { name: 'Governance Engine', status: 'Planned', description: 'Explicit permission and policy checks that determine which actions are allowed, which require review, and which must be blocked.' },
  { name: 'Decision Ledger', status: 'Planned', description: 'A traceable record of recommendations, evidence, policy versions, human approvals, and execution outcomes.' },
  { name: 'Supervisor', status: 'Planned', description: 'A human oversight surface for reviewing recommendations, resolving uncertainty, approving permitted actions, and handling escalation.' },
];

export const workflow = [
  ['Capture the order', 'Record the customer, freight, locations, stops, and dates.'],
  ['Coordinate the trip', 'Review the work and assign drivers and equipment.'],
  ['Support the driver', 'Keep assigned trip details and paperwork close to the field team.'],
  ['Close the loop', 'Review completion, documents, invoices, and accounting.'],
];

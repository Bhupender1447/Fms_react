import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Safety from './Safety';
import { COMPLIANCE_COVERAGE } from './safetyRequirements';
import Sidebar from '../Sidebar';

test('unconnected safety view never turns unknown evidence into clearance or makes operational requests', () => {
  const originalFetch = global.fetch;
  const fetchSpy = jest.fn();
  global.fetch = fetchSpy;
  try {
    render(<Safety />);
    expect(screen.getByRole('heading', { name: 'SIS Safety', level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Live safety assessment is not connected.')).toBeInTheDocument();
    expect(screen.getByText('Calculations disabled; reviewed rules and verified duty history required')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Operational alerts unavailable' })).toBeInTheDocument();
    expect(screen.getByText(/not a report of zero risks/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Safety overview' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('button', { name: /approve|dispatch|edit.*log/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /explore evidence requirements/i }));
    expect(screen.getByText(/required inputs, not completed checks/i)).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  } finally {
    global.fetch = originalFetch;
  }
});

test('domain review and filtering keep unknown evidence visible without persisting completion', () => {
  const { unmount } = render(<Safety />);
  fireEvent.click(screen.getByRole('button', { name: 'Review Hours of service evidence' }));
  expect(screen.getByRole('button', { name: 'Evidence requirements' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByLabelText('Safety area')).toHaveValue('hos');
  const evidence = screen.getByRole('region', { name: 'Evidence requirements' });
  expect(within(evidence).getByText('Evidence unavailable')).toBeInTheDocument();
  expect(within(evidence).getByText(/complete duty history/i)).toBeInTheDocument();
  expect(within(evidence).getByText('HOS calculations are disabled')).toBeInTheDocument();
  expect(within(evidence).getByText(/U\.S\. and Canadian federal source records are references only/i)).toBeInTheDocument();
  expect(within(evidence).getByText(/does not calculate driver hours or authorize dispatch/i)).toBeInTheDocument();
  expect(within(evidence).queryByText(/No Violations/i)).not.toBeInTheDocument();
  expect(within(evidence).queryByRole('heading', { name: /Vehicle inspections/ })).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Safety area'), { target: { value: 'vehicle' } });
  expect(within(evidence).getByRole('heading', { name: 'Vehicle inspections & maintenance' })).toBeInTheDocument();
  expect(within(evidence).getByText(/applicable driver inspection/i)).toBeInTheDocument();
  expect(within(evidence).queryByRole('checkbox')).not.toBeInTheDocument();
  unmount();
  render(<Safety />);
  expect(screen.getByRole('button', { name: 'Safety overview' })).toHaveAttribute('aria-pressed', 'true');
});

test('references point to federal primary sources and distinguish reference scope from approval', () => {
  render(<Safety />);
  fireEvent.click(screen.getByRole('button', { name: 'U.S. references' }));
  const references = screen.getByRole('region', { name: 'U.S. references' });
  expect(within(references).getByText(/References checked October 22, 2026/)).toBeInTheDocument();
  expect(screen.getByText(/not a complete USDOT compliance program/i)).toBeInTheDocument();
  expect(within(references).getByRole('link', { name: /49 CFR 395.3/ })).toBeInTheDocument();
  within(references).getAllByRole('link').forEach((link) => {
    const url = new URL(link.href);
    expect(url.protocol).toBe('https:');
    expect(['www.ecfr.gov', 'www.fmcsa.dot.gov', 'eld.fmcsa.dot.gov']).toContain(url.hostname);
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
  fireEvent.change(screen.getByLabelText('Safety area'), { target: { value: 'records' } });
  expect(within(references).getByText(/SIS does not edit official logs/)).toBeInTheDocument();
});

test('coverage inventory names unassessed U.S. and Canadian scopes without implying clearance', () => {
  render(<Safety />);
  fireEvent.click(screen.getByRole('button', { name: 'Compliance coverage' }));
  const coverage = screen.getByRole('region', { name: 'Compliance coverage' });
  const usStateCoverage = COMPLIANCE_COVERAGE.find((item) => item.id === 'us-state-intrastate');
  expect(within(coverage).getByText(/No jurisdiction or carrier program is certified/i)).toBeInTheDocument();
  expect(within(coverage).getByText('U.S. state and intrastate operations')).toBeInTheDocument();
  expect(usStateCoverage.status).toBe('NOT_ASSESSED');
  expect(usStateCoverage.jurisdictions).toHaveLength(51);
  expect(usStateCoverage.jurisdictionSources).toHaveLength(51);
  expect(new Set(usStateCoverage.jurisdictionSources.map((source) => source.jurisdiction)).size).toBe(51);
  fireEvent.click(within(coverage).getByText('Official state law portals (51)'));
  const statePortalLinks = within(coverage).getAllByRole('link')
    .filter((link) => usStateCoverage.jurisdictionSources.some((source) => source.url === link.getAttribute('href')));
  expect(statePortalLinks).toHaveLength(51);
  const statePortalLinksByUrl = new Map(statePortalLinks.map((link) => [link.href, link]));
  usStateCoverage.jurisdictionSources.forEach((source) => {
    const portal = statePortalLinksByUrl.get(source.url);
    expect(portal).toBeDefined();
    expect(portal).toHaveAttribute('target', '_blank');
    expect(portal).toHaveAttribute('rel', 'noopener noreferrer');
    expect(new URL(source.url).protocol).toBe('https:');
    expect(within(coverage).getByText(`${source.jurisdiction}:`)).toBeInTheDocument();
  });
  const statePortalFilter = within(coverage).getByLabelText('Official state law portals filter');
  fireEvent.change(statePortalFilter, { target: { value: 'California' } });
  expect(within(coverage).getByText('Showing 1 of 51 portals')).toHaveAttribute('role', 'status');
  expect(within(coverage).getByRole('link', { name: /California Legislative Information/ })).toBeInTheDocument();
  expect(within(coverage).queryByText(/^Arizona:/)).not.toBeInTheDocument();
  fireEvent.change(statePortalFilter, { target: { value: 'no such jurisdiction' } });
  expect(within(coverage).getByText('No jurisdiction or portal matches that filter.')).toBeInTheDocument();
  expect(within(coverage).getByText('Canada · federal')).toBeInTheDocument();
  expect(within(coverage).getByText('Canada · provinces and territories')).toBeInTheDocument();
  expect(within(coverage).getByText('U.S.–Canada cross-border operations')).toBeInTheDocument();
  expect(within(coverage).getByText(/Primary source identified · qualified review pending · source checked October 24, 2026/)).toBeInTheDocument();
  const canadaLaw = within(coverage).getByRole('link', { name: /Commercial Vehicle Drivers Hours of Service Regulations/ });
  expect(canadaLaw).toHaveAttribute('href', 'https://laws-lois.justice.gc.ca/eng/regulations/SOR-2005-313/FullText.html');
  expect(canadaLaw).toHaveAttribute('target', '_blank');
  expect(canadaLaw).toHaveAttribute('rel', 'noopener noreferrer');
  expect(within(coverage).getByText(/Official legislation portals are linked for every province and territory/i)).toBeInTheDocument();
  expect(within(coverage).getByText(/Official legislation portals identified · scope review pending · source checked October 24, 2026/)).toBeInTheDocument();
  const ontarioLaw = within(coverage).getByRole('link', { name: /Ontario e-Laws.*specific instrument identified; not assessed/ });
  expect(ontarioLaw).toHaveAttribute('href', 'https://www.ontario.ca/laws/regulation/060555');
  expect(ontarioLaw).toHaveAttribute('target', '_blank');
  expect(ontarioLaw).toHaveAttribute('rel', 'noopener noreferrer');
  fireEvent.click(within(coverage).getByText('Official legislation portals (13)'));
  const provincialTerritorial = COMPLIANCE_COVERAGE.find((item) => item.id === 'canada-provincial-territorial');
  expect(provincialTerritorial.jurisdictionSources).toHaveLength(13);
  provincialTerritorial.jurisdictionSources.forEach((source) => {
    const portal = within(coverage).getAllByRole('link')
      .find((link) => link.getAttribute('href') === source.url);
    expect(portal).toBeDefined();
    expect(portal).toHaveAttribute('href', source.url);
    expect(portal).toHaveAttribute('target', '_blank');
    expect(portal).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(coverage).getByText(new RegExp(`^${source.jurisdiction}:`))).toBeInTheDocument();
  });
  expect(within(coverage).getByText(/Portal links are for source discovery only/i)).toBeInTheDocument();
  expect(within(coverage).getAllByText('Not assessed').length).toBeGreaterThanOrEqual(5);
  expect(within(coverage).getByText('Disabled · review pending')).toBeInTheDocument();
  fireEvent.click(within(coverage).getByText('Included scopes (51)'));
  expect(within(coverage).getByText('District of Columbia')).toBeInTheDocument();
  fireEvent.click(within(coverage).getByText('Included scopes (13)'));
  expect(within(coverage).getByText('Nunavut')).toBeInTheDocument();
  expect(within(coverage).getByText(/No provincial or territorial scope is assessed/i)).toBeInTheDocument();
  expect(within(coverage).queryByText('Compliant')).not.toBeInTheDocument();
  expect(within(coverage).queryByText('Approved')).not.toBeInTheDocument();
});

test('existing sidebar exposes the SIS Safety route beside World Model', () => {
  localStorage.setItem('logindetail', JSON.stringify({ role: 'admin' }));
  try {
    render(<MemoryRouter initialEntries={['/sis/safety']}><Sidebar /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'SIS Connections' })).toHaveAttribute('href', '/sis/connections');
    expect(screen.getByRole('link', { name: 'SIS Safety' })).toHaveAttribute('href', '/sis/safety');
    expect(screen.getByRole('link', { name: 'SIS Driver Onboarding' })).toHaveAttribute('href', '/sis/driver-onboarding');
    expect(screen.getByRole('link', { name: 'World Model' })).toHaveAttribute('href', '/sis/world-model');
    const activeItem = screen.getAllByRole('listitem').find((item) => within(item).queryByRole('link', { name: 'SIS Safety' }));
    expect(activeItem).toHaveClass('active');
  } finally {
    localStorage.removeItem('logindetail');
  }
});

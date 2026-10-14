import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import * as XLSX from 'xlsx';
import ExcelStopUploader from './ExcelStopUploader';
import { validateRouteStops } from './routePlanningModel';

function buildWorkbookFile(rows) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Carrier Route');
  const workbookBytes = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
  const file = new File([workbookBytes], 'carrier-route.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  Object.defineProperty(file, 'arrayBuffer', { value: async () => workbookBytes });
  return file;
}

test('uploads 30 Excel stops without a Stop ID column', async () => {
  const rows = Array.from({ length: 30 }, (_, index) => ({
    Customer: `Carrier Customer ${index + 1}`,
    Address: `${index + 1} Main Street`,
    City: 'London',
    'Province/State': 'Ontario',
    'Postal/ZIP': 'N6A 1A1',
  }));
  const onStopsChange = jest.fn();
  render(<ExcelStopUploader onStopsChange={onStopsChange} />);

  fireEvent.change(screen.getByLabelText(/Choose a stop workbook/), { target: { files: [buildWorkbookFile(rows)] } });

  await waitFor(() => expect(onStopsChange).toHaveBeenCalled());
  const importedStops = onStopsChange.mock.calls.at(-1)[0];
  expect(importedStops).toHaveLength(30);
  expect(validateRouteStops(importedStops)).toMatchObject({ valid: true, errors: [] });
  expect(importedStops.every((stop) => stop.stopId === '')).toBe(true);
  expect(new Set(importedStops.map((stop) => stop.previewKey)).size).toBe(30);
  expect(screen.queryByText('Stop ID is required.')).not.toBeInTheDocument();
});

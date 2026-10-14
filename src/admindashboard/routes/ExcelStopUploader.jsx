import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { normalizeRouteRows, ROUTE_FIELDS, detectRouteColumnMapping } from './routePlanningModel';

const MAX_WORKBOOK_BYTES = 15 * 1024 * 1024;
const MAX_WORKBOOK_ROWS = 5000;

export default function ExcelStopUploader({ onStopsChange }) {
	const [headers, setHeaders] = useState([]);
	const [rows, setRows] = useState([]);
	const [mapping, setMapping] = useState({});
	const [fileName, setFileName] = useState('');
	const [error, setError] = useState('');

	const publishRows = (nextRows, nextMapping) => {
		setRows(nextRows);
		setMapping(nextMapping);
		onStopsChange(normalizeRouteRows(nextRows, nextMapping));
	};

	const handleFile = async (event) => {
		const file = event.target.files?.[0];
		setError('');
		if (!file) return;
		if (!file.name.toLowerCase().endsWith('.xlsx')) {
			setError('Choose an .xlsx workbook. Other spreadsheet formats are not accepted in this preview.');
			event.target.value = '';
			return;
		}
		if (file.size > MAX_WORKBOOK_BYTES) {
			setError('Workbook is larger than the 15 MB local-preview limit.');
			event.target.value = '';
			return;
		}

		try {
			const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true });
			const firstSheetName = workbook.SheetNames[0];
			if (!firstSheetName) throw new Error('Workbook has no worksheets.');
			const worksheet = workbook.Sheets[firstSheetName];
			const parsedRows = XLSX.utils.sheet_to_json(worksheet, { defval: '', raw: false, blankrows: false });
			if (!parsedRows.length) throw new Error('The first worksheet contains no stop rows.');
			if (parsedRows.length > MAX_WORKBOOK_ROWS) throw new Error(`Workbook has ${parsedRows.length} rows; the local parser limit is ${MAX_WORKBOOK_ROWS}.`);
			const nextHeaders = Object.keys(parsedRows[0]);
			const nextMapping = detectRouteColumnMapping(nextHeaders);
			setHeaders(nextHeaders);
			setFileName(file.name);
			publishRows(parsedRows, nextMapping);
		} catch (parseError) {
			setRows([]);
			setHeaders([]);
			setFileName('');
			onStopsChange([]);
			setError(parseError.message || 'The workbook could not be read.');
		} finally {
			event.target.value = '';
		}
	};

	const handleMapping = (fieldKey, header) => {
		const nextMapping = { ...mapping, [fieldKey]: header };
		setMapping(nextMapping);
		onStopsChange(normalizeRouteRows(rows, nextMapping));
	};

	const clearWorkbook = () => {
		setHeaders([]);
		setRows([]);
		setMapping({});
		setFileName('');
		setError('');
		onStopsChange([]);
	};

	return (
		<section className="route-section" aria-labelledby="route-workbook-heading">
			<div className="route-section-heading">
				<div><h3 id="route-workbook-heading">Import one route</h3><p>One .xlsx workbook creates one route; each data row is a stop. Selecting another workbook replaces this route's stop list.</p></div>
				{fileName && <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearWorkbook}>Clear workbook</button>}
			</div>
			<label className="route-file-control" htmlFor="route-stop-workbook">
				<span className="route-file-icon" aria-hidden="true"><i className="fa fa-file-excel-o" /></span>
				<span><strong>{fileName || 'Choose a stop workbook'}</strong><small>Excel .xlsx · maximum 15 MB</small></span>
				<input id="route-stop-workbook" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={handleFile} />
			</label>
			{error && <p className="route-inline-error" role="alert">{error}</p>}
			{headers.length > 0 && <>
				<div className="route-import-meta" role="status">{rows.length} stops loaded from the first worksheet for one route. Verify column mapping before reviewing validation.</div>
				<div className="route-mapping-grid">{ROUTE_FIELDS.map((field) => (
					<label className="route-field" key={field.key}>
						<span>{field.label}{field.required ? ' *' : ''}</span>
						<select className="form-control" value={mapping[field.key] || ''} onChange={(event) => handleMapping(field.key, event.target.value)}>
							<option value="">Not mapped</option>{headers.map((header) => <option key={`${field.key}-${header}`} value={header}>{header}</option>)}
						</select>
					</label>
				))}</div>
				<div className="table-responsive route-import-preview"><table className="table table-sm table-striped mb-0">
					<caption className="sr-only">First eight rows from the uploaded stop workbook</caption>
					<thead><tr>{headers.slice(0, 8).map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
					<tbody>{rows.slice(0, 8).map((row, index) => <tr key={`row-${index}`}>{headers.slice(0, 8).map((header) => <td key={`${index}-${header}`}>{String(row[header] ?? '')}</td>)}</tr>)}</tbody>
				</table></div>
			</>}
		</section>
	);
}

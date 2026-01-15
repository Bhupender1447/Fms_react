import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const Iftalisting = () => {
  const [data, setData] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]); // Stores complete parsed data for export

  const api = axios.create({
    baseURL: 'https://isovia.ca',
    timeout: 30000,
    headers: {
      Cookie: 'ci_session=40a2k4qco7jhjdbei4vksmluienbgu2e',
      Accept: 'application/json',
    },
  });

  // Function to export data to Excel
  const exportToExcel = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create a worksheet from the full data
    const ws = XLSX.utils.json_to_sheet(fullData);
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    
    // Generate the Excel file and trigger download
    XLSX.writeFile(wb, "expenses_data.xlsx");
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get('/fms_api/api/getExpense');
        setData(res.data || null);

        const normalized = [];
        const fullDataForExport = [];

        if (res?.data?.message && Array.isArray(res.data.message)) {
          res.data.message.forEach((item) => {
            let etcParsed = null;
            if (typeof item?.etc === 'string') {
              try {
                etcParsed = JSON.parse(item.etc);
              } catch (e) {
                console.error('Error parsing etc JSON:', e);
              }
            } else if (typeof item?.etc === 'object' && item?.etc !== null) {
              etcParsed = item.etc;
            }

            // Create compact preview row for listing
            normalized.push({
              id: item?.id ?? '',
              from_id: item?.from_id ?? '',
              to_id: item?.to_id ?? '',
              amount: item?.amount ?? '',
              exp_date: item?.exp_date ?? '',
              firstLocation: Array.isArray(etcParsed?.['Location Name']) ? etcParsed['Location Name'][0] : '',
              firstCity: Array.isArray(etcParsed?.City) ? etcParsed.City[0] : '',
              firstPostDate: Array.isArray(etcParsed?.['Post Date']) ? etcParsed['Post Date'][0] : '',
              firstInvoice: Array.isArray(etcParsed?.Invoice) ? etcParsed.Invoice[0] : '',
            });

            // Create full data for export - flatten etc data with parent fields
            if (etcParsed) {
              // Get the maximum length of arrays in etcParsed
              const maxLength = Math.max(
                ...Object.values(etcParsed).map(arr => Array.isArray(arr) ? arr.length : 0)
              );
              
              // Create one row for each index in the arrays
              for (let i = 0; i < maxLength; i++) {
                const row = {
                  id: item?.id ?? '',
                  from_id: item?.from_id ?? '',
                  to_id: item?.to_id ?? '',
                  amount: item?.amount ?? '',
                  exp_date: item?.exp_date ?? '',
                };
                
                // Add each etc field at current index
                Object.keys(etcParsed).forEach(key => {
                  if (Array.isArray(etcParsed[key])) {
                    row[key] = etcParsed[key][i] ?? '';
                  } else {
                    row[key] = etcParsed[key] ?? '';
                  }
                });
                
                fullDataForExport.push(row);
              }
            } else {
              // If no etc data, just add the basic fields
              fullDataForExport.push({
                id: item?.id ?? '',
                from_id: item?.from_id ?? '',
                to_id: item?.to_id ?? '',
                amount: item?.amount ?? '',
                exp_date: item?.exp_date ?? '',
              });
            }
          });
        }

        setRows(normalized);
        setFullData(fullDataForExport);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to fetch expenses'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [api]);

  return (
    <div  className="content-wrapper" style={{ minHeight: 440 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 mb-0">Iftalisting</h1>
        {!loading && !error && fullData.length > 0 && (
          <button 
            onClick={exportToExcel}
            className="btn btn-success"
          >
            Export to Excel
          </button>
        )}
      </div>

      {loading && (
        <div className="alert alert-info" role="alert">
          Loading expenses...
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="text-muted small">Status</div>
                  <div className="fw-semibold">{data?.status ?? '-'}</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="text-muted small">Total Amount</div>
                  <div className="fw-semibold">{data?.total_amount ?? '-'}</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="text-muted small">Records</div>
                  <div className="fw-semibold">{rows.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">From</th>
                  <th scope="col">To</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Exp Date</th>
                  <th scope="col">Location (first)</th>
                  <th scope="col">City (first)</th>
                  <th scope="col">Post Date (first)</th>
                  <th scope="col">Invoice (first)</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center text-muted">
                      No records found
                    </td>
                  </tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr key={`${r.id}-${idx}`}>
                      <td>{r.id}</td>
                      <td>{r.from_id}</td>
                      <td>{r.to_id}</td>
                      <td>{r.amount}</td>
                      <td>{r.exp_date}</td>
                      <td>{r.firstLocation}</td>
                      <td>{r.firstCity}</td>
                      <td>{r.firstPostDate}</td>
                      <td>{r.firstInvoice}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Iftalisting;
import React, { useEffect, useState } from "react";
import axios from "axios";

const OwnerFleetSummary = () => {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://isovia.ca/fms_api/api/ownerFleetSummary",
        { withCredentials: true }
      );

      if (Array.isArray(res.data)) {
        setSummary(res.data);
      } else if (Array.isArray(res.data?.summary)) {
        setSummary(res.data.summary);
      } else {
        setSummary([]);
      }
    } catch (err) {
      console.error("Fleet Summary API Error", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (score) => {
    if (!score) return <span className="label label-default">N/A</span>;
    const s = score.toLowerCase();
    let cls = "label-info";
    if (s.includes("satisfactory") || s.includes("pass")) cls = "label-success";
    if (s.includes("conditional") || s.includes("warn")) cls = "label-warning";
    if (s.includes("unsatisfactory") || s.includes("critical")) cls = "label-danger";
    return <span className={`label ${cls}`}>{score.toUpperCase()}</span>;
  };

  const getDocStatus = (expiry) => {
    if (!expiry) return <span className="text-danger"><i className="fa fa-warning"></i> Missing</span>;
    const expDate = new Date(expiry);
    const today = new Date();
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return <span className="text-danger"><i className="fa fa-times-circle"></i> Expired</span>;
    if (diffDays < 30) return <span className="text-warning"><i className="fa fa-clock-o"></i> {diffDays}d Left</span>;
    return <span className="text-success"><i className="fa fa-check-circle"></i> Valid</span>;
  };

  const renderValue = (value) => {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Owner Operator Summary <small>Overview</small>
        </h1>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12">
            <div className="box box-info shadow-lg" style={{ borderRadius: '15px', borderTop: '4px solid #00c0ef' }}>
              <div className="box-header with-border">
                <h3 className="box-title fw-bold"><i className="fa fa-shield text-info"></i> Compliance & Risk Dashboard</h3>
              </div>

              <div className="box-body table-responsive no-padding">
                {loading ? (
                  <div className="text-center p-5">
                    <i className="fa fa-refresh fa-spin fa-3x fa-fw text-info"></i>
                    <p className="mt-2">Analyzing Fleet Compliance...</p>
                  </div>
                ) : (
                  <table className="table table-hover table-striped mb-0">
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                      <tr>
                        <th>Owner / Company</th>
                        <th>Authority (MC/DOT)</th>
                        <th>Contact</th>
                        <th>Fleet Size</th>
                        <th>Insurance Status</th>
                        <th>Risk Score</th>
                        <th>Permits</th>
                      </tr>
                    </thead>

                    <tbody>
                      {summary.length === 0 ? (
                        <tr>
                          <td colSpan="7" align="center" className="p-4 text-muted">
                            No data found for the current fleet selection.
                          </td>
                        </tr>
                      ) : (
                        summary.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <div className="d-flex flex-column">
                                <span className="fw-bold text-primary" style={{ fontSize: '1.1em' }}>{row.owner_name}</span>
                                <small className="text-muted">{row.company}</small>
                              </div>
                            </td>
                            <td>
                              <div><small className="label label-default">MC</small> {row.mc_no || "N/A"}</div>
                              <div className="mt-1"><small className="label label-default">DOT</small> {row.dot_no || "N/A"}</div>
                            </td>
                            <td>
                              <div><i className="fa fa-phone text-muted small"></i> {row.phone}</div>
                              <div><i className="fa fa-envelope text-muted small"></i> {row.email}</div>
                            </td>
                            <td>
                              <span className="badge bg-blue">{row.total_trucks} Trucks</span><br />
                              <span className="badge bg-purple">{row.total_trailers} Trailers</span>
                            </td>
                            <td>
                              <div>{getDocStatus(row.ins_expiry)}</div>
                              <small className="text-muted">{row.ins_policy || "No Policy On File"}</small>
                            </td>
                            <td>
                              {getRiskBadge(row.safety_score)}
                            </td>
                            <td>
                              <button className="btn btn-xs btn-default btn-flat" title="View Detailed Permits">
                                <i className="fa fa-file-text-o"></i> Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="box-footer clearfix" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="pull-left">
                  <span className="text-muted">Direct oversight for {summary.length} owner-operators</span>
                </div>
                <div className="pull-right">
                  <button className="btn btn-sm btn-info btn-flat" onClick={fetchSummary}>
                    <i className="fa fa-refresh"></i> Refresh Safety Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligent Permit Manager Section (Placeholder for now) */}
        <div className="row">
          <div className="col-md-6">
            <div className="box box-solid bg-green-gradient">
              <div className="box-header">
                <i className="fa fa-calendar-check-o"></i>
                <h3 className="box-title">Critical Renewals (Next 30 Days)</h3>
              </div>
              <div className="box-body">
                <p>No critical permit renewals found for this fleet.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="box box-solid bg-yellow-gradient">
              <div className="box-header">
                <i className="fa fa-warning"></i>
                <h3 className="box-title">Risk Alerts</h3>
              </div>
              <div className="box-body">
                <p>Monitoring FMCSA safety scores for all carriers...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      Summary;
    </div>
  );
};

export default OwnerFleetSummary;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";

const AutoSuspendCarriers = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchAutoSuspendedCarriers();
  }, []);

  const fetchAutoSuspendedCarriers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}api/autoSuspendCarriers`,
        { withCredentials: true }
      );

      if (res.data?.status) {
        setCarriers(res.data.data || []);
      } else {
        setCarriers([]);
        setMessage("No auto suspended carriers found");
      }
    } catch (err) {
      console.error("Auto Suspend API error", err);
      setMessage("Error loading auto suspended carriers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      {/* Content Header */}
      <section className="content-header">
        <h1>
          Manage
          <small> Auto Suspended Carriers</small>
        </h1>
      </section>

      {/* Main content */}
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">

            {message && (
              <div className="alert alert-info">
                {message}
              </div>
            )}

            <div className="box box-danger">
              <div className="box-header with-border">
                <h3 className="box-title">Auto Suspended Carriers</h3>
              </div>

              <div className="box-body table-responsive">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>USDOT</th>
                        <th>MC #</th>
                        <th>Status</th>
                        <th>Suspended Reason</th>
                        <th>Suspended At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carriers.length === 0 ? (
                        <tr>
                          <td colSpan="7" align="center">
                            No Data Found
                          </td>
                        </tr>
                      ) : (
                        carriers.map((c, index) => (
                          <tr key={index}>
                            <td>{c.id}</td>
                            <td>{c.name}</td>
                            <td>{c.dotno || "-"}</td>
                            <td>{c.mcno || "-"}</td>
                            <td>
                              <span className="label label-danger">
                                {c.status || "Suspended"}
                              </span>
                            </td>
                            <td>{c.reason || "-"}</td>
                            <td>{c.suspended_at || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="box-footer">
                <small className="text-muted">
                  Total Records: {carriers.length}
                </small>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default AutoSuspendCarriers;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../config";

const TruckComplianceChecklist = () => {
  const [truckList, setTruckList] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState("");
  const [truckData, setTruckData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ✅ Get Trucks */
  useEffect(() => {
    axios
      .get(`${BASE_URL}api/getTrucks`)
      .then(res => {
        if (res.data.status === "success") {
          setTruckList(res.data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  /* ✅ Get Compliance for selected truck */
  useEffect(() => {
    if (!selectedTruck) return;

    const fetchCompliance = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${BASE_URL}api/truckComplianceList?id=${selectedTruck}`
        );

        if (res.data.status === "success") {
          setTruckData(res.data.data[0]);
        } else {
          setError("Failed to fetch compliance data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompliance();
  }, [selectedTruck]);

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <h1>
          Truck Compliance <small>Checklist</small>
        </h1>
      </section>

      <section className="content">

        {/* ✅ Truck Selector */}
        <div className="box box-primary">
          <div className="box-header with-border">
            <label>Select Truck</label>
            <select
              className="form-control"
              style={{ maxWidth: 350 }}
              value={selectedTruck}
              onChange={(e) => setSelectedTruck(e.target.value)}
            >
              <option value="">-- Select Truck --</option>
              {truckList.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="box-body">

            {loading && (
              <div className="text-center">
                <div className="spinner-border" />
                <p>Loading data...</p>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {/* ✅ TABLE */}
            {!loading && truckData && (
              <>
                <h4 style={{ marginBottom: 15 }}>
                  {truckData.truck_name} (ID: {truckData.truck_id})
                </h4>

                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th style={{ width: "5%" }}>#</th>
                      <th>Document Type</th>
                      <th>Expiry Date</th>
                      <th>Remaining</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {truckData.documents.map((doc, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{doc.document_type}</td>
                        <td>{doc.expiry_date || "N/A"}</td>
                        <td>
                          {doc.remaining_days === null
                            ? "N/A"
                            : doc.remaining_days === 0
                              ? "Expired"
                              : `${doc.remaining_days} days`}
                        </td>
                        <td>
                          <span
                            className={`label ${doc.status === "active"
                                ? "label-success"
                                : doc.status === "expired"
                                  ? "label-danger"
                                  : doc.status === "expiring soon"
                                    ? "label-warning"
                                    : "label-default"
                              }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* ✅ Summary */}
                <div className="well">
                  <strong>Total:</strong> {truckData.documents.length} &nbsp; | &nbsp;
                  <strong className="text-danger">
                    Expired:
                  </strong>{" "}
                  {
                    truckData.documents.filter(d => d.status === "expired")
                      .length
                  } &nbsp; | &nbsp;
                  <strong className="text-success">
                    Active:
                  </strong>{" "}
                  {
                    truckData.documents.filter(d => d.status === "active")
                      .length
                  }
                </div>
              </>
            )}

          </div>
        </div>
      </section>
    </div>
  );
};

export default TruckComplianceChecklist;

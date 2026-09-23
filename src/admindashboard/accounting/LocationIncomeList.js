import axios from "axios";
import { BASE_URL } from "../../config";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

const LocationIncomeList = () => {
  const [data, setData] = useState([]);
  const [filterType, setFilterType] = useState("monthly");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);

  // pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLocationIncome();
  }, [filterType, fromDate, toDate]);

  const fetchLocationIncome = async () => {
    setLoading(true);
    try {
      let url = `${BASE_URL}api/getLocationIncomelist?type=${filterType}`;
      if (fromDate && toDate) url += `&from=${fromDate}&to=${toDate}`;

      const res = await axios.get(url);
      if (Array.isArray(res.data)) {
        const filtered = res.data.filter(
          (row) => row.name && row.value !== null
        );
        setData(filtered);
      }
    } catch (error) {
      console.error("Error fetching location income:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageClick = (event) => setCurrentPage(event.selected);
  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  // Calculate total income
  const totalIncome = data.reduce((sum, row) => sum + Number(row.value || 0), 0);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Reports <small>Location Income</small>
        </h1>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            {/* FILTERS */}
            <div className="box" style={{ padding: "15px", marginBottom: "15px" }}>
              <div className="row">
                <div className="col-md-2">
                  <label>View By:</label>
                  <select
                    className="form-control"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label>From:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label>To:</label>
                  <input
                    type="date"
                    className="form-control"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  />
                </div>

                <div
                  className="col-md-2"
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <button className="btn btn-primary" onClick={fetchLocationIncome}>
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="box">
              <div className="box-body">
                {loading ? (
                  <div className="text-center">
                    <h4>Loading...</h4>
                  </div>
                ) : (
                  <>
                    <table className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>Pickup</th>
                          <th>Delivery</th>
                          <th>Company</th>
                          <th>Period</th>
                          <th>Income</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.length > 0 ? (
                          currentData.map((item, i) => (
                            <tr
                              key={i}
                              style={
                                item.name === "Total"
                                  ? { backgroundColor: "#e6f7ff", fontWeight: "bold" }
                                  : {}
                              }
                            >
                              <td>{item.pickup_address || "-"}</td>
                              <td>{item.delivery_address || "-"}</td>
                              <td>{item.company || "-"}</td>
                              <td>{item.period || "-"}</td>
                              <td style={{ color: "green" }}>
                                ${Number(item.value || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No records found
                            </td>
                          </tr>
                        )}

                        {!data.some((d) => d.name === "Total") && (
                          <tr
                            style={{
                              backgroundColor: "#e6f7ff",
                              fontWeight: "bold",
                            }}
                          >
                            <td colSpan="4">Overall Total</td>
                            <td style={{ color: "green" }}>${totalIncome.toFixed(2)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>


                    {/* PAGINATION */}
                    <div className="row">
                      <div className="col-sm-5">
                        <div className="dataTables_info">
                          Showing {offset + 1} to {offset + currentData.length} of{" "}
                          {data.length} entries
                        </div>
                      </div>
                      <div className="col-sm-7">
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          pageCount={Math.ceil(data.length / itemsPerPage)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick}
                          containerClassName={"pagination"}
                          activeClassName={"active"}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LocationIncomeList;

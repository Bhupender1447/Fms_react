import axios from 'axios';
import { BASE_URL } from '../../config';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Itypes = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true); // Added loading state

  const fetchItypesData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/fetchitypesProductData`);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching insurance types data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItypesData();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Remove function
  const handleRemove = async (id) => {
    const confirmRemove = window.confirm('Are you sure you want to remove this item?');
    if (confirmRemove) {
      try {
        await axios.post(`${BASE_URL}api/remove`, { id, table: 'itypes' }); // Changed payload and URL
        // Refresh data after removal
        fetchItypesData();
      } catch (error) {
        console.error('Error removing item:', error);
      }
    }
  };

  if (loading) {
    return <div className="content-wrapper" style={{ minHeight: 440 }}>Loading...</div>;
  }

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Manage
          <small>Insurance Types</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <Link to="../cpanel/">
              <i className="fa fa-dashboard" /> Home
            </Link>
          </li>
          <li className="active">Insurance Types</li>
        </ol>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <Link to="/itypes/create" className="btn btn-primary">
              Add Insurance Types
            </Link>
            <br /> <br />
            <div className="box">
              <div className="col-md-6 col-xs-12 pull pull-right">
                <button id="exportButton" className="btn btn-default ">
                  <span className="fa fa-file-pdf-o" /> Export to PDF
                </button>
                <button id="exportButtonExcl" className="btn btn-default">
                  <span className="fa fa-file-excel-o" /> Export to Excel
                </button>
              </div>
              <div className="box-body">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Remarks</th>
                      <th>Active</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.remarks}</td>
                        <td>{item.active}</td>
                        <td>
                          <Link to={`/itypes/update/${item.id}`} className="btn btn-default">
                            <i className="fa fa-pencil" />
                          </Link>{" "}
                          <button
                            type="button"
                            className="btn btn-default"
                            onClick={() => handleRemove(item.id)}
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="row">
                  <div className="col-sm-5">
                    <div className="dataTables_info" role="status" aria-live="polite">
                      Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {data.length} entries
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <ul className="pagination">
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li key={index} className={`paginate_button ${currentPage === index + 1 ? 'active' : ''} `}>
                          <button
                            onClick={() => paginate(index + 1)}
                            className="btn btn-default"
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Itypes;

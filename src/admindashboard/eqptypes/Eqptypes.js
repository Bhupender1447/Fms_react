import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Eqptypes = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/fetcheqptypesProductData')
      .then(res => setData(res.data))
      .catch(error => console.log(error));
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Remove function
  const handleRemove = async (id) => {
    try {
      const response = await axios.post(
        'https://isovia.ca/fms_api/api/remove',
        new URLSearchParams({
          id: id,
          type: 'fms_eqptypes'  // Adjust the type if necessary
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'ci_session=06vlfcjjenfs9pp507kpsbcetr7h8va3'
          }
        }
      );
      console.log("Response:", response.data);
      // Remove the item from the state after successful deletion
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>
          Manage
          <small>Equipment Type</small>
        </h1>
        <ol className="breadcrumb">
          <li>
            <a href="../cpanel/">
              <i className="fa fa-dashboard" /> Home
            </a>
          </li>
          <li className="active">Equipment Types</li>
        </ol>
      </section>
      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <div id="messages" />
            <Link to="/eqptypes/create" className="btn btn-primary">
              Add Equipment Types
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
                          <Link to={`/eqptypes/update/${item.id}`} className="btn btn-default">
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
                    <div className="dataTables_info">
                      Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
                    </div>
                  </div>
                  <div className="col-sm-7">
                    <ul className="pagination">
                      <li
                        className={`paginate_button previous ${currentPage === 1 ? 'disabled' : ''}`}
                      >
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          className="btn btn-default"
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <li
                          key={index}
                          className={`paginate_button ${currentPage === index + 1 ? 'active' : ''}`}
                        >
                          <button
                            onClick={() => paginate(index + 1)}
                            className="btn btn-default"
                          >
                            {index + 1}
                          </button>
                        </li>
                      ))}
                      <li
                        className={`paginate_button next ${currentPage === totalPages ? 'disabled' : ''}`}
                      >
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          className="btn btn-default"
                        >
                          Next
                        </button>
                      </li>
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

export default Eqptypes

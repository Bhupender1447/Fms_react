import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import CarriersEmailpopup from './CarriersEmailpopup';

const Carriers = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/fetchcarriersProductData')
      .then(res => setData(res.data))
      .catch(error => console.log(error));
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleRemove = async (id) => {
    try {
      await axios.post(
        'https://isovia.ca/fms_api/api/remove',
        new URLSearchParams({
          id: id,
          type: 'fms_carriers'
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'ci_session=06vlfcjjenfs9pp507kpsbcetr7h8va3'
          }
        }
      );
      setData(data.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleSendAgreementClick = (carrier) => {
    setSelectedCarrier(carrier);
  };

  const closeModal = () => {
    setSelectedCarrier(null);
  };

  const offset = currentPage * itemsPerPage;
  const currentData = data.slice(offset, offset + itemsPerPage);

  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
      <section className="content-header">
        <h1>Manage <small>Carrier</small></h1>
      </section>

      <section className="content">
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <Link to={'/carriers/create'} className="btn btn-primary">Add Carriers</Link>
            <br /> <br />
            <div className="box">
              <div className="box-body">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>State</th>
                      <th>Yard</th>
                      <th>Region</th>
                      <th>Company</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map(item => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.country}</td>
                        <td>{item.state}</td>
                        <td>{item.yard}</td>
                        <td>{item.region}</td>
                        <td>{item.company}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-xs"
                            onClick={() => handleSendAgreementClick(item)}
                          >
                            Send Agreement
                          </button>
                          <Link to={`/carriers/update/${item.id}`} className="btn btn-default btn-sm">
                            <i className="fa fa-pencil" />
                          </Link>
                          <button
                            type="button"
                            className="btn btn-default btn-sm"
                            onClick={() => handleRemove(item.id)}
                          >
                            <i className="fa fa-trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(data.length / itemsPerPage)}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination"}
                  activeClassName={"active"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Render the modal only when selectedCarrier is set */}
      {selectedCarrier && (
        <CarriersEmailpopup
          pdfLink={`https://isovia.ca/fms_api/pdf/agreement.php?id=${selectedCarrier.id}`}
          carrierId={selectedCarrier.id}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Carriers;

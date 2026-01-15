import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const SplitTripModal = ({ yards, onClose, onSuccess }) => {
    const { tripId } = useParams(); // Get tripId from URL params
    const [yardId, setYardId] = useState(""); // State for selected yard
    const [error, setError] = useState(""); // State for error messages
    const [data, setdata] = useState(""); // State for error messages
  
    const handleSubmit = async (e) => {
      e.preventDefault(); // Prevent default form submission
  
      // Prepare the data for the API request
      const data = {
        trip_id: tripId, // Use tripId from URL params
        yard_id: yardId, // Use selected yard ID
      };
  
      try {
        // Send POST request to the API
        const response = await axios.post("https://isovia.ca/fms_api/api/createsplit", data, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });
  
        // Handle success response
        if (response.data.status === "success") {
          alert("Trip split created successfully!");
          onClose(); // Close the modal
          onSuccess(); // Trigger data refresh in the parent component
        } else {
          setError(response.data.message); // Display error message
        }
      } catch (err) {
        // Handle errors
        setError("An error occurred while creating the trip split.");
        console.error(err);
      }
    };

    useEffect(()=>{
    axios.get('https://isovia.ca/fms_api/api/getOrderData')
    .then(res=>{setdata(res.data)
    console.log(res.data)})
    .catch(error=>setError(error))
 
    },[])
  
    return (
      <div className="modal" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Split Trip</h5>
              <button type="button" className="close" onClick={onClose}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Trip Detail</label>
                  <input
                    type="text"
                    className="form-control"
                    name="id"
                    placeholder="Enter Trip Detail"
                    readOnly
                    value={tripId}
                  />
                </div>
  
                <div className="form-group">
                  <label>Select Yard</label>
                  <select
                    className="form-control"
                    name="yard_id"
                    value={yardId}
                    onChange={(e) => setYardId(e.target.value)}
                    required
                  >
                    <option value="">Select Yard</option>
                    {yards.map((yard) => (
                      <option key={yard.id} value={yard.id}>
                        {yard.location}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Select Yard (Optional)</label>
                  <select
              className="form-control"
              id="pickup_from"
              onChange={(e) => setYardId(e.target.value)}
              name="pickup_from"
            >
                 {data.locations?.map(item=>( <option value={item.id}>{item.name}</option>))}
            </select>
                </div>
  
                {error && <div className="alert alert-danger">{error}</div>}
  
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };

const SplitRoutesTable = ({ data }) => {
  return (
    <table className="table table-striped table-bordered table-hover">
      <thead>
        <tr>
          <th>Yards</th>
         
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.yard}</td>
            
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const SplitRoutes = () => {
    const { tripId } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [yards, setYards] = useState([]);
    const [splitRoutes, setSplitRoutes] = useState([]);
  
    // Fetch yards data
    useEffect(() => {
      axios
        .get("https://isovia.ca/fms_api/api/gettripsData")
        .then((res) => setYards(res.data.yards))
        .catch((error) => console.error("Error fetching yards data:", error));
    }, []);
  
    // Fetch split routes data
    // eslint-disable-next-line react-hooks/exhaustive-deps, no-undef
    const fetchSplitRoutes = useCallback(() => {
      axios
        .get(`https://isovia.ca/fms_api/api/fetchProductDatadocs/${tripId}`, {
          headers: {
            Cookie: "ci_session=so5jso1nk4pf757mcg7i1nir4g7rk4fn", // Add the session cookie
          },
        })
        .then((res) => {
          // Transform the API response into the required format
          const formattedData = res.data.data.map((item, index) => ({
            id: index + 1, // Generate a unique ID
            yard: item[0], // The first item in the array is the location
          }));
          setSplitRoutes(formattedData); // Update the state with formatted data
        })
        .catch((error) => {
          console.error("Error fetching split routes data:", error);
        });
    });
  
    // Initial fetch of split routes data
    useEffect(() => {
      fetchSplitRoutes();
    }, [fetchSplitRoutes, tripId]);
  
    return (
      <div className="content-wrapper">
        <h3>Split Routes</h3>
  
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Split Trip
        </button>
  
        {showModal && (
          <SplitTripModal
            yards={yards}
            onClose={() => setShowModal(false)}
            onSuccess={fetchSplitRoutes} // Pass the callback function
          />
        )}
  
        <br />
        <br />
  
        <SplitRoutesTable data={splitRoutes} />
      </div>
    );
  };

export default SplitRoutes;
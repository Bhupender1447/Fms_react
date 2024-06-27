
import "./App.css";
import Header from "./websitefiles/Header";
import Home from "./websitefiles/Home";
import Footer from "./websitefiles/Footer";
import { Route, Routes, useLocation } from "react-router-dom";
import Contactus from "./websitefiles/Contactus";
import Aboutus from "./websitefiles/Aboutus";
import Service from "./websitefiles/Service";
import Shop from "./websitefiles/Shop";
import Company from "./websitefiles/Company";
import { useEffect, useState } from "react";
import RegistrationForm from "./websitefiles/Registration";
import Adminheader from "./admindashboard/Adminheader";
import Dashboard from "./admindashboard/Dashboard";
import Footeradmin from "./admindashboard/Footer";
import Login from "./websitefiles/Login";
import Createorder from "./admindashboard/order/Createorder";
import Orders from "./admindashboard/order/Orders";
import Createtrips from "./admindashboard/trips/Createtrips";
import Triplist from "./admindashboard/trips/Triplist";
import Invoices from "./admindashboard/invoices/Invoices";
import ProfileInfo from "./admindashboard/Profile/ProfileInfo";
import Trailors from "./admindashboard/trailors/Trailors";
import Create from "./admindashboard/trailors/Create";
import Trucks from "./admindashboard/trucks/Trucks";
import Createtrucks from "./admindashboard/trucks/Create";
import Owners from "./admindashboard/owners/Owners";
import Createowners from "./admindashboard/owners/Create";
import Drivers from "./admindashboard/drivers/Drivers";
import Createdrivers from "./admindashboard/drivers/Create";
import Fleets from "./admindashboard/fleets/Fleets";
import Createfleets from "./admindashboard/fleets/Create";
import Employees from "./admindashboard/employees/Employees";
import Createemployees from "./admindashboard/employees/Create";
import Assign from "./admindashboard/order/Assign";
import Update from "./admindashboard/order/Update";
import Vendors from "./admindashboard/vendors/Vendors";
import Createvendors from "./admindashboard/vendors/Create";
import Carriers from "./admindashboard/carriers/Carriers";
import Createcarriers from "./admindashboard/carriers/Create";
import Yardsdata from "./admindashboard/yards/Yardsdata";
import Customers from "./admindashboard/customers/Customers";
import Createcustomer from "./admindashboard/customers/Create";
import Factorings from "./admindashboard/factorings/Factorings";
import Createfactorings from "./admindashboard/factorings/Create";
import Brokers from "./admindashboard/brokers/Brokers";
import Createbrokers from "./admindashboard/brokers/Create";
import Location from "./admindashboard/locations/Location";
import Createlocation from "./admindashboard/locations/Create";
import Importers from "./admindashboard/importers/Importers";
import Createimporters from "./admindashboard/importers/Create";
import Extracharges from "./admindashboard/extracharges/Extracharges";
import Createextracharges from "./admindashboard/extracharges/Create";
import Terms from "./admindashboard/terms/Terms";
import Createterms from "./admindashboard/terms/Create";
import Mtypes from "./admindashboard/mtypes/Mtypes";
import Createmtypes from "./admindashboard/mtypes/Create";
import Creatediscounttypes from "./admindashboard/discounttypes/Create";
import Discounttypes from "./admindashboard/discounttypes/Discounttypes";
import Createmplans from "./admindashboard/mplans/Create";
import Mplans from "./admindashboard/mplans/Mplans";
import Createdoctypes from "./admindashboard/doctypes/Create";
import Doctypes from "./admindashboard/doctypes/Doctypes";
import Ads from "./admindashboard/ads/Ads";
import Createads from "./admindashboard/ads/Create";
import Etypes from "./admindashboard/etypes/Etypes";
import Createetypes from "./admindashboard/etypes/Create";
import Itypes from "./admindashboard/itypes/Itypes";
import Createitypes from "./admindashboard/itypes/Create";
import Createeqptypes from "./admindashboard/eqptypes/Create";
import Eqptypes from "./admindashboard/eqptypes/Eqptypes";



function App() {
  const [currentPageUrl, setCurrentPageUrl] = useState("");
  let location = useLocation();
  useEffect(() => {
    setCurrentPageUrl(location.pathname);
  }, [location]);

  return (
    <>
   
      <Routes>
        <Route path="/" element={<><Header /><Home /><Footer /></>} />
        <Route path="/contact" element={<><Header /><Contactus /><Footer /></>} />
        <Route path="/aboutus" element={<><Header /><Aboutus /><Footer /></>} />
        <Route path="/service" element={<><Header /><Service /><Footer /></>} />
        <Route path="/shop" element={<><Header /><Shop /><Footer /></>} />
        <Route path="/company" element={<><Header /><Company /><Footer /></>} />
        <Route path="/registration" element={<><Header /><RegistrationForm /><Footer /></>} />
        <Route path="/login" element={<><Header /><Login /><Footer /></>} />
        
        <Route path="/admin" element={<div className="skin-blue sidebar-mini"><Adminheader /><Dashboard/><Footeradmin/></div>} />
        <Route path="/createorder" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createorder/><Footeradmin/></div>} />
        <Route path="/orderlist" element={<div className="skin-blue sidebar-mini"><Adminheader /><Orders/><Footeradmin/></div>} />
        <Route path="/assign/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Assign/><Footeradmin/></div>} />
        <Route path="/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Update/><Footeradmin/></div>} />
        <Route path="/createtrips" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createtrips/><Footeradmin/></div>} />
        <Route path="/triplist" element={<div className="skin-blue sidebar-mini"><Adminheader /><Triplist/><Footeradmin/></div>} />
        <Route path="/invoices" element={<div className="skin-blue sidebar-mini"><Adminheader /><Invoices/><Footeradmin/></div>} />
        <Route path="/profile" element={<div className="skin-blue sidebar-mini"><Adminheader /><ProfileInfo/><Footeradmin/></div>} />
        <Route path="/trailors" element={<div className="skin-blue sidebar-mini"><Adminheader /><Trailors/><Footeradmin/></div>} />
        <Route path="/trailors/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Create/><Footeradmin/></div>} />
        <Route path="/trucks" element={<div className="skin-blue sidebar-mini"><Adminheader /><Trucks/><Footeradmin/></div>} />
        <Route path="/trucks/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createtrucks/><Footeradmin/></div>} />
        <Route path="/owners" element={<div className="skin-blue sidebar-mini"><Adminheader /><Owners/><Footeradmin/></div>} />
        <Route path="/owners/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createowners/><Footeradmin/></div>} />
        <Route path="/drivers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Drivers/><Footeradmin/></div>} />
        <Route path="/drivers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createdrivers/><Footeradmin/></div>} />
        <Route path="/fleets" element={<div className="skin-blue sidebar-mini"><Adminheader /><Fleets/><Footeradmin/></div>} />
        <Route path="/fleets/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createfleets/><Footeradmin/></div>} />
        <Route path="/employees" element={<div className="skin-blue sidebar-mini"><Adminheader /><Employees/><Footeradmin/></div>} />
        <Route path="/employees/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createemployees/><Footeradmin/></div>} />
        <Route path="/vendors" element={<div className="skin-blue sidebar-mini"><Adminheader /><Vendors/><Footeradmin/></div>} />
        <Route path="/vendors/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createvendors/><Footeradmin/></div>} />
        <Route path="/carriers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Carriers/><Footeradmin/></div>} />
        <Route path="/carriers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createcarriers/><Footeradmin/></div>} />
        <Route path="/yards" element={<div className="skin-blue sidebar-mini"><Adminheader /><Yardsdata/><Footeradmin/></div>} />

        <Route path="/customers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Customers/><Footeradmin/></div>} />
        <Route path="/customers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createcustomer/><Footeradmin/></div>} />
        <Route path="/factorings" element={<div className="skin-blue sidebar-mini"><Adminheader /><Factorings/><Footeradmin/></div>} />
        <Route path="/factorings/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createfactorings/><Footeradmin/></div>} />
        <Route path="/brokers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Brokers/><Footeradmin/></div>} />
        <Route path="/brokers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createbrokers/><Footeradmin/></div>} />
        <Route path="/importers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Importers/><Footeradmin/></div>} />
        <Route path="/importers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createimporters/><Footeradmin/></div>} />
        <Route path="/extracharges" element={<div className="skin-blue sidebar-mini"><Adminheader /><Extracharges/><Footeradmin/></div>} />
        <Route path="/extracharges/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createextracharges/><Footeradmin/></div>} />
        <Route path="/terms" element={<div className="skin-blue sidebar-mini"><Adminheader /><Terms/><Footeradmin/></div>} />
        <Route path="/terms/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createterms/><Footeradmin/></div>} />
        <Route path="/mtypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Mtypes/><Footeradmin/></div>} />
        <Route path="/mtypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createmtypes/><Footeradmin/></div>} />
        <Route path="/discounttypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Discounttypes/><Footeradmin/></div>} />
        <Route path="/discounttypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Creatediscounttypes/><Footeradmin/></div>} />
        <Route path="/mplans" element={<div className="skin-blue sidebar-mini"><Adminheader /><Mplans/><Footeradmin/></div>} />
        <Route path="/mplans/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createmplans/><Footeradmin/></div>} />
        <Route path="/doctypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Doctypes/><Footeradmin/></div>} />
        <Route path="/doctypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createdoctypes/><Footeradmin/></div>} />
        <Route path="/ads" element={<div className="skin-blue sidebar-mini"><Adminheader /><Ads/><Footeradmin/></div>} />
        <Route path="/ads/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createads/><Footeradmin/></div>} />
        <Route path="/etypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Etypes/><Footeradmin/></div>} />
        <Route path="/etypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createetypes/><Footeradmin/></div>} />
        <Route path="/itypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Itypes/><Footeradmin/></div>} />
        <Route path="/itypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createitypes/><Footeradmin/></div>} />
        <Route path="/eqptypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Eqptypes/><Footeradmin/></div>} />
        <Route path="/eqptypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createeqptypes/><Footeradmin/></div>} />
        <Route path="/locations" element={<div className="skin-blue sidebar-mini"><Adminheader /><Location/><Footeradmin/></div>} />
        <Route path="/locations/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createlocation/><Footeradmin/></div>} />
        
      </Routes>

      
    </>
  );
}

export default App;

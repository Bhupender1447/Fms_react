

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
import Userinfoset from "./admindashboard/users/Userinfoset";
import DriverLogin from "./websitefiles/Driverlogin";
import Driverheader from "./Driverdashboard/Driverheader";
import DriverDashboard from "./Driverdashboard/Dashboard";
import Assignorder from "./admindashboard/order/Assign";
import Assigntrip from "./admindashboard/trips/Assign";
import TripDriverlist from "./Driverdashboard/trips/Triplist";
import TripDetails from "./Driverdashboard/trips/TripDetails";
import Income from "./Driverdashboard/income/Income";
import Updatetrailors from "./admindashboard/trailors/Update";
import Updatetrucks from "./admindashboard/trucks/Updatetrucks";
import Updateowners from "./admindashboard/owners/Update";
import Updatefleets from "./admindashboard/fleets/Update";
import Updatedrivers from "./admindashboard/drivers/Update";
import Updateemployees from "./admindashboard/employees/Update";
import Updatevendors from "./admindashboard/vendors/Update";
import Updatecarriers from "./admindashboard/carriers/Update";
import Updatecustomer from "./admindashboard/customers/Update";
import Updatefactorings from "./admindashboard/factorings/Update";
import Updatebrokers from "./admindashboard/brokers/Update";
import Updateimporters from "./admindashboard/importers/Update";
import UpdateLocation from "./admindashboard/locations/Update";
import Updateextracharges from "./admindashboard/extracharges/Update";
import Updateterms from "./admindashboard/terms/Update";
import Updatemtype from "./admindashboard/mtypes/Update";
import Updatediscounttypes from "./admindashboard/discounttypes/Update";
import Updatemplans from "./admindashboard/mplans/Update";
import Updatedoctypes from "./admindashboard/doctypes/Update";
import Updateads from "./admindashboard/ads/Update";
import Updateetypes from "./admindashboard/etypes/Update";
import Updateitypes from "./admindashboard/itypes/Update";
import Updateeqptypes from "./admindashboard/eqptypes/Update";
import Createagent from "./admindashboard/agent/Create";
import Agentlist from "./admindashboard/agent/Agentlist";
import AgentLogin from "./websitefiles/Agentlogin";
import Agentheader from "./Agentdashboard/Agentheader";
import AgentDashboard from "./Agentdashboard/Dashboard";
import Incomeagent from "./Agentdashboard/income/Income";
import Orderlist from "./Agentdashboard/orders/Orderlist";
import Editagent from "./admindashboard/agent/Editagent";
import Updatetrip from "./admindashboard/trips/Updatetripe";
import Orderhistory from "./admindashboard/order/Orderhistory";
import Dashboardaccounting from "./admindashboard/accounting/Dashboardaccounting";
import VehicleTable from "./admindashboard/gomotive/VehicleTable";
import GomotiveUsers from "./admindashboard/gomotive/GomotiveUsers";
import LogTable from "./admindashboard/gomotive/LogTable";
import CredentialsUI from "./admindashboard/Credential/CredentialsUI";
import SamsaraDrivers from "./admindashboard/Samsara/SamsaraUsers";
import Partner from "./websitefiles/Partner";
import FreightManagement from "./websitefiles/FreightManagement";
import FleetManagement from "./websitefiles/FleetManagement";
import News from "./websitefiles/News";
import Blog from "./websitefiles/Blog";
import Carrieruploadpdf from "./websitefiles/Carrieruploadpdf";
import TripMap from "./admindashboard/livemap";
import DispatchBoard from "./admindashboard/Dispatch_board";
import Article1 from "./websitefiles/blogs/Article1";
import Article2 from "./websitefiles/blogs/Article2";
import Article3 from "./websitefiles/blogs/Article3";
import TripViewer from "./admindashboard/trips/TripViewer";
import SplitRoutes from "./admindashboard/trips/Splitetrip";
import Driverpaylist from "./admindashboard/accounting/Driverpaylist";
import NetIncomeTable from "./admindashboard/accounting/NetIncomeTable";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TripRecalculateForm from "./Driverdashboard/trips/TripRecalculateForm";
import TripStatusForm from "./Driverdashboard/trips/TripStatusForm";
import HoursOfServiceForm from "./admindashboard/hos/HoursOfServiceReport";
import VehicleDriverLogs from "./admindashboard/hos/Hosalldata";
import TripForm from "./Driverdashboard/dutystatus/onduty";
import OffDutyButton from "./Driverdashboard/dutystatus/offduty";
import Dutylist from "./Driverdashboard/dutystatus/listofduty";
import DriverHOS from "./admindashboard/drivers/Hosview";
import DriverDutyNotification from "./admindashboard/hos/DriverDutyNotification";
import Dutychart from "./Driverdashboard/dutystatus/Dutychart";
import TripLogChart from "./Driverdashboard/dutystatus/Logs";
import DailyLogDetail from "./Driverdashboard/dutystatus/DailyLogDetail";



function App() {

  const [currentPageUrl, setCurrentPageUrl] = useState("");
  let location = useLocation();
  useEffect(() => {
    setCurrentPageUrl(location.pathname);
  }, [location]);

  return (
    <>
      <ToastContainer />
      <Routes>

        {/* website */}
        <Route path="/" element={<><Header /><Home /><Footer /></>} />
        <Route path="/contact" element={<><Header /><Contactus /><Footer /></>} />
        <Route path="/carrier-upload/:formId" element={<><Header /><Carrieruploadpdf /><Footer /></>} />
        <Route path="/aboutus" element={<><Header /><Aboutus /><Footer /></>} />
        <Route path="/service" element={<><Header /><Service /><Footer /></>} />
        <Route path="/shop" element={<><Header /><Shop /><Footer /></>} />
        <Route path="/company" element={<><Header /><Company /><Footer /></>} />
        <Route path="/registration" element={<><Header /><RegistrationForm /><Footer /></>} />
        <Route path="/login" element={<><Header /><Login /><Footer /></>} />
        <Route path="/logindriver" element={<><Header /><DriverLogin /><Footer /></>} />
        <Route path="/Article1" element={<><Header /><Article1 /><Footer /></>} />
        <Route path="/Article2" element={<><Header /><Article2 /><Footer /></>} />
        <Route path="/Article3" element={<><Header /><Article3 /><Footer /></>} />
        <Route path="/loginagent" element={<><Header /><AgentLogin /><Footer /></>} />
        <Route path="/partner" element={<><Header /><Partner /><Footer /></>} />
        <Route path="/freightmanagement" element={<><Header /><FreightManagement /><Footer /></>} />
        <Route path="/fleetmanagement" element={<><Header /><FleetManagement /><Footer /></>} />
        <Route path="/news" element={<><Header /><News /><Footer /></>} />
        <Route path="/blog" element={<><Header /><Blog /><Footer /></>} />
 {/*end website */}

{/* Agent */}


        <Route path="/agentdashboard" element={<div className="skin-blue sidebar-mini"><Agentheader /><AgentDashboard /></div>} />
        <Route path="/agentorder" element={<div className="skin-blue sidebar-mini"><Agentheader /><Orderlist /></div>} />
        <Route path="/agentupdate/:id" element={<div className="skin-blue sidebar-mini"><Agentheader /><Update /></div>} />
        <Route path="/agentincome" element={<div className="skin-blue sidebar-mini"><Agentheader /><Incomeagent /></div>} />

{/*end Agent */}


        {/* admin panel */}



        <Route path="/admin" element={<div className="skin-blue sidebar-mini"><Adminheader /><Dashboard /><Footeradmin /></div>} />
        <Route path="/hos" element={<div className="skin-blue sidebar-mini"><Adminheader /><HoursOfServiceForm /><Footeradmin /></div>} />
        <Route path="/hosgetall" element={<div className="skin-blue sidebar-mini"><Adminheader /><VehicleDriverLogs /><Footeradmin /></div>} />
        <Route path="/driverdutynotification" element={<div className="skin-blue sidebar-mini"><Adminheader /><DriverDutyNotification /><Footeradmin /></div>} />
        <Route path="/accounting" element={<div className="skin-blue sidebar-mini"><Adminheader /><Dashboardaccounting /><Footeradmin /></div>} />
        <Route path="/createorder" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createorder /><Footeradmin /></div>} />
        <Route path="/orderlist" element={<div className="skin-blue sidebar-mini"><Adminheader /><Orders /><Footeradmin /></div>} />
        <Route path="/orderhistory" element={<div className="skin-blue sidebar-mini"><Adminheader /><Orderhistory /><Footeradmin /></div>} />
        <Route path="/driverpaylist" element={<div className="skin-blue sidebar-mini"><Adminheader /><Driverpaylist /><Footeradmin /></div>} />
        <Route path="/netincometable" element={<div className="skin-blue sidebar-mini"><Adminheader /><NetIncomeTable /><Footeradmin /></div>} />
        <Route path="/assign/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Assignorder /><Footeradmin /></div>} />
        <Route path="/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Update /><Footeradmin /></div>} />
        <Route path="/createagent" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createagent /><Footeradmin /></div>} />
        <Route path="/agentlist" element={<div className="skin-blue sidebar-mini"><Adminheader /><Agentlist /><Footeradmin /></div>} />
        <Route path="/agentedit/:agentId" element={<div className="skin-blue sidebar-mini"><Adminheader /><Editagent /><Footeradmin /></div>} />
        <Route path="/gomotive/vehicletable" element={<div className="skin-blue sidebar-mini"><Adminheader /><VehicleTable /><Footeradmin /></div>} />
        <Route path="/gomotive/gomotiveusers" element={<div className="skin-blue sidebar-mini"><Adminheader /><GomotiveUsers /><Footeradmin /></div>} />
        <Route path="/gomotive/logtable" element={<div className="skin-blue sidebar-mini"><Adminheader /><LogTable /><Footeradmin /></div>} />
        {/* <Route path="/gomotive/vehicletable" element={<div className="skin-blue sidebar-mini"><Adminheader /><VehicleTable /><Footeradmin /></div>} /> */}
        <Route path="/samsara/samsarausers" element={<div className="skin-blue sidebar-mini"><Adminheader /><SamsaraDrivers /><Footeradmin /></div>} />
        {/* <Route path="/gomotive/logtable" element={<div className="skin-blue sidebar-mini"><Adminheader /><LogTable /><Footeradmin /></div>} /> */}
        <Route path="/createtrips" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createtrips /><Footeradmin /></div>} />
        <Route path="/tripsmap" element={<div className="skin-blue sidebar-mini"><Adminheader /><TripMap /><Footeradmin /></div>} />
        <Route path="/tripviewer/:tripId" element={<div className="skin-blue sidebar-mini"><Adminheader /><TripViewer /><Footeradmin /></div>} />
        <Route path="/tripsplit/:tripId" element={<div className="skin-blue sidebar-mini"><Adminheader /><SplitRoutes /><Footeradmin /></div>} />
        <Route path="/DispatchBoard" element={<div className="skin-blue sidebar-mini"><Adminheader /><DispatchBoard /><Footeradmin /></div>} />
        <Route path="/triplist" element={<div className="skin-blue sidebar-mini"><Adminheader /><Triplist /><Footeradmin /></div>} />
        <Route path="/trips/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatetrip /><Footeradmin /></div>} />
        <Route path="trips/assign/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Assigntrip /><Footeradmin /></div>} />
        <Route path="/invoices" element={<div className="skin-blue sidebar-mini"><Adminheader /><Invoices /><Footeradmin /></div>} />
        <Route path="/profile" element={<div className="skin-blue sidebar-mini"><Adminheader /><ProfileInfo /><Footeradmin /></div>} />
        <Route path="/trailors" element={<div className="skin-blue sidebar-mini"><Adminheader /><Trailors /><Footeradmin /></div>} />
        <Route path="/configurations" element={<div className="skin-blue sidebar-mini"><Adminheader /><CredentialsUI /><Footeradmin /></div>} />
        <Route path="/trailors/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Create /><Footeradmin /></div>} />
        <Route path="/trailors/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatetrailors /><Footeradmin /></div>} />
        <Route path="/trucks" element={<div className="skin-blue sidebar-mini"><Adminheader /><Trucks /><Footeradmin /></div>} />
        <Route path="/trucks/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createtrucks /><Footeradmin /></div>} />
        <Route path="/trucks/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatetrucks /><Footeradmin /></div>} />
        <Route path="/owners" element={<div className="skin-blue sidebar-mini"><Adminheader /><Owners /><Footeradmin /></div>} />
        <Route path="/owners/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createowners /><Footeradmin /></div>} />
        <Route path="/owners/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateowners /><Footeradmin /></div>} />
        <Route path="/drivers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Drivers /><Footeradmin /></div>} />
        <Route path="/drivers/hos/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><DriverHOS /><Footeradmin /></div>} />
        <Route path="/drivers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createdrivers /><Footeradmin /></div>} />
        <Route path="/drivers/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatedrivers /><Footeradmin /></div>} />
        <Route path="/fleets" element={<div className="skin-blue sidebar-mini"><Adminheader /><Fleets /><Footeradmin /></div>} />
        <Route path="/fleets/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createfleets /><Footeradmin /></div>} />
        <Route path="/fleets/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatefleets /><Footeradmin /></div>} />
        <Route path="/employees" element={<div className="skin-blue sidebar-mini"><Adminheader /><Employees /><Footeradmin /></div>} />
        <Route path="/employees/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createemployees /><Footeradmin /></div>} />
        <Route path="/employees/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateemployees /><Footeradmin /></div>} />
        <Route path="/vendors" element={<div className="skin-blue sidebar-mini"><Adminheader /><Vendors /><Footeradmin /></div>} />
        <Route path="/vendors/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createvendors /><Footeradmin /></div>} />
        <Route path="/vendors/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatevendors /><Footeradmin /></div>} />
        <Route path="/carriers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Carriers /><Footeradmin /></div>} />
        <Route path="/carriers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createcarriers /><Footeradmin /></div>} />
        <Route path="/carriers/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatecarriers /><Footeradmin /></div>} />
        <Route path="/yards" element={<div className="skin-blue sidebar-mini"><Adminheader /><Yardsdata /><Footeradmin /></div>} />
        <Route path="/customers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Customers /><Footeradmin /></div>} />
        <Route path="/customers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createcustomer /><Footeradmin /></div>} />
        <Route path="/customers/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatecustomer /><Footeradmin /></div>} />
        <Route path="/factorings" element={<div className="skin-blue sidebar-mini"><Adminheader /><Factorings /><Footeradmin /></div>} />
        <Route path="/factorings/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createfactorings /><Footeradmin /></div>} />
        <Route path="/factorings/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatefactorings /><Footeradmin /></div>} />
        <Route path="/brokers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Brokers /><Footeradmin /></div>} />
        <Route path="/brokers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createbrokers /><Footeradmin /></div>} />
        <Route path="/brokers/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatebrokers /><Footeradmin /></div>} />
        <Route path="/importers" element={<div className="skin-blue sidebar-mini"><Adminheader /><Importers /><Footeradmin /></div>} />
        <Route path="/importers/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createimporters /><Footeradmin /></div>} />
        <Route path="/importers/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateimporters /><Footeradmin /></div>} />
        <Route path="/extracharges" element={<div className="skin-blue sidebar-mini"><Adminheader /><Extracharges /><Footeradmin /></div>} />
        <Route path="/extracharges/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createextracharges /><Footeradmin /></div>} />
        <Route path="/extracharges/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateextracharges /><Footeradmin /></div>} />
        <Route path="/terms" element={<div className="skin-blue sidebar-mini"><Adminheader /><Terms /><Footeradmin /></div>} />
        <Route path="/terms/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createterms /><Footeradmin /></div>} />
        <Route path="/terms/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateterms /><Footeradmin /></div>} />
        <Route path="/mtypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Mtypes /><Footeradmin /></div>} />
        <Route path="/mtypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createmtypes /><Footeradmin /></div>} />
        <Route path="/mtypes/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatemtype /><Footeradmin /></div>} />
        <Route path="/discounttypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Discounttypes /><Footeradmin /></div>} />
        <Route path="/discounttypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Creatediscounttypes /><Footeradmin /></div>} />
        <Route path="/discounttypes/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatediscounttypes /><Footeradmin /></div>} />
        <Route path="/mplans" element={<div className="skin-blue sidebar-mini"><Adminheader /><Mplans /><Footeradmin /></div>} />
        <Route path="/mplans/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createmplans /><Footeradmin /></div>} />
        <Route path="/mplans/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatemplans /><Footeradmin /></div>} />
        <Route path="/doctypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Doctypes /><Footeradmin /></div>} />
        <Route path="/doctypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createdoctypes /><Footeradmin /></div>} />
        <Route path="/doctypes/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updatedoctypes /><Footeradmin /></div>} />
        <Route path="/ads" element={<div className="skin-blue sidebar-mini"><Adminheader /><Ads /><Footeradmin /></div>} />
        <Route path="/ads/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createads /><Footeradmin /></div>} />
        <Route path="/ads/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateads /><Footeradmin /></div>} />
        <Route path="/etypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Etypes /><Footeradmin /></div>} />
        <Route path="/etypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createetypes /><Footeradmin /></div>} />
        <Route path="/etypes/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateetypes /><Footeradmin /></div>} />
        <Route path="/itypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Itypes /><Footeradmin /></div>} />
        <Route path="/itypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createitypes /><Footeradmin /></div>} />
        <Route path="/itypes/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateitypes /><Footeradmin /></div>} />
        <Route path="/eqptypes" element={<div className="skin-blue sidebar-mini"><Adminheader /><Eqptypes /><Footeradmin /></div>} />
        <Route path="/eqptypes/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createeqptypes /><Footeradmin /></div>} />
        <Route path="/eqptypes/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><Updateeqptypes /><Footeradmin /></div>} />
        <Route path="/locations" element={<div className="skin-blue sidebar-mini"><Adminheader /><Location /><Footeradmin /></div>} />
        <Route path="/locations/create" element={<div className="skin-blue sidebar-mini"><Adminheader /><Createlocation /><Footeradmin /></div>} />
        <Route path="/locations/update/:id" element={<div className="skin-blue sidebar-mini"><Adminheader /><UpdateLocation /><Footeradmin /></div>} />
        <Route path="/users/setting" element={<div className="skin-blue sidebar-mini"><Adminheader /><Userinfoset /><Footeradmin /></div>} />
      {/*end admin panel */}


        {/* driver */}
        <Route path="/driverdashboard" element={<div className="skin-blue sidebar-mini"><Driverheader /><DriverDashboard /></div>} />
        <Route path="/driverincome" element={<div className="skin-blue sidebar-mini"><Driverheader /><Income /></div>} />
        <Route path="/drivertrip" element={<div className="skin-blue sidebar-mini"><Driverheader /><TripDriverlist /></div>} />
        <Route path="/startduty" element={<div className="skin-blue sidebar-mini"><Driverheader /><TripForm /></div>} />
        <Route path="/stopduty" element={<div className="skin-blue sidebar-mini"><Driverheader /><OffDutyButton /></div>} />
        <Route path="/dutylist" element={<div className="skin-blue sidebar-mini"><Driverheader /><Dutylist /></div>} />
        <Route path="/dutychart/:did" element={<div className="skin-blue sidebar-mini"><Driverheader /><Dutychart /></div>} />
        <Route path="/triprecalculation" element={<div className="skin-blue sidebar-mini"><Driverheader /><TripRecalculateForm /></div>} />
        <Route path="/tripstatusform" element={<div className="skin-blue sidebar-mini"><Driverheader /><TripStatusForm /></div>} />
        <Route path="/tripdetails" element={<div className="skin-blue sidebar-mini"><Driverheader /><TripDetails /></div>} />
        <Route path="/logs" element={<div className="skin-blue sidebar-mini"><Driverheader /><TripLogChart /></div>} />
        <Route path="/daily-log-detail" element={<div className="skin-blue sidebar-mini"><Driverheader /><DailyLogDetail /></div>} />
         
{/*end driver */}

      </Routes>


    </>
  );
}

export default App;

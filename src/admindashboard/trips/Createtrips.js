import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Createtrips = () => {
const[data,setdata]=useState([])
useEffect(()=>{
axios.get('https://isovia.ca/fms_api/api/getOrderData')
.then(res=>console.log(res))
.catch(error=>console.log(error))
},[])

  return (
    <div className='content-wrapper'><section className="content-header">
    <h1>
      Manage
      <small>Trips</small>
    </h1>
    <ol className="breadcrumb">
      <li>
        <a href="#">
          <i className="fa fa-dashboard" /> Home
        </a>
      </li>
      <li className="active">Orders</li>
    </ol>
  </section>
  <section className="content">
  {/* Small boxes (Stat box) */}
  <div className="row">
    <div className="col-md-12 col-xs-12">
      <div id="messages" />
      <div className="box">
        <div className="col-md-12 col-xs-12 pull pull-left">
          <div className="form-group">
            <h4>
              <span className="label label-success">CUSTOMER DETAILS</span>
            </h4>
            <h3 align="center">TRIP # : ISV_TRIP-1230</h3>
          </div>
        </div>
        {/* /.box-header */}
        <form role="form" action="" method="post" encType="multipart/form-data">
          <div className="box-body">
            <div className="col-md-6 col-xs-12 pull pull-left">
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Company</label>
                  <select className="form-control" id="company" name="company">
                    <option value="Adonis Freight Inc.">
                      ADONIS FREIGHT INC.
                    </option>
                  </select>
                </div>
              </div>
              <input
                type="hidden"
                className="form-control"
                id="customerorderno"
                name="customerorderno"
                defaultValue="ISV_TRIP-1230"
                placeholder="Enter Customer Order #"
                autoComplete="off"
              />
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Shipment Type</label>
                  <select
                    className="form-control"
                    id="shipmenttype"
                    name="shipmenttype"
                  >
                    <option value="Regular">Regular</option>
                    <option value="into Canada">into Canada</option>
                    <option value="into USA">into USA</option>
                    <option value="round">round</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Commmission</label>
                  <select
                    className="form-control"
                    id="commission"
                    name="commission"
                  >
                    <option value="Order">Order</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-xs-12 pull pull-right">
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Brokers</label>
                  <select
                    className="form-control"
                    id="customer_id"
                    name="customer_id"
                  >
                    <option value={23}>RELIANCE LOGISTICS GROUP INC.</option>
                    <option value={19}>LOYAL EXPRESS TRANSPORT</option>
                    <option value={18}>META FACEBOOK</option>
                    <option value={17}>BAKERS FIELD</option>
                    <option value={15}>NATIONAL PRODUCE MARKETING INC</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Load Type</label>
                  <select
                    className="form-control"
                    id="loadtype"
                    name="loadtype"
                  >
                    <option value="FTL">FTL</option>
                    <option value="LTL">LTL</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Frieght on</label>
                  <select
                    className="form-control"
                    id="frieghton"
                    name="frieghton"
                  >
                    <option value="Order">Order</option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Salesman</label>
                  <select
                    className="form-control"
                    id="salesman"
                    name="salesman"
                  >
                    <option value={23}>
                      Reliance Logistics Group Inc., Wertheim Court, Richmond
                      Hill, ON, Canada
                    </option>
                    <option value={22}>
                      HBC TRANSPORTATION, Armstrong Avenue, Georgetown, ON,
                      Canada
                    </option>
                    <option value={21}>
                      Montreal Polymers, Chemin Dalton, Mount Royal, QC, Canada
                    </option>
                    <option value={20}>
                      Pratt &amp; Whitney Canada, Courtneypark Drive East,
                      Mississauga, ON, Canada
                    </option>
                    <option value={19}>
                      Loyal Express Transport, Avenue Edward Vii, Dorval, QC,
                      Canada
                    </option>
                    <option value={18}>Metairie, LA, USA</option>
                    <option value={17}>
                      Testaccio market, Via Aldo Manuzio, Rome, Metropolitan
                      City of Rome, Italy
                    </option>
                    <option value={16}>
                      Marvel Safety &amp; Complaince Inc, Mississauga, ON,
                      Canada
                    </option>
                    <option value={15}>
                      National Produce Marketing Inc, Plywood Place, Etobicoke,
                      ON, Canada
                    </option>
                    <option value={14}>Holt Marine - terminal</option>
                    <option value={13}>
                      National Produce Marketing Inc, Plywood Place, Etobicoke,
                      ON, Canada
                    </option>
                    <option value={12}>
                      Rollx Carriers, Drew Road, Mississauga, ON, Canada
                    </option>
                    <option value={11}>
                      Impexive Technologies, Depalpur Road, Ambikapuri
                      Extension, Ambikapuri Main, Indore, Madhya Pradesh,
                    </option>
                    <option value={9}>
                      VASPLANET, Sector 70, Sahibzada Ajit Singh Nagar, Punjab,
                      India
                    </option>
                  </select>
                </div>
              </div>
              <div className="col-md-3 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Scale #</label>
                  <input
                    type="text"
                    className="form-control"
                    id="scaleticketno"
                    name="scaleticketno"
                    defaultValue="ISV_TRIP-1230"
                    placeholder="Enter Scale Ticket #"
                    autoComplete="off"
                  />
                </div>
              </div>
              {/*
          
           <div class="col-md-12 col-xs-12 pull pull-left">
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea type="text" class="form-control" id="carrier_desc" name="carrier_desc"  autocomplete="off">
                              </textarea>
          </div> 
          </div>
          */}
            </div>
          </div>
          {/*   
             <div class="col-md-4 col-xs-12 pull pull-left">
              <div class="form-group">
              <label for="store">Weight</label>
               <select class="form-control" id="weight" name="weight">
                      
                      <option value="Gallons">Gallons</option>
                      <option value="Grams">Grams</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="MBF">MBF</option>
                      <option value="Metric Ton">Metric Ton</option>
                      <option value="Ounces">Ounces</option>
                      <option value="Pounds">Pounds</option>
                      <option value="Tons">Tons</option>

              </select>
              </div>
          </div>
          */}
          {/*
              <div class="col-md-3 col-xs-12 pull pull-left">
              <div class="form-group">
              <label for="store">Measurement*</label>
              <select class="form-control" id="measurement" name="measurement">
              <option value="Centimeter">Centimeter</option>
               <option value="Feet">Feet</option>
                <option value="Inches">Inches</option>
                 <option value="Meter">Meter</option>
               
              </select>
              </div>
          </div>
              
             <div class="col-md-3 col-xs-12 pull pull-left">
              
                  <div class="form-group">
                  <label for="username">L*</label>
                  <input type="text" class="form-control" id="l" name="l"  autocomplete="off">
                  </div>
              
              </div>
                 <div class="col-md-3 col-xs-12 pull pull-left">
              
                  <div class="form-group">
                  <label for="username">B*</label>
                  <input type="text" class="form-control" id="b" name="b"  autocomplete="off">
                  </div>
              
              </div>
                 <div class="col-md-3 col-xs-12 pull pull-left">
              
                  <div class="form-group">
                  <label for="username">H*</label>
                  <input type="text" class="form-control" id="h" name="h"  autocomplete="off">
                  </div>
              
              </div>
          
             
              
        
        <!--
          
           <div class="col-md-12 col-xs-12 pull pull-left">
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea type="text" class="form-control" id="shipment_desc" name="shipment_desc" placeholder="Enter Shipment  Notes" autocomplete="off">
                              </textarea>
          </div> 
          </div>
          */}
        </form>
      </div>
      <div className="col-md-6 col-xs-12 pull pull-right">
        {/*
              <div class="col-md-3 col-xs-12 pull pull-left">
               <label for="store">Pack. Type</label>
              <div class="form-group">
              <input type="text" class="form-control"   name="carr_weight"  list="select-list-id1"/>
              </div>
              <datalist id="select-list-id1">
             
                     
                      <option value="Bag">Bag</option>
                      <option value="Bale">Bale</option>
                      <option value="Barrel">Barrel</option>
                      <option value="Basket">Basket</option>
                      <option value="Bin">Bin</option>
                      <option value="Bing Chest">Bing Chest</option>
                      <option value="Box">Box</option>
                      <option value="Bucket">Bucket</option>
                      <option value="Bundle">Bundle</option>
                      <option value="Can">Can</option>
                      <option value="Can Case">Can Case</option>
                      <option value="Carooy">Carooy</option>
                      <option value="Carcass">Carcass</option>
                      <option value="Carton">Carton</option>
                      <option value="Case">Case</option>
                      <option value="Cask">Cask</option>
                      <option value="Centimeter">Centimeter</option>
                      <option value="Chest">Chest</option>
                      <option value="Coil">Coil</option>
                      <option value="Container Bulk Cargo">Container Bulk Cargo</option>
                      <option value="Cord">Cord</option>
                      <option value="Crate">Crate</option>
                      
                      
                      <option value="Cyilnder">Cyilnder</option>
                      <option value="Drum">Drum</option>
                      <option value="Dry Bulk">Dry Bulk</option>
                      <option value="Feet">Feet</option>
                      <option value="Gallon">Gallon</option>
                      
                      <option value="Hamper">Hamper</option>
                      <option value="Heads of Beef">Heads of Beef</option>
                      <option value="Inches">Inches</option>
                      <option value="Keg">Keg</option>
                      <option value="Lift Van">Lift Van</option>
                      <option value="Liquid Bulk">Liquid Bulk</option>
                      <option value="Logos">Logos</option>
                      <option value="Lugs">Lugs</option>
                      <option value="Meter">Meter</option>
                      <option value="Package">Package</option>
                      <option value="Pail">Pail</option>
                      <option value="Parcel">Parcel</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Private Vehicle">Private Vehicle</option>
                      
                      
                      <option value="Quarters of Beef">Quarters of Beef</option>
                      <option value="Reel">Reel</option>
                      <option value="Roll">Roll</option>
                      <option value="Sack">Sack</option>
                      <option value="Sheet">Sheet</option>
                      <option value="Side of Beef">Side of Beef</option>
                      <option value="Skid">Skid</option>
                      <option value="Tank">Tank</option>
                      <option value="Tin">Tin</option>
                      <option value="Tote Bin">Tote Bin</option>
                      <option value="Truck Load">Truck Load</option>
                      <option value="Tube">Tube</option>
                      <option value="Unit">Unit</option>
                      <option value="Vanpack">Vanpack</option>
                      
                      <option value="Vehicle">Vehicle</option>
                      <option value="Wooden Case">Wooden Case</option>

                                            
                          
                      
              </datalist>
              </div>
              
           */}
      </div>
      <div className="col-md-12 col-xs-12 pull pull-left">
        <div className="form-group">
          <h4>
            <span className="label label-success">PICKUP/DELIVERY DETAIL</span>
          </h4>
        </div>
      </div>
      <div className="col-md-6 col-xs-12 pull pull-left">
        <div className="col-md-12 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="store">
              Pickup From |{" "}
              <a href="http://localhost/fms/locations/create">Add Location</a>{" "}
            </label>
            <select
              className="form-control"
              id="pickup_from"
              onchange="fetch_address();"
              name="pickup_from"
            >
              <option value={58}>Top O' the River</option>
              <option value={57}>
                Kisko Products, 50 Royal Group Crescent, Woodbridge, ON L4H 1X9
              </option>
              <option value={56}>
                C&amp;S Wholesale Grocers Logistics, East Penn Avenue,
                Robesonia, PA, USA
              </option>
              <option value={55}>
                Supervalu Distribution Center, Paintersville Road, New Stanton,
                PA, USA
              </option>
              <option value={54}>
                Dollar General, East Pike, Zanesville, OH, USA
              </option>
              <option value={53}>
                Furlani Foods, Aimco Boulevard, Mississauga, ON, Canada
              </option>
              <option value={52}>
                Costco, Brant Street, Burlington, ON, Canada
              </option>
              <option value={51}>
                Adonis Carriers Inc, Dixie Road, Mississauga, ON, Canada
              </option>
              <option value={50}>ECBVerdyol, Riverton, MB, Canada</option>
              <option value={49}>
                Murphy Warehouse Co, 24th Avenue Southeast, Minneapolis, MN, USA
              </option>
              <option value={48}>
                Conwed Plastics LLC, Weeks Avenue Southeast, Minneapolis, MN,
                USA
              </option>
              <option value={47}>
                Winnipeg James Armstrong Richardson International Airport (YWG),
                Wellington Avenue, Winnipeg, MB, Ca
              </option>
              <option value={46}>
                Versa Cold, 78 Avenue Southeast, Calgary, AB, Canada
              </option>
              <option value={45}>
                Precise Manufacturing Inc, Merchant Road, Fort Wayne, IN, USA
              </option>
              <option value={44}>
                Richard's Produce, North Creek Drive, Festus, MO, USA
              </option>
              <option value={43}>Maryland City, MD, USA</option>
              <option value={42}>
                Arizona Mills, South Arizona Mills Circle, Tempe, AZ, USA
              </option>
              <option value={41}>
                Husted's Hazel Dell Lanes, Northeast Highway 99, Vancouver, WA,
                USA
              </option>
              <option value={40}>
                Fort Worth Stockyards, East Exchange Avenue, Fort Worth, TX, USA
              </option>
              <option value={39}>
                Metro Ontario Inc, Dundas Street West, Etobicoke, ON, Canada
              </option>
              <option value={38}>
                Baketree, Gana Court, Mississauga, ON, Canada
              </option>
              <option value={37}>
                Dallas Love Field Airport (DAL), Herb Kelleher Way, Dallas, TX,
                USA
              </option>
              <option value={34}>
                Jaipur Junction, Station Road, Gopalbari, Jaipur, Rajasthan,
                India
              </option>
              <option value={33}>
                Major's Tower, Lakhnaur Pind Road, Sector 74, Sahibzada Ajit
                Singh Nagar, Punjab, India
              </option>
              <option value={32}>
                Manitoulin Transport, Shawson Drive, Mississauga, ON, Canada
              </option>
              <option value={31}>
                HBC TRANSPORTATION, Armstrong Avenue, Georgetown, ON, Canada
              </option>
              <option value={30}>
                Spark Freight System, Williams Parkway, Brampton, ON, Canada
              </option>
              <option value={29}>
                Boise Engineered Woodproducts ALLjoist, Rue Industrielle,
                Saint-Jacques, NB, Canada
              </option>
              <option value={28}>
                Greenovative Solutions, Inc., Chemin de la Côte-de-Liesse,
                Saint-Laurent, QC, Canada
              </option>
              <option value={27}>
                Boise Engineered Woodproducts ALLjoist, Rue Industrielle,
                Saint-Jacques, NB, Canada
              </option>
              <option value={26}>
                Pratt &amp; Whitney, Bee Line Highway, Jupiter, FL, USA
              </option>
              <option value={25}>
                Pratt &amp; Whitney Canada, Boulevard Marie-Victorin, Longueuil,
                QC, Canada
              </option>
              <option value={24}>
                Pratt &amp; Whitney Canada, Courtneypark Drive East,
                Mississauga, ON, Canada
              </option>
              <option value={22}>
                Dollarama, Royalmount Avenue, Mount Royal, QC, Canada
              </option>
              <option value={20}>
                Wisconsin State Capitol, East Main Street, Madison, WI, USA
              </option>
              <option value={19}>
                Turlock DMV, East Monte Vista Avenue, Turlock, CA, USA
              </option>
              <option value={18}>
                Mohali Stadium Road, Phase 3B-1, Phase 3B-2, Sector 60,
                Sahibzada Ajit Singh Nagar, Punjab, India
              </option>
              <option value={17}>
                Ontario Mills, Mills Circle, Ontario, CA, USA
              </option>
              <option value={16}>
                Marvel Safety &amp; Complaince Inc, Mississauga, ON, Canada
              </option>
              <option value={14}>
                Marvel Safety &amp; Complaince Inc, Windmill Road, Dartmouth,
                NS, Canada
              </option>
              <option value={13}>
                Marvel Safety &amp; Complaince Inc, Mississauga, ON, Canada
              </option>
              <option value={12}>
                Rollx Carriers, Drew Road, Mississauga, ON, Canada
              </option>
              <option value={11}>Hamburg, Germany</option>
              <option value={10}>
                Brisbane Airport Domestic Terminal Multi-Storey Car Park,
                Brisbane Airport QLD, Australia
              </option>
              <option value={9}>
                A2z Immigration Consultancy, Sector 70, Mohali, Punjab, India
              </option>
              <option value={8}>Gushaini, Himachal Pradesh, India</option>
              <option value={7}>Chandigarh, Punjab, India</option>
              <option value={4}>Patiala, Punjab, India</option>
              <option value={3}>California</option>
              <option value={2}>Brampton</option>
            </select>
          </div>
        </div>
        <div className="col-md-12 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="username">Pickup Address</label>
            <input
              type="text"
              className="form-control"
              id="pickup_address"
              name="pickup_address"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-md-4 col-xs-12 pull pull-left">
          <label htmlFor="store">Pickup Date</label>
          <div className="input-group date" data-provide="datepicker">
            <input
              type="text"
              name="pickupdate"
              id="pickupdate"
              className="form-control"
            />
            <div className="input-group-addon">
              <span className="glyphicon glyphicon-th" />
            </div>
          </div>
          <input
            className="form-control"
            type="text"
            id="pickuptime"
            placeholder="Set Time"
            name="pickuptime"
          />
        </div>
        <div className="col-md-4 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="username">Refrence No.*</label>
            <input
              type="text"
              className="form-control"
              id="pickup_refno"
              defaultValue="ISV_TRIP-1230"
              name="pickup_refno"
              autoComplete="off"
            />
          </div>
        </div>
        {/* 
              <div class="col-md-6 col-xs-12 pull pull-left">
               <label for="store">Weight</label>
              <div class="form-group">
              <input type="text" class="form-control" placeholder="Search/Select  Values" list="select-list-id"/>
              </div>
              <datalist id="select-list-id">
             
               <option value="Gallons">Gallons</option>
                      <option value="Grams">Grams</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="MBF">MBF</option>
                      <option value="Metric Ton">Metric Ton</option>
                      <option value="Ounces">Ounces</option>
                      <option value="Pounds">Pounds</option>
                      <option value="Tons">Tons</option>
              </datalist>
              </div> */}
        <div className="col-md-12 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="description">Pickup Description</label>
            <textarea
              type="text"
              className="form-control"
              id="pickup_desc"
              name="pickup_desc"
              placeholder="Enter Pickup Notes"
              autoComplete="off"
              defaultValue={"  "}
            />
          </div>
        </div>
      </div>
      <div className="col-md-6 col-xs-12 pull pull-right">
        <div className="col-md-12 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="store">Deliver To</label>
            <select
              className="form-control"
              id="delivery"
              onchange="fetch_delivery_address();"
              name="delivery"
            >
              <option value={58}>Top O' the River</option>
              <option value={57}>
                Kisko Products, 50 Royal Group Crescent, Woodbridge, ON L4H 1X9
              </option>
              <option value={56}>
                C&amp;S Wholesale Grocers Logistics, East Penn Avenue,
                Robesonia, PA, USA
              </option>
              <option value={55}>
                Supervalu Distribution Center, Paintersville Road, New Stanton,
                PA, USA
              </option>
              <option value={54}>
                Dollar General, East Pike, Zanesville, OH, USA
              </option>
              <option value={53}>
                Furlani Foods, Aimco Boulevard, Mississauga, ON, Canada
              </option>
              <option value={52}>
                Costco, Brant Street, Burlington, ON, Canada
              </option>
              <option value={51}>
                Adonis Carriers Inc, Dixie Road, Mississauga, ON, Canada
              </option>
              <option value={50}>ECBVerdyol, Riverton, MB, Canada</option>
              <option value={49}>
                Murphy Warehouse Co, 24th Avenue Southeast, Minneapolis, MN, USA
              </option>
              <option value={48}>
                Conwed Plastics LLC, Weeks Avenue Southeast, Minneapolis, MN,
                USA
              </option>
              <option value={47}>
                Winnipeg James Armstrong Richardson International Airport (YWG),
                Wellington Avenue, Winnipeg, MB, Ca
              </option>
              <option value={46}>
                Versa Cold, 78 Avenue Southeast, Calgary, AB, Canada
              </option>
              <option value={45}>
                Precise Manufacturing Inc, Merchant Road, Fort Wayne, IN, USA
              </option>
              <option value={44}>
                Richard's Produce, North Creek Drive, Festus, MO, USA
              </option>
              <option value={43}>Maryland City, MD, USA</option>
              <option value={42}>
                Arizona Mills, South Arizona Mills Circle, Tempe, AZ, USA
              </option>
              <option value={41}>
                Husted's Hazel Dell Lanes, Northeast Highway 99, Vancouver, WA,
                USA
              </option>
              <option value={40}>
                Fort Worth Stockyards, East Exchange Avenue, Fort Worth, TX, USA
              </option>
              <option value={39}>
                Metro Ontario Inc, Dundas Street West, Etobicoke, ON, Canada
              </option>
              <option value={38}>
                Baketree, Gana Court, Mississauga, ON, Canada
              </option>
              <option value={37}>
                Dallas Love Field Airport (DAL), Herb Kelleher Way, Dallas, TX,
                USA
              </option>
              <option value={34}>
                Jaipur Junction, Station Road, Gopalbari, Jaipur, Rajasthan,
                India
              </option>
              <option value={33}>
                Major's Tower, Lakhnaur Pind Road, Sector 74, Sahibzada Ajit
                Singh Nagar, Punjab, India
              </option>
              <option value={32}>
                Manitoulin Transport, Shawson Drive, Mississauga, ON, Canada
              </option>
              <option value={31}>
                HBC TRANSPORTATION, Armstrong Avenue, Georgetown, ON, Canada
              </option>
              <option value={30}>
                Spark Freight System, Williams Parkway, Brampton, ON, Canada
              </option>
              <option value={29}>
                Boise Engineered Woodproducts ALLjoist, Rue Industrielle,
                Saint-Jacques, NB, Canada
              </option>
              <option value={28}>
                Greenovative Solutions, Inc., Chemin de la Côte-de-Liesse,
                Saint-Laurent, QC, Canada
              </option>
              <option value={27}>
                Boise Engineered Woodproducts ALLjoist, Rue Industrielle,
                Saint-Jacques, NB, Canada
              </option>
              <option value={26}>
                Pratt &amp; Whitney, Bee Line Highway, Jupiter, FL, USA
              </option>
              <option value={25}>
                Pratt &amp; Whitney Canada, Boulevard Marie-Victorin, Longueuil,
                QC, Canada
              </option>
              <option value={24}>
                Pratt &amp; Whitney Canada, Courtneypark Drive East,
                Mississauga, ON, Canada
              </option>
              <option value={22}>
                Dollarama, Royalmount Avenue, Mount Royal, QC, Canada
              </option>
              <option value={20}>
                Wisconsin State Capitol, East Main Street, Madison, WI, USA
              </option>
              <option value={19}>
                Turlock DMV, East Monte Vista Avenue, Turlock, CA, USA
              </option>
              <option value={18}>
                Mohali Stadium Road, Phase 3B-1, Phase 3B-2, Sector 60,
                Sahibzada Ajit Singh Nagar, Punjab, India
              </option>
              <option value={17}>
                Ontario Mills, Mills Circle, Ontario, CA, USA
              </option>
              <option value={16}>
                Marvel Safety &amp; Complaince Inc, Mississauga, ON, Canada
              </option>
              <option value={14}>
                Marvel Safety &amp; Complaince Inc, Windmill Road, Dartmouth,
                NS, Canada
              </option>
              <option value={13}>
                Marvel Safety &amp; Complaince Inc, Mississauga, ON, Canada
              </option>
              <option value={12}>
                Rollx Carriers, Drew Road, Mississauga, ON, Canada
              </option>
              <option value={11}>Hamburg, Germany</option>
              <option value={10}>
                Brisbane Airport Domestic Terminal Multi-Storey Car Park,
                Brisbane Airport QLD, Australia
              </option>
              <option value={9}>
                A2z Immigration Consultancy, Sector 70, Mohali, Punjab, India
              </option>
              <option value={8}>Gushaini, Himachal Pradesh, India</option>
              <option value={7}>Chandigarh, Punjab, India</option>
              <option value={4}>Patiala, Punjab, India</option>
              <option value={3}>California</option>
              <option value={2}>Brampton</option>
            </select>
          </div>
        </div>
        <div className="col-md-12 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="username">Delivery Address</label>
            <input
              type="text"
              className="form-control"
              id="delivery_address"
              name="delivery_address"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-md-4 col-xs-12 pull pull-left">
          <label htmlFor="store">Delivery Date</label>
          <div className="input-group date" data-provide="datepicker">
            <input
              type="text"
              name="deliverydate"
              id="deliverydate"
              className="form-control"
            />
            <div className="input-group-addon">
              <span className="glyphicon glyphicon-th" />
            </div>
          </div>
          <input
            className="form-control"
            type="text"
            id="deliverytime"
            placeholder="Set Time"
            name="deliverytime"
          />
        </div>
        <div className="col-md-4 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="username">Refrence No.*</label>
            <input
              type="text"
              className="form-control"
              id="delivery_refno"
              defaultValue="ISV_TRIP-1230"
              name="delivery_refno"
              autoComplete="off"
            />
          </div>
        </div>
        {/* 
              <div class="col-md-6 col-xs-12 pull pull-left">
               <label for="store">Weight</label>
              <div class="form-group">
              <input type="text" class="form-control" placeholder="Search/Select  Values" list="select-list-id"/>
              </div>
              <datalist id="select-list-id">
             
               <option value="Gallons">Gallons</option>
                      <option value="Grams">Grams</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="MBF">MBF</option>
                      <option value="Metric Ton">Metric Ton</option>
                      <option value="Ounces">Ounces</option>
                      <option value="Pounds">Pounds</option>
                      <option value="Tons">Tons</option>
              </datalist>
              </div> */}
        <div className="col-md-4 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="store">Appointment</label>
            <select
              className="form-control"
              id="dappointment"
              name="dappointment"
            >
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div className="col-md-12 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="description">Delivery Description</label>
            <textarea
              type="text"
              className="form-control"
              id="delivery_desc"
              name="delivery_desc"
              placeholder="Enter Delivery Notes"
              autoComplete="off"
              defaultValue={"                                    "}
            />
          </div>
        </div>
        <input
          type="hidden"
          className="form-control"
          id="lat"
          name="lat"
          autoComplete="off"
        />
        <input
          type="hidden"
          className="form-control"
          id="lng"
          name="lng"
          autoComplete="off"
        />
        <input
          type="hidden"
          className="form-control"
          id="source_lat"
          name="source_lat"
          autoComplete="off"
        />
        <input
          type="hidden"
          className="form-control"
          id="source_lng"
          name="source_lng"
          autoComplete="off"
        />
      </div>
      {/*
                      <div class="col-md-2 col-xs-12 pull pull-left">
                      <div class="form-group">
                      <label for="store">Stop Type</label>
                      <select class="form-control" id="stoptype" name="stoptype">
                      
                      <option value="Delivery">Delivery</option>
                      <option value="Pickup">Pickup</option>
                      </select>
                      </div>
                      </div>
                      
                      
                      <div class="col-md-6 col-xs-12 pull pull-left">
                      <div class="form-group">
                      <label for="username">Location</label>
                      <input id="pac-location" name="pac-location" type="text" class="form-control" placeholder="Enter Location Name, Address etc." autocomplete="off" />
                      
                      </div>
                      </div>
                    
                 */}
    </div>
    <div className="col-md-12 col-xs-12 pull pull-left">
      <div className="form-group">
        <button
          type="button"
          className="btn btn-info btn-sm"
          data-id='"ISV_TRIP-1230"'
          data-toggle="modal"
          data-target="#removeModal2"
        >
          Add Pickup/Delivery Stops
        </button>
      </div>
    </div>
    <div className="col-md-12 col-xs-12 pull pull-left">
      <div
        id="manageTablestops_wrapper"
        className="dataTables_wrapper form-inline dt-bootstrap no-footer"
      >
        <div className="row">
          <div className="col-sm-6">
            <div className="dataTables_length" id="manageTablestops_length">
              <label>
                Show{" "}
                <select
                  name="manageTablestops_length"
                  aria-controls="manageTablestops"
                  className="form-control input-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>{" "}
                entries
              </label>
            </div>
          </div>
          <div className="col-sm-6">
            <div id="manageTablestops_filter" className="dataTables_filter">
              <label>
                Search:
                <input
                  type="search"
                  className="form-control input-sm"
                  placeholder=""
                  aria-controls="manageTablestops"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <table
              id="manageTablestops"
              className="table table-bordered table-striped dataTable no-footer"
              role="grid"
              aria-describedby="manageTablestops_info"
              style={{ width: 1260 }}
            >
              <thead>
                <tr role="row">
                  <th
                    className="sorting"
                    tabIndex={0}
                    aria-controls="manageTablestops"
                    rowSpan={1}
                    colSpan={1}
                    aria-label="Type: activate to sort column ascending"
                    style={{ width: "494.2px" }}
                  >
                    Type
                  </th>
                  <th
                    className="sorting"
                    tabIndex={0}
                    aria-controls="manageTablestops"
                    rowSpan={1}
                    colSpan={1}
                    aria-label="Location: activate to sort column ascending"
                    style={{ width: 669 }}
                  >
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="odd">
                  <td valign="top" colSpan={2} className="dataTables_empty">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-5">
            <div
              className="dataTables_info"
              id="manageTablestops_info"
              role="status"
              aria-live="polite"
            >
              Showing 0 to 0 of 0 entries
            </div>
          </div>
          <div className="col-sm-7">
            <div
              className="dataTables_paginate paging_simple_numbers"
              id="manageTablestops_paginate"
            >
              <ul className="pagination">
                <li
                  className="paginate_button previous disabled"
                  id="manageTablestops_previous"
                >
                  <a
                    href="#"
                    aria-controls="manageTablestops"
                    data-dt-idx={0}
                    tabIndex={0}
                  >
                    Previous
                  </a>
                </li>
                <li
                  className="paginate_button next disabled"
                  id="manageTablestops_next"
                >
                  <a
                    href="#"
                    aria-controls="manageTablestops"
                    data-dt-idx={1}
                    tabIndex={0}
                  >
                    Next
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="col-md-12 col-xs-12 pull pull-left">
      <div className="form-group">
        <h4>
          <span className="label label-success">SHIPMENT DETAIL</span>
        </h4>
      </div>
    </div>
    <div className="col-md-12 col-xs-12 pull pull-left">
      <div className="table-responsive">
        <table className="table table-bordered" id="dynamic_weight">
          <tbody>
            <tr>
              <td>
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Commodities(s)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="commodity[]"
                      name="commodity[]"
                      placeholder="Enter Commodity"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </td>
              <td>
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Weight</label>
                    <input
                      type="text"
                      className="form-control"
                      id="weight[]"
                      name="weight[]"
                      placeholder="Enter Weight"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </td>
              <td>
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Packages(s)</label>
                    <select className="form-control" id="unit[]" name="unit[]">
                      <option value="Gallons">Gallons</option>
                      <option value="Gallons">Gallons</option>
                      <option value="Grams">Grams</option>
                      <option value="KGs">KGs</option>
                      <option value="MBF">MBF</option>
                      <option value="Metric Ton">Metric Ton</option>
                      <option value="Ounces">Ounces</option>
                      <option value="Pounds">Pounds</option>
                      <option value="Tons">Tons</option>
                    </select>
                  </div>
                </div>
              </td>
              <td>
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Packages(s)</label>
                    <input
                      type="text"
                      className="form-control"
                      id="package[]"
                      name="package[]"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </td>
              <td>
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Add Rows</label>
                    <button
                      type="button"
                      name="add1"
                      id="add1"
                      className="btn btn-success"
                    >
                      +
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="col-md-3 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="description">Selecct Trailor Type</label>
            <select
              className="form-control"
              id="trailortype"
              name="trailortype"
            >
              <option value="" disabled="" selected="">
                Choose Trailor Type
              </option>
              <option value="Dry VAN 53">DRY VAN 53"</option>
              <option value="Dry VAN 53">DRY VAN 53"</option>
              <option value="Auto Carrier Trailer">AUTO CARRIER TRAILER</option>
              <option value="Beverage Rack Trailer">
                BEVERAGE RACK TRAILER
              </option>
              <option value="20 feet sea container(closed top)">
                20 FEET SEA CONTAINER(CLOSED TOP)
              </option>
            </select>
          </div>
        </div>
        <div className="col-md-3 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="store">View Manifest</label>
            <select className="form-control" id="manifest" name="manifest">
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div className="col-md-3 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="store">Hazmat</label>
            <select className="form-control" id="hazmat" name="hazmat">
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div className="col-md-3 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="username">Addl. Charges</label>
            <input
              type="text"
              className="form-control"
              id="addlcharge"
              name="addlcharge"
              autoComplete="off"
            />
          </div>
        </div>
        {/*
               <div class="col-md-2 col-xs-12 pull pull-left">
              <div class="form-group">
              <label for="store">Refer</label>
              <select class="form-control" id="refer" name="refer">
             <option value="C">C</option>
                <option value="F">F</option>
               
              </select>
              </div>
          </div>
          */}
        <div className="col-md-3 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="username">Delivery by APPT*</label>
            <input
              type="text"
              className="form-control"
              id="appt"
              name="appt"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="col-md-3 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="store">PIP</label>
            <select className="form-control" id="pip" name="pip">
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
        <div className="col-md-3 col-xs-12 pull pull-left">
          <div className="form-group">
            <label htmlFor="store">CTPAT</label>
            <select className="form-control" id="ctpat" name="ctpat">
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
      </div>
      <div className="col-md-12 col-xs-12 pull pull-left">
        <div className="form-group">
          <h4>
            <span className="label label-success">REVENUE DETAILS</span>
          </h4>
        </div>
      </div>
      <div className="col-md-6 col-xs-12 pull pull-left">
        <div className="table-responsive">
          <label htmlFor="store">Revenue Item | Revenue Method</label>
          <table className="table table-bordered" id="dynamic_field">
            <tbody>
              <tr>
                {/*
              	<td><select name="revitem[]" class="form-control name_list" required >
						     <option value="na" disabled selected>Select Revenue Item</option>
						  <option value="Frieght Charge">Frieght Charge</option>
						  <option value="Fuel Surcharge">Fuel Surcharge</option>
						  </select> </td>	
					
              	<td><select name="ratemethod[]"  class="form-control name_list" required >
              	     <option value="na" disabled selected>Select Rate Type</option>
              	     <option value="Flat">Flat</option>   <option value="RateMile">RateMile</option>    <option value="RateHour">RateHour</option>  <option value="RateItem">RateItem</option>   <option value="Rate/Packages">Rate/Packages</option>   <option value="Rate/Weight">Rate/Weight</option>  <option value="MBF">MBF</option>
						  </select> </td> */}
                <td>
                  <input
                    type="text"
                    name="rate[]"
                    placeholder="Enter Rate (0.00)"
                    className="form-control name_list"
                    required=""
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="ratevalue[]"
                    onkeyup="sum();"
                    placeholder="Enter Qty"
                    className="form-control name_list"
                    required=""
                  />{" "}
                </td>
                <td>
                  <button
                    type="button"
                    name="add"
                    id="add"
                    className="btn btn-success"
                  >
                    Add More
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-md-12 col-xs-12 pull pull-left">
          <table className="table">
            <tbody>
              <tr>
                <th scope="row" />
                <td />
                <td />
                <td>Gross Amount</td>
                <td className="text-right">
                  {" "}
                  <input
                    type="text"
                    className="form-control"
                    id="gross_amount"
                    name="gross_amount"
                    defaultValue={0}
                    autoComplete="off"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row" />
                <td />
                <td>HST(%)</td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    id="hst"
                    name="hst"
                    defaultValue={0}
                    autoComplete="off"
                  />
                </td>
                <td>
                  {" "}
                  <input
                    type="text"
                    className="form-control"
                    id="hstamount"
                    name="hstamount"
                    defaultValue={0}
                    autoComplete="off"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row" />
                <td />
                <td>CST Amount(%)</td>
                <td>
                  {" "}
                  <input
                    type="text"
                    className="form-control"
                    id="cst"
                    name="cst"
                    defaultValue={0}
                    autoComplete="off"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    id="cstamount"
                    name="cstamount"
                    defaultValue={0}
                    autoComplete="off"
                  />
                </td>
              </tr>
              <tr>
                <th scope="row" />
                <td />
                <td />
                <td>Net Amount</td>
                <td>
                  {" "}
                  <input
                    type="text"
                    className="form-control"
                    id="net_amount"
                    name="net_amount"
                    defaultValue={0}
                    autoComplete="off"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {/* /.box-body */}
    {/* /.box-body */}
  </div>
  {/* /.box */}
  <div className="text-center">
    <button type="submit" className="btn btn-primary">
      CREATE TRIP
    </button>
    <a href="http://localhost/fms/orders/" className="btn btn-warning">
      Back
    </a>
  </div>
</section>

  </div>
  )
}

export default Createtrips
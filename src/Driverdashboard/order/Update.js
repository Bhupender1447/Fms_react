import React from 'react'

const Update = () => {
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Manage
        <small>Trips</small>
      </h1>
      <ol className="breadcrumb">
        <li>
          <Link to="#">
            <i className="fa fa-dashboard" /> Home
          </Link>
        </li>
        <li className="active">Orders</li>
      </ol>
    </section>
    {/* Main content */}
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
                <h3 align="center">Order # </h3>
              </div>
            </div>
            {/* /.box-header */}
            <form
              role="form"
              action=""
              method="post"
              encType="multipart/form-data"
            >
              <div className="box-body">
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Company</label>
                      <select
                        className="form-control"
                        id="company"
                        name="company"
                      >
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
                    defaultValue="ISV-ORD1042"
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
                        <option value="Regular" selected="">
                          Regular{" "}
                        </option>
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
                        <option value="" selected="">
                          {" "}
                        </option>
                        <option value="Order">Order</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="pickupnote"
                        name="pickupnote"
                        placeholder="Enter Pickup Notes"
                        autoComplete="off"
                        defaultValue={""}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-right">
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Customers</label>
                      <select
                        className="form-control"
                        id="customer_id"
                        onchange="fetch_company_locations();"
                        name="customer_id"
                      >
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={23}>RELIANCE LOGISTICS GROUP INC.</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={22} />
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={21}>MONTREAL POLYMERS</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={20}>PRATT &amp; WHITNEY CANADA</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={19}>LOYAL EXPRESS TRANSPORT</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={18}>META FACEBOOK</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={17}>BAKERS FIELD</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={16}>
                          MARVEL SAFETY &amp; COMPLAINCE INC,
                        </option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={15}>NATIONAL PRODUCE MARKETING INC</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={14}>HOLT MARINE </option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={13}>TEST</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={12}>ROLLX CARRIERS INC.</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={11}>IMPEXIVE</option>
                        <option value="Adonis Freight Inc." selected="">
                          Adonis Freight Inc.{" "}
                        </option>
                        <option value={9}>VASPLANET</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Load Type</label>
                      <select
                        className="form-control"
                        id="loadtype"
                        name="loadtype"
                      >
                        <option value="FTL" selected="">
                          FTL{" "}
                        </option>
                        <option value="FTL">FTL</option>
                        <option value="LTL">LTL</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Frieght on</label>
                      <select
                        className="form-control"
                        id="frieght_on"
                        name="frieghton"
                      >
                        <option value="" selected="">
                          {" "}
                        </option>
                        <option value="Order">Order</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Salesman</label>
                      <select
                        className="form-control"
                        id="salesman"
                        name="salesman"
                      >
                        <option value="Ankit" selected="">
                          Ankit{" "}
                        </option>
                        <option value={23}>
                          Reliance Logistics Group Inc., Wertheim Court, Richmond
                          Hill, ON, Canada
                        </option>
                        <option value={22}>
                          HBC TRANSPORTATION, Armstrong Avenue, Georgetown, ON,
                          Canada
                        </option>
                        <option value={21}>
                          Montreal Polymers, Chemin Dalton, Mount Royal, QC,
                          Canada
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
                          National Produce Marketing Inc, Plywood Place,
                          Etobicoke, ON, Canada
                        </option>
                        <option value={14}>Holt Marine - terminal</option>
                        <option value={13}>
                          National Produce Marketing Inc, Plywood Place,
                          Etobicoke, ON, Canada
                        </option>
                        <option value={12}>
                          Rollx Carriers, Drew Road, Mississauga, ON, Canada
                        </option>
                        <option value={11}>
                          Impexive Technologies, Depalpur Road, Ambikapuri
                          Extension, Ambikapuri Main, Indore, Madhya Pradesh,
                        </option>
                        <option value={9}>
                          VASPLANET, Sector 70, Sahibzada Ajit Singh Nagar,
                          Punjab, India
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Scale #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue="ISV-ORD1042"
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
                        <input
                          type="hidden"
                          className="form-control"
                          id="commodity_id[]"
                          name="commodity_id[]"
                          defaultValue={18}
                          autoComplete="off"
                        />
                        <td>
                          <div className="col-md-12 col-xs-12 pull pull-left">
                            <div className="form-group">
                              <label htmlFor="username">Commodities(s)</label>
                              <input
                                type="text"
                                className="form-control"
                                id="commodity[]"
                                name="commodity[]"
                                defaultValue="Baked goods"
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
                                defaultValue={17000}
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="col-md-12 col-xs-12 pull pull-left">
                            <div className="form-group">
                              <label htmlFor="username">Packages(s)</label>
                              <select
                                className="form-control"
                                id="unit[]"
                                name="unit[]"
                              >
                                <option value="Regular" selected="">
                                  Pounds{" "}
                                </option>
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
                                defaultValue={10}
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
                  <div className="col-md-2 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Hazmat</label>
                      <select className="form-control" id="hazmat" name="hazmat">
                        <option value="YES" selected="">
                          YES{" "}
                        </option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Refer</label>
                      <select className="form-control" id="refer" name="refer">
                        <option value="F" selected="">
                          F{" "}
                        </option>
                        <option value="C">C</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Temprature*</label>
                      <input
                        type="text"
                        className="form-control"
                        id="temprature"
                        name="temprature"
                        defaultValue={-10}
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="col-md-2 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">PIP</label>
                      <select className="form-control" id="pip" name="pip">
                        <option value="YES" selected="">
                          YES{" "}
                        </option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-2 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">CTPAT</label>
                      <select className="form-control" id="ctpat" name="ctpat">
                        <option value="YES" selected="">
                          YES{" "}
                        </option>
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                      </select>
                    </div>
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
                    <span className="label label-success">
                      PICKUP/DELIVERY DETAIL
                    </span>
                  </h4>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="col-md-8 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Pickup From</label>
                    <select
                      className="form-control"
                      id="pickup_from"
                      onchange="fetch_address();"
                      name="pickup_from"
                    ></select>
                  </div>
                </div>
                <div className="col-md-4 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Add Locations</label>
                    <Link
                      to="/locations/create"
                      className="btn btn-warning"
                    >
                      Add{" "}
                    </Link>
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
                      defaultValue="32.84810289999999|-96.8512063|8008 Herb Kelleher Way, Dallas, TX 75235, USA"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <label htmlFor="store">Pickup Date</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      name="pickupdate"
                      id="pickupdate"
                      defaultValue="07/25/2023"
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
                    defaultValue="09:00:00 am"
                    name="pickuptime"
                  />
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Reference No.*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="pickup_refno"
                      defaultValue="ISV-ORD1042"
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
                    <label htmlFor="description">Description</label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="pickup_desc"
                      name="pickup_desc"
                      placeholder="Enter Pickup Notes"
                      autoComplete="off"
                      defaultValue={""}
                    />
                  </div>
                </div>
                <div className="col-md-2 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Distance</label>
                    <input
                      type="text"
                      className="form-control"
                      id="distance"
                      name="distance"
                      defaultValue=""
                      autoComplete="off"
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
                    ></select>
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
                      defaultValue="43.6661186|-79.6906388|815 Gana Ct, Mississauga, ON L5S 1P2, Canada"
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="col-md-5 col-xs-12 pull pull-left">
                  <label htmlFor="store">Delivery Date</label>
                  <div className="input-group date" data-provide="datepicker">
                    <input
                      type="text"
                      name="deliverydate"
                      id="deliverydate"
                      defaultValue="07/28/2023"
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
                    defaultValue="08:00:00 am"
                    name="deliverytime"
                  />
                </div>
                <div className="col-md-4 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="username">Reference No.*</label>
                    <input
                      type="text"
                      className="form-control"
                      id="delivery_refno"
                      defaultValue="ISV-ORD1042"
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
                <div className="col-md-3 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="store">Appointment</label>
                    <select
                      className="form-control"
                      id="dappointment"
                      name="dappointment"
                    >
                      <option value="YES" selected="">
                        YES{" "}
                      </option>
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-12 col-xs-12 pull pull-left">
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      type="text"
                      className="form-control"
                      id="delivery_desc"
                      name="delivery_desc"
                      placeholder="Enter Delivery Notes"
                      autoComplete="off"
                      defaultValue={"                  "}
                    />
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
                      <tr></tr>
                      <tr>
                        <td>
                          <input
                            type="hidden"
                            className="form-control"
                            id="trans_id[]"
                            name="trans_id[]"
                            defaultValue={25}
                            autoComplete="off"
                          />
                        </td>
                        <td>
                          <select
                            name="revitem[]"
                            className="form-control name_list"
                            required=""
                          >
                            <option value="Regular" selected="">
                              Frieght Charge{" "}
                            </option>
                            <option value="Frieght Charge">Frieght Charge</option>
                            <option value="Fuel Surcharge">Fuel Surcharge</option>
                          </select>{" "}
                        </td>
                        <td>
                          <select
                            name="ratemethod[]"
                            className="form-control name_list"
                            required=""
                          >
                            <option value="Regular" selected="">
                              Flat{" "}
                            </option>
                            <option value="Flat">Flat</option>{" "}
                            <option value="RateMile">RateMile</option>{" "}
                            <option value="RateHour">RateHour</option>{" "}
                            <option value="RateItem">RateItem</option>{" "}
                            <option value="Rate/Packages">Rate/Packages</option>{" "}
                            <option value="Rate/Weight">Rate/Weight</option>{" "}
                            <option value="MBF">MBF</option>
                          </select>{" "}
                        </td>
                        <td>
                          <input
                            type="text"
                            name="rate[]"
                            id="rate1"
                            onchange="sum();"
                            defaultValue={6600}
                            className="form-control name_list"
                            required=""
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="ratevalue[]"
                            onchange="sum();"
                            defaultValue={1}
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
                            defaultValue={6600}
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
                            defaultValue={6600}
                            autoComplete="off"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
          </div>
          {/* /.box-body */}
          {/* /.box-body */}
        </div>
        {/* /.box */}
      </div>
      {/* col-md-12 */}
      <div className="text-center">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <Link to="/orders/" className="btn btn-warning">
          Back
        </Link>
      </div>
    </section>
  </div>
  
  )
}

export default Update
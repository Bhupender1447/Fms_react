import React from 'react'

const Assign = () => {
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        Assign
        <small>Carriers</small>
      </h1>
      <ol className="breadcrumb">
        <li>
          <Link to="#">
            <i className="fa fa-dashboard" /> Home
          </Link>
        </li>
        <li className="active">Crriers</li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div id="messages" />
          <div className="box">
            <div className="box-header"></div>
            {/* /.box-header */}
            <form
              role="form"
              action=""
              method="post"
              encType="multipart/form-data"
            >
              <div className="box-body">
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="col-md-6 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="store">Select Trasnport Mode</label>
                      <select
                        className="form-control"
                        id="mode"
                        onchange="change();"
                        name="mode"
                      >
                        <option value="" disabled="" selected="">
                          --Select Mode--
                        </option>
                        <option value="CARRIER">Carrier</option>
                        <option value="LOG">Logistics</option>
                      </select>
                    </div>
                  </div>
                  <div id="result-display" />
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <select
                        className="form-control"
                        id="carriers"
                        name="carriers"
                        style={{ visibility: "hidden" }}
                      >
                        <option value="" disabled="" selected="">
                          --Select Carrier--
                        </option>
                        <option value={23}>
                          MARVEL TRUCKING INC 23 MARVEL TRUCKING INC
                        </option>
                        <option value={22}>
                          MARJAN ENTERPRISE INC 22 MARJAN ENTERPRISE INC
                        </option>
                        <option value={21}>
                          BALRAM BROTHER'S LOGISTICS INC 21 BALRAM BROTHER'S
                          LOGISTICS INC
                        </option>
                        <option value={20}>
                          BALRAM BROTHER'S LOGISTICS INC 20 BALRAM BROTHER'S
                          LOGISTICS INC
                        </option>
                        <option value={19}>
                          TRUE NORTH FREIGHT SOLUTIONS INC 19 TRUE NORTH FREIGHT
                          SOLUTIONS INC
                        </option>
                        <option value={6}>
                          Marvel Trucking inc. 6 Marvel Trucking inc.
                        </option>
                        <option value={5}>Ace City Inc. 5 Ace City Inc.</option>
                        <option value={4}>
                          Rollx carrier Inc. 4 Rollx carrier Inc.
                        </option>
                        <option value={3}>
                          6722920 Canada Ltd./kk transport 3 6722920 Canada
                          Ltd./kk transport
                        </option>
                        <option value={2}>Virk Transport 2 Virk Transport</option>
                        <option value={1}>Ranbaxy 1 Ranbaxy</option>
                      </select>
                    </div>
                  </div>
                  {/*   
                        <div class="col-md-12 col-xs-12 pull pull-left">
                        <div class="form-group">
                        
                        <select class="form-control" id="log" name="log">
                        <option value="" disabled selected>--Assign to Logistic--</option>
                        
                                                    
                        <option value="6">FS120 L5874K Dry VAN 53"</option>  
                                                    
                        <option value="5">FS120 L5874K Dry VAN 53"</option>  
                                                    
                        <option value="4">ZR101 6EW880 Auto Carrier Trailer</option>  
                                                    
                        <option value="3">PB34 5678 PB4567 Beverage Rack Trailer</option>  
                                                    
                        <option value="2">trailor singh plate# 20 feet sea container(closed top)</option>  
                                                    </select>
                        </div>
                        </div>
                        */}
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="remarks"
                        name="remarks"
                        placeholder="Enter 
                        description"
                        autoComplete="off"
                        defaultValue={"na"}
                      />
                    </div>
                  </div>
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="description">Message for Carrier</label>
                      <textarea
                        type="text"
                        className="form-control"
                        id="msg"
                        name="msg"
                        placeholder="Enter Message for Carrier"
                        autoComplete="off"
                        defaultValue={"na"}
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label id="rrate" htmlFor="username">
                        Rate
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="rate"
                        name="rate"
                        defaultValue={5200}
                        placeholder="Enter Rate"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                  <div className="col-md-3 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label id="ccur" htmlFor="store">
                        Currency
                      </label>
                      <select className="form-control" id="cur" name="cur">
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xs-12 pull pull-left">
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Order #</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue="ISV-ORD1042"
                        placeholder="Enter Rate"
                        autoComplete="off"
                        disabled=""
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Shipment ype</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue="Regular"
                        placeholder="Enter Rate"
                        autoComplete="off"
                        disabled=""
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Load Type</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue="FTL"
                        placeholder="Enter Rate"
                        autoComplete="off"
                        disabled=""
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Commodity</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue=""
                        placeholder="Enter Rate"
                        autoComplete="off"
                        disabled=""
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Measurement</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue=""
                        placeholder="Enter Rate"
                        autoComplete="off"
                        disabled=""
                      />
                    </div>
                  </div>
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Pickup Location</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue="8008 Herb Kelleher Way, Dallas, TX 75235, USA"
                        placeholder="Enter Rate"
                        autoComplete="off"
                        disabled=""
                      />
                    </div>
                  </div>
                  <div className="col-md-12 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Delivery at</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue="815 Gana Ct, Mississauga, ON L5S 1P2, Canada"
                        placeholder="Enter Rate"
                        autoComplete="off"
                        disabled=""
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Pickup Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue="07/25/2023"
                        disabled=""
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-xs-12 pull pull-left">
                    <div className="form-group">
                      <label htmlFor="username">Delivery Date</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scaleticketno"
                        name="scaleticketno"
                        defaultValue="07/28/2023"
                        disabled=""
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* /.box-body */}
              <div className="box-footer">
                <button type="submit" className="btn btn-primary">
                  Confirm Order
                </button>
                <Link to="/trips/" className="btn btn-warning">
                  Cancel Order
                </Link>
              </div>
            </form>
            {/* /.box-body */}
          </div>
          {/* /.box */}
        </div>
        {/* col-md-12 */}
      </div>
      {/* /.row */}
    </section>
    {/* /.content */}
  </div>
  
  )
}

export default Assign
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Createorder = () => {
  const[data,setdata]=useState([])
  const[error,seterror]=useState([])
  const [formData, setFormData] = useState({
    company: "",
    customerorderno: "",
    shipmenttype: "",
    loadtype: "",
    pickupnote: "",
    customer_id: "",
    salesman: "",
    loadno: "",
    commodity: [],
    weight: [],
    unit: [],
    package: [],
    trailortype: "",
    hazmat: "",
    refer: "",
    temprature: "",
    pip: "",
    ctpat: "",
    pickup_from: "",
    pickup_address: "",
    pickupdate: "",
    pickuptime: "",
    pickup_refno: "",
    pickup_desc: "",
    manageTablestops_length: "",
    delivery: "",
    delivery_address: "",
    deliverydate: "",
    deliverytime: "",
    delivery_refno: "",
    dappointment: "",
    delivery_desc: "",
    revitem: [],
    ratemethod: [],
    rate: [],
    ratevalue: [],
    gross_amount: "",
    hst: "",
    hstamount: "",
    cst: "",
    cstamount: "",
    net_amount: ""
  });
const[messageres,setmessage]=useState()
  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
  };
  const handleInputChange2 = (e, index, field) => {
    const { value } = e.target;

    setFormData(prevState => {
        const updatedFormData = { ...prevState };

        // Ensure the array exists in the state
        if (!updatedFormData[field]) {
            updatedFormData[field] = [];
        }

        // Update the value at the specified index
        updatedFormData[field][index] = value;

        return updatedFormData;
    });
}

  
  
useEffect(()=>{
axios.get('https://isovia.ca/fms_api/api/getOrderData')
.then(res=>{setdata(res.data)
  setFormData({customerorderno:res&&res.data.orderno})
console.log(res.data)})
.catch(error=>seterror(error))
handleAddRow();
},[])


const [rows, setRows] = useState([]);

let handleonSubmit = async (e) => {
  e.preventDefault();
  
  const form = new FormData();
  form.append('company', formData.company);
  form.append('customerorderno', formData.customerorderno);
  form.append('shipmenttype', formData.shipmenttype);
  form.append('loadtype', formData.loadtype);
  form.append('pickupnote', formData.pickupnote);
  form.append('customer_id', formData.customer_id);
  form.append('salesman', formData.salesman);
  form.append('loadno', formData.loadno);
  form.append('commodity[]', formData.commodity);
  form.append('weight[]', formData.weight);
  form.append('unit[]', formData.unit);
  form.append('package[]', formData.package);
  form.append('trailortype', formData.trailortype);
  form.append('hazmat', formData.hazmat);
  form.append('refer', formData.refer);
  form.append('temprature', formData.temprature);
  form.append('pip', formData.pip);
  form.append('ctpat', formData.ctpat);
  form.append('pickup_from', formData.pickup_from);
  form.append('pickup_address', formData.pickup_address);
  form.append('pickupdate', formData.pickupdate);
  form.append('pickuptime', formData.pickuptime);
  form.append('pickup_refno', formData.pickup_refno);
  form.append('pickup_desc', formData.pickup_desc);
  form.append('manageTablestops_length', formData.manageTablestops_length);
  form.append('delivery', formData.delivery);
  form.append('delivery_address', formData.delivery_address);
  form.append('deliverydate', formData.deliverydate);
  form.append('deliverytime', formData.deliverytime);
  form.append('delivery_refno', formData.delivery_refno);
  form.append('dappointment', formData.dappointment);
  form.append('delivery_desc', formData.delivery_desc);
  form.append('revitem[]', formData.revitem);
  form.append('ratemethod[]', formData.ratemethod);
  form.append('rate[]', formData.rate);
  form.append('ratevalue[]', formData.ratevalue);
  form.append('gross_amount', formData.gross_amount);
  form.append('hst', formData.hst);
  form.append('hstamount', formData.hstamount);
  form.append('cst', formData.cst);
  form.append('cstamount', formData.cstamount);
  form.append('net_amount', formData.net_amount);

  try {
    const response = await axios.post('https://isovia.ca/fms_api/api/create', form);
    setmessage(response.data.message);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rethrow the error to handle it in the calling code
  }
}
{console.log(formData?.commodity)}
const handleAddRow = () => {
  setRows(prevRows => [
    ...prevRows,
    (
      <tr key={prevRows.length + 1}>
      <td>
     
        <input
          type="text"
          name={`commodity[${prevRows.length}]`}
          placeholder="Enter Commodity"
          className="form-control name_list"
          required
          value={formData?.commodity[prevRows.length] || ""}
          onChange={(e) => handleInputChange2(e, prevRows.length, 'commodity')}
        />
      </td>
      <td>
        <input
          type="text"
          name={`weight[${prevRows.length}]`}
          placeholder="Enter Weight"
          className="form-control name_list"
          required
          value={formData?.weight[prevRows.length] || ""}
          onChange={(e) => handleInputChange2(e, prevRows.length, 'weight')}
        />
      </td>
      <td>
        <select
          name={`unit[${prevRows.length}]`}
          className="form-control name_list"
          required
          value={formData?.unit[prevRows.length] || ""}
          onChange={(e) => handleInputChange2(e, prevRows.length, 'unit')}
        >
          <option value="na" disabled>Select Unit</option>
          <option value="Gallons">Gallons</option>
          <option value="KG">KG</option>
          <option value="TON">TON</option>
          <option value="Metric Ton">Metric Ton</option>
          <option value="Ounces">Ounces</option>
          <option value="MBF">MBF</option>
          <option value="Pounds">Pounds</option>
        </select>
      </td>
      <td>
        <input
          type="text"
          name={`package[${prevRows.length}]`}
          placeholder="Enter No. of Packages"
          className="form-control name_list"
          required
          value={formData?.package[prevRows.length] || ""}
          onChange={(e) => handleInputChange2(e, prevRows.length, 'package')}
        />
      </td>
      <td>
        <button
          type="button"
          name="remove"
          className="btn btn-danger btn_remove"
          onClick={() => handleRemoveRow(prevRows.length + 1)}
        >
          X
        </button>
      </td>
    </tr>
    
    
    )
  ]);
};


const handleRemoveRow = (index) => {
  setRows(prevRows => prevRows.filter((row, i) => i !== index - 1));
};



  return (
    <div className="content-wrapper">  <section className="content-header">
    <h1>
      Manage
      <small>Trips</small>
    </h1>
    <ol className="breadcrumb">
      <li><Link to="#"><i className="fa fa-dashboard"></i> Home</Link></li>
      <li className="active">Orders</li>
    </ol>
  </section>
  <section className="content">
  {/* Small boxes (Stat box) */}
  <div className="row">
    <div className="col-md-12 col-xs-12">
      <div id="messages" />
       {messageres?<div className="alert alert-success" role="alert">
      {  messageres}
</div>:''
}
      <div className="box">
        <div className="col-md-12 col-xs-12 pull pull-left">
          <div className="form-group">
            <h4>
              <span className="label label-success">CUSTOMER DETAILS</span>
            </h4>
            <h3 align="center">Order # : {data&&data.orderno}</h3>
          </div>
        </div>
       
        {/* /.box-header */}
        <form >
          <div className="box-body">
            <div className="col-md-6 col-xs-12 pull pull-left">
              <div className="col-md-12 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Company</label>
                 {console.log(formData)}
                  <select className="form-control" id="company" name="company" value={formData.company} onChange={handleInputChange}>
                  <option value="">Select Company</option>
                  {data.company_data?.map(item=>( <option value={item.company_name}>
                      
                     {item.company_name}
                    </option>))}
                   
                  </select>
                </div>
              </div>
              <input
                type="hidden"
                className="form-control"
                id="customerorderno"
                name="customerorderno"
                defaultValue={data&&data.orderno}
                placeholder="Enter Customer Order #"
                autoComplete="off"
                value={data&&data.orderno}
              />
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Shipment Type</label>
                  <select
                    className="form-control"
                    id="shipmenttype"
                    name="shipmenttype"
                    value={formData.shipmenttype} onChange={handleInputChange}
                  >
                    <option value="Regular">Regular</option>
                    <option value="into Canada">into Canada</option>
                    <option value="into USA">into USA</option>
                    <option value="round">round</option>
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
                    value={formData.loadtype} onChange={handleInputChange}
                  >
                    <option value="FTL">FTL</option>
                    <option value="LTL">LTL</option>
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
                    value={formData.pickupnote} onChange={handleInputChange}
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
                    name="customer_id"
                    value={formData.customer_id} onChange={handleInputChange}
                  >
                    <option value="">Select Customer</option>
                    {data&&data.customers?.map(item=>(  <option value={item.id}>{item.legal?item.legal:item.name}</option>))}
                  
                   
                  </select>
                </div>
              </div>
              <div className="col-md-6 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Sales Man</label>
                  <input
                    type="text"
                    className="form-control"
                    id="salesman"
                    name="salesman"
                    placeholder="Enter Salesman Name"
                    autoComplete="off"
                    required=""
                    value={formData.salesman} onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-4 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="username">Load #</label>
                  <input
                    type="text"
                    className="form-control"
                    id="loadno"
                    name="loadno"
                    placeholder="Enter Load No"
                    autoComplete="off"
                    required=""
                    value={formData.loadno} onChange={handleInputChange}
                  />
                </div>
              </div>
              {/*
          
           <div className="col-md-12 col-xs-12 pull pull-left">
          
          <div className="form-group">
            <label for="description">Description</label>
            <textarea type="text" className="form-control" id="carrier_desc" name="carrier_desc"  autocomplete="off">
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
          {rows.map((row, index) => (
            <React.Fragment key={index}>
              {row}
            </React.Fragment>
          ))}
           <button
        type="button"
        name="add1"
        id="add1"
        className="btn btn-success"
        onClick={handleAddRow}
      >
        +
      </button>
        </tbody>
      </table>
     
              <div className="col-md-2 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="description">Selecct Trailor Type</label>
                  <select
                    className="form-control"
                    id="trailortype"
                    name="trailortype"
                    value={formData.trailortype} onChange={handleInputChange}
                  >
                    <option value="" disabled="" selected="">
                      Choose Trailor Type
                    </option>
                    {data.trailors?.map(item=>(<option value={item.trailortype} >
                     {item.trailortype}
                    </option>))}
                    
                  
                 
                  </select>
                </div>
              </div>
              <div className="col-md-2 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Hazmat</label>
                  <select className="form-control" id="hazmat" name="hazmat" value={formData.hazmat} onChange={handleInputChange}>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
              <div className="col-md-2 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">Refer</label>
                  <select className="form-control" id="refer" name="refer" value={formData.refer} onChange={handleInputChange}>
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
                    autoComplete="off"
                    value={formData.temprature} onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="col-md-2 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">PIP</label>
                  <select className="form-control" id="pip" name="pip" value={formData.pip} onChange={handleInputChange}>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
              <div className="col-md-2 col-xs-12 pull pull-left">
                <div className="form-group">
                  <label htmlFor="store">CTPAT</label>
                  <select className="form-control" id="ctpat" name="ctpat" value={formData.ctpat} onChange={handleInputChange}>
                    <option value="YES">YES</option>
                    <option value="NO">NO</option>
                  </select>
                </div>
              </div>
            </div>
            {/*   
             <div className="col-md-4 col-xs-12 pull pull-left">
              <div className="form-group">
              <label for="store">Weight</label>
               <select className="form-control" id="weight" name="weight">
                      
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
              <div className="col-md-3 col-xs-12 pull pull-left">
              <div className="form-group">
              <label for="store">Measurement*</label>
              <select className="form-control" id="measurement" name="measurement">
              <option value="Centimeter">Centimeter</option>
               <option value="Feet">Feet</option>
                <option value="Inches">Inches</option>
                 <option value="Meter">Meter</option>
               
              </select>
              </div>
          </div>
              
             <div className="col-md-3 col-xs-12 pull pull-left">
              
                  <div className="form-group">
                  <label for="username">L*</label>
                  <input type="text" className="form-control" id="l" name="l"  autocomplete="off">
                  </div>
              
              </div>
                 <div className="col-md-3 col-xs-12 pull pull-left">
              
                  <div className="form-group">
                  <label for="username">B*</label>
                  <input type="text" className="form-control" id="b" name="b"  autocomplete="off">
                  </div>
              
              </div>
                 <div className="col-md-3 col-xs-12 pull pull-left">
              
                  <div className="form-group">
                  <label for="username">H*</label>
                  <input type="text" className="form-control" id="h" name="h"  autocomplete="off">
                  </div>
              
              </div>
          
             
              
        
        <!--
          
           <div className="col-md-12 col-xs-12 pull pull-left">
          
          <div className="form-group">
            <label for="description">Description</label>
            <textarea type="text" className="form-control" id="shipment_desc" name="shipment_desc" placeholder="Enter Shipment  Notes" autocomplete="off">
                              </textarea>
          </div> 
          </div>
          */}
          </div>
          <div className="col-md-6 col-xs-12 pull pull-right">
            {/*
              <div className="col-md-3 col-xs-12 pull pull-left">
               <label for="store">Pack. Type</label>
              <div className="form-group">
              <input type="text" className="form-control"   name="carr_weight"  list="select-list-id1"/>
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
                <label htmlFor="store">
                  Pickup From |{" "}
                  <Link to="/locations/create">
                    Add Location
                  </Link>{" "}
                </label>
                <select
                  className="form-control"
                  id="pickup_from"
                  value={formData.pickup_from} onChange={handleInputChange}
                  name="pickup_from"
                >
                  <option value=""> Pickup From</option>
                  {data.locations?.map(item=>( <option value={item.id}>{item.name}</option>))}
                 
                  
                </select>
              </div>
            </div>
            <div className="col-md-4 col-xs-12 pull pull-left">
              <div className="form-group">
                <label htmlFor="username">Add New Locations</label>
                <Link
                  to="/locations/create"
                  className="btn btn-warning"
                >
                  Add
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
                  autoComplete="off"
                  value={formData.pickup_address} onChange={handleInputChange}
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
                  value={formData.pickupdate} onChange={handleInputChange}
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
                value={formData.pickuptime} onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4 col-xs-12 pull pull-left">
              <div className="form-group">
                <label htmlFor="username">Pickup Ref#</label>
                <input
                  type="text"
                  className="form-control"
                  id="pickup_refno"
                  name="pickup_refno"
                  autoComplete="off"
                  value={formData.pickup_refno} onChange={handleInputChange}
                />
              </div>
            </div>
            {/* 
              <div className="col-md-6 col-xs-12 pull pull-left">
               <label for="store">Weight</label>
              <div className="form-group">
              <input type="text" className="form-control" placeholder="Search/Select  Values" list="select-list-id"/>
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
                  value={formData.pickup_desc} onChange={handleInputChange}
                />
              </div>
            </div>
            {/*
       <div className="col-md-2 col-xs-12 pull pull-left">
              
                  <div className="form-group">
                  <label for="username">Distance</label>
                  <input type="text" className="form-control" id="distance" name="distance"  autocomplete="off">
                  </div>
             
      </div>   
      */}
            <div className="col-md-12 col-xs-12 pull pull-left">
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-info btn-sm"
                  data-id={data&&data.orderno}
                  data-toggle="modal"
                  data-target="#removeModal2"
                >
                  Add Pickup/Delivery Stops
                </button>
              </div>
            </div>
            <div
              id="manageTablestops_wrapper"
              className="dataTables_wrapper form-inline dt-bootstrap no-footer"
            >
              <div className="row">
                <div className="col-sm-6">
                  <div
                    className="dataTables_length"
                    id="manageTablestops_length"
                  >
                    <label>
                      Show{" "}
                      <select
                        name="manageTablestops_length"
                        aria-controls="manageTablestops"
                        className="form-control input-sm"
                        value={formData.manageTablestops_length} onChange={handleInputChange}
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
                  <div
                    id="manageTablestops_filter"
                    className="dataTables_filter"
                  >
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
                    style={{ width: 601 }}
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
                          style={{ width: "210.2px" }}
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
                          style={{ width: 294 }}
                        >
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="odd">
                        <td
                          valign="top"
                          colSpan={2}
                          className="dataTables_empty"
                        >
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
                        <Link
                          to="#"
                          aria-controls="manageTablestops"
                          data-dt-idx={0}
                          tabIndex={0}
                        >
                          Previous
                        </Link>
                      </li>
                      <li
                        className="paginate_button next disabled"
                        id="manageTablestops_next"
                      >
                        <Link
                          to="#"
                          aria-controls="manageTablestops"
                          data-dt-idx={1}
                          tabIndex={0}
                        >
                          Next
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-xs-12 pull pull-right">
            <div className="col-md-12 col-xs-12 pull pull-left">
              <div className="form-group">
                <label htmlFor="store">Deliver To</label>
                <select
                  className="form-control"
                  onchange="fetch_delivery_address();"
                  id="delivery"
                  name="delivery"
                  value={formData.delivery} onChange={handleInputChange}
                >
                  <option value="">Select Deliver To</option>
                  {data.locations?.map(item=>( <option value={item.id}>{item.name}</option>))}
                 
                 
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
                  value={formData.delivery_address} onChange={handleInputChange}
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
                  value={formData.deliverydate} onChange={handleInputChange}
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
                value={formData.deliverytime} onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4 col-xs-12 pull pull-left">
              <div className="form-group">
                <label htmlFor="username">Delivery Ref#</label>
                <input
                  type="text"
                  className="form-control"
                  id="delivery_refno"
                  name="delivery_refno"
                  autoComplete="off"
                  value={formData.delivery_refno} onChange={handleInputChange}
                />
              </div>
            </div>
            {/* 
              <div className="col-md-6 col-xs-12 pull pull-left">
               <label for="store">Weight</label>
              <div className="form-group">
              <input type="text" className="form-control" placeholder="Search/Select  Values" list="select-list-id"/>
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
                  value={formData.dappointment} onChange={handleInputChange}
                >
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
                  defaultValue={""}
                  value={formData.delivery_desc} onChange={handleInputChange}
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
                  <tr>
                    <td>
                      <select
                        name="revitem[]"
                        className="form-control name_list"
                        required=""
                        value={formData.revitem} onChange={handleInputChange}
                      >
                        <option value="na" disabled="" selected="">
                          Select Revenue Item
                        </option>
                        <option value="Frieght Charge">Frieght Charge</option>
                        <option value="Fuel Surcharge">Fuel Surcharge</option>
                      </select>
                    </td>
                    <td>
                      <select
                        name="ratemethod[]"
                        className="form-control name_list"
                        required=""
                        value={formData.ratemethod} onChange={handleInputChange}
                      >
                        <option value="na" disabled="" selected="">
                          Select Rate Type
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
                        placeholder="Enter Rate (0.00)"
                        className="form-control name_list"
                        required=""
                        value={formData.rate} onChange={handleInputChange}

                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="ratevalue[]"
                        onKeyUp="sum();"
                        placeholder="Enter Qty"
                        className="form-control name_list"
                        required=""
                        value={formData.ratevalue} onChange={handleInputChange}
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
                        value={formData.gross_amount} onChange={handleInputChange}
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
                        value={formData.hst} onChange={handleInputChange}
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
                        value={formData.hstamount} onChange={handleInputChange}
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
                        value={formData.cst} onChange={handleInputChange}
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
                        value={formData.cstamount} onChange={handleInputChange}
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
                        value={formData.net_amount} onChange={handleInputChange}
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
    <button onClick={handleonSubmit} className="btn btn-primary">
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

export default Createorder
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const Updatetrip = () => {
  const [data, setdata] = useState([])
  const [paperworkList, setPaperworkList] = useState([]);
  const [error, seterror] = useState([])
  const { id } = useParams()
  let userdata = JSON.parse(localStorage.getItem('logindetail'));

  const handleRemoveRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      commodity: prev.commodity.filter((_, i) => i !== index),
      weight: prev.weight.filter((_, i) => i !== index),
      unit: prev.unit.filter((_, i) => i !== index),
      package: prev.package.filter((_, i) => i !== index),
    }));
  };

  const handleAddRow = () => {
    setFormData((prev) => ({
      ...prev,
      commodity: [...(prev.commodity || []), ""],
      weight: [...(prev.weight || []), ""],
      unit: [...(prev.unit || []), ""],
      package: [...(prev.package || []), ""],
    }));
  };

  const handleAddRevenueRow = () => {
    setFormData((prev) => ({
      ...prev,
      revitem: [...(prev.revitem || []), ""],
      ratemethod: [...(prev.ratemethod || []), ""],
      rate: [...(prev.rate || []), ""],
      ratevalue: [...(prev.ratevalue || []), ""],
    }));
  };

  const handleRemoveRevenueRow = (index) => {
    setFormData((prev) => ({
      ...prev,
      revitem: prev.revitem.filter((_, i) => i !== index),
      ratemethod: prev.ratemethod.filter((_, i) => i !== index),
      rate: prev.rate.filter((_, i) => i !== index),
      ratevalue: prev.ratevalue.filter((_, i) => i !== index),
    }));
  };

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
    net_amount: "",
    custom_paper: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "delivery") {
      const selectedLocation = data.locations.find((item) => item.id === value);
      setFormData({
        ...formData,
        [name]: value,
        delivery_address: selectedLocation ? selectedLocation.address1 : ""
      });
    } else if (name === "pickup_from") {
      const selectedLocation = data.locations.find((item) => item.id === value);
      setFormData({
        ...formData,
        [name]: value,
        pickup_address: selectedLocation ? selectedLocation.address1 : ""
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleInputChange2 = (e, index, field) => {
    const { value } = e.target;
    setFormData(prevState => {
      const updatedFormData = { ...prevState };
      if (!updatedFormData[field]) {
        updatedFormData[field] = [];
      }
      updatedFormData[field][index] = value;
      return updatedFormData;
    });
  }

  useEffect(() => {
    axios.get(`${BASE_URL}api/getOrderData`)
      .then(res => {
        setdata(res.data)
        setFormData(prev => ({ ...prev, customerorderno: res && res.data.orderno }))
      })
      .catch(error => seterror(error))
    fetchPaperworks();
  }, [])

  const fetchPaperworks = async () => {
    try {
      const res = await axios.get(`${BASE_URL}api/listCustompapers`);
      const data = res.data;
      if (data.status === "success") setPaperworkList(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    axios.get(`${BASE_URL}api/updateorder/${id}`)
      .then(res => {
        const fetchedData = res.data.data.product_data;
        setFormData({
          company: fetchedData.company || "",
          customerorderno: fetchedData.customer_orderno || "",
          shipmenttype: fetchedData.shipment_type || "",
          loadtype: fetchedData.load_type || "",
          pickupnote: fetchedData.pickup_desc || "",
          customer_id: fetchedData.customer_id || "",
          salesman: fetchedData.salesman || "",
          loadno: fetchedData.loadno || "",
          commodity: fetchedData.commodity || [],
          weight: fetchedData.weight || [],
          unit: fetchedData.unit || [],
          package: fetchedData.package || [],
          trailortype: fetchedData.trailortype || "",
          hazmat: fetchedData.hazmat || "",
          refer: fetchedData.refer || "",
          temprature: fetchedData.temprature || "",
          pip: fetchedData.pip || "",
          ctpat: fetchedData.ctpat || "",
          pickup_from: fetchedData.pickup || "",
          pickup_address: fetchedData.pickup_address || "",
          pickupdate: fetchedData.pickup_date || "",
          pickuptime: fetchedData.pickuptime || "",
          pickup_refno: fetchedData.pickup_refno || "",
          pickup_desc: fetchedData.pickup_desc || "",
          manageTablestops_length: fetchedData.manageTablestops_length || "",
          delivery: fetchedData.delivery || "",
          delivery_address: fetchedData.delivery_address || "",
          deliverydate: fetchedData.deliver_date || "",
          deliverytime: fetchedData.deliverytime || "",
          delivery_refno: fetchedData.delivery_refno || "",
          dappointment: fetchedData.appointment || "",
          delivery_desc: fetchedData.delivery_desc || "",
          revitem: fetchedData.revitem || [],
          ratemethod: fetchedData.ratemethod || [],
          rate: fetchedData.rate || [],
          ratevalue: fetchedData.ratevalue || [],
          gross_amount: fetchedData.gross_amount || "",
          hst: fetchedData.hst || "",
          hstamount: fetchedData.hst_amount || "",
          cst: fetchedData.cst || "",
          cstamount: fetchedData.cst_amount || "",
          net_amount: fetchedData.net_amount || "",
          custom_paper: fetchedData.custom_paper || ""
        });
      })
      .catch(error => seterror(error))
  }, [id])

  const [ocrRaw, setOcrRaw] = useState(null);

  const uploadOcrFile = async (file) => {
    const form = new FormData();
    form.append("file", file);
    form.append("module_type", "trip");
    form.append("prompt", "Extract all information in JSON format");

    try {
      const res = await axios.post(
        `${BASE_URL}OCRController/simple_openai_process`,
        form,
        { withCredentials: true }
      );

      if (res.data?.success) {
        setOcrRaw(res.data.data);
        applyOCRToAllFields(res.data);
      }
    } catch (e) {
      console.error("OCR failed", e);
    }
  };

  const flattenObject = (obj, prefix = "", res = {}) => {
    for (let key in obj) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (typeof value === "object" && value !== null) {
        flattenObject(value, newKey, res);
      } else {
        res[newKey.toLowerCase()] = String(value);
      }
    }
    return res;
  };

  const applyOCRToAllFields = (ocrResponse) => {
    if (!ocrResponse) return;

    const gptData = ocrResponse.gpt_response?.structured_json || {};
    const ocrDataRaw = ocrResponse.data || {};
    const flatOCR = ocrDataRaw ? flattenObject(ocrDataRaw) : {};
    const combinedSource = { ...flatOCR };

    if (gptData.names) gptData.names.forEach((n, i) => combinedSource[`gpt_name_${i}`] = n);
    if (gptData.addresses) gptData.addresses.forEach((a, i) => combinedSource[`gpt_address_${i}`] = a);
    if (gptData.dates) Object.entries(gptData.dates).forEach(([k, v]) => combinedSource[`gpt_date_${k}`] = v);
    if (gptData.numbers) Object.entries(gptData.numbers).forEach(([k, v]) => combinedSource[`gpt_number_${k}`] = v);
    if (gptData.records?.[0]) {
      Object.entries(gptData.records[0]).forEach(([k, v]) => combinedSource[`rec_${k}`] = String(v));
    }

    const flatGPT = flattenObject(gptData);
    Object.entries(flatGPT).forEach(([k, v]) => {
      combinedSource[`gpt_${k}`] = String(v);
    });

    setFormData((prev) => {
      const updated = { ...prev };
      const sourceKeys = Object.keys(combinedSource);
      let localMatchCount = 0;

      const getMatch = (synonyms) => {
        const key = sourceKeys.find(k => synonyms.some(s => k.toLowerCase().includes(s.toLowerCase())));
        return key ? combinedSource[key] : null;
      };

      const isFieldEmpty = (val) => {
        if (val === null || val === undefined) return true;
        const s = String(val).trim();
        if (s === "") return true;
        if (Array.isArray(val)) return val.length === 0 || (val.length === 1 && String(val[0]).trim() === "");
        return false;
      };

      const loadVal = getMatch(['rec_load_number', 'gpt_number_load', 'loadno', 'load_number', 'load']);
      if (loadVal) {
        updated.loadno = String(loadVal);
        localMatchCount++;
      }

      const salesmanVal = getMatch(['rec_name', 'gpt_name_0', 'salesman', 'names', 'driver_name']);
      if (salesmanVal && isFieldEmpty(updated.salesman)) {
        updated.salesman = String(salesmanVal);
        localMatchCount++;
      }

      const pickupAddr = getMatch(['rec_pickup_address', 'gpt_address_0', 'addresses', 'pickup_addr', 'shipper_address', 'origin_address', 'address']);
      if (pickupAddr && isFieldEmpty(updated.pickup_address)) {
        updated.pickup_address = String(pickupAddr);
        localMatchCount++;
      }

      const pickupLoc = getMatch(['shipper', 'ship_from', 'pickup_loc', 'origin', 'pickup_from']);
      if (pickupLoc && isFieldEmpty(updated.pickup_from)) {
        const loc = data.locations?.find(l => l.name?.toLowerCase().includes(String(pickupLoc).toLowerCase()));
        if (loc) { updated.pickup_from = loc.id; localMatchCount++; }
      }

      const deliveryAddr = getMatch(['rec_delivery_address', 'gpt_address_1', 'addresses', 'delivery_addr', 'consignee_address', 'destination_address']);
      if (deliveryAddr && isFieldEmpty(updated.delivery_address)) {
        updated.delivery_address = String(deliveryAddr);
        localMatchCount++;
      }

      const deliveryLoc = getMatch(['consignee', 'ship_to', 'delivery_loc', 'destination', 'delivery']);
      if (deliveryLoc && isFieldEmpty(updated.delivery)) {
        const loc = data.locations?.find(l => l.name?.toLowerCase().includes(String(deliveryLoc).toLowerCase()));
        if (loc) { updated.delivery = loc.id; localMatchCount++; }
      }

      const pickupDate = getMatch(['rec_pickup_date', 'gpt_date_pickup', 'pickup_date', 'pickupdate', 'iss']);
      if (pickupDate && isFieldEmpty(updated.pickupdate)) {
        updated.pickupdate = String(pickupDate);
        localMatchCount++;
      }

      const deliveryDate = getMatch(['rec_delivery_date', 'gpt_date_delivery', 'delivery_date', 'deliverydate', 'exp']);
      if (deliveryDate && isFieldEmpty(updated.deliverydate)) {
        updated.deliverydate = String(deliveryDate);
        localMatchCount++;
      }

      Object.keys(updated).forEach(field => {
        const isDefault = ["No", "Regular", "LTL", "Hazmat", "13", "0"].includes(String(updated[field]));
        if (!isFieldEmpty(updated[field]) && !isDefault && field !== 'loadno') return;

        const val = getMatch([field]);
        if (val) {
          if (Array.isArray(updated[field])) {
            updated[field] = [String(val)];
          } else if (!isNaN(prev[field]) && typeof prev[field] === 'number') {
            updated[field] = String(val).replace(/[^\d.]/g, "");
          } else {
            updated[field] = String(val).substring(0, 300);
          }
          localMatchCount++;
        }
      });

      if (localMatchCount > 0) {
        toast.success(`OCR processed successfully. Mapped ${localMatchCount} details.`);
      } else {
        toast.warning("OCR processed but no matching fields found.");
      }
      return updated;
    });
  };

  let handleonSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('userid', userdata.id);
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
    form.append('custom_paper', formData.custom_paper);

    try {
      const response = await axios.post(`${BASE_URL}api/updateorder/${id}`, form);
      if (response.data.status === 'success') {
        toast.success(response.data.message || "Trip updated successfully");
      } else {
        toast.error(response.data.message || "Error updating trip");
      }
      return response.data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  return (
    <div className="content-wrapper">
      <section className="content-header">
        <div className="form-group">
          <label htmlFor="product_image">Upload Licence / PDF</label>
          <div className="input-group">
            <input
              type="file"
              id="product_image"
              name="product_image"
              accept=".png,.jpg,.jpeg,.pdf"
              className="form-control"
              onChange={(e) => uploadOcrFile(e.target.files[0])}
            />
          </div>
        </div>
        <h1>
          Manage
          <small>Trips</small>
        </h1>
        <ol className="breadcrumb">
          <li><a href="#"><i className="fa fa-dashboard"></i> Home</a></li>
          <li className="active">Trips</li>
        </ol>
      </section>

      <form onSubmit={handleonSubmit}>
        <section className="content">
          <div className="row">
            <div className="col-md-12 col-xs-12">
              <div id="messages" />

              <div className="box">
                <div className="col-md-12 col-xs-12">
                  <div className="form-group">
                    <h4>
                      <span className="label label-success">CUSTOMER DETAILS</span>
                    </h4>
                    <h3 align="center">Order # : {data && data.orderno}</h3>
                  </div>
                </div>

                <div className="box-body">
                  <div className="row">
                    <div className="col-md-6 col-xs-12">
                      <div className="col-md-12 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="store">Company</label>
                          <select className="form-control" id="company" name="company" value={formData.company} onChange={handleInputChange}>
                            <option value="">Select Company</option>
                            {data.company_data?.map(item => (<option key={item.company_name} value={item.company_name}>{item.company_name}</option>))}
                          </select>
                        </div>
                      </div>
                      <input type="hidden" name="customerorderno" value={data && data.orderno} />
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="store">Shipment Type</label>
                          <select className="form-control" id="shipmenttype" name="shipmenttype" value={formData.shipmenttype} onChange={handleInputChange}>
                            <option value="Regular">Regular</option>
                            <option value="into Canada">into Canada</option>
                            <option value="into USA">into USA</option>
                            <option value="round">round</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="store">Load Type</label>
                          <select className="form-control" id="loadtype" name="loadtype" value={formData.loadtype} onChange={handleInputChange}>
                            <option value="FTL">FTL</option>
                            <option value="LTL">LTL</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="description">Description</label>
                          <textarea className="form-control" id="pickupnote" name="pickupnote" placeholder="Enter Pickup Notes" value={formData.pickupnote} onChange={handleInputChange} />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 col-xs-12">
                      <div className="col-md-12 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="store">Customers</label>
                          <select className="form-control" id="customer_id" name="customer_id" value={formData.customer_id} onChange={handleInputChange}>
                            <option value="">Select Customer</option>
                            {data && data.customers?.map(item => (<option key={item.id} value={item.id}>{item.legal ? item.legal : item.name}</option>))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="username">Sales Man</label>
                          <input type="text" className="form-control" id="salesman" name="salesman" placeholder="Enter Salesman Name" value={formData.salesman} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="col-md-6 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="username">Load #</label>
                          <input type="text" className="form-control" id="loadno" name="loadno" placeholder="Enter Load No" value={formData.loadno} onChange={handleInputChange} required />
                        </div>
                      </div>
                      <div className="col-md-12 col-xs-12">
                        <div className="form-group">
                          <label htmlFor="custom_paper">Custom Paper</label>
                          <select className="form-control" id="custom_paper" name="custom_paper" value={formData.custom_paper} onChange={handleInputChange}>
                            <option value="">-- Select Custom Paper --</option>
                            {paperworkList.map((paper) => (
                              <option key={paper.id} value={paper.id}>
                                {paper.custom_paper?.split("/").pop() || "Paper " + paper.id}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: '20px' }}>
                    <div className="col-md-12">
                      <h4><span className="label label-success">SHIPMENT DETAIL</span></h4>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Commodity</th>
                              <th>Weight</th>
                              <th>Unit</th>
                              <th>Packages</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.commodity?.map((_, index) => (
                              <tr key={index}>
                                <td><input type="text" className="form-control" value={formData.commodity[index] || ""} onChange={(e) => handleInputChange2(e, index, 'commodity')} /></td>
                                <td><input type="text" className="form-control" value={formData.weight[index] || ""} onChange={(e) => handleInputChange2(e, index, 'weight')} /></td>
                                <td>
                                  <select className="form-control" value={formData.unit[index] || "na"} onChange={(e) => handleInputChange2(e, index, 'unit')}>
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
                                <td><input type="text" className="form-control" value={formData.package[index] || ""} onChange={(e) => handleInputChange2(e, index, 'package')} /></td>
                                <td><button type="button" className="btn btn-danger" onClick={() => handleRemoveRow(index)}>X</button></td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan="5"><button type="button" className="btn btn-success" onClick={handleAddRow}>+</button></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Trailer Type</label>
                        <select className="form-control" name="trailortype" value={formData.trailortype} onChange={handleInputChange}>
                          <option value="">Choose</option>
                          {data.trailors?.map(item => (<option key={item.trailortype} value={item.trailortype}>{item.trailortype}</option>))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2"><div className="form-group"><label>Hazmat</label><select className="form-control" name="hazmat" value={formData.hazmat} onChange={handleInputChange}><option value="YES">YES</option><option value="NO">NO</option></select></div></div>
                    <div className="col-md-2"><div className="form-group"><label>Refer</label><select className="form-control" name="refer" value={formData.refer} onChange={handleInputChange}><option value="C">C</option><option value="F">F</option></select></div></div>
                    <div className="col-md-2"><div className="form-group"><label>Temp*</label><input type="text" className="form-control" name="temprature" value={formData.temprature} onChange={handleInputChange} /></div></div>
                    <div className="col-md-2"><div className="form-group"><label>PIP</label><select className="form-control" name="pip" value={formData.pip} onChange={handleInputChange}><option value="YES">YES</option><option value="NO">NO</option></select></div></div>
                    <div className="col-md-2"><div className="form-group"><label>CTPAT</label><select className="form-control" name="ctpat" value={formData.ctpat} onChange={handleInputChange}><option value="YES">YES</option><option value="NO">NO</option></select></div></div>
                  </div>

                  <div className="row" style={{ marginTop: '20px' }}>
                    <div className="col-md-12">
                      <h4><span className="label label-success">PICKUP/DELIVERY DETAIL</span></h4>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <h5><b>PICKUP</b></h5>
                      <div className="form-group">
                        <label>Pickup From</label>
                        <select className="form-control" name="pickup_from" value={formData.pickup_from} onChange={handleInputChange}>
                          <option value="">Select</option>
                          {data.locations?.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" name="pickup_address" value={formData.pickup_address} onChange={handleInputChange} />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Date</label>
                          <input type="text" className="form-control" name="pickupdate" value={formData.pickupdate} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                          <label>Time</label>
                          <input type="text" className="form-control" name="pickuptime" value={formData.pickuptime} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Ref #</label>
                        <input type="text" className="form-control" name="pickup_refno" value={formData.pickup_refno} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" name="pickup_desc" value={formData.pickup_desc} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <h5><b>DELIVERY</b></h5>
                      <div className="form-group">
                        <label>Deliver To</label>
                        <select className="form-control" name="delivery" value={formData.delivery} onChange={handleInputChange}>
                          <option value="">Select</option>
                          {data.locations?.map(item => (<option key={item.id} value={item.id}>{item.name}</option>))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Address</label>
                        <input type="text" className="form-control" name="delivery_address" value={formData.delivery_address} onChange={handleInputChange} />
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Date</label>
                          <input type="text" className="form-control" name="deliverydate" value={formData.deliverydate} onChange={handleInputChange} />
                        </div>
                        <div className="col-md-6">
                          <label>Time</label>
                          <input type="text" className="form-control" name="deliverytime" value={formData.deliverytime} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Ref #</label>
                        <input type="text" className="form-control" name="delivery_refno" value={formData.delivery_refno} onChange={handleInputChange} />
                      </div>
                      <div className="form-group">
                        <label>Appointment</label>
                        <select className="form-control" name="dappointment" value={formData.dappointment} onChange={handleInputChange}><option value="YES">YES</option><option value="NO">NO</option></select>
                      </div>
                      <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" name="delivery_desc" value={formData.delivery_desc} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: '20px' }}>
                    <div className="col-md-12">
                      <button type="button" className="btn btn-info btn-sm">Add Pickup/Delivery Stops</button>
                      <div className="table-responsive" style={{ marginTop: '10px' }}>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Type</th>
                              <th>Location</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr><td colSpan="2" className="text-center">No data available in table</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ marginTop: '20px' }}>
                    <div className="col-md-12">
                      <h4><span className="label label-success">REVENUE DETAILS</span></h4>
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th>Method</th>
                              <th>Rate</th>
                              <th>Qty</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.revitem?.map((_, index) => (
                              <tr key={index}>
                                <td>
                                  <select className="form-control" value={formData.revitem[index] || "na"} onChange={(e) => handleInputChange2(e, index, 'revitem')}>
                                    <option value="na" disabled>Select</option>
                                    <option value="Frieght Charge">Frieght Charge</option>
                                    <option value="Fuel Surcharge">Fuel Surcharge</option>
                                  </select>
                                </td>
                                <td>
                                  <select className="form-control" value={formData.ratemethod[index] || "na"} onChange={(e) => handleInputChange2(e, index, 'ratemethod')}>
                                    <option value="na" disabled>Select</option>
                                    <option value="Flat">Flat</option>
                                    <option value="RateMile">RateMile</option>
                                    <option value="RateHour">RateHour</option>
                                    <option value="RateItem">RateItem</option>
                                    <option value="Rate/Packages">Rate/Packages</option>
                                    <option value="Rate/Weight">Rate/Weight</option>
                                    <option value="MBF">MBF</option>
                                  </select>
                                </td>
                                <td><input type="text" className="form-control" value={formData.rate[index] || ""} onChange={(e) => handleInputChange2(e, index, 'rate')} /></td>
                                <td><input type="text" className="form-control" value={formData.ratevalue[index] || ""} onChange={(e) => handleInputChange2(e, index, 'ratevalue')} /></td>
                                <td><button type="button" className="btn btn-danger" onClick={() => handleRemoveRevenueRow(index)}>X</button></td>
                              </tr>
                            ))}
                            <tr><td colSpan="5"><button type="button" className="btn btn-success" onClick={handleAddRevenueRow}>Add More</button></td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-md-offset-6">
                      <table className="table">
                        <tbody>
                          <tr><th>Gross Amount</th><td><input type="text" className="form-control" name="gross_amount" value={formData.gross_amount} onChange={handleInputChange} /></td></tr>
                          <tr><th>HST(%)</th><td><input type="text" className="form-control" name="hst" value={formData.hst} onChange={handleInputChange} /></td><td><input type="text" className="form-control" name="hstamount" value={formData.hstamount} onChange={handleInputChange} /></td></tr>
                          <tr><th>CST(%)</th><td><input type="text" className="form-control" name="cst" value={formData.cst} onChange={handleInputChange} /></td><td><input type="text" className="form-control" name="cstamount" value={formData.cstamount} onChange={handleInputChange} /></td></tr>
                          <tr><th>Net Amount</th><td><input type="text" className="form-control" name="net_amount" value={formData.net_amount} onChange={handleInputChange} /></td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">Save</button>
            <a href="/trips/" className="btn btn-warning" style={{ marginLeft: '10px' }}>Back</a>
          </div>
        </section>
      </form>
    </div>
  )
}

export default Updatetrip
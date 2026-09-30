import React, { useState } from 'react';
import FmsMap from '../../components/Map/FmsMap';

const TripDetails = (props) => {
  const [tripData] = useState({
    "id": "264",
    "tmsTriptId": "",
    "mode": "LOG",
    "company": "Adonis Freight Inc.",
    "customer_orderno": "ISV_TRIP-1231",
    "customer_id": "19",
    "shipment_type": "Regular",
    "shipment_for": "",
    "commission": "Order",
    "company_desc": null,
    "carriers": null,
    "load_type": "FTL",
    "frieght_on": "Order",
    "salesman": "24",
    "scale_ticketno": "ISV_TRIP-1231",
    "carrier_desc": null,
    "commodity": null,
    "equipments": null,
    "weight": null,
    "applicable_on": "",
    "L": null,
    "B": null,
    "H": null,
    "measurement": null,
    "shipment_desc": "",
    "no_of_packkages": null,
    "carr_weight": null,
    "tap": null,
    "hazmat": "YES",
    "addl_charge": "",
    "appt": "",
    "promiles": "",
    "manifest": "YES",
    "refer": null,
    "temprature": null,
    "pip": "YES",
    "ctpat": "YES",
    "pickup": "57",
    "pickup_address": "50 Royal Group Crescent",
    "pickup_refno": "ISV_TRIP-1231",
    "pickup_date": "07/11/2024",
    "pickuptime": "",
    "pickup_tap": null,
    "pickup_desc": "  ",
    "delivery": "46",
    "delivery_address": "5555 78 Ave SE, Calgary, AB T2C 4M4, Canada",
    "delivery_refno": "ISV_TRIP-1231",
    "deliver_date": "07/26/2024",
    "deliverytime": "",
    "appointment": "YES",
    "delivery_desc": "                                    ",
    "distance": null,
    "createdat": "2024-07-07 21:06:55",
    "status": "ACTIVE",
    "gross_amount": "5500",
    "hst": "0",
    "hst_amount": "0",
    "cst": "0",
    "cst_amount": "0",
    "net_amount": "5500",
    "active": "active",
    "store_id": "",
    "carrier": "",
    "remarks": "Quaerat aute et maxi",
    "msg": "Quod nulla aspernatu",
    "rate": "16",
    "currency": "CAD",
    "truck_id": "5",
    "trailor_id": "8",
    "trailortype": "Refirigrated Trailors/Reefers Vn 53",
    "driver_id": "10007",
    "codriver_id": "10006",
    "city_driver_id": "10006",
    "lat": "50.98247000000001",
    "lng": "-113.9533779",
    "source_lat": "",
    "source_lng": "",
    "report_url": "",
    "logistic_assigned": "1",
    "loadno": "",
    "pickuplocation": "5555 Av. Royalmount, Mont-Royal, QC H4P 1J3, Canada",
    "deliverylocation": "5555 Av. Royalmount, Mont-Royal, QC H4P 1J3, Canada"
  });

  return (
    <div className='content-wrapper'>
      <div className="container">
        <div className="card mt-4">
          <div className="card-header">
            <h2 className="card-title">Order Details</h2>
          </div>
          <div className="card-body">
            <p className="card-text"><strong>Trip ID:</strong> {tripData.id}</p>
            <p className="card-text"><strong>Company:</strong> {tripData.company}</p>
            <p className="card-text"><strong>Pickup Address:</strong> {tripData.pickup_address}</p>
            <p className="card-text"><strong>Delivery Address:</strong> {tripData.delivery_address}</p>
            <p className="card-text"><strong>Pickup Date:</strong> {tripData.pickup_date}</p>
            <p className="card-text"><strong>Delivery Date:</strong> {tripData.deliver_date}</p>
            <p className="card-text"><strong>Gross Amount:</strong> {tripData.gross_amount} {tripData.currency}</p>
            <p className="card-text"><strong>Remarks:</strong> {tripData.remarks}</p>
            <p className="card-text"><strong>Status:</strong> {tripData.status}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <FmsMap 
            title="Trip Route Preview"
            initialOrigin={tripData.pickup_address}
            initialDestination={tripData.delivery_address}
          />
        </div>
      </div>
    </div>
  );
};

export default TripDetails;

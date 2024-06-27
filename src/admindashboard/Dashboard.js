import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'


const Dashboard = () => {
  const[data,setdata]=useState()
  useEffect(()=>{
    axios.get('https://isovia.ca/fms_api/api/cpanel')
    .then(res=>setdata(res.data))
    .catch(error=>console.error(error))
 
  },[])

  return (<>
   <div className="content-wrapper">
     <section className="content-header">
    <h1 align="center">
      <b>Fleet</b>
    </h1>
  </section>
  {data?<>
  <section className="content">
         <div className="row">
          <div className="col-lg-3 col-xs-6">
        
            <div className="small-box">
              <div className="inner">
                <h4>({data.total_trailors}) Trailors</h4>
              </div>
               <div className="icon">
                <div className="icon">
            
                  <Link to={'/trailors'}>
                <i className="fa fa-truck fa-sm" ></i>
                </Link>
             
              </div>
              </div>
                           
            </div>
          </div>
               <div className="col-lg-3 col-xs-6">
     
            <div className="small-box">
              <div className="inner">
                <h4>({data.total_trucks}) Trucks</h4>

              </div>
              <div className="icon">
                <div className="icon">
                  
              
                  <Link to={'/trucks'}>
                <i className="fa fa-subway"></i>
                </Link>
               
              </div>
              </div>
              
            </div>
          </div>
       <div className="col-lg-3 col-xs-6">
     
            <div className="small-box">
              <div className="inner">
                <h4>({data.total_owners}) Truck Owners</h4>

               
              </div>
                    <div className="icon">
                 
                    
                    <Link to={'/owners'}>
                    <i className="fa fa-group"></i>
                    </Link>
                  
                    </div>
             
            </div>
          </div>
    
          <div className="col-lg-3 col-xs-6">
         
            <div className="small-box">
              <div className="inner">
                <h4>({data.total_fleets}) Fleets</h4>

               
              </div>
              <div className="icon">
                    <Link to={'/fleets'}>
                    <i className="fa fa-random" aria-hidden="true"></i>
                    </Link>
              </div>
             
            </div>
          </div>
          
          
  </div>
    
      
    </section>
    <hr/>
    <section className="content-header">
  <h1 align="center">
    <b>Profiles</b>
  </h1>
</section>
    
<section className="content">



        <div className="row">
          <div className="col-lg-3 col-xs-6">

            <div className="small-box ">
              <div className="inner">
                <h4>({data.total_drivers}) Drivers</h4>
              </div>
              <div className="icon">
             
                  <Link to={'/drivers'}>  <i className="fa fa-address-book-o" aria-hidden="true"></i></Link>
                  
         
              </div>
              
            </div>
          </div>

          <div className="col-lg-3 col-xs-6">
       
            <div className="small-box ">
              <div className="inner">
                <h4>({data.total_users}) Employees</h4>

              </div>
              <div className="icon">
           
                  <Link to={'/employees'}>  <i className="fa fa-user-o" aria-hidden="true"></i></Link>
              
              </div>
             
            </div>
          </div>
         
          <div className="col-lg-3 col-xs-6">
     
            <div className="small-box ">
              <div className="inner">
                <h4>({data.total_users}) Vendors</h4>

               
              </div>
              <div className="icon">
              
              
                  <Link to={'/vendors'}>
               <i className="fa fa-puzzle-piece" aria-hidden="true"></i>
                </Link>
                   </div>
             
            </div>
          </div>

          <div className="col-lg-3 col-xs-6">
 
            <div className="small-box ">
              <div className="inner">
                <h4>({data.total_stores}) Carriers</h4>

               
              </div>
              <div className="icon">
             
              
                  <Link to={'/carriers'}>
              <i className="fa fa-ship" aria-hidden="true"></i>
                </Link>
          
              </div>
            
            </div>
          </div>
          
          
          
          
           <div className="col-lg-3 col-xs-6">

            <div className="small-box ">
              <div className="inner">
                <h4>({data.total_stores}) Yards</h4>

               
              </div>
              <div className="icon">
                
              
                  <Link to={'/yards'}>
              <i className="fa fa-ship" aria-hidden="true"></i>
                </Link>
              
              </div>
            
            </div>
          </div>
          
          
          
          
          
          
          
                
             
          
          
                
            
          
           

        </div>
 
      
      
   
      
      

    </section>
    <hr/>
    <section className="content-header">
  <h1 align="center">
    <b>Customers</b>
  </h1>
</section>
<section className="content">
  {/* Small boxes (Stat box) */}
  <div className="row">
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>({data.total_customers}) Customers</h4>
        </div>
        <div className="icon">
          <Link to={'/customers'}>
            {" "}
            <i className="fa fa-address-book-o" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
    {/* ./col */}
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>(0) Factoring</h4>
        </div>
        <div className="icon">
          <Link to={'/factorings'}>
            <i className="fa fa-industry" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
    {/* ./col */}
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>({data.total_users}) Custom Brokers</h4>
        </div>
        <div className="icon">
          <Link to={'/brokers'}>
            <i className="fa fa-chain-broken" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
    {/* ./col */}
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>({data.total_stores})Importers</h4>
        </div>
        <div className="icon">
          <Link to={'/importers'}>
            <i className="fa fa-download" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
    {/* /.row */}
  </div>
</section>
<hr />
  <section className="content-header">
    <h1 align="center">
      <b>Others</b>
    </h1>
  </section>
  <section className="content">
  {/* Small boxes (Stat box) */}
  <div className="row">
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>({data.total_products}) Locations</h4>
        </div>
        <div className="icon">
          <Link to={'/locations'}>
            <i className="fa fa-location-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
    {/* ./col */}
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>(0) Extra Charge</h4>
        </div>
        <div className="icon">
          <Link to={'/extracharges'}>
            <i className="fa fa-usd" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    {/* ./col */}
    {/* ./col */}
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>({data.total_stores}) Terms</h4>
        </div>
        <div className="icon">
          <Link to={'/terms'}>
            <i className="fa fa-check-circle-o" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>({data.total_stores}) Mantinance Types</h4>
        </div>
        <div className="icon">
          <Link to={'/mtypes'}>
            <i className="fa fa-server" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box">
        <div className="inner">
          <h4>({data.total_stores}) Discount Types</h4>
        </div>
        <div className="icon">
          <Link to={'/discounttypes'}>
            <i className="fa fa-mars" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>({data.total_stores})Mantinance Plan</h4>
        </div>
        <div className="icon">
          <Link to={'/mplans'}>
            <i className="fa fa-server" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box ">
        <div className="inner">
          <h4>({data.total_stores}) Document Types</h4>
        </div>
        <div className="icon">
          <Link to={'/doctypes'}>
            <i className="fa fa-file" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box">
        <div className="inner">
          <h4>({data.total_stores}) Deduction Types</h4>
        </div>
        <div className="icon">
          <Link to={'/ads'}>
            <i className="fa fa-bandcamp" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box">
        <div className="inner">
          <h4>({data.total_stores}) Expense Types</h4>
        </div>
        <div className="icon">
          <Link to={'/etypes'}>
            <i className="fa fa-flask" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box">
        <div className="inner">
          <h4>({data.total_stores})Insurance Types</h4>
        </div>
        <div className="icon">
          <Link to={'/itypes'}>
            <i className="fa fa-lightbulb-o" aria-hidden="true" />
         </Link>
        </div>
      </div>
    </div>
    <div className="col-lg-3 col-xs-6">
      {/* small box */}
      <div className="small-box">
        <div className="inner">
          <h4>({data.total_stores}) Equipment Types</h4>
        </div>
        <div className="icon">
          <Link to={'/eqptypes'} >
          <i className="fa fa-wrench" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

    </>:""}
    </div>
  </>
  )
}

export default Dashboard
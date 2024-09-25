import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './user.css'

const AgentDashboard = () => {
  const[data,setdata]=useState()
  useEffect(()=>{
    axios.get('https://isovia.ca/fms_api/api/cpanel')
    .then(res=>setdata(res.data))
    .catch(error=>console.error(error))
 
  },[])

  return (<>
   <div className="content-wrapper">
   
   <label className="switch">
  <input type="checkbox" />
  <span className="slider round" />

</label>

<label className='online'>Online Agent</label>
  {data?<>
  <section className="content">
         <div className="row">
          <div className="col-lg-3 col-xs-6">
        
            <div className="small-box">
              <div className="inner">
                <h4>({data.total_trailors}) Trip</h4>
              </div>
               <div className="icon">
                <div className="icon">
{/*             
                  <Link to={'/drivertrip'}> */}
                <i className="fa fa-truck fa-sm" ></i>
                {/* </Link> */}
             
              </div>
              </div>
                           
            </div>
          </div>
     
          
          
  </div>
    
      
    </section>
    <hr/>


    </>:""}
    </div>
  </>
  )
}

export default AgentDashboard
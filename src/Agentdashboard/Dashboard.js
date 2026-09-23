import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './user.css'

const AgentDashboard = () => {
  const [data, setdata] = useState()
  const [elapsedTime, setElapsedTime] = useState('');

  useEffect(() => {
    // Timer logic
    const loginData = JSON.parse(localStorage.getItem('logindetail'));
    const loginTime = loginData?.login_time ? new Date(loginData.login_time).getTime() : null;

    if (!loginTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = now - loginTime;

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setElapsedTime(
        `${hours.toString().padStart(2, '0')}h ${minutes
          .toString()
          .padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios.get('https://isovia.ca/fms_api/api/cpanel')
      .then(res => setdata(res.data))
      .catch(error => console.error(error))

  }, [])

  return (<>
    <div className="content-wrapper">

      <label className="switch">
        <input type="checkbox" />
        <span className="slider round" />

      </label>

      <label className='online'>Online Agent</label>
      <span className="badge badge-info ml-2" style={{ fontSize: '1.2rem', marginLeft: '10px' }}>
        <i className="fa fa-clock-o mr-1"></i> {elapsedTime || '00h 00m 00s'}
      </span>
      {data ? <>
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
        <hr />


      </> : ""}
    </div>
  </>
  )
}

export default AgentDashboard
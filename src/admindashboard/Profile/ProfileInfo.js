import {Link } from 'react-router-dom';

const ProfileInfo = () => {
  return (
    <div className="content-wrapper" style={{ minHeight: "341.2px" }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        User
        <small>Profile</small>
      </h1>
      <ol className="breadcrumb">
        <li>
          <Link to="#">
            <i className="fa fa-dashboard" /> Home
          </Link>
        </li>
        <li className="active">Profile</li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Profile XXX</h3>
            </div>
            {/* /.box-header */}
            <div className="box-body">
              <table className="table table-bordered table-condensed table-hovered">
                <tbody>
                  <tr>
                    <th>Username</th>
                    <td>admin</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>admin@admin.com</td>
                  </tr>
                  <tr>
                    <th>First Name</th>
                    <td>john</td>
                  </tr>
                  <tr>
                    <th>Last Name</th>
                    <td>doe</td>
                  </tr>
                  <tr>
                    <th>Gender</th>
                    <td>Male</td>
                  </tr>
                  <tr>
                    <th>Phone</th>
                    <td>80789998</td>
                  </tr>
                  <tr>
                    <th>Group</th>
                    <td>
                      <span className="label label-info">
                        Super Administrator
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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

export default ProfileInfo
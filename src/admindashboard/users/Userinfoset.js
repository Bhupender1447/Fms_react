/* eslint-disable jsx-a11y/no-redundant-roles */
import { Link } from "react-router-dom";
const Userinfoset = () => {
  return (
    <div className="content-wrapper" style={{ minHeight: 440 }}>
    {/* Content Header (Page header) */}
    <section className="content-header">
      <h1>
        User
        <small>Setting</small>
      </h1>
      <ol className="breadcrumb">
        <li>
          <Link to="#">
            <i className="fa fa-dashboard" /> Home
          </Link>
        </li>
        <li className="active">Setting</li>
      </ol>
    </section>
    {/* Main content */}
    <section className="content">
      {/* Small boxes (Stat box) */}
      <div className="row">
        <div className="col-md-12 col-xs-12">
          <div className="box">
            <div className="box-header">
              <h3 className="box-title">Update Information</h3>
            </div>
            {/* /.box-header */}
            <form role="form" action="" method="post">
              <div className="box-body">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder="Username"
                    defaultValue="admin"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="Email"
                    defaultValue="admin@admin.com"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fname">First name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    name="fname"
                    placeholder="First name"
                    defaultValue="john"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lname">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    name="lname"
                    placeholder="Last name"
                    defaultValue="doe"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    name="phone"
                    placeholder="Phone"
                    defaultValue={80789998}
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender</label>
                  <div className="radio">
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        id="male"
                        defaultValue={1}
                        defaultChecked=""
                      />
                      Male
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="gender"
                        id="female"
                        defaultValue={2}
                      />
                      Female
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <div
                    className="alert alert-info alert-dismissible"
                    role="alert"
                  >
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                    Leave the password field empty if you don't want to change.
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="text"
                    className="form-control"
                    id="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="off"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cpassword">Confirm password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="cpassword"
                    name="cpassword"
                    placeholder="Confirm Password"
                    autoComplete="off"
                  />
                </div>
              </div>
              {/* /.box-body */}
              <div className="box-footer">
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <Link
                  to="https://isovia.ca/fms/users/"
                  className="btn btn-warning"
                >
                  Back
                </Link>
              </div>
            </form>
          </div>
          {/* /.box */}
        </div>
      </div>
      {/* /.row */}
    </section>
    {/* /.content */}
  </div>
  
  )
}

export default Userinfoset
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <>
      {/* <WebsiteLayout> */}
      <header>
        <div className="header-main-div">
          <div className="topbar">
            <div className="topbar-addrees">
              <div className="topbar-contact-adrees">
                <div className="email-text">
                  <Link to="#">
                    <i className="fa-regular fa-envelope" />
                    Isoviafreightmanagement@gmail.com
                  </Link>
                </div>
                <div className="number-text">
                  <Link to="#">
                    <i className="fa-solid fa-phone" />
                    +16472415999
                  </Link>
                </div>
              </div>
              <div className="topbar-links">
                <ul className="list-of-links">
                  <li className="topbar-links">
                    <NavLink to="/contact">Contact</NavLink>
                  </li>
                  <li className="topbar-links">
                    <NavLink to="/loginmain">Login</NavLink>
                  </li>
                  <li className="topbar-links">
                    <NavLink to="/registration">Register</NavLink>
                  </li>
                  <li className="topbar-links">
                    <Link to="#">
                      <i className="fa-brands fa-facebook-f" />
                    </Link>
                  </li>
                  <li className="topbar-links">
                    <Link to="#">
                      <i className="fa-brands fa-linkedin-in" />
                    </Link>
                  </li>
                  <li className="topbar-links">
                    <Link to="#">
                      <i className="fa-brands fa-instagram" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* ================= MAIN HEADER ================= */}
          <div className="container header-bar">
            <nav className="navbar navbar-expand-lg navbar-light">
              {/* LOGO */}
              <NavLink className="navbar-brand header-logo" to="/">
                <img src="/images/logo.png" alt="Logo" />
              </NavLink>

              {/* TOGGLER */}
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mainNavbar"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              {/* MENU */}
              <div className="collapse navbar-collapse" id="mainNavbar">
                <ul className="navbar-nav mx-auto">
                  <li className="nav-item">
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }
                    >
                      Home
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/aboutus"  className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }>
                      About
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/partner"  className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }>
                      Partners
                    </NavLink>
                  </li>

                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      data-bs-toggle="dropdown"
                    >
                      Software
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/freightmanagement"
                        >
                          Freight Management System
                        </NavLink>
                      </li>
                      <li>
                        <NavLink
                          className="dropdown-item"
                          to="/fleetmanagement"
                        >
                          Fleet Management System
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/news" className="nav-link">
                      News
                    </NavLink>
                  </li>

                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      data-bs-toggle="dropdown"
                    >
                      Blog
                    </Link>
                    <ul className="dropdown-menu">
                      <li>
                        <NavLink className="dropdown-item" to="/Article1">
                          Article 1
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/Article2">
                          Article 2
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/Article3">
                          Article 3
                        </NavLink>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item">
                    <NavLink to="/contact"  className={({ isActive }) =>
                        `nav-link ${isActive ? "active" : ""}`
                      }>
                      Contact
                    </NavLink>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

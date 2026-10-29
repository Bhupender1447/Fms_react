import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../design-system/components';
import './public-shell.css';

const Header = () => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const { pathname, hash } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname, hash]);
  const closeWithEscape = (event) => {
    if (event.key === 'Escape' && open) {
      setOpen(false);
      toggleRef.current?.focus();
    }
  };
  return (
  <header className="iso-ui iso-public-header" data-iso-theme="light" onKeyDown={closeWithEscape}>
    {pathname === '/' && <a className="iso-public-skip" href="#isovia-page-content">Skip to main content</a>}
    <div className="iso-public-header-inner">
      <NavLink className="iso-public-brand" to="/" aria-label="Isovia home">
        <img src="/images/logo.png" alt="" />
      </NavLink>
      <Button ref={toggleRef} variant="secondary" className="iso-public-toggle" aria-controls="isoviaMainNav" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? 'Close menu' : 'Menu'}
      </Button>
      <nav className={`iso-public-nav${open ? ' is-open' : ''}`} id="isoviaMainNav" aria-label="Main navigation" onClick={(event) => { if (event.target.closest('a')) setOpen(false); }}>
        <div className="iso-public-nav-links">
          <NavLink to="/" end>Overview</NavLink>
          <a href="/#products">Products</a>
          <a href="/#ifm-workflow">How it works</a>
          <NavLink to="/freightmanagement">IFM platform</NavLink>
          <a href="/#sis-foundations">SIS</a>
          <NavLink to="/partner">Partners</NavLink>
          <NavLink to="/news">News</NavLink>
        </div>
        <div className="iso-public-nav-actions">
          <NavLink to="/contact">Contact</NavLink>
          <Link className="iso-public-login" to="/alllogin">Workspace login <span aria-hidden="true">→</span></Link>
        </div>
      </nav>
    </div>
  </header>
  );
};

export default Header;

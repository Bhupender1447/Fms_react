import { Link } from 'react-router-dom';
import './public-shell.css';

const Footer = () => (
  <footer className="iso-ui iso-public-footer" data-iso-theme="dark">
    <div className="iso-public-footer-main">
      <div className="iso-public-footer-brand">
        <Link className="iso-public-brand" to="/" aria-label="Isovia home"><img src="/images/logo.png" alt="" /><span>ISOVIA<small>FREIGHT SYSTEMS</small></span></Link>
        <p>Freight Connected. Without Limits.</p>
        <p>Where freight connects. Beyond borders.</p>
      </div>
      <nav className="iso-public-footer-column" aria-label="Explore Isovia"><h2>Explore</h2><a href="/#products">Product ecosystem</a><Link to="/freightmanagement">IFM platform</Link><Link to="/partner">Partners</Link><Link to="/news">News</Link></nav>
      <nav className="iso-public-footer-column" aria-label="Workspace access"><h2>Workspace</h2><Link to="/admin-login">Admin access</Link><Link to="/agents-login">Agent access</Link><Link to="/driver-login">Driver access</Link></nav>
      <div className="iso-public-footer-column"><h2>Contact</h2><a href="mailto:Isoviafreightmanagement@gmail.com">Isoviafreightmanagement@gmail.com</a><a href="tel:+16472415999">+1 647 241 5999</a><small>Brampton, Ontario, Canada</small></div>
    </div>
    <div className="iso-public-footer-bottom"><span>© {new Date().getFullYear()} Isovia Technology Solutions Inc.</span><span>Freight management · Fleet operations · Driver workflows</span></div>
  </footer>
);

export default Footer;

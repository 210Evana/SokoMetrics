import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">🟢 SokoMetrics</Link>
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
          <Link to="/education" className={location.pathname === '/education' ? 'active' : ''}>Education</Link>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
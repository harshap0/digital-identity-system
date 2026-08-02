import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        🧠 <span>IdentityHub</span>
      </div>

      <ul className="nav-links">
        <li>Dashboard</li>
        <li>Documents</li>
        <li>AI Analysis</li>
      </ul>

      <div className="nav-right">
        <button className="icon-btn">🔔</button>
        <button className="profile-btn">👤 Harsha</button>
      </div>
    </nav>
  );
}

export default Navbar;
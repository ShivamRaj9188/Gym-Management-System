import { NavLink } from "react-router-dom";

function Navbar() {
  const getLinkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar navbar-expand-lg bg-white rounded shadow-sm px-3 py-2">
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#gymMainNavbar"
        aria-controls="gymMainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="gymMainNavbar">
        <ul className="navbar-nav nav-pills gap-1 w-100">
          <li className="nav-item">
            <NavLink className={getLinkClass} to="/">
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={getLinkClass} to="/members">
              Member Plans
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={getLinkClass} to="/trainers">
              Trainer Assignment
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={getLinkClass} to="/attendance">
              Attendance
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={getLinkClass} to="/payments">
              Payment Tracking
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

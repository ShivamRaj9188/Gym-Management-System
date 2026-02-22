import { NavLink } from "react-router-dom";
import { getStoredUser, logoutUser } from "../services/AuthService";

function Navbar({ isLoggedIn }) {
  const getLinkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  const currentUser = getStoredUser();

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

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
          {isLoggedIn ? (
            <>
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
              <li className="nav-item ms-lg-auto d-flex align-items-center px-2 text-secondary">
                {currentUser?.username}
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-danger btn-sm mt-1 mt-lg-0" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item ms-lg-auto">
                <NavLink className={getLinkClass} to="/login">
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={getLinkClass} to="/signup">
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

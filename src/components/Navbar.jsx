import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/dashboard")}>
        Daily Habit Tracker
      </div>

      <div className="nav-links">
        <NavLink to="/dashboard" className={linkClass}>Today</NavLink>
        <NavLink to="/streak" className={linkClass}>🔥 Streak</NavLink>
        <NavLink to="/xp" className={linkClass}>⭐ XP</NavLink>
        <NavLink to="/achievements" className={linkClass}>🏆 Achievements</NavLink>
        <NavLink to="/settings" className={linkClass}>⚙ Settings</NavLink>

        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

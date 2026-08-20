import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Streak from "./pages/Streak";
import XP from "./pages/XP";
import Achievements from "./pages/Achievements";
import Settings from "./pages/Settings";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/streak"
          element={<Streak />}
        />

        <Route
          path="/xp"
          element={<XP />}
        />

        <Route
          path="/achievements"
          element={<Achievements />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
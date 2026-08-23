import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Streak() {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const auth = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    loadStreaks();
  }, []);

  const loadStreaks = async () => {
    try {
      const habitsResponse = await axios.get(
        "https://daily-habit-tracker-backend-orte.onrender.com/habits",
        auth
      );

      const activeHabits = habitsResponse.data.filter(
        (habit) => habit.active
      );

      setHabits(activeHabits);

      const results = await Promise.all(
        activeHabits.map(async (habit) => {
          const [current, longest] = await Promise.all([
            axios.get(
              `https://daily-habit-tracker-backend-orte.onrender.com/habits/${habit.id}/streak`,
              auth
            ),
            axios.get(
              `https://daily-habit-tracker-backend-orte.onrender.com/habits/${habit.id}/longest-streak`,
              auth
            )
          ]);

          return {
            id: habit.id,
            current: current.data.currentStreak ?? 0,
            longest: longest.data.longestStreak ?? 0
          };
        })
      );

      const map = {};
      results.forEach((item) => {
        map[item.id] = item;
      });

      setStats(map);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const maxCurrent = Math.max(
    0,
    ...Object.values(stats).map((item) => item.current)
  );

  const maxLongest = Math.max(
    0,
    ...Object.values(stats).map((item) => item.longest)
  );

  return (
    <div className="app-container">
      <Navbar />

      <section className="page-section">
        <p className="eyebrow">CONSISTENCY</p>
        <h1 className="page-title">🔥 Streaks</h1>
        <p className="page-subtitle">
          Keep your habits alive by showing up every day.
        </p>

        {loading ? (
          <div className="loading">Loading streaks...</div>
        ) : habits.length === 0 ? (
          <div className="empty-card">
            <h3>No active habits</h3>
            <p>Create a habit to start building a streak.</p>
          </div>
        ) : (
          <>
            <div className="highlight-grid">
              <div className="highlight-card">
                <span>🔥</span>
                <small>Best current streak</small>
                <strong>{maxCurrent} days</strong>
              </div>

              <div className="highlight-card">
                <span>🏆</span>
                <small>Best ever streak</small>
                <strong>{maxLongest} days</strong>
              </div>
            </div>

            <div className="data-card-grid">
              {habits.map((habit) => {
                const item = stats[habit.id] || {
                  current: 0,
                  longest: 0
                };

                return (
                  <div className="data-card" key={habit.id}>
                    <h3>{habit.title}</h3>

                    <div className="metric-row">
                      <span>Current streak</span>
                      <strong>{item.current} days</strong>
                    </div>

                    <div className="metric-row">
                      <span>Longest streak</span>
                      <strong>{item.longest} days</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Streak;

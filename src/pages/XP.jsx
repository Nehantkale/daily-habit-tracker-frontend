import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function XP() {
  const [habits, setHabits] = useState([]);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const auth = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    loadXP();
  }, []);

  const loadXP = async () => {
    try {
      const response = await axios.get(
        "https://daily-habit-tracker-backend-orte.onrender.com/habits",
        auth
      );

      const activeHabits = response.data.filter(
        (habit) => habit.active
      );

      setHabits(activeHabits);

      const results = await Promise.all(
        activeHabits.map(async (habit) => {
          const response = await axios.get(
            `https://daily-habit-tracker-backend-orte.onrender.com/xp/${habit.id}/level`,
            auth
          );

          return {
            id: habit.id,
            totalXP: response.data.totalXP ?? 0,
            level: response.data.level ?? 1
          };
        })
      );

      const map = {};
      results.forEach((item) => {
        map[item.id] = item;
      });

      setData(map);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const levelStart = (level) => {
    if (level <= 1) return 0;
    if (level === 2) return 100;
    if (level === 3) return 250;
    if (level === 4) return 500;
    return 1000;
  };

  const nextLevelXP = (level) => {
    if (level === 1) return 100;
    if (level === 2) return 250;
    if (level === 3) return 500;
    if (level === 4) return 1000;
    return 1000;
  };

  return (
    <div className="app-container">
      <Navbar />

      <section className="page-section">
        <p className="eyebrow">REWARDS</p>
        <h1 className="page-title">⭐ XP & Levels</h1>
        <p className="page-subtitle">
          Complete habits and turn consistency into XP.
        </p>

        {loading ? (
          <div className="loading">Loading XP...</div>
        ) : habits.length === 0 ? (
          <div className="empty-card">
            <h3>No active habits</h3>
            <p>Create a habit to start earning XP.</p>
          </div>
        ) : (
          <div className="data-card-grid">
            {habits.map((habit) => {
              const item = data[habit.id] || {
                totalXP: 0,
                level: 1
              };

              const start = levelStart(item.level);
              const next = nextLevelXP(item.level);

              const percentage =
                item.level >= 5
                  ? 100
                  : Math.min(
                      100,
                      Math.max(
                        0,
                        ((item.totalXP - start) /
                          (next - start)) *
                          100
                      )
                    );

              return (
                <div className="data-card" key={habit.id}>
                  <div className="card-title-row">
                    <h3>{habit.title}</h3>
                    <span className="level-badge">
                      Level {item.level}
                    </span>
                  </div>

                  <div className="xp-number">
                    {item.totalXP} XP
                  </div>

                  <div className="xp-bar">
                    <div
                      className="xp-bar-fill"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="card-help">
                    {item.level >= 5
                      ? "Maximum level reached."
                      : `${Math.max(
                          0,
                          next - item.totalXP
                        )} XP until the next level`}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default XP;

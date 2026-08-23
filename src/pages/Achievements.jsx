import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Achievements() {
  const [habits, setHabits] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const auth = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
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
          const response = await axios.get(
            `https://daily-habit-tracker-backend-orte.onrender.com/achievements/${habit.id}`,
            auth
          );

          return response.data.map((achievement) => ({
            ...achievement,
            habitTitle: habit.title
          }));
        })
      );

      setAchievements(results.flat());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const iconFor = (name) => {
    if (name === "First Habit") return "🎯";
    if (name === "7 Day Streak") return "🔥";
    if (name === "100 XP") return "⭐";
    return "🏆";
  };

  return (
    <div className="app-container">
      <Navbar />

      <section className="page-section">
        <p className="eyebrow">MILESTONES</p>
        <h1 className="page-title">🏆 Achievements</h1>
        <p className="page-subtitle">
          Every milestone is proof that you kept going.
        </p>

        {loading ? (
          <div className="loading">Loading achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="empty-card">
            <h3>No achievements yet</h3>
            <p>
              Complete a habit to unlock your first achievement.
            </p>
          </div>
        ) : (
          <div className="achievement-grid">
            {achievements.map((achievement, index) => (
              <div
                className={`achievement-card ${
                  achievement.unlocked ? "unlocked" : "locked"
                }`}
                key={`${achievement.habitId}-${achievement.name}-${index}`}
              >
                <div className="achievement-icon">
                  {iconFor(achievement.name)}
                </div>

                <div className="achievement-content">
                  <div className="card-title-row">
                    <h3>{achievement.name}</h3>
                    <span>
                      {achievement.unlocked
                        ? "Unlocked"
                        : "Locked"}
                    </span>
                  </div>

                  <p>{achievement.description}</p>
                  <small>{achievement.habitTitle}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Achievements;

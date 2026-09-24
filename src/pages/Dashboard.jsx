import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [habits, setHabits] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const token = localStorage.getItem("token");
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const auth = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    loadDashboard();
    loadTodayHabits();
  }, []);

  useEffect(() => {
    loadHistory();
  }, [month, year]);

  const loadDashboard = async () => {
    try {
      const response = await axios.get(
        "https://daily-habit-tracker-backend-orte.onrender.com/dashboard",
        auth
      );
      setDashboard(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadTodayHabits = async () => {
    try {
      const response = await axios.get(
        "https://daily-habit-tracker-backend-orte.onrender.com/habits/today",
        auth
      );
      setHabits(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await axios.get(
        `https://daily-habit-tracker-backend-orte.onrender.com/habits/history?month=${month}&year=${year}`,
        auth
      );
      setHistory(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const completeHabit = async (habitId) => {
    try {
      await axios.post(
        `https://daily-habit-tracker-backend-orte.onrender.com/habits/${habitId}/complete`,
        {},
        auth
      );

      await Promise.all([
        loadTodayHabits(),
        loadDashboard(),
        loadHistory()
      ]);
    } catch (error) {
      console.log(error);
      alert("Could not complete habit.");
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 2, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month, 1));
  };

  if (!dashboard) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });

  const daysInMonth = new Date(year, month, 0).getDate();

  const todayDate = new Date();

  const isCurrentMonth =
    todayDate.getFullYear() === year &&
    todayDate.getMonth() + 1 === month;

  const todayDay = todayDate.getDate();

  return (
    <div className="app-container">
      <Navbar />

      <section className="today-section">
        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR DAILY ROUTINE</p>
            <h1 className="today-title">Today</h1>
            <p className="today-date">{today}</p>
          </div>
        </div>

        <div className="habits-container">
          {habits.length === 0 ? (
            <div className="empty-card">
              <h3>No active habits</h3>
              <p>Add your first habit from Settings.</p>
            </div>
          ) : (
            habits.map((habit) => {
              const habitId = habit.habitId ?? habit.id;

              return (
                <div className="habit-card" key={habitId}>
                  <div className="habit-info">
                    <h3 className="habit-title">
                      <span
                        className={`habit-checkbox ${
                          habit.completed ? "checked" : ""
                        }`}
                      >
                        {habit.completed ? "✓" : ""}
                      </span>

                      <span>{habit.title}</span>
                    </h3>

                    <span className="habit-status">
                      {habit.completed
                        ? "Completed today"
                        : "Not completed yet"}
                    </span>
                  </div>

                  {habit.completed ? (
                    <button className="completed-button" disabled>
                      ✓ Completed
                    </button>
                  ) : (
                    <button
                      className="complete-button"
                      onClick={() => completeHabit(habitId)}
                    >
                      Complete
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="history-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">CONSISTENCY</p>
            <h2 className="section-title">Monthly History</h2>
          </div>

          <div className="history-header">
            <button className="month-button" onClick={previousMonth}>
              ← Previous
            </button>

            <h2 className="month-title">{monthName}</h2>

            <button className="month-button" onClick={nextMonth}>
              Next →
            </button>
          </div>
        </div>

        <div className="history-wrapper">
          <div className="history-grid">
            <div className="history-row history-header-row">
              <div className="habit-name">Habit</div>

              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;

                const todayClass =
                  isCurrentMonth && day === todayDay
                    ? " today-day"
                    : "";

                return (
                  <div
                    className={`day-number${todayClass}`}
                    key={day}
                  >
                    {day}
                  </div>
                );
              })}
            </div>

            {history.map((habit) => (
              <div className="history-row" key={habit.habitId}>
                <div className="habit-name">{habit.title}</div>

                {Array.from({ length: daysInMonth }, (_, index) => {
                  const day = index + 1;

                  const date = `${year}-${String(month).padStart(
                    2,
                    "0"
                  )}-${String(day).padStart(2, "0")}`;

                  const completed =
                    habit.completedDates?.includes(date);

                  const todayClass =
                    isCurrentMonth && day === todayDay
                      ? " today-box"
                      : "";

                  return (
                    <div
                      className={`history-box ${
                        completed ? "completed" : ""
                      }${todayClass}`}
                      key={day}
                    >
                      {completed ? "✓" : ""}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="progress-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">TODAY'S PERFORMANCE</p>
            <h2 className="section-title">Today's Progress</h2>
          </div>
        </div>

        <div className="progress-bar-section">
          <div className="progress-bar-header">
            <span>
              {dashboard.todayCompleted} / {dashboard.todayTotal} completed
            </span>

            <strong>{dashboard.completionRate}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${dashboard.completionRate}%`
              }}
            />
          </div>
        </div>

        <div className="progress-card-container">
          <div className="progress-card">
            <span className="stat-icon">✓</span>

            <h3>Completed</h3>

            <div className="progress-value">
              {dashboard.todayCompleted}/{dashboard.todayTotal}
            </div>
          </div>

          <div className="progress-card">
            <span className="stat-icon">%</span>

            <h3>Completion</h3>

            <div className="progress-value">
              {dashboard.completionRate}%
            </div>
          </div>

          <div className="progress-card">
            <span className="stat-icon">🔥</span>

            <h3>Current Streak</h3>

            <div className="progress-value">
              {dashboard.currentStreak}
            </div>
          </div>

          <div className="progress-card">
            <span className="stat-icon">⭐</span>

            <h3>Total XP</h3>

            <div className="progress-value">
              {dashboard.totalXP}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
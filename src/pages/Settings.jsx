import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Settings() {
  const [habits, setHabits] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const token = localStorage.getItem("token");
  const auth = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      const response = await axios.get(
        "https://daily-habit-tracker-backend-orte.onrender.com/habits",
        auth
      );
      setHabits(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addHabit = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      alert("Habit title cannot be empty");
      return;
    }

    try {
      await axios.post(
        "https://daily-habit-tracker-backend-orte.onrender.com/habits",
        { title, description },
        auth
      );

      setTitle("");
      setDescription("");
      await loadHabits();
      alert("Habit added successfully!");
    } catch (error) {
      console.log(error);
      alert("Could not add habit");
    }
  };

  const startEditing = (habit) => {
    setEditingId(habit.id);
    setEditTitle(habit.title);
    setEditDescription(habit.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const updateHabit = async (id) => {
    if (!editTitle.trim()) {
      alert("Habit title cannot be empty");
      return;
    }

    try {
      await axios.put(
        `https://daily-habit-tracker-backend-orte.onrender.com/habits/${id}`,
        {
          title: editTitle,
          description: editDescription,
          active: true
        },
        auth
      );

      cancelEditing();
      await loadHabits();
      alert("Habit updated successfully!");
    } catch (error) {
      console.log(error);
      alert("Could not update habit");
    }
  };

  const deleteHabit = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to deactivate this habit?"
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `https://daily-habit-tracker-backend-orte.onrender.com/habits/${id}`,
        auth
      );

      await loadHabits();
    } catch (error) {
      console.log(error);
      alert("Could not deactivate habit");
    }
  };

  const activateHabit = async (id) => {
    try {
      await axios.put(
        `https://daily-habit-tracker-backend-orte.onrender.com/habits/${id}/activate`,
        {},
        auth
      );

      await loadHabits();
    } catch (error) {
      console.log(error);
      alert("Could not activate habit");
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <section className="page-section">
        <p className="eyebrow">MANAGE ROUTINE</p>
        <h1 className="page-title">⚙ Settings</h1>
        <p className="page-subtitle">
          Create, edit, activate, and deactivate your habits.
        </p>

        <div className="settings-grid">
          <section className="settings-card">
            <h2>Add New Habit</h2>

            <form onSubmit={addHabit}>
              <label>Habit Name</label>
              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="e.g. Read Book"
              />

              <label>Description</label>
              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Optional description"
                rows="4"
              />

              <button className="primary-action" type="submit">
                + Add Habit
              </button>
            </form>
          </section>

          <section className="settings-card">
            <div className="card-title-row">
              <h2>Your Habits</h2>
              <span className="habit-count">
                {habits.length}
              </span>
            </div>

            {habits.length === 0 ? (
              <p className="muted">
                You haven't created any habits yet.
              </p>
            ) : (
              <div className="settings-habit-list">
                {habits.map((habit) => (
                  <div
                    className="settings-habit"
                    key={habit.id}
                  >
                    {editingId === habit.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(event) =>
                            setEditTitle(event.target.value)
                          }
                        />

                        <textarea
                          value={editDescription}
                          onChange={(event) =>
                            setEditDescription(
                              event.target.value
                            )
                          }
                          rows="3"
                        />

                        <div className="action-row">
                          <button
                            className="primary-action"
                            onClick={() =>
                              updateHabit(habit.id)
                            }
                          >
                            Save
                          </button>

                          <button
                            className="secondary-action"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div>
                          <h3>{habit.title}</h3>

                          <p>
                            {habit.description ||
                              "No description"}
                          </p>

                          <span
                            className={`status-badge ${
                              habit.active
                                ? "active-status"
                                : "inactive-status"
                            }`}
                          >
                            {habit.active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        <div className="action-row">
                          {habit.active ? (
                            <>
                              <button
                                className="secondary-action"
                                onClick={() =>
                                  startEditing(habit)
                                }
                              >
                                ✏️ Edit
                              </button>

                              <button
                                className="danger-action"
                                onClick={() =>
                                  deleteHabit(habit.id)
                                }
                              >
                                Deactivate
                              </button>
                            </>
                          ) : (
                            <button
                              className="primary-action"
                              onClick={() =>
                                activateHabit(habit.id)
                              }
                            >
                              🔄 Activate
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

export default Settings;

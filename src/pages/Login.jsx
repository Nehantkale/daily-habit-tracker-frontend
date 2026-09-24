import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://daily-habit-tracker-backend-orte.onrender.com/users/login",
        {
          email: email,
          password: password
        }
      );

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");

    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Unable to login. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-brand">

        <div className="brand-logo">
          <span>✓</span>
        </div>

        <h1>
          Build better.
          <br />
          <span>Every single day.</span>
        </h1>

        <p>
          Track your habits, stay consistent, and see your
          progress grow over time.
        </p>

        <div className="habit-preview">

          <div className="preview-header">
            <span>Today's progress</span>
            <strong>75%</strong>
          </div>

          <div className="preview-bar">
            <div className="preview-fill"></div>
          </div>

          <div className="preview-habits">

            <div className="preview-habit completed">
              <span>✓</span>
              <p>Study Java</p>
            </div>

            <div className="preview-habit completed">
              <span>✓</span>
              <p>Workout</p>
            </div>

            <div className="preview-habit">
              <span></span>
              <p>Read 30 minutes</p>
            </div>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="auth-form-section">

        <div className="auth-form-container">

          <div className="mobile-logo">
            <div className="brand-logo">
              <span>✓</span>
            </div>
          </div>

          <div className="auth-heading">
            <p className="auth-eyebrow">
              WELCOME BACK
            </p>

            <h2>Sign in to your account</h2>

            <p>
              Continue building your daily habits.
            </p>
          </div>


          <form onSubmit={handleLogin}>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}


            <div className="input-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
              />

            </div>


            <div className="input-group">

              <div className="password-label">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() =>
                    alert("Password reset will be added soon.")
                  }
                >
                  Forgot password?
                </button>

              </div>


              <div className="password-input">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>


          <div className="auth-divider">
            <span>OR</span>
          </div>


          <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/register">
              Create one
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;
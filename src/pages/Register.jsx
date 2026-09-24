import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:8080/users", {
        username: username,
        email: email,
        password: password
      });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.log(error);

      if (error.response?.status === 400) {
        setError(
          error.response?.data?.message ||
          "Email may already be registered."
        );
      } else {
        setError("Unable to create account. Please try again.");
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
          Start your
          <br />
          <span>better routine.</span>
        </h1>

        <p>
          Create an account and start building habits
          that actually stick.
        </p>

        <div className="habit-preview">

          <div className="preview-header">
            <span>Your journey</span>
            <strong>Day 1</strong>
          </div>

          <div className="preview-bar">
            <div className="preview-fill register-fill"></div>
          </div>

          <div className="preview-habits">

            <div className="preview-habit">
              <span>1</span>
              <p>Create your first habit</p>
            </div>

            <div className="preview-habit">
              <span>2</span>
              <p>Stay consistent</p>
            </div>

            <div className="preview-habit">
              <span>3</span>
              <p>Watch your progress grow</p>
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
              GET STARTED
            </p>

            <h2>Create your account</h2>

            <p>
              Start tracking your habits today.
            </p>

          </div>


          <form onSubmit={handleRegister}>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-success">
                {success}
              </div>
            )}


            <div className="input-group">

              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                required
              />

            </div>


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

              <label htmlFor="password">
                Password
              </label>

              <div className="password-input">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
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


            <div className="input-group">

              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <div className="password-input">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>


          <div className="auth-divider">
            <span>OR</span>
          </div>


          <p className="signup-text">
            Already have an account?{" "}
            <Link to="/">
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/AuthService";

const USERNAME_REGEX = /^[A-Za-z0-9._]+$/;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

const validateSignup = (usernameInput, passwordInput) => {
  const normalizedUsername = usernameInput.trim();

  if (!normalizedUsername || !passwordInput.trim()) {
    return "Username and password are required.";
  }

  if (
    normalizedUsername.length < MIN_USERNAME_LENGTH ||
    normalizedUsername.length > MAX_USERNAME_LENGTH
  ) {
    return `Username must be ${MIN_USERNAME_LENGTH}-${MAX_USERNAME_LENGTH} characters.`;
  }

  if (!USERNAME_REGEX.test(normalizedUsername)) {
    return "Username can only contain letters, numbers, dot, and underscore.";
  }

  if (
    passwordInput.length < MIN_PASSWORD_LENGTH ||
    passwordInput.length > MAX_PASSWORD_LENGTH
  ) {
    return `Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters.`;
  }

  if (/\s/.test(passwordInput)) {
    return "Password must not contain spaces.";
  }

  if (!PASSWORD_REGEX.test(passwordInput)) {
    return "Password must include uppercase, lowercase, number, and special character.";
  }

  return "";
};

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");

    const validationError = validateSignup(username, password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const data = await signupUser({
        username: username.trim(),
        password,
      });
      setMessage(data?.message || "Signup successful");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h3 mb-3">Sign Up</h2>

        <form className="col-12 col-md-6 col-lg-5" onSubmit={handleSubmit}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <small className="text-muted d-block mb-3">
            Username: 3-20 chars, letters/numbers/._ | Password: 8-64 chars with uppercase, lowercase, number, special character.
          </small>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-3 mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        {message ? (
          <div className="alert alert-success mt-3 mb-0" role="alert">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="alert alert-danger mt-3 mb-0" role="alert">
            {error}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default Signup;

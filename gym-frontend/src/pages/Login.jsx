import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { isAuthenticated, loginUser } from "../services/AuthService";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        username: username.trim(),
        password,
      });

      setMessage(data?.message || "Login successful");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const useDemoCredentials = () => {
    setUsername("admin");
    setPassword("admin123");
    setError("");
    setMessage("");
  };

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h3 mb-3">Login</h2>
        <div className="alert alert-secondary py-2" role="alert">
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </div>

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
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <button className="btn btn-outline-secondary ms-2" type="button" onClick={useDemoCredentials}>
            Use Demo
          </button>
        </form>

        <p className="mt-3 mb-0">
          New user? <Link to="/signup">Create an account</Link>
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

export default Login;

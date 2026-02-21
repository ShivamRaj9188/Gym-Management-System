import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../services/AuthService";

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

    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
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
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

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

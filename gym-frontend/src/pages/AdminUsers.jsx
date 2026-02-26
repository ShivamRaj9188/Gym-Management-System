import { useEffect, useState } from "react";
import { deleteUser, getUsers, unverifyUser, verifyUser } from "../services/AdminService";

const getErrorMessage = error => error?.response?.data?.message || "Something went wrong. Please try again.";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    const data = await getUsers();
    setUsers(data);
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await loadUsers();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const handleVerify = async id => {
    clearMessages();
    try {
      await verifyUser(id);
      setMessage("User verified.");
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleUnverify = async id => {
    clearMessages();
    try {
      await unverifyUser(id);
      setMessage("User unverified.");
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async id => {
    clearMessages();
    try {
      await deleteUser(id);
      setMessage("User deleted.");
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">Loading users...</div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h3 mb-3">Admin Users</h2>

        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>Username</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.role || "USER"}</td>
                  <td>{user.verified ? "Yes" : "No"}</td>
                  <td>
                    <div className="d-flex gap-1">
                      {user.verified ? (
                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleUnverify(user.id)}>
                          Unverify
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleVerify(user.id)}>
                          Verify
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user.id)}
                        disabled={(user.role || "").toUpperCase() === "ADMIN"}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default AdminUsers;

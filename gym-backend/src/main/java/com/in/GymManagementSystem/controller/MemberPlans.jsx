import { useEffect, useState } from "react";
import { getAllMembers, createMember, updateMember, deleteMember } from "../services/MemberService";
import { getAllPlans } from "../services/PlanService";

function MemberPlans() {
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    planId: "",
    active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersData, plansData] = await Promise.all([
        getAllMembers(),
        getAllPlans()
      ]);
      setMembers(membersData);
      setPlans(plansData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const memberData = {
        ...formData,
        planId: formData.planId ? parseInt(formData.planId) : null
      };

      if (editingMember) {
        await updateMember(editingMember.id, memberData);
      } else {
        await createMember(memberData);
      }

      setShowForm(false);
      setEditingMember(null);
      setFormData({ name: "", email: "", phone: "", planId: "", active: true });
      fetchData();
    } catch (err) {
      setError("Failed to save member");
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email || "",
      phone: member.phone || "",
      planId: member.planId || "",
      active: member.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteMember(id);
        fetchData();
      } catch (err) {
        setError("Failed to delete member");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
    setFormData({ name: "", email: "", phone: "", planId: "", active: true });
  };

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h3 mb-3">Member Plans</h2>
          <p className="text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Member Plans</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add Member
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {showForm && (
          <div className="card bg-body-tertiary border-0 mb-3">
            <div className="card-body">
              <h3 className="h5 mb-3">{editingMember ? "Edit Member" : "Add New Member"}</h3>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Plan</label>
                    <select
                      className="form-select"
                      value={formData.planId}
                      onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    >
                      <option value="">No Plan</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - Rs {plan.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="activeCheck"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      />
                      <label className="form-check-label" htmlFor="activeCheck">
                        Active Member
                      </label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                      {editingMember ? "Update" : "Create"}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No members found. Add your first member!
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>{member.name}</td>
                    <td>{member.email || "-"}</td>
                    <td>{member.phone || "-"}</td>
                    <td>{member.planName || "No Plan"}</td>
                    <td>
                      <span className={`badge ${member.active ? "bg-success" : "bg-secondary"}`}>
                        {member.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(member)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(member.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default MemberPlans;


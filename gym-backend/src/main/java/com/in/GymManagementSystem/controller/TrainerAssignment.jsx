import { useEffect, useState } from "react";
import { getAllTrainers, createTrainer, updateTrainer, deleteTrainer } from "../services/TrainerService";
import { getAllMembers, assignTrainer, removeTrainer } from "../services/MemberService";

function TrainerAssignment() {
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [trainersData, membersData] = await Promise.all([
        getAllTrainers(),
        getAllMembers()
      ]);
      setTrainers(trainersData);
      setMembers(membersData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrainer) {
        await updateTrainer(editingTrainer.id, formData);
      } else {
        await createTrainer(formData);
      }

      setShowForm(false);
      setEditingTrainer(null);
      setFormData({ name: "", specialization: "", email: "", phone: "" });
      fetchData();
    } catch (err) {
      setError("Failed to save trainer");
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await assignTrainer(parseInt(selectedMember), parseInt(selectedTrainer));
      setShowAssignForm(false);
      setSelectedMember("");
      setSelectedTrainer("");
      fetchData();
    } catch (err) {
      setError("Failed to assign trainer");
    }
  };

  const handleEdit = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name,
      specialization: trainer.specialization || "",
      email: trainer.email || "",
      phone: trainer.phone || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this trainer?")) {
      try {
        await deleteTrainer(id);
        fetchData();
      } catch (err) {
        setError("Failed to delete trainer");
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTrainer(null);
    setFormData({ name: "", specialization: "", email: "", phone: "" });
  };

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h3 mb-3">Trainer Assignment</h2>
          <p className="text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Trainer Assignment</h2>
          <div>
            <button className="btn btn-primary me-2" onClick={() => setShowForm(true)}>
              Add Trainer
            </button>
            <button className="btn btn-outline-primary" onClick={() => setShowAssignForm(true)}>
              Assign Trainer to Member
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {showForm && (
          <div className="card bg-body-tertiary border-0 mb-3">
            <div className="card-body">
              <h3 className="h5 mb-3">{editingTrainer ? "Edit Trainer" : "Add New Trainer"}</h3>
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
                    <label className="form-label">Specialization</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
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
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                      {editingTrainer ? "Update" : "Create"}
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

        {showAssignForm && (
          <div className="card bg-body-tertiary border-0 mb-3">
            <div className="card-body">
              <h3 className="h5 mb-3">Assign Trainer to Member</h3>
              <form onSubmit={handleAssign}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Select Member *</label>
                    <select
                      className="form-select"
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                      required
                    >
                      <option value="">Choose member...</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Select Trainer *</label>
                    <select
                      className="form-select"
                      value={selectedTrainer}
                      onChange={(e) => setSelectedTrainer(e.target.value)}
                      required
                    >
                      <option value="">Choose trainer...</option>
                      {trainers.map((trainer) => (
                        <option key={trainer.id} value={trainer.id}>
                          {trainer.name} - {trainer.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                      Assign
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAssignForm(false);
                        setSelectedMember("");
                        setSelectedTrainer("");
                      }}
                    >
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
                <th>Specialization</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trainers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No trainers found. Add your first trainer!
                  </td>
                </tr>
              ) : (
                trainers.map((trainer) => (
                  <tr key={trainer.id}>
                    <td>{trainer.name}</td>
                    <td>{trainer.specialization || "-"}</td>
                    <td>{trainer.email || "-"}</td>
                    <td>{trainer.phone || "-"}</td>
                    <td>
                      <span className="badge bg-info">{trainer.memberCount || 0}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(trainer)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(trainer.id)}
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

export default TrainerAssignment;


import { useEffect, useState } from "react";
import {
  assignTrainerToMember,
  getMembers,
  removeTrainerFromMember,
} from "../services/MemberService";
import { createTrainer, deleteTrainer, getTrainers, updateTrainer } from "../services/TrainerService";

const emptyTrainerForm = {
  name: "",
  specialization: "",
  email: "",
  phone: "",
};

const emptyAssignmentForm = {
  memberId: "",
  trainerId: "",
};

const getErrorMessage = error => error?.response?.data?.message || "Something went wrong. Please try again.";
const isValidEmail = email => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);

function TrainerAssignment() {
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [trainerForm, setTrainerForm] = useState(emptyTrainerForm);
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignmentForm);
  const [editingTrainerId, setEditingTrainerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    const [trainerRes, memberRes] = await Promise.all([getTrainers(), getMembers()]);
    setTrainers(trainerRes);
    setMembers(memberRes);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await loadData();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const clearMessages = () => {
    setError("");
    setMessage("");
  };

  const handleTrainerSubmit = async e => {
    e.preventDefault();
    clearMessages();
    try {
      const payload = {
        name: trainerForm.name.trim(),
        specialization: trainerForm.specialization.trim(),
        email: trainerForm.email.trim(),
        phone: trainerForm.phone.trim(),
      };

      if (!payload.name) {
        setError("Trainer name is required.");
        return;
      }
      if (!payload.email) {
        setError("Trainer email is required.");
        return;
      }
      if (!isValidEmail(payload.email)) {
        setError("Please enter a valid trainer email.");
        return;
      }

      if (editingTrainerId) {
        await updateTrainer(editingTrainerId, payload);
        setMessage("Trainer updated.");
      } else {
        await createTrainer(payload);
        setMessage("Trainer created.");
      }

      setEditingTrainerId(null);
      setTrainerForm(emptyTrainerForm);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleTrainerEdit = trainer => {
    clearMessages();
    setEditingTrainerId(trainer.id);
    setTrainerForm({
      name: trainer.name || "",
      specialization: trainer.specialization || "",
      email: trainer.email || "",
      phone: trainer.phone || "",
    });
  };

  const handleTrainerDelete = async id => {
    clearMessages();
    try {
      await deleteTrainer(id);
      setMessage("Trainer deleted.");
      if (editingTrainerId === id) {
        setEditingTrainerId(null);
        setTrainerForm(emptyTrainerForm);
      }
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleAssignmentAction = async action => {
    clearMessages();
    const memberId = Number(assignmentForm.memberId);
    const trainerId = Number(assignmentForm.trainerId);

    if (!memberId || !trainerId) {
      setError("Select both member and trainer.");
      return;
    }

    try {
      if (action === "assign") {
        await assignTrainerToMember(memberId, trainerId);
        setMessage("Trainer assigned to member.");
      } else {
        await removeTrainerFromMember(memberId, trainerId);
        setMessage("Trainer removed from member.");
      }

      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">Loading trainers and members...</div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h3 mb-3">Trainer Assignment</h2>

        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="card border-0 bg-body-tertiary">
              <div className="card-body">
                <h3 className="h5 mb-3">{editingTrainerId ? "Edit Trainer" : "Create Trainer"}</h3>
                <form onSubmit={handleTrainerSubmit}>
                  <input
                    className="form-control mb-2"
                    placeholder="Name"
                    value={trainerForm.name}
                    onChange={e => setTrainerForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Specialization"
                    value={trainerForm.specialization}
                    onChange={e => setTrainerForm(prev => ({ ...prev, specialization: e.target.value }))}
                  />
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={trainerForm.email}
                        onChange={e => setTrainerForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        className="form-control"
                        placeholder="Phone"
                        value={trainerForm.phone}
                        onChange={e => setTrainerForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary me-2">
                    {editingTrainerId ? "Update Trainer" : "Create Trainer"}
                  </button>
                  {editingTrainerId ? (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setEditingTrainerId(null);
                        setTrainerForm(emptyTrainerForm);
                      }}
                    >
                      Cancel
                    </button>
                  ) : null}
                </form>
              </div>
            </div>

            <div className="table-responsive mt-3">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Specialization</th>
                    <th>Members</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {trainers.map(trainer => (
                    <tr key={trainer.id}>
                      <td>{trainer.name}</td>
                      <td>{trainer.specialization || "-"}</td>
                      <td>{trainer.memberCount ?? 0}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleTrainerEdit(trainer)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleTrainerDelete(trainer.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="card border-0 bg-body-tertiary">
              <div className="card-body">
                <h3 className="h5 mb-3">Assign / Remove Trainer</h3>
                <div className="row g-2 mb-3">
                  <div className="col-12">
                    <label className="form-label mb-1">Member</label>
                    <select
                      className="form-select"
                      value={assignmentForm.memberId}
                      onChange={e => setAssignmentForm(prev => ({ ...prev, memberId: e.target.value }))}
                    >
                      <option value="">Select member</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label mb-1">Trainer</label>
                    <select
                      className="form-select"
                      value={assignmentForm.trainerId}
                      onChange={e => setAssignmentForm(prev => ({ ...prev, trainerId: e.target.value }))}
                    >
                      <option value="">Select trainer</option>
                      {trainers.map(trainer => (
                        <option key={trainer.id} value={trainer.id}>
                          {trainer.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button className="btn btn-primary me-2" onClick={() => handleAssignmentAction("assign")}>
                  Assign
                </button>
                <button className="btn btn-outline-warning" onClick={() => handleAssignmentAction("remove")}>
                  Remove
                </button>
              </div>
            </div>

            <div className="table-responsive mt-3">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Plan</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.planName || "No Plan"}</td>
                      <td>{member.active ? "Active" : "Inactive"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrainerAssignment;

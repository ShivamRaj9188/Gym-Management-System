import { useEffect, useState } from "react";
import { createMember, deleteMember, getMembers, updateMember } from "../services/MemberService";
import { createPlan, deletePlan, getPlans, updatePlan } from "../services/PlanService";

const emptyPlanForm = {
  name: "",
  description: "",
  durationMonths: 1,
  price: 0,
  active: true,
};

const emptyMemberForm = {
  name: "",
  email: "",
  phone: "",
  planId: "",
  active: true,
};

const getErrorMessage = error => error?.response?.data?.message || "Something went wrong. Please try again.";

function MemberPlans() {
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    const [planRes, memberRes] = await Promise.all([getPlans(), getMembers()]);
    setPlans(planRes);
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

  const handlePlanSubmit = async e => {
    e.preventDefault();
    clearMessages();
    try {
      const payload = {
        name: planForm.name.trim(),
        description: planForm.description.trim(),
        durationMonths: Number(planForm.durationMonths),
        price: Number(planForm.price),
        active: Boolean(planForm.active),
      };

      if (!payload.name) {
        setError("Plan name is required.");
        return;
      }

      if (editingPlanId) {
        await updatePlan(editingPlanId, payload);
        setMessage("Plan updated.");
      } else {
        await createPlan(payload);
        setMessage("Plan created.");
      }

      setPlanForm(emptyPlanForm);
      setEditingPlanId(null);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handlePlanEdit = plan => {
    clearMessages();
    setEditingPlanId(plan.id);
    setPlanForm({
      name: plan.name || "",
      description: plan.description || "",
      durationMonths: plan.durationMonths ?? 1,
      price: plan.price ?? 0,
      active: Boolean(plan.active),
    });
  };

  const handlePlanDelete = async id => {
    clearMessages();
    try {
      await deletePlan(id);
      setMessage("Plan deleted.");
      if (editingPlanId === id) {
        setEditingPlanId(null);
        setPlanForm(emptyPlanForm);
      }
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleMemberSubmit = async e => {
    e.preventDefault();
    clearMessages();
    try {
      const payload = {
        name: memberForm.name.trim(),
        email: memberForm.email.trim(),
        phone: memberForm.phone.trim(),
        planId: memberForm.planId ? Number(memberForm.planId) : null,
        active: Boolean(memberForm.active),
      };

      if (!payload.name) {
        setError("Member name is required.");
        return;
      }

      if (editingMemberId) {
        await updateMember(editingMemberId, payload);
        setMessage("Member updated.");
      } else {
        await createMember(payload);
        setMessage("Member created.");
      }

      setMemberForm(emptyMemberForm);
      setEditingMemberId(null);
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleMemberEdit = member => {
    clearMessages();
    setEditingMemberId(member.id);
    setMemberForm({
      name: member.name || "",
      email: member.email || "",
      phone: member.phone || "",
      planId: member.planId?.toString() || "",
      active: Boolean(member.active),
    });
  };

  const handleMemberDelete = async id => {
    clearMessages();
    try {
      await deleteMember(id);
      setMessage("Member deleted.");
      if (editingMemberId === id) {
        setEditingMemberId(null);
        setMemberForm(emptyMemberForm);
      }
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">Loading members and plans...</div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h3 mb-3">Member Plans</h2>

        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="card border-0 bg-body-tertiary">
              <div className="card-body">
                <h3 className="h5 mb-3">{editingPlanId ? "Edit Plan" : "Create Plan"}</h3>
                <form onSubmit={handlePlanSubmit}>
                  <input
                    className="form-control mb-2"
                    placeholder="Plan name"
                    value={planForm.name}
                    onChange={e => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Description"
                    rows={2}
                    value={planForm.description}
                    onChange={e => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        placeholder="Duration (months)"
                        value={planForm.durationMonths}
                        onChange={e => setPlanForm(prev => ({ ...prev, durationMonths: e.target.value }))}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-control"
                        placeholder="Price"
                        value={planForm.price}
                        onChange={e => setPlanForm(prev => ({ ...prev, price: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-check mb-3">
                    <input
                      id="plan-active"
                      type="checkbox"
                      className="form-check-input"
                      checked={planForm.active}
                      onChange={e => setPlanForm(prev => ({ ...prev, active: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="plan-active">
                      Active
                    </label>
                  </div>
                  <button className="btn btn-primary me-2" type="submit">
                    {editingPlanId ? "Update Plan" : "Create Plan"}
                  </button>
                  {editingPlanId ? (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        setEditingPlanId(null);
                        setPlanForm(emptyPlanForm);
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
                    <th>Months</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan.id}>
                      <td>{plan.name}</td>
                      <td>{plan.durationMonths}</td>
                      <td>Rs {plan.price}</td>
                      <td>{plan.active ? "Active" : "Inactive"}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handlePlanEdit(plan)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handlePlanDelete(plan.id)}>
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
                <h3 className="h5 mb-3">{editingMemberId ? "Edit Member" : "Create Member"}</h3>
                <form onSubmit={handleMemberSubmit}>
                  <input
                    className="form-control mb-2"
                    placeholder="Member name"
                    value={memberForm.name}
                    onChange={e => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        className="form-control"
                        placeholder="Email"
                        value={memberForm.email}
                        onChange={e => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="col-6">
                      <input
                        className="form-control"
                        placeholder="Phone"
                        value={memberForm.phone}
                        onChange={e => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                  <select
                    className="form-select mb-2"
                    value={memberForm.planId}
                    onChange={e => setMemberForm(prev => ({ ...prev, planId: e.target.value }))}
                  >
                    <option value="">No Plan</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  <div className="form-check mb-3">
                    <input
                      id="member-active"
                      type="checkbox"
                      className="form-check-input"
                      checked={memberForm.active}
                      onChange={e => setMemberForm(prev => ({ ...prev, active: e.target.checked }))}
                    />
                    <label className="form-check-label" htmlFor="member-active">
                      Active
                    </label>
                  </div>
                  <button className="btn btn-primary me-2" type="submit">
                    {editingMemberId ? "Update Member" : "Create Member"}
                  </button>
                  {editingMemberId ? (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        setEditingMemberId(null);
                        setMemberForm(emptyMemberForm);
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
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map(member => (
                    <tr key={member.id}>
                      <td>{member.name}</td>
                      <td>{member.planName || "No Plan"}</td>
                      <td>{member.active ? "Active" : "Inactive"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-1"
                          onClick={() => handleMemberEdit(member)}
                        >
                          Edit
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleMemberDelete(member.id)}>
                          Delete
                        </button>
                      </td>
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

export default MemberPlans;

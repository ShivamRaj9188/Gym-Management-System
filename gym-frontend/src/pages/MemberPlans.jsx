import { useEffect, useState } from "react";
import { createMember, deleteMember, getMembers, updateMember, exportMembersToExcel, exportMembersToPdf } from "../services/MemberService";
import { createPlan, deletePlan, getActivePlans, getPlans, updatePlan } from "../services/PlanService";
import { isAdmin } from "../services/AuthService";
import { isValidEmail, isValidName, isValidPhone, isValidPlanName } from "../utils/validators";

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
  const [activePlans, setActivePlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [planForm, setPlanForm] = useState(emptyPlanForm);
  const [memberForm, setMemberForm] = useState(emptyMemberForm);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [planErrors, setPlanErrors] = useState({});
  const [memberErrors, setMemberErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [planPage, setPlanPage] = useState(0);
  const [planTotalPages, setPlanTotalPages] = useState(0);
  const [memberPage, setMemberPage] = useState(0);
  const [memberTotalPages, setMemberTotalPages] = useState(0);

  const loadData = async (pp = planPage, mp = memberPage) => {
    const [planRes, activePlanRes, memberRes] = await Promise.all([
      getPlans(pp),
      getActivePlans(),
      getMembers(mp),
    ]);
    setPlans(planRes.content || []);
    setPlanTotalPages(planRes.totalPages || 0);
    setActivePlans(activePlanRes);
    setMembers(memberRes.content || []);
    setMemberTotalPages(memberRes.totalPages || 0);
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
    setPlanErrors({});
    setMemberErrors({});
  };

  const handlePlanSubmit = async e => {
    e.preventDefault();
    clearMessages();
    try {
      const nextPlanErrors = {};
      const payload = {
        name: planForm.name.trim(),
        description: planForm.description.trim(),
        durationMonths: Number(planForm.durationMonths),
        price: Number(planForm.price),
        active: Boolean(planForm.active),
      };

      if (!payload.name) {
        nextPlanErrors.name = "Plan name is required.";
        setPlanErrors(nextPlanErrors);
        setError(nextPlanErrors.name);
        return;
      }
      if (!isValidPlanName(payload.name)) {
        nextPlanErrors.name = "Plan name must be 2-60 letters and can include single spaces, apostrophes, or hyphens.";
        setPlanErrors(nextPlanErrors);
        setError(nextPlanErrors.name);
        return;
      }
      if (!Number.isInteger(payload.durationMonths) || payload.durationMonths < 1 || payload.durationMonths > 60) {
        nextPlanErrors.durationMonths = "Plan duration must be between 1 and 60 months.";
        setPlanErrors(nextPlanErrors);
        setError(nextPlanErrors.durationMonths);
        return;
      }
      if (!Number.isFinite(payload.price) || payload.price < 1000) {
        nextPlanErrors.price = "Plan price must be at least 1000.";
        setPlanErrors(nextPlanErrors);
        setError(nextPlanErrors.price);
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
      const nextMemberErrors = {};
      const payload = {
        name: memberForm.name.trim(),
        email: memberForm.email.trim().toLowerCase(),
        phone: memberForm.phone.trim(),
        planId: memberForm.planId ? Number(memberForm.planId) : null,
        active: Boolean(memberForm.active),
      };

      if (!payload.name) {
        nextMemberErrors.name = "Member name is required.";
        setMemberErrors(nextMemberErrors);
        setError(nextMemberErrors.name);
        return;
      }
      if (!isValidName(payload.name)) {
        nextMemberErrors.name = "Member name must be 2-60 letters and can include single spaces, apostrophes, or hyphens.";
        setMemberErrors(nextMemberErrors);
        setError(nextMemberErrors.name);
        return;
      }
      if (!payload.email) {
        nextMemberErrors.email = "Member email is required.";
        setMemberErrors(nextMemberErrors);
        setError(nextMemberErrors.email);
        return;
      }
      if (!isValidEmail(payload.email)) {
        nextMemberErrors.email = "Member email format is invalid.";
        setMemberErrors(nextMemberErrors);
        setError(nextMemberErrors.email);
        return;
      }
      if (!payload.phone) {
        nextMemberErrors.phone = "Member phone is required.";
        setMemberErrors(nextMemberErrors);
        setError(nextMemberErrors.phone);
        return;
      }
      if (!isValidPhone(payload.phone)) {
        nextMemberErrors.phone = "Member phone must be a valid 10-digit number starting with 6-9.";
        setMemberErrors(nextMemberErrors);
        setError(nextMemberErrors.phone);
        return;
      }
      const duplicateMember = members.find(
        member =>
          member.id !== editingMemberId &&
          ((member.email || "").toLowerCase() === payload.email || (member.phone || "") === payload.phone)
      );
      if (duplicateMember) {
        if ((duplicateMember.email || "").toLowerCase() === payload.email) {
          nextMemberErrors.email = "Member email already exists.";
        } else {
          nextMemberErrors.phone = "Member phone already exists.";
        }
        setMemberErrors(nextMemberErrors);
        setError(nextMemberErrors.email || nextMemberErrors.phone);
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
                    className={`form-control mb-2 ${planErrors.name ? "is-invalid" : ""}`}
                    placeholder="Plan name"
                    maxLength={60}
                    value={planForm.name}
                    onChange={e => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  {planErrors.name ? <div className="invalid-feedback d-block mb-2">{planErrors.name}</div> : null}
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
                        max="60"
                        className={`form-control ${planErrors.durationMonths ? "is-invalid" : ""}`}
                        placeholder="Duration (months)"
                        value={planForm.durationMonths}
                        onChange={e => setPlanForm(prev => ({ ...prev, durationMonths: e.target.value }))}
                      />
                      {planErrors.durationMonths ? (
                        <div className="invalid-feedback d-block">{planErrors.durationMonths}</div>
                      ) : null}
                    </div>
                    <div className="col-6">
                      <input
                        type="number"
                        min="1000"
                        step="0.01"
                        className={`form-control ${planErrors.price ? "is-invalid" : ""}`}
                        placeholder="Price"
                        value={planForm.price}
                        onChange={e => setPlanForm(prev => ({ ...prev, price: e.target.value }))}
                      />
                      {planErrors.price ? <div className="invalid-feedback d-block">{planErrors.price}</div> : null}
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
            {planTotalPages > 1 && (
              <div className="pagination-controls">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={planPage === 0}
                  onClick={() => { setPlanPage(p => p - 1); loadData(planPage - 1, memberPage); }}
                >
                  Prev
                </button>
                <span className="page-info">Page {planPage + 1} of {planTotalPages}</span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={planPage >= planTotalPages - 1}
                  onClick={() => { setPlanPage(p => p + 1); loadData(planPage + 1, memberPage); }}
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="col-12 col-xl-6">
            <div className="card border-0 bg-body-tertiary">
              <div className="card-body">
                <h3 className="h5 mb-3">{editingMemberId ? "Edit Member" : "Create Member"}</h3>
                <form onSubmit={handleMemberSubmit}>
                  <input
                    className={`form-control mb-2 ${memberErrors.name ? "is-invalid" : ""}`}
                    placeholder="Member name"
                    maxLength={60}
                    value={memberForm.name}
                    onChange={e => setMemberForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                  {memberErrors.name ? <div className="invalid-feedback d-block mb-2">{memberErrors.name}</div> : null}
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        type="email"
                        className={`form-control ${memberErrors.email ? "is-invalid" : ""}`}
                        placeholder="Email"
                        maxLength={254}
                        value={memberForm.email}
                        onChange={e => setMemberForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                      {memberErrors.email ? <div className="invalid-feedback d-block">{memberErrors.email}</div> : null}
                    </div>
                    <div className="col-6">
                      <input
                        type="tel"
                        className={`form-control ${memberErrors.phone ? "is-invalid" : ""}`}
                        placeholder="Phone"
                        maxLength={10}
                        value={memberForm.phone}
                        onChange={e => setMemberForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                      {memberErrors.phone ? <div className="invalid-feedback d-block">{memberErrors.phone}</div> : null}
                    </div>
                  </div>
                  <select
                    className="form-select mb-2"
                    value={memberForm.planId}
                    onChange={e => setMemberForm(prev => ({ ...prev, planId: e.target.value }))}
                  >
                    <option value="">No Plan</option>
                    {activePlans.map(plan => (
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

            {isAdmin() && (
              <div className="card border-0 bg-body-tertiary mt-3">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <span className="fw-medium">Export All Members Data</span>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-danger" onClick={() => exportMembersToPdf()}>
                      Export PDF
                    </button>
                    <button className="btn btn-sm btn-outline-success" onClick={() => exportMembersToExcel()}>
                      Export Excel
                    </button>
                  </div>
                </div>
              </div>
            )}

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
            {memberTotalPages > 1 && (
              <div className="pagination-controls">
                <button className="btn btn-sm btn-outline-secondary" disabled={memberPage === 0} onClick={() => { setMemberPage(p => p - 1); loadData(memberPage - 1); }}>Prev</button>
                <span className="page-info">Page {memberPage + 1} of {memberTotalPages}</span>
                <button className="btn btn-sm btn-outline-secondary" disabled={memberPage >= memberTotalPages - 1} onClick={() => { setMemberPage(p => p + 1); loadData(memberPage + 1); }}>Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MemberPlans;

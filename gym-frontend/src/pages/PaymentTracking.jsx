import { useEffect, useState } from "react";
import { getMembers } from "../services/MemberService";
import { getPayments, getPaymentsByMember, getPaymentsByStatus, createPayment, updatePaymentStatus, deletePayment } from "../services/PaymentService";
import { getPlans } from "../services/PlanService";
import { isAdmin } from "../services/AuthService";
import { isValidPaymentMethod, isValidPaymentStatus } from "../utils/validators";

const emptyPaymentForm = {
  memberId: "",
  planId: "",
  amount: "",
  paymentDate: "",
  status: "PENDING",
  paymentMethod: "",
  dueDate: "",
};

const getErrorMessage = error => error?.response?.data?.message || "Something went wrong. Please try again.";
const getCurrentYear = () => new Date().getFullYear();
const isPastYearPayment = dateString => {
  if (!dateString) return false;
  const year = new Date(dateString).getFullYear();
  return year < getCurrentYear();
};
const isCurrentYear = dateString => {
  if (!dateString) return false;
  return new Date(dateString).getFullYear() === getCurrentYear();
};
const getYearStart = () => `${getCurrentYear()}-01-01`;
const getYearEnd = () => `${getCurrentYear()}-12-31`;

function PaymentTracking() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyPaymentForm);
  const [paymentErrors, setPaymentErrors] = useState({});
  const [statusFilter, setStatusFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadInitialData = async () => {
    const [paymentRes, memberRes, planRes] = await Promise.all([getPayments(), getMembers(), getPlans()]);
    setPayments(paymentRes);
    setMembers(memberRes);
    setPlans(planRes);
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await loadInitialData();
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  const clearMessages = () => {
    setMessage("");
    setError("");
    setPaymentErrors({});
  };

  const refreshPaymentsWithFilters = async () => {
    if (memberFilter) {
      const data = await getPaymentsByMember(Number(memberFilter));
      setPayments(data);
      return;
    }
    if (statusFilter) {
      const data = await getPaymentsByStatus(statusFilter);
      setPayments(data);
      return;
    }
    const data = await getPayments();
    setPayments(data);
  };

  const handleCreatePayment = async e => {
    e.preventDefault();
    clearMessages();
    try {
      const nextPaymentErrors = {};
      if (!form.memberId || !form.planId || !form.amount || !form.paymentDate || !form.status) {
        if (!form.memberId) nextPaymentErrors.memberId = "Member is required.";
        if (!form.planId) nextPaymentErrors.planId = "Plan is required.";
        if (!form.amount) nextPaymentErrors.amount = "Amount is required.";
        if (!form.paymentDate) nextPaymentErrors.paymentDate = "Payment date is required.";
        if (!form.status) nextPaymentErrors.status = "Status is required.";
        setPaymentErrors(nextPaymentErrors);
        setError("Member, plan, amount, date, and status are required.");
        return;
      }
      const amount = Number(form.amount);
      if (!Number.isFinite(amount) || amount <= 0) {
        nextPaymentErrors.amount = "Amount must be greater than zero.";
        setPaymentErrors(nextPaymentErrors);
        setError(nextPaymentErrors.amount);
        return;
      }
      const selectedPlan = plans.find(plan => Number(plan.id) === Number(form.planId));
      if (selectedPlan && amount < Number(selectedPlan.price)) {
        nextPaymentErrors.amount = `Amount cannot be less than selected plan price (Rs ${selectedPlan.price}).`;
        setPaymentErrors(nextPaymentErrors);
        setError(nextPaymentErrors.amount);
        return;
      }
      if (!isCurrentYear(form.paymentDate)) {
        nextPaymentErrors.paymentDate = "Only current year payments are allowed.";
        setPaymentErrors(nextPaymentErrors);
        setError(nextPaymentErrors.paymentDate);
        return;
      }
      if (!isValidPaymentStatus(form.status)) {
        nextPaymentErrors.status = "Invalid payment status.";
        setPaymentErrors(nextPaymentErrors);
        setError(nextPaymentErrors.status);
        return;
      }
      const normalizedMethod = form.paymentMethod.trim();
      if (normalizedMethod && !isValidPaymentMethod(normalizedMethod)) {
        nextPaymentErrors.paymentMethod = "Payment method must be CASH, CARD, or UPI.";
        setPaymentErrors(nextPaymentErrors);
        setError(nextPaymentErrors.paymentMethod);
        return;
      }
      if (form.dueDate && form.dueDate < form.paymentDate) {
        nextPaymentErrors.dueDate = "Due date cannot be before payment date.";
        setPaymentErrors(nextPaymentErrors);
        setError(nextPaymentErrors.dueDate);
        return;
      }

      await createPayment({
        memberId: Number(form.memberId),
        planId: Number(form.planId),
        amount,
        paymentDate: form.paymentDate,
        status: form.status,
        paymentMethod: normalizedMethod || null,
        dueDate: form.dueDate || null,
      });

      setForm(emptyPaymentForm);
      setMessage("Payment created.");
      await refreshPaymentsWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleStatusUpdate = async (payment, status) => {
    clearMessages();
    try {
      if (isPastYearPayment(payment.paymentDate)) {
        setError("Cannot update status for last year payments.");
        return;
      }
      if (!isValidPaymentStatus(status)) {
        setError("Invalid payment status.");
        return;
      }
      await updatePaymentStatus(payment.id, status);
      setMessage("Payment status updated.");
      await refreshPaymentsWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async id => {
    clearMessages();
    try {
      await deletePayment(id);
      setMessage("Payment deleted.");
      await refreshPaymentsWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const applyFilters = async () => {
    clearMessages();
    try {
      await refreshPaymentsWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const clearFilters = async () => {
    clearMessages();
    setStatusFilter("");
    setMemberFilter("");
    try {
      const data = await getPayments();
      setPayments(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">Loading payments...</div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h3 mb-3">Payment Tracking</h2>

        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="row g-4">
          <div className="col-12 col-xl-5">
            <div className="card border-0 bg-body-tertiary mb-3">
              <div className="card-body">
                <h3 className="h5 mb-3">Create Payment</h3>
                <form onSubmit={handleCreatePayment}>
                  <select
                    className={`form-select mb-2 ${paymentErrors.memberId ? "is-invalid" : ""}`}
                    value={form.memberId}
                    onChange={e => setForm(prev => ({ ...prev, memberId: e.target.value }))}
                  >
                    <option value="">Select member</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  {paymentErrors.memberId ? <div className="invalid-feedback d-block mb-2">{paymentErrors.memberId}</div> : null}
                  <select
                    className={`form-select mb-2 ${paymentErrors.planId ? "is-invalid" : ""}`}
                    value={form.planId}
                    onChange={e => setForm(prev => ({ ...prev, planId: e.target.value }))}
                  >
                    <option value="">Select plan</option>
                    {plans.map(plan => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                  {paymentErrors.planId ? <div className="invalid-feedback d-block mb-2">{paymentErrors.planId}</div> : null}
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        className={`form-control ${paymentErrors.amount ? "is-invalid" : ""}`}
                        placeholder="Amount"
                        value={form.amount}
                        onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                      />
                      {paymentErrors.amount ? <div className="invalid-feedback d-block">{paymentErrors.amount}</div> : null}
                    </div>
                    <div className="col-6">
                      <select
                        className={`form-select ${paymentErrors.status ? "is-invalid" : ""}`}
                        value={form.status}
                        onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                      {paymentErrors.status ? <div className="invalid-feedback d-block">{paymentErrors.status}</div> : null}
                    </div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label mb-1">Payment Date</label>
                      <input
                        type="date"
                        className={`form-control ${paymentErrors.paymentDate ? "is-invalid" : ""}`}
                        min={getYearStart()}
                        max={getYearEnd()}
                        value={form.paymentDate}
                        onChange={e => setForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                      />
                      {paymentErrors.paymentDate ? (
                        <div className="invalid-feedback d-block">{paymentErrors.paymentDate}</div>
                      ) : null}
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1">Due Date</label>
                      <input
                        type="date"
                        className={`form-control ${paymentErrors.dueDate ? "is-invalid" : ""}`}
                        min={form.paymentDate || undefined}
                        value={form.dueDate}
                        onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                      {paymentErrors.dueDate ? <div className="invalid-feedback d-block">{paymentErrors.dueDate}</div> : null}
                    </div>
                  </div>
                  <input
                    className={`form-control mb-3 ${paymentErrors.paymentMethod ? "is-invalid" : ""}`}
                    placeholder="Payment method (CASH/CARD/UPI)"
                    maxLength={10}
                    value={form.paymentMethod}
                    onChange={e => setForm(prev => ({ ...prev, paymentMethod: e.target.value.toUpperCase() }))}
                  />
                  {paymentErrors.paymentMethod ? (
                    <div className="invalid-feedback d-block mb-3">{paymentErrors.paymentMethod}</div>
                  ) : null}
                  <button type="submit" className="btn btn-primary">
                    Create Payment
                  </button>
                </form>
              </div>
            </div>

            <div className="card border-0 bg-body-tertiary">
              <div className="card-body">
                <h3 className="h5 mb-3">Filters</h3>
                <label className="form-label mb-1">Member</label>
                <select
                  className="form-select mb-2"
                  value={memberFilter}
                  onChange={e => setMemberFilter(e.target.value)}
                >
                  <option value="">All members</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
                <label className="form-label mb-1">Status</label>
                <select
                  className="form-select mb-3"
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="">All statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                  <option value="FAILED">FAILED</option>
                </select>
                <button className="btn btn-outline-primary me-2" onClick={applyFilters}>
                  Apply
                </button>
                <button className="btn btn-outline-secondary" onClick={clearFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-7">
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Plan</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Set Status</th>
                    {isAdmin() ? <th>Delete</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.memberName}</td>
                      <td>{payment.planName}</td>
                      <td>Rs {payment.amount}</td>
                      <td>{payment.paymentDate}</td>
                      <td>{payment.status}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleStatusUpdate(payment, "PAID")}
                            disabled={isPastYearPayment(payment.paymentDate)}
                          >
                            PAID
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleStatusUpdate(payment, "PENDING")}
                            disabled={isPastYearPayment(payment.paymentDate)}
                          >
                            PENDING
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleStatusUpdate(payment, "FAILED")}
                            disabled={isPastYearPayment(payment.paymentDate)}
                          >
                            FAILED
                          </button>
                        </div>
                      </td>
                      {isAdmin() ? (
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(payment.id)}>
                            Delete
                          </button>
                        </td>
                      ) : null}
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

export default PaymentTracking;

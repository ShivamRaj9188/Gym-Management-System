import { useEffect, useState } from "react";
import { getMembers } from "../services/MemberService";
import { getPayments, getPaymentsByMember, getPaymentsByStatus, createPayment, updatePaymentStatus } from "../services/PaymentService";
import { getPlans } from "../services/PlanService";

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

function PaymentTracking() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(emptyPaymentForm);
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
      if (!form.memberId || !form.planId || !form.amount || !form.paymentDate || !form.status) {
        setError("Member, plan, amount, date, and status are required.");
        return;
      }

      await createPayment({
        memberId: Number(form.memberId),
        planId: Number(form.planId),
        amount: Number(form.amount),
        paymentDate: form.paymentDate,
        status: form.status,
        paymentMethod: form.paymentMethod.trim() || null,
        dueDate: form.dueDate || null,
      });

      setForm(emptyPaymentForm);
      setMessage("Payment created.");
      await refreshPaymentsWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleStatusUpdate = async (paymentId, status) => {
    clearMessages();
    try {
      await updatePaymentStatus(paymentId, status);
      setMessage("Payment status updated.");
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
                    className="form-select mb-2"
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
                  <select
                    className="form-select mb-2"
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
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-control"
                        placeholder="Amount"
                        value={form.amount}
                        onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                      />
                    </div>
                    <div className="col-6">
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PAID">PAID</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                    </div>
                  </div>
                  <div className="row g-2 mb-2">
                    <div className="col-6">
                      <label className="form-label mb-1">Payment Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.paymentDate}
                        onChange={e => setForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1">Due Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={form.dueDate}
                        onChange={e => setForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                  </div>
                  <input
                    className="form-control mb-3"
                    placeholder="Payment method (cash/card/upi)"
                    value={form.paymentMethod}
                    onChange={e => setForm(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  />
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
                            onClick={() => handleStatusUpdate(payment.id, "PAID")}
                          >
                            PAID
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleStatusUpdate(payment.id, "PENDING")}
                          >
                            PENDING
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleStatusUpdate(payment.id, "FAILED")}
                          >
                            FAILED
                          </button>
                        </div>
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

export default PaymentTracking;

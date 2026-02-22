import { useEffect, useState } from "react";
import { getAllPayments, createPayment, updatePaymentStatus } from "../services/PaymentService";
import { getAllMembers } from "../services/MemberService";
import { getAllPlans } from "../services/PlanService";

function PaymentTracking() {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [formData, setFormData] = useState({
    memberId: "",
    planId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    status: "PAID",
    paymentMethod: "CASH",
    dueDate: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsData, membersData, plansData] = await Promise.all([
        getAllPayments(),
        getAllMembers(),
        getAllPlans()
      ]);
      setPayments(paymentsData);
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
      await createPayment({
        ...formData,
        memberId: parseInt(formData.memberId),
        planId: parseInt(formData.planId),
        amount: parseFloat(formData.amount)
      });

      setShowForm(false);
      setFormData({
        memberId: "",
        planId: "",
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        status: "PAID",
        paymentMethod: "CASH",
        dueDate: ""
      });
      fetchData();
    } catch (err) {
      setError("Failed to create payment");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updatePaymentStatus(id, newStatus);
      fetchData();
    } catch (err) {
      setError("Failed to update payment status");
    }
  };

  const filteredPayments = filterStatus === "ALL" 
    ? payments 
    : payments.filter(p => p.status === filterStatus);

  const totalRevenue = payments
    .filter(p => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h3 mb-3">Payment Tracking</h2>
          <p className="text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Payment Tracking</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Record Payment
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <div className="card bg-success text-white border-0">
              <div className="card-body">
                <p className="mb-1">Total Revenue</p>
                <h3 className="mb-0">Rs {totalRevenue.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-warning text-dark border-0">
              <div className="card-body">
                <p className="mb-1">Pending Payments</p>
                <h3 className="mb-0">Rs {pendingAmount.toFixed(2)}</h3>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-info text-white border-0">
              <div className="card-body">
                <p className="mb-1">Total Transactions</p>
                <h3 className="mb-0">{payments.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="card bg-body-tertiary border-0 mb-3">
            <div className="card-body">
              <h3 className="h5 mb-3">Record New Payment</h3>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Member *</label>
                    <select
                      className="form-select"
                      value={formData.memberId}
                      onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
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
                    <label className="form-label">Plan *</label>
                    <select
                      className="form-select"
                      value={formData.planId}
                      onChange={(e) => {
                        const plan = plans.find(p => p.id === parseInt(e.target.value));
                        setFormData({ 
                          ...formData, 
                          planId: e.target.value,
                          amount: plan ? plan.price.toString() : ""
                        });
                      }}
                      required
                    >
                      <option value="">Choose plan...</option>
                      {plans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name} - Rs {plan.price}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Amount *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Payment Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      <option value="PAID">Paid</option>
                      <option value="PENDING">Pending</option>
                      <option value="OVERDUE">Overdue</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-select"
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    >
                      <option value="CASH">Cash</option>
                      <option value="CARD">Card</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                      Record Payment
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowForm(false);
                        setFormData({
                          memberId: "",
                          planId: "",
                          amount: "",
                          paymentDate: new Date().toISOString().split("T")[0],
                          status: "PAID",
                          paymentMethod: "CASH",
                          dueDate: ""
                        });
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

        <div className="mb-3">
          <label className="form-label">Filter by Status</label>
          <select
            className="form-select"
            style={{ maxWidth: "200px" }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Payments</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No payment records found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>{payment.memberName}</td>
                    <td>{payment.planName}</td>
                    <td>Rs {payment.amount.toFixed(2)}</td>
                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                    <td>{payment.paymentMethod || "-"}</td>
                    <td>
                      <span
                        className={`badge ${
                          payment.status === "PAID"
                            ? "bg-success"
                            : payment.status === "PENDING"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.status !== "PAID" && (
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleStatusUpdate(payment.id, "PAID")}
                        >
                          Mark as Paid
                        </button>
                      )}
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

export default PaymentTracking;


import { useEffect, useState } from "react";
import {
  checkOutAttendance,
  createAttendance,
  deleteAttendance,
  getAttendance,
  getAttendanceByDate,
  getAttendanceByMember,
} from "../services/AttendanceService";
import { getMembers } from "../services/MemberService";
import { isAdmin } from "../services/AuthService";

const emptyAttendanceForm = {
  memberId: "",
  date: "",
  checkIn: "",
};

const getErrorMessage = error => error?.response?.data?.message || "Something went wrong. Please try again.";
const getTodayString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const isBeforeToday = dateString => dateString && dateString < getTodayString();

function Attendance() {
  const [attendanceRows, setAttendanceRows] = useState([]);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState(emptyAttendanceForm);
  const [dateFilter, setDateFilter] = useState("");
  const [memberFilter, setMemberFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadInitialData = async () => {
    const [attendanceRes, memberRes] = await Promise.all([getAttendance(), getMembers()]);
    setAttendanceRows(attendanceRes);
    setMembers(memberRes);
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

  const refreshAttendanceWithFilters = async () => {
    if (memberFilter) {
      const data = await getAttendanceByMember(Number(memberFilter));
      setAttendanceRows(data);
      return;
    }
    if (dateFilter) {
      const data = await getAttendanceByDate(dateFilter);
      setAttendanceRows(data);
      return;
    }
    const data = await getAttendance();
    setAttendanceRows(data);
  };

  const handleCreateAttendance = async e => {
    e.preventDefault();
    clearMessages();
    try {
      if (!form.memberId) {
        setError("Please select a member.");
        return;
      }
      if (form.date && isBeforeToday(form.date)) {
        setError("Attendance cannot be marked for past dates.");
        return;
      }

      await createAttendance({
        memberId: Number(form.memberId),
        date: form.date || null,
        checkIn: form.checkIn || null,
      });

      setMessage("Attendance marked.");
      setForm(emptyAttendanceForm);
      await refreshAttendanceWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleCheckOut = async row => {
    clearMessages();
    try {
      if (row.date && isBeforeToday(row.date)) {
        setError("Attendance checkout is only allowed for today.");
        return;
      }
      await checkOutAttendance(row.id);
      setMessage("Checkout time updated.");
      await refreshAttendanceWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async id => {
    clearMessages();
    try {
      await deleteAttendance(id);
      setMessage("Attendance deleted.");
      await refreshAttendanceWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const applyFilters = async () => {
    clearMessages();
    try {
      await refreshAttendanceWithFilters();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const clearFilters = async () => {
    clearMessages();
    setDateFilter("");
    setMemberFilter("");
    try {
      const data = await getAttendance();
      setAttendanceRows(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">Loading attendance data...</div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h3 mb-3">Attendance Management</h2>

        {message ? <div className="alert alert-success">{message}</div> : null}
        {error ? <div className="alert alert-danger">{error}</div> : null}

        <div className="row g-4">
          <div className="col-12 col-xl-5">
            <div className="card border-0 bg-body-tertiary mb-3">
              <div className="card-body">
                <h3 className="h5 mb-3">Mark Check-In</h3>
                <form onSubmit={handleCreateAttendance}>
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
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label mb-1">Date (optional)</label>
                      <input
                        type="date"
                        className="form-control"
                        min={getTodayString()}
                        value={form.date}
                        onChange={e => setForm(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label mb-1">Check-in (optional)</label>
                      <input
                        type="time"
                        className="form-control"
                        value={form.checkIn}
                        onChange={e => setForm(prev => ({ ...prev, checkIn: e.target.value }))}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Mark Attendance
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
                <label className="form-label mb-1">Date</label>
                <input type="date" className="form-control mb-3" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
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
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Action</th>
                    {isAdmin() ? <th>Delete</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {attendanceRows.map(row => (
                    <tr key={row.id}>
                      <td>{row.memberName}</td>
                      <td>{row.date}</td>
                      <td>{row.checkIn || "-"}</td>
                      <td>{row.checkOut || "-"}</td>
                      <td>
                        {row.checkOut ? (
                          <span className="badge text-bg-success">Completed</span>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleCheckOut(row)}
                            disabled={isBeforeToday(row.date)}
                          >
                            Check Out
                          </button>
                        )}
                      </td>
                      {isAdmin() ? (
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(row.id)}>
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

export default Attendance;

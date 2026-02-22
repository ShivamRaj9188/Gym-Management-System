import { useEffect, useState } from "react";
import { getAllAttendance, getAttendanceByDate, createAttendance, checkOut } from "../services/AttendanceService";
import { getAllMembers } from "../services/MemberService";

function Attendance() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      const [attendanceData, membersData] = await Promise.all([
        getAttendanceByDate(selectedDate),
        getAllMembers()
      ]);
      setAttendanceList(attendanceData);
      setMembers(membersData);
      setLoading(false);
    } catch (err) {
      setError("Failed to load data");
      setLoading(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    try {
      await createAttendance({
        memberId: parseInt(selectedMember),
        date: selectedDate,
        checkIn: null,
        checkOut: null
      });
      setShowCheckIn(false);
      setSelectedMember("");
      fetchData();
    } catch (err) {
      setError("Failed to check in");
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await checkOut(id);
      fetchData();
    } catch (err) {
      setError("Failed to check out");
    }
  };

  const formatTime = (time) => {
    if (!time) return "-";
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h3 mb-3">Attendance Management</h2>
          <p className="text-muted">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h3 mb-0">Attendance Management</h2>
          <button className="btn btn-primary" onClick={() => setShowCheckIn(true)}>
            Check In Member
          </button>
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Select Date</label>
          <input
            type="date"
            className="form-control"
            style={{ maxWidth: "200px" }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {showCheckIn && (
          <div className="card bg-body-tertiary border-0 mb-3">
            <div className="card-body">
              <h3 className="h5 mb-3">Check In Member</h3>
              <form onSubmit={handleCheckIn}>
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
                      {members
                        .filter((m) => m.active)
                        .map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} - {member.planName || "No Plan"}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                      Check In
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowCheckIn(false);
                        setSelectedMember("");
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

        <div className="alert alert-info" role="alert">
          <strong>Today's Attendance:</strong> {attendanceList.length} members checked in
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No attendance records for this date
                  </td>
                </tr>
              ) : (
                attendanceList.map((record) => (
                  <tr key={record.id}>
                    <td>{record.memberName}</td>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
                    <td>{formatTime(record.checkIn)}</td>
                    <td>{formatTime(record.checkOut)}</td>
                    <td>
                      {record.checkOut ? (
                        <span className="badge bg-success">Checked Out</span>
                      ) : (
                        <span className="badge bg-warning text-dark">In Gym</span>
                      )}
                    </td>
                    <td>
                      {!record.checkOut && (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleCheckOut(record.id)}
                        >
                          Check Out
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

export default Attendance;


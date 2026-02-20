import { useEffect, useState } from "react";
import { getDashboardData } from "../services/HomeService";

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardData()
      .then(res => {
        setData(res);
      })
      .catch(() => {
        setError("Unable to load dashboard right now.");
      });
  }, []);

  if (error) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h3 mb-3">Dashboard</h2>
          <p className="text-muted mb-0">{error}</p>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h3 mb-3">Dashboard</h2>
          <p className="text-muted mb-0">Loading dashboard data...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body p-4">
        <h2 className="h3 mb-3">Dashboard Overview</h2>

        <div className="row g-3">
          <div className="col-12 col-md-6 col-xl-3">
            <article className="card h-100 bg-body-tertiary border-0">
              <div className="card-body">
                <p className="text-muted mb-1">Total Members</p>
                <p className="h2 mb-0">{data.totalMembers}</p>
              </div>
            </article>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <article className="card h-100 bg-body-tertiary border-0">
              <div className="card-body">
                <p className="text-muted mb-1">Active Members</p>
                <p className="h2 mb-0">{data.activeMembers}</p>
              </div>
            </article>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <article className="card h-100 bg-body-tertiary border-0">
              <div className="card-body">
                <p className="text-muted mb-1">Total Trainers</p>
                <p className="h2 mb-0">{data.totalTrainers}</p>
              </div>
            </article>
          </div>
          <div className="col-12 col-md-6 col-xl-3">
            <article className="card h-100 bg-body-tertiary border-0">
              <div className="card-body">
                <p className="text-muted mb-1">Today Attendance</p>
                <p className="h2 mb-0">{data.todayAttendance}</p>
              </div>
            </article>
          </div>
          <div className="col-12 col-xl-6">
            <article className="card h-100 bg-body-tertiary border-0">
              <div className="card-body">
                <p className="text-muted mb-1">Total Revenue</p>
                <p className="h2 mb-0">Rs {data.totalRevenue}</p>
              </div>
            </article>
          </div>
        </div>

        <div className="alert alert-secondary mt-3 mb-0" role="alert">
          <h3 className="h5 mb-2">Quick Notes</h3>
          <p className="mb-0 text-secondary">
            Use Member Plans for subscription updates, Attendance for daily logs, and Payment Tracking to verify due
            collections.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;

import { useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import MemberPlans from "./pages/MemberPlans";
import TrainerAssignment from "./pages/TrainerAssignment";
import Attendance from "./pages/Attendance";
import PaymentTracking from "./pages/PaymentTracking";
import AdminUsers from "./pages/AdminUsers";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { isAuthenticated } from "./services/AuthService";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const syncAuth = () => setIsLoggedIn(isAuthenticated());
    window.addEventListener("auth-changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("auth-changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return (
    <div className="container-fluid min-vh-100 py-4 app-shell">
      <div className="container">
        <header className="card border-0 text-white mb-3 hero-card">
          <div className="card-body p-4">
            <div className="row align-items-center g-3">
              <div className="col-12 col-lg-7">
                <p className="text-uppercase text-white-50 small mb-2">Operational Command Center</p>
                <h1 className="display-6 fw-bold mb-2">Gym Management System</h1>
                <p className="mb-3 text-white-50">
                  Run memberships, trainers, attendance, and payments with a single high-performance dashboard.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge text-bg-dark border border-light-subtle">Live Attendance</span>
                  <span className="badge text-bg-dark border border-light-subtle">Revenue Tracking</span>
                  <span className="badge text-bg-dark border border-light-subtle">Member Insights</span>
                </div>
              </div>
              <div className="col-12 col-lg-5 text-lg-end">
                <div className="d-inline-flex flex-column gap-2">
                  <span className="text-white-50 small">Peak Performance Mode</span>
                  <span className="h1 fw-bold text-white">24/7</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Navbar isLoggedIn={isLoggedIn} />

        <main className="mt-3">
          {!isLoggedIn ? (
            <section className="alert alert-info border-0 shadow-sm mb-3" role="alert">
              Login to access all modules: Dashboard, Member Plans, Trainer Assignment, Attendance, and Payments.
            </section>
          ) : null}
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/members"
              element={
                <ProtectedRoute>
                  <MemberPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainers"
              element={
                <ProtectedRoute>
                  <TrainerAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <PaymentTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

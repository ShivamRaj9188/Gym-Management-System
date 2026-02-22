import { useEffect, useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import MemberPlans from "./pages/MemberPlans";
import TrainerAssignment from "./pages/TrainerAssignment";
import Attendance from "./pages/Attendance";
import PaymentTracking from "./pages/PaymentTracking";
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
    <div className="container-fluid min-vh-100 bg-light py-4">
      <div className="container">
        <header className="card border-0 shadow-sm bg-dark text-white mb-3">
          <div className="card-body p-4">
            <h1 className="h2 mb-2">Gym Management System</h1>
            <p className="mb-0 text-white-50">Track members, staff, attendance, and payments in one place.</p>
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

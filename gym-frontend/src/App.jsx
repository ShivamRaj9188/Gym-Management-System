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
  const isLoggedIn = isAuthenticated();

  return (
    <div className="container-fluid min-vh-100 bg-light py-4">
      <div className="container">
        <header className="card border-0 shadow-sm bg-dark text-white mb-3">
          <div className="card-body p-4">
            <h1 className="h2 mb-2">Gym Management System</h1>
            <p className="mb-0 text-white-50">Track members, staff, attendance, and payments in one place.</p>
          </div>
        </header>

        <Navbar />

        <main className="mt-3">
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

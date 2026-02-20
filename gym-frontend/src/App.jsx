import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import MemberPlans from "./pages/MemberPlans";
import TrainerAssignment from "./pages/TrainerAssignment";
import Attendance from "./pages/Attendance";
import PaymentTracking from "./pages/PaymentTracking";

function App() {
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/members" element={<MemberPlans />} />
            <Route path="/trainers" element={<TrainerAssignment />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payments" element={<PaymentTracking />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;

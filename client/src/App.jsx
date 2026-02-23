import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Login from './components/auth/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeList from './components/employees/EmployeeList';
import AttendanceBoard from './components/attendance/AttendanceBoard';
import AttendanceHistory from './components/attendance/AttendanceHistory';
import LeaveList from './components/leave/LeaveList';
import LeaveApproval from './components/leave/LeaveApproval';
import ReportDashboard from './components/reports/ReportDashboard';
import { useAuth } from './hooks/useAuth';

const AppLayout = ({ children }) => (
  <div className="min-h-screen bg-slate-50">
    <Navbar />
    <div className="mx-auto flex max-w-7xl px-4 py-4">
      <Sidebar />
      <main className="flex-1 rounded-xl bg-white p-5 shadow-sm">{children}</main>
    </div>
  </div>
);

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/attendance" element={<AttendanceBoard />} />
                <Route path="/attendance/history" element={<AttendanceHistory />} />
                <Route path="/leaves" element={<LeaveList />} />
                <Route path="/leaves/approvals" element={<LeaveApproval />} />
                <Route path="/reports" element={<ReportDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;

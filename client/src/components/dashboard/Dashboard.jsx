import { useEffect, useState } from 'react';
import StatCard from './StatCard';
import AttendanceChart from './AttendanceChart';
import Loader from '../common/Loader';
import { getDashboardStats } from '../../services/reportService';

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => setStats(null));
  }, []);

  if (!stats) return <Loader />;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Employees" value={stats.employeesTotal} />
        <StatCard label="Active Employees" value={stats.activeEmployees} />
        <StatCard label="Pending Leaves" value={stats.pendingLeaves} />
        <StatCard label="Approved Leaves" value={stats.approvedLeaves} />
      </div>
      <AttendanceChart summary={stats.todayAttendance} />
    </div>
  );
}

export default Dashboard;

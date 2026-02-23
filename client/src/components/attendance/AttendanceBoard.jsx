import { useAttendance } from '../../hooks/useAttendance';
import Loader from '../common/Loader';
import AttendanceCard from './AttendanceCard';
import MarkAttendance from './MarkAttendance';

function AttendanceBoard() {
  const { today, loading, refreshToday } = useAttendance();

  if (loading) return <Loader />;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Today Attendance</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded bg-green-50 p-3 text-green-700">Present: {today.summary.present}</div>
        <div className="rounded bg-red-50 p-3 text-red-700">Absent: {today.summary.absent}</div>
        <div className="rounded bg-yellow-50 p-3 text-yellow-700">Leave: {today.summary.leave}</div>
      </div>
      <MarkAttendance onSaved={refreshToday} />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {today.data.map((record) => (
          <AttendanceCard key={record._id} record={record} />
        ))}
      </div>
    </section>
  );
}

export default AttendanceBoard;

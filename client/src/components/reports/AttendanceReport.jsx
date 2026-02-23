function AttendanceReport({ summary }) {
  return (
    <div className="rounded border p-4">
      <h3 className="font-semibold">Attendance Report</h3>
      <p className="text-sm">Total: {summary.total || 0}</p>
      <p className="text-sm">Present: {summary.present || 0}</p>
      <p className="text-sm">Absent: {summary.absent || 0}</p>
      <p className="text-sm">Leave: {summary.leave || 0}</p>
    </div>
  );
}

export default AttendanceReport;

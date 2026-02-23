function LeaveReport({ summary }) {
  return (
    <div className="rounded border p-4">
      <h3 className="font-semibold">Leave Report</h3>
      <p className="text-sm">Total Requests: {summary.total || 0}</p>
      <p className="text-sm">Approved: {summary.byStatus?.approved || 0}</p>
      <p className="text-sm">Pending: {summary.byStatus?.pending || 0}</p>
      <p className="text-sm">Rejected: {summary.byStatus?.rejected || 0}</p>
    </div>
  );
}

export default LeaveReport;

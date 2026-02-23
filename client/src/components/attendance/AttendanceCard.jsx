function AttendanceCard({ record }) {
  return (
    <div className="rounded border border-slate-200 p-3 text-sm">
      <p className="font-medium">{record.employeeId?.firstName} {record.employeeId?.lastName}</p>
      <p>Status: <span className="uppercase">{record.status}</span></p>
      <p>In: {record.clockIn || '-'} / Out: {record.clockOut || '-'}</p>
    </div>
  );
}

export default AttendanceCard;

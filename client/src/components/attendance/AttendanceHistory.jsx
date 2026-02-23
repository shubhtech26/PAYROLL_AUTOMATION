import { useEffect, useState } from 'react';
import { getAttendance } from '../../services/attendanceService';
import { formatDate } from '../../utils/dateHelpers';

function AttendanceHistory() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    getAttendance({ limit: 50 })
      .then((response) => setRecords(response.data || []))
      .catch(() => setRecords([]));
  }, []);

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">Attendance History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Date</th>
              <th className="p-2">Employee</th>
              <th className="p-2">Status</th>
              <th className="p-2">Hours</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id} className="border-b">
                <td className="p-2">{formatDate(record.date)}</td>
                <td className="p-2">{record.employeeId?.firstName} {record.employeeId?.lastName}</td>
                <td className="p-2 uppercase">{record.status}</td>
                <td className="p-2">{record.hoursWorked || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AttendanceHistory;

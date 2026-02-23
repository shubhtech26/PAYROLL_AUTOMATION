import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getAttendanceReport, getLeaveReport } from '../../services/reportService';
import AttendanceReport from './AttendanceReport';
import LeaveReport from './LeaveReport';
import ExportButton from './ExportButton';

function ReportDashboard() {
  const [attendanceSummary, setAttendanceSummary] = useState({});
  const [leaveSummary, setLeaveSummary] = useState({});

  useEffect(() => {
    getAttendanceReport().then((response) => setAttendanceSummary(response.summary || {}));
    getLeaveReport().then((response) => setLeaveSummary(response.summary || {}));
  }, []);

  const exportCsv = async (type) => {
    const response = await api.post(
      '/reports/export',
      { type },
      {
        responseType: 'blob',
      }
    );
    const url = window.URL.createObjectURL(response.data);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${type}-report.csv`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
      <div className="flex gap-2">
        <ExportButton label="Export Attendance" onClick={() => exportCsv('attendance')} />
        <ExportButton label="Export Leave" onClick={() => exportCsv('leave')} />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <AttendanceReport summary={attendanceSummary} />
        <LeaveReport summary={leaveSummary} />
      </div>
    </section>
  );
}

export default ReportDashboard;

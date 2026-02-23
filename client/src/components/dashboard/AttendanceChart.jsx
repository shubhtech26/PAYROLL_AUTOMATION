import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function AttendanceChart({ summary }) {
  const data = [
    { name: 'Present', value: summary.present || 0 },
    { name: 'Absent', value: summary.absent || 0 },
    { name: 'Leave', value: summary.leave || 0 },
  ];

  return (
    <div className="h-64 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-medium">Today Attendance Mix</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#667eea" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AttendanceChart;

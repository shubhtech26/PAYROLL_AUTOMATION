function StatCard({ label, value, color = 'indigo' }) {
  const colorClassMap = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${colorClassMap[color] || 'text-indigo-600'}`}>{value}</p>
    </div>
  );
}

export default StatCard;

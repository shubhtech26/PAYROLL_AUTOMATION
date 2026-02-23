function EmployeeCard({ employee }) {
  return (
    <div className="rounded border border-slate-200 p-3">
      <p className="font-medium">{employee.firstName} {employee.lastName}</p>
      <p className="text-sm text-slate-600">{employee.employeeId} · {employee.department}</p>
      <p className="text-xs uppercase text-slate-500">{employee.role}</p>
    </div>
  );
}

export default EmployeeCard;

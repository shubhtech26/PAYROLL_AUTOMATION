function EmployeeDetail({ employee }) {
  if (!employee) return <p className="text-sm text-slate-500">Select employee</p>;
  return (
    <div className="rounded border border-slate-200 p-4">
      <h3 className="font-semibold">Employee Profile</h3>
      <p className="text-sm">Name: {employee.firstName} {employee.lastName}</p>
      <p className="text-sm">Email: {employee.email}</p>
      <p className="text-sm">Position: {employee.position || '-'}</p>
      <p className="text-sm">Status: {employee.status}</p>
    </div>
  );
}

export default EmployeeDetail;

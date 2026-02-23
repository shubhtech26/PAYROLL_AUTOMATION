function EmployeeSearch({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search by name, email, employee ID"
      className="w-full rounded border px-3 py-2"
    />
  );
}

export default EmployeeSearch;

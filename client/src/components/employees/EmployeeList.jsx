import { useEffect, useState } from 'react';
import EmployeeCard from './EmployeeCard';
import EmployeeSearch from './EmployeeSearch';
import EmployeeForm from './EmployeeForm';
import Loader from '../common/Loader';
import { getEmployees } from '../../services/employeeService';
import { useAuth } from '../../hooks/useAuth';

function EmployeeList() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await getEmployees({ search });
      setEmployees(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [search]);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Employees</h2>
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <EmployeeForm canAssignRole={user.role === 'admin'} onCreated={loadEmployees} />
      )}
      <EmployeeSearch value={search} onChange={setSearch} />
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {employees.map((employee) => (
            <EmployeeCard key={employee._id} employee={employee} />
          ))}
          {employees.length === 0 && <p className="text-sm text-slate-500">No employees found.</p>}
        </div>
      )}
    </section>
  );
}

export default EmployeeList;

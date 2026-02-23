import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createEmployee } from '../../services/employeeService';
import { DEPARTMENTS } from '../../utils/constants';

function EmployeeForm({ canAssignRole, onCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: 'employee',
      department: 'Operations',
      status: 'active',
    },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (values) => {
    try {
      setError('');
      setSuccess('');
      await createEmployee(values);
      setSuccess('Employee added successfully');
      reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        employeeId: '',
        position: '',
        role: 'employee',
        department: 'Operations',
        status: 'active',
      });
      if (onCreated) onCreated();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to create employee');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-3 text-lg font-semibold">Add Employee</h3>

      {error && <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      {success && <p className="mb-3 rounded bg-green-50 p-2 text-sm text-green-700">{success}</p>}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <input className="rounded border px-3 py-2" placeholder="First Name" {...register('firstName', { required: 'First name required' })} />
        <input className="rounded border px-3 py-2" placeholder="Last Name" {...register('lastName', { required: 'Last name required' })} />
        <input className="rounded border px-3 py-2" placeholder="Employee ID (e.g. WLAB-101)" {...register('employeeId', { required: 'Employee ID required' })} />

        <input className="rounded border px-3 py-2" type="email" placeholder="Email" {...register('email', { required: 'Email required' })} />
        <input className="rounded border px-3 py-2" type="password" placeholder="Temporary Password" {...register('password', { required: 'Password required', minLength: 6 })} />
        <input className="rounded border px-3 py-2" placeholder="Position" {...register('position')} />

        <select className="rounded border px-3 py-2" {...register('department')}>
          {DEPARTMENTS.map((department) => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        {canAssignRole ? (
          <select className="rounded border px-3 py-2" {...register('role')}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
          </select>
        ) : (
          <input type="hidden" value="employee" {...register('role')} />
        )}

        <select className="rounded border px-3 py-2" {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {(errors.firstName || errors.lastName || errors.employeeId || errors.email || errors.password) && (
        <p className="mt-2 text-xs text-red-600">
          {errors.firstName?.message || errors.lastName?.message || errors.employeeId?.message || errors.email?.message || errors.password?.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
      >
        {isSubmitting ? 'Adding...' : 'Add Employee'}
      </button>
    </form>
  );
}

export default EmployeeForm;

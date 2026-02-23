import { useForm } from 'react-hook-form';
import { createLeave } from '../../services/leaveService';
import { LEAVE_TYPES } from '../../utils/constants';

function LeaveRequestForm({ onSubmitted }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const submit = async (values) => {
    await createLeave(values);
    reset();
    onSubmitted();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-2 rounded border border-slate-200 p-3 md:grid-cols-4">
      <select className="rounded border px-2 py-1" {...register('leaveType')}>
        {LEAVE_TYPES.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <input className="rounded border px-2 py-1" type="date" {...register('startDate', { required: true })} />
      <input className="rounded border px-2 py-1" type="date" {...register('endDate', { required: true })} />
      <input className="rounded border px-2 py-1" placeholder="Reason" {...register('reason')} />
      <button type="submit" disabled={isSubmitting} className="rounded bg-indigo-600 px-3 py-2 text-white md:col-span-4">
        Submit Leave Request
      </button>
    </form>
  );
}

export default LeaveRequestForm;

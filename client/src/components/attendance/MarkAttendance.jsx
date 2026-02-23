import { useForm } from 'react-hook-form';
import { markAttendance } from '../../services/attendanceService';
import { ATTENDANCE_STATUS } from '../../utils/constants';

function MarkAttendance({ onSaved }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: { date: new Date().toISOString().slice(0, 10), status: 'present' },
  });

  const submit = async (values) => {
    await markAttendance(values);
    reset({ ...values, clockIn: '', clockOut: '', notes: '' });
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid grid-cols-1 gap-2 rounded border border-slate-200 p-3 md:grid-cols-5">
      <input className="rounded border px-2 py-1" placeholder="Employee ObjectId" {...register('employeeId', { required: true })} />
      <input className="rounded border px-2 py-1" type="date" {...register('date', { required: true })} />
      <select className="rounded border px-2 py-1" {...register('status')}>
        {ATTENDANCE_STATUS.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <input className="rounded border px-2 py-1" placeholder="Clock In HH:mm" {...register('clockIn')} />
      <input className="rounded border px-2 py-1" placeholder="Clock Out HH:mm" {...register('clockOut')} />
      <textarea className="rounded border px-2 py-1 md:col-span-4" placeholder="Notes" {...register('notes')} />
      <button className="rounded bg-indigo-600 px-3 py-2 text-white" type="submit" disabled={isSubmitting}>
        Save Attendance
      </button>
    </form>
  );
}

export default MarkAttendance;

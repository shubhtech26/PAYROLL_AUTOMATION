import { useEffect, useState } from 'react';
import { approveLeave, getPendingLeaves, rejectLeave } from '../../services/leaveService';

function LeaveApproval() {
  const [pendingLeaves, setPendingLeaves] = useState([]);

  const loadPending = async () => {
    const data = await getPendingLeaves();
    setPendingLeaves(data);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (id) => {
    await approveLeave(id);
    loadPending();
  };

  const handleReject = async (id) => {
    await rejectLeave(id, 'Insufficient staffing');
    loadPending();
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Leave Approvals</h2>
      {pendingLeaves.map((leave) => (
        <div key={leave._id} className="flex items-center justify-between rounded border p-3">
          <div>
            <p className="font-medium">{leave.employeeId?.firstName} {leave.employeeId?.lastName}</p>
            <p className="text-sm text-slate-600">{leave.leaveType} · {leave.numberOfDays} day(s)</p>
          </div>
          <div className="flex gap-2">
            <button className="rounded bg-green-600 px-3 py-1 text-white" onClick={() => handleApprove(leave._id)}>Approve</button>
            <button className="rounded bg-red-600 px-3 py-1 text-white" onClick={() => handleReject(leave._id)}>Reject</button>
          </div>
        </div>
      ))}
      {pendingLeaves.length === 0 && <p className="text-sm text-slate-500">No pending leaves.</p>}
    </section>
  );
}

export default LeaveApproval;

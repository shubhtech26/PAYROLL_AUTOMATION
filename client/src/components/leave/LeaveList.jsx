import { useEffect, useState } from 'react';
import LeaveRequestForm from './LeaveRequestForm';
import { getLeaves } from '../../services/leaveService';
import { formatDate } from '../../utils/dateHelpers';

function LeaveList() {
  const [leaves, setLeaves] = useState([]);

  const loadLeaves = async () => {
    const response = await getLeaves();
    setLeaves(response.data || []);
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Leave Requests</h2>
      <LeaveRequestForm onSubmitted={loadLeaves} />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Employee</th>
              <th className="p-2">Type</th>
              <th className="p-2">Dates</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id} className="border-b">
                <td className="p-2">{leave.employeeId?.firstName} {leave.employeeId?.lastName}</td>
                <td className="p-2 uppercase">{leave.leaveType}</td>
                <td className="p-2">{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</td>
                <td className="p-2 uppercase">{leave.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default LeaveList;

import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/employees', label: 'Employees' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/attendance/history', label: 'Attendance History' },
  { to: '/leaves', label: 'Leave Requests' },
  { to: '/leaves/approvals', label: 'Leave Approvals' },
  { to: '/reports', label: 'Reports' },
];

function Sidebar() {
  return (
    <aside className="mr-4 hidden w-64 flex-shrink-0 rounded-xl bg-white p-3 shadow-sm lg:block">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm ${
                isActive ? 'bg-indigo-100 font-medium text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

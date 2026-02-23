import { useAuth } from '../../hooks/useAuth';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-primaryStart to-primaryEnd px-6 py-4 text-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <h1 className="text-lg font-semibold">Water Lab Attendance Tracker</h1>
        <div className="flex items-center gap-4 text-sm">
          <span>{user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Guest'}</span>
          {user && (
            <button
              type="button"
              className="rounded bg-white/20 px-3 py-1 hover:bg-white/30"
              onClick={logout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

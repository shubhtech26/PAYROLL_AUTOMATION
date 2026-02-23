import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';

function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const onSubmit = async (values) => {
    try {
      setError('');
      await login(values);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form className="w-full max-w-md rounded-xl bg-white p-6 shadow" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="mb-5 text-2xl font-semibold">Sign in</h2>
        <ErrorMessage message={error} />

        <label className="mb-1 block text-sm font-medium">Email</label>
        <input
          className="mb-2 w-full rounded border px-3 py-2"
          type="email"
          {...register('email', { required: 'Email required' })}
        />
        <p className="mb-3 text-xs text-red-600">{errors.email?.message}</p>

        <label className="mb-1 block text-sm font-medium">Password</label>
        <input
          className="mb-2 w-full rounded border px-3 py-2"
          type="password"
          {...register('password', { required: 'Password required' })}
        />
        <p className="mb-4 text-xs text-red-600">{errors.password?.message}</p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Login'}
        </button>
        <p className="mt-3 text-xs text-slate-500">Seed admin: admin@waterlab.com / Admin@123</p>
      </form>
    </div>
  );
}

export default Login;

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { loginUser } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await loginUser(form);
      setAuth(data);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-zinc-900">Sign in</h1>
        <p className="text-sm text-zinc-500">
          Welcome back. Sign in to access your account and track orders.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wide text-zinc-500" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="text-center text-sm text-zinc-500">
        New to ShopSphere?{' '}
        <Link href="/register" className="font-medium text-zinc-900">
          Create an account
        </Link>
      </p>
    </div>
  );
}

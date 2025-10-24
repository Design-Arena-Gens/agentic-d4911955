'use client';

import Link from 'next/link';
import { useState } from 'react';
import { registerUser, resendEmailVerification, requestPhoneVerification, verifyPhone } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const { token } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneStatus, setPhoneStatus] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await registerUser(form);
      setAuth(data);
      setEmailStatus('Verification email sent. Check your inbox.');
      if (form.phoneNumber) {
        setPhoneStatus('SMS verification sent. Enter the code below.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      await resendEmailVerification(token);
      setEmailStatus('Verification email re-sent.');
    } catch (err) {
      setEmailStatus(err.message);
    }
  };

  const handleRequestPhone = async () => {
    try {
      await requestPhoneVerification(token, { phoneNumber: form.phoneNumber });
      setPhoneStatus('Verification code sent.');
    } catch (err) {
      setPhoneStatus(err.message);
    }
  };

  const handleVerifyPhone = async () => {
    try {
      await verifyPhone(token, { code: phoneCode });
      setPhoneStatus('Phone verified successfully.');
    } catch (err) {
      setPhoneStatus(err.message);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold text-zinc-900">Create account</h1>
        <p className="text-sm text-zinc-500">Sign up to manage orders and track deliveries.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        {['name', 'email', 'phoneNumber', 'password'].map((field) => (
          <div key={field} className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500" htmlFor={field}>
              {field === 'phoneNumber' ? 'Phone number' : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              id={field}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              required={field !== 'phoneNumber'}
              value={form[field]}
              onChange={(event) => setForm({ ...form, [field]: event.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
            />
          </div>
        ))}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      {emailStatus && <p className="text-center text-sm text-emerald-600">{emailStatus}</p>}
      {token && (
        <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <button
            onClick={handleResendEmail}
            className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
          >
            Resend email verification
          </button>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handleRequestPhone}
                className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
                type="button"
              >
                Send phone OTP
              </button>
              <input
                value={phoneCode}
                onChange={(event) => setPhoneCode(event.target.value)}
                placeholder="Enter code"
                className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
              />
              <button
                onClick={handleVerifyPhone}
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
                type="button"
              >
                Verify
              </button>
            </div>
            {phoneStatus && <p className="text-sm text-emerald-600">{phoneStatus}</p>}
          </div>
        </div>
      )}
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-zinc-900">
          Sign in
        </Link>
      </p>
    </div>
  );
}

'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyEmailToken } from '../../lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('Verifying email...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('Missing verification token.');
        return;
      }
      try {
        await verifyEmailToken(token);
        setStatus('Email verified successfully. You can close this tab.');
      } catch (err) {
        setStatus(err.message);
      }
    };
    verify();
  }, [token]);

  return (
    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">Email verification</h1>
      <p className="mt-4 text-sm text-zinc-600">{status}</p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Email verification</h1>
          <p className="mt-4 text-sm text-zinc-600">Preparing verification...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { createOrder } from '../../lib/api';

const initialForm = {
  fullName: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: ''
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCartStore();
  const { token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      router.push('/login');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await createOrder(token, {
        items: items.map((item) => ({ productId: item.id, qty: item.qty })),
        shippingAddress: form
      });
      clear();
      router.push('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = items.length === 0 || isSubmitting;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr,1fr]">
      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Checkout</h1>
          <p className="text-sm text-zinc-500">Enter shipping details to finalize your order.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.entries(form).map(([key, value]) => (
            <div key={key} className={key === 'addressLine2' ? 'sm:col-span-2' : undefined}>
              <label htmlFor={key} className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                id={key}
                value={value}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                required={key !== 'addressLine2'}
                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              />
            </div>
          ))}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? 'Processing...' : `Place order (${items.length} items)`}
        </button>
      </form>

      <aside className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Order summary</h2>
        <div className="space-y-2 text-sm text-zinc-600">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.title} × {item.qty}
              </span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-base font-semibold text-zinc-900">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {!token && (
          <p className="text-xs text-zinc-500">
            You need to sign in to place orders. Your cart will be preserved.
          </p>
        )}
      </aside>
    </div>
  );
}

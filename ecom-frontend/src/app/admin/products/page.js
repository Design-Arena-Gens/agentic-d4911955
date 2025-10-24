'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/authStore';
import { adminCreateProduct } from '../../../lib/api';

const defaultForm = {
  title: '',
  slug: '',
  description: '',
  price: '',
  images: '',
  category: '',
  stock: '',
  attributes: ''
};

export default function AdminProductsPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const [form, setForm] = useState(defaultForm);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [token, user, router]);

  if (!token || (user && user.role !== 'admin')) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        description: form.description,
        price: Number(form.price),
        images: form.images.split(',').map((item) => item.trim()).filter(Boolean),
        category: form.category,
        stock: Number(form.stock),
        attributes: form.attributes
          ? Object.fromEntries(
              form.attributes.split(',').map((pair) => {
                const [key, value] = pair.split(':');
                return [key.trim(), (value || '').trim()];
              })
            )
          : undefined
      };
      await adminCreateProduct(token, payload);
      setStatus('Product created successfully.');
      setForm(defaultForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">Admin – Add product</h1>
        <p className="text-sm text-zinc-500">Publish new products and enrich metadata for discovery.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        {Object.entries(form).map(([field, value]) => (
          <div key={field} className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wide text-zinc-500" htmlFor={field}>
              {field}
            </label>
            <textarea
              id={field}
              value={value}
              onChange={(event) => setForm({ ...form, [field]: event.target.value })}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10"
              rows={field === 'description' ? 4 : 2}
            />
            {field === 'images' && (
              <p className="text-xs text-zinc-500">Comma-separated image URLs</p>
            )}
            {field === 'attributes' && (
              <p className="text-xs text-zinc-500">Format: key:value,key:value</p>
            )}
          </div>
        ))}
        {status && <p className="text-sm text-emerald-600">{status}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? 'Publishing...' : 'Publish product'}
        </button>
      </form>
    </div>
  );
}

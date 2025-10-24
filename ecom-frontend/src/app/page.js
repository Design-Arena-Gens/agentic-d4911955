'use client';

import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';

export default function Home() {
  const { products, isLoading } = useProducts();

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 p-10 text-white shadow-xl">
        <h1 className="text-4xl font-semibold md:text-5xl">Elevate your everyday essentials</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-200">
          Discover curated products tailored to your lifestyle. Seamless checkout, real-time order
          tracking, and smart inventory alerts keep you in the loop.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 text-sm font-medium">
          <Link
            href="/products"
            className="rounded-full bg-white px-5 py-2 text-zinc-900 transition hover:bg-zinc-200"
          >
            Shop collection
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-white px-5 py-2 text-white transition hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-zinc-900">Latest arrivals</h2>
          <Link href="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
            Browse all
          </Link>
        </div>
        {isLoading ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
            Loading products...
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
            No products found.
          </div>
        )}
      </section>
    </div>
  );
}

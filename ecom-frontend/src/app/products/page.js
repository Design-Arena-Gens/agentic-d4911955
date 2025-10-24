'use client';

import { useState } from 'react';
import ProductCard from '../../components/ProductCard';
import { useProducts } from '../../hooks/useProducts';

export default function ProductsPage() {
  const { products, isLoading } = useProducts();
  const [search, setSearch] = useState('');

  const filtered = products.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">Products</h1>
          <p className="text-sm text-zinc-600">Browse the latest additions to the catalog.</p>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products"
          className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm shadow-sm focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 md:w-64"
        />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          Loading products...
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          No products matched your search.
        </div>
      )}
    </div>
  );
}

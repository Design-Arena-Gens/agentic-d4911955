'use client';

import { notFound, useParams } from 'next/navigation';
import { useProduct } from '../../../hooks/useProducts';
import { useCartStore } from '../../../store/cartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const { product, isLoading } = useProduct(productId);
  const addToCart = useCartStore((state) => state.addToCart);

  if (!productId) {
    return notFound();
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
        Product unavailable.
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr,1.1fr]">
      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.title} className="w-full object-cover" />
        ) : (
          <div className="flex h-72 items-center justify-center text-sm text-zinc-500">
            No image available
          </div>
        )}
      </div>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900">{product.title}</h1>
          <p className="mt-2 text-sm uppercase tracking-wide text-zinc-500">
            {product.category || 'Uncategorized'}
          </p>
        </div>
        <p className="text-base leading-relaxed text-zinc-600">{product.description}</p>
        <div className="flex items-center gap-6">
          <div className="text-3xl font-semibold text-zinc-900">${product.price.toFixed(2)}</div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
            {product.stock > 0 ? 'In stock' : 'Out of stock'}
          </span>
        </div>
        <button
          disabled={product.stock <= 0}
          onClick={() => addToCart(product, 1)}
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          Add to cart
        </button>
        {product.attributes && product.attributes.size > 0 && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Details
            </h2>
            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm text-zinc-600 md:grid-cols-2">
              {Array.from(product.attributes.entries()).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 rounded-lg border border-zinc-200 bg-white px-3 py-2">
                  <dt className="font-medium text-zinc-500">{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}

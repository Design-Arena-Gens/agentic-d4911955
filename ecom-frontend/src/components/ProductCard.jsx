'use client';

import Link from 'next/link';
import { useCartStore } from '../store/cartStore';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <div className="flex h-full flex-col rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-zinc-100">
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500">
            No image
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <Link href={`/products/${product._id}`} className="text-lg font-semibold text-zinc-900">
          {product.title}
        </Link>
        <p className="mt-2 flex-1 text-sm text-zinc-600">{product.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-zinc-900">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => addToCart(product, 1)}
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCartStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-zinc-900">Your cart</h1>
        <Link href="/products" className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row md:items-center"
              >
                <div>
                  <h2 className="text-lg font-semibold text-zinc-900">{item.title}</h2>
                  <p className="text-sm text-zinc-500">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-sm text-zinc-500" htmlFor={`qty-${item.id}`}>
                    Qty
                  </label>
                  <input
                    id={`qty-${item.id}`}
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(event) => updateQty(item.id, Number(event.target.value))}
                    className="w-20 rounded-full border border-zinc-300 px-3 py-1 text-sm focus:border-zinc-900 focus:outline-none"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="rounded-full border border-zinc-300 px-3 py-1 text-sm text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Summary</h2>
            <div className="flex justify-between text-sm text-zinc-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-zinc-600">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-zinc-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="block rounded-full bg-zinc-900 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

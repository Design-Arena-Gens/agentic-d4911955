'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchOrders } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export default function OrdersPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    const loadOrders = async () => {
      try {
        const data = await fetchOrders(token);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900">Orders</h1>
        <p className="text-sm text-zinc-500">Track purchases and view fulfillment status.</p>
      </div>
      {loading ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          Loading orders...
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
          You have no orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="space-y-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-wide text-zinc-500">Order ID</p>
                  <p className="font-mono text-sm text-zinc-900">{order._id}</p>
                </div>
                <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                  {order.status}
                </span>
              </div>
              <div className="space-y-2 text-sm text-zinc-600">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>
                      {item.productId?.title || 'Item'} × {item.qty}
                    </span>
                    <span>${(item.priceAtPurchase * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm text-zinc-500">
                <span>Placed</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-zinc-900">
                <span>Total</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

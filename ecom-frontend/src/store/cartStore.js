'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const calculateTotals = (items) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return {
    subtotal,
    totalItems: items.reduce((sum, item) => sum + item.qty, 0)
  };
};

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      totalItems: 0,
      addToCart: (product, qty = 1) => {
        const existing = get().items.find((item) => item.id === product._id);
        let items;
        if (existing) {
          items = get().items.map((item) =>
            item.id === product._id ? { ...item, qty: item.qty + qty } : item
          );
        } else {
          items = [
            ...get().items,
            {
              id: product._id,
              title: product.title,
              price: product.price,
              image: product.images?.[0],
              qty
            }
          ];
        }

        const totals = calculateTotals(items);
        set({ items, ...totals });
      },
      updateQty: (id, qty) => {
        const items = get().items.map((item) =>
          item.id === id ? { ...item, qty } : item
        );
        const totals = calculateTotals(items);
        set({ items, ...totals });
      },
      removeItem: (id) => {
        const items = get().items.filter((item) => item.id !== id);
        const totals = calculateTotals(items);
        set({ items, ...totals });
      },
      clear: () => set({ items: [], subtotal: 0, totalItems: 0 })
    }),
    {
      name: 'cart-storage'
    }
  )
);

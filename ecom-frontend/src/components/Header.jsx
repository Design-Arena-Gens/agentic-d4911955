'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/cart', label: 'Cart' }
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCartStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold text-zinc-900">
          ShopSphere
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? 'text-zinc-900'
                  : 'transition hover:text-zinc-900'
              }
            >
              {link.label}
              {link.href === '/cart' && totalItems > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-zinc-900 px-1 text-xs text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          ))}
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/orders" className="hover:text-zinc-900">
                Orders
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin/products" className="hover:text-zinc-900">
                  Admin
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="rounded-full border border-zinc-300 px-3 py-1 text-sm transition hover:border-zinc-900 hover:text-zinc-900"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="hover:text-zinc-900">
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-zinc-900 px-3 py-1 text-sm text-white transition hover:bg-zinc-700"
              >
                Create account
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

"use client0";

import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <Link href="/admin/dashboard" className="block hover:text-gray-300">
          Dashboard
        </Link>
        <Link href="/admin/products" className="block hover:text-gray-300">
          Products
        </Link>
        <Link href="/admin/users" className="block hover:text-gray-300">
          Users
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar
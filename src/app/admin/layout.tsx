import { ReactNode } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-100 p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <div className="space-y-4 flex-grow">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start">Dashboard</Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="ghost" className="w-full justify-start">Categories</Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="ghost" className="w-full justify-start">Products</Button>
          </Link>
          <Link href="/admin/users">
            <Button variant="ghost" className="w-full justify-start">Users</Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="w-full justify-start">Orders</Button>
          </Link>
        </div>
        <Link href="/" className="mt-auto">
          <Button className="w-full">Back to POS</Button>
        </Link>
      </nav>
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}


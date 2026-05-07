'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      
      // Fetch user role from database
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      setRole(data?.role || 'patron')
      setLoading(false)
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const navigationItems = {
    entertainer: [
      { label: 'Check In', href: '/entertainer/check-in' },
      { label: 'My Schedule', href: '/entertainer/schedule' },
      { label: 'Safety Tools', href: '/entertainer/safety' },
    ],
    patron: [
      { label: 'Browse Clubs', href: '/patron/discover' },
      { label: 'My Favorites', href: '/patron/favorites' },
      { label: 'Stage View', href: '/patron/stage-view' },
    ],
    manager: [
      { label: 'Lineup Manager', href: '/admin/lineup' },
      { label: 'Club Settings', href: '/admin/settings' },
      { label: 'Reports', href: '/admin/reports' },
    ],
  }

  const items = navigationItems[role as keyof typeof navigationItems] || navigationItems.patron

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">UpNext</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            {role === 'entertainer' && '🎭 Entertainer Dashboard'}
            {role === 'patron' && '🎫 Patron Dashboard'}
            {role === 'manager' && '👨‍💼 Manager Dashboard'}
          </h2>
          <p className="text-gray-600">
            {role === 'entertainer' && 'Manage your schedule and safety features'}
            {role === 'patron' && 'Discover clubs and follow your favorite entertainers'}
            {role === 'manager' && 'Manage your club lineup and operations'}
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow hover:bg-blue-50"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.label}</h3>
              <p className="text-gray-600 text-sm">Navigate to {item.label.toLowerCase()}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}

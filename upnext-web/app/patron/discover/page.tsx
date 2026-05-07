'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Link from 'next/link'

interface Club {
  id: number
  name: string
  address: string
  is_partner: boolean
}

export default function PatronDiscoveryPage() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const fetchClubs = async () => {
      const supabase = createClient()
      
      const { data } = await supabase
        .from('clubs')
        .select('*')
        .eq('is_partner', true)

      setClubs(data as Club[] || [])
      setLoading(false)
    }

    fetchClubs()
  }, [])

  const toggleFavorite = (clubId: number) => {
    setFavorites(prev =>
      prev.includes(clubId)
        ? prev.filter(id => id !== clubId)
        : [...prev, clubId]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎫 Discover Clubs</h1>
          <p className="text-gray-600">Find your favorite entertainers and clubs</p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Club Image Placeholder */}
              <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-4xl">
                🏢
              </div>

              {/* Club Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{club.name}</h3>
                    <p className="text-gray-600 text-sm flex items-center gap-1 mt-1">
                      📍 {club.address}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleFavorite(club.id)}
                    className={`text-2xl transition-transform transform hover:scale-110 ${
                      favorites.includes(club.id) ? '⭐' : '☆'
                    }`}
                  >
                    {favorites.includes(club.id) ? '⭐' : '☆'}
                  </button>
                </div>

                {/* Badge */}
                {club.is_partner && (
                  <div className="mb-4 inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                    ✓ Partner Club
                  </div>
                )}

                {/* View Lineup Button */}
                <Link
                  href={`/patron/stage-view?clubId=${club.id}`}
                  className="block w-full px-4 py-3 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Lineup →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {clubs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No partner clubs found yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface Entertainer {
  id: number
  stage_name: string
  is_premium: boolean
}

interface LineupItem {
  id: number
  entertainer_id: number
  sort_order: number
  estimated_start: string
  entertainer: Entertainer
}

export default function StageViewPage() {
  const [lineup, setLineup] = useState<LineupItem[]>([])
  const [loading, setLoading] = useState(true)
  const [clubId, setClubId] = useState<number>(1) // Default to first club

  useEffect(() => {
    const fetchLineup = async () => {
      const supabase = createClient()
      
      const { data } = await supabase
        .from('lineups')
        .select(`
          id,
          entertainer_id,
          sort_order,
          estimated_start,
          entertainer:entertainer_profiles(
            id,
            stage_name,
            is_premium
          )
        `)
        .eq('club_id', clubId)
        .order('sort_order', { ascending: true })

      setLineup(data as LineupItem[] || [])
      setLoading(false)
    }

    fetchLineup()

    // Subscribe to real-time updates
    const supabase = createClient()
    const subscription = supabase
      .channel('lineups')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lineups' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLineup(prev => [...prev, payload.new as LineupItem])
          } else if (payload.eventType === 'UPDATE') {
            setLineup(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as LineupItem : item
            ))
          } else if (payload.eventType === 'DELETE') {
            setLineup(prev => prev.filter(item => item.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [clubId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            🎭 The Emerald Lounge
          </h1>
          <p className="text-purple-300 mt-2">High Energy Vibe</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Now Playing */}
        {lineup.length > 0 && (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg p-8 text-white shadow-2xl">
              <div className="text-sm uppercase tracking-widest mb-2 opacity-90">Now Playing</div>
              <h2 className="text-5xl font-bold mb-4">{lineup[0]?.entertainer?.stage_name}</h2>
              <div className="flex items-center gap-4">
                <span className="inline-block px-4 py-2 bg-green-400 text-black rounded-full font-bold text-sm">
                  ON STAGE NOW
                </span>
                <button className="px-6 py-3 bg-white text-pink-600 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                  💰 Tip Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Up Next Queue */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Up Next</h3>
          <div className="space-y-4">
            {lineup.slice(1).map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-purple-400">#{index + 2}</div>
                    <div>
                      <h4 className="text-xl font-bold text-white flex items-center gap-2">
                        {item.entertainer?.stage_name}
                        {item.entertainer?.is_premium && (
                          <span className="text-yellow-400">⭐</span>
                        )}
                      </h4>
                      <p className="text-purple-300 text-sm">
                        In approximately {10 + index * 15} minutes
                      </p>
                    </div>
                  </div>
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-2xl">
                    🎭
                  </div>
                </div>
                <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                    style={{ width: `${(index + 1) * 15}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Follow House Lineup */}
        <div className="mt-12">
          <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-colors">
            ⭐ Follow This Lineup
          </button>
        </div>
      </main>
    </div>
  )
}

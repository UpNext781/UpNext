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
  const [clubId] = useState<number>(1) // Hardcoded to 1 for initial build

  // Helper function to fetch the full lineup including performer names
  const fetchLineup = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
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

    if (error) {
      console.error('Fetch error:', error)
    } else {
      setLineup(data as unknown as LineupItem[] || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLineup()

    // Subscribe to real-time updates from Supabase
    const supabase = createClient()
    const subscription = supabase
      .channel('lineup-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lineups' },
        () => {
          console.log('Change detected in lineup table - Refreshing...')
          fetchLineup() // Re-fetch to get the full profile objects
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [clubId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-purple-500/20 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            🎭 The Emerald Lounge
          </h1>
          <p className="text-purple-300 mt-2">Verified Real-Time Lineup</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Now Playing Section */}
        {lineup.length > 0 ? (
          <div className="mb-12">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-8 shadow-2xl border border-white/10">
              <div className="text-sm uppercase tracking-widest mb-2 text-white/80">On Stage Now</div>
              <h2 className="text-6xl font-black mb-6">
                {lineup[0].entertainer?.stage_name || 'TBA'}
              </h2>
              <div className="flex items-center gap-4">
                <span className="bg-green-400 text-black px-4 py-2 rounded-full font-bold text-xs animate-pulse">
                  LIVE
                </span>
                <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all">
                  💰 Tip Performer
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800/20 rounded-2xl border border-dashed border-gray-700">
            <p className="text-gray-400">No performers currently scheduled.</p>
          </div>
        )}

        {/* Up Next Queue */}
        {lineup.length > 1 && (
          <div>
            <h3 className="text-2xl font-bold mb-6 text-purple-200">Coming Up</h3>
            <div className="space-y-4">
              {lineup.slice(1).map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 flex items-center justify-between hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-4xl font-black text-purple-500/50">#{index + 2}</div>
                    <div>
                      <h4 className="text-2xl font-bold">
                        {item.entertainer?.stage_name}
                        {item.entertainer?.is_premium && <span className="ml-2">⭐</span>}
                      </h4>
                      <p className="text-purple-400 text-sm mt-1">Ready in ~{15 + index * 15} mins</p>
                    </div>
                  </div>
                  <div className="hidden sm:block text-5xl opacity-20">🎭</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

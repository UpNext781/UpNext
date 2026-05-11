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
  const [clubId] = useState<number>(1)

  const fetchLineup = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('lineups')
      .select(`
        id, entertainer_id, sort_order, estimated_start,
        entertainer:entertainer_profiles(id, stage_name, is_premium)
      `)
      .eq('club_id', clubId)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase Sync Error:', error)
    } else {
      setLineup(data as unknown as LineupItem[] || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchLineup()

    const supabase = createClient()
    const subscription = supabase
      .channel('lineup-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lineups' },
        () => {
          console.log('Lineup modified - Refreshing View...');
          fetchLineup(); 
        }
      )
      .subscribe()

    return () => { subscription.unsubscribe() }
  }, [clubId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">The Emerald Lounge</h1>
      {lineup.length > 0 ? (
        <div className="bg-purple-600 p-8 rounded-2xl mb-8">
          <p className="uppercase text-xs font-bold opacity-80">On Stage Now</p>
          <h2 className="text-5xl font-black">{lineup[0].entertainer?.stage_name || 'TBA'}</h2>
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-700">The stage is clear.</div>
      )}
    </div>
  )
}

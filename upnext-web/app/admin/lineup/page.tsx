'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface LineupItem {
  id: number
  entertainer_id: number
  sort_order: number
  estimated_start: string
  entertainer: any
}

export default function LineupManagerPage() {
  const [lineup, setLineup] = useState<LineupItem[]>([])
  const [loading, setLoading] = useState(true)
  const [entertainers, setEntertainers] = useState<any[]>([])
  const [selectedEntertainer, setSelectedEntertainer] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Fetch entertainers
      const { data: entertainersData } = await supabase
        .from('entertainer_profiles')
        .select('*')

      setEntertainers(entertainersData || [])

      // Fetch current lineup
      const { data: lineupData } = await supabase
        .from('lineups')
        .select(`
          id,
          entertainer_id,
          sort_order,
          estimated_start,
          entertainer:entertainer_profiles(*)
        `)
        .eq('club_id', 1)
        .order('sort_order', { ascending: true })

      setLineup(lineupData as LineupItem[] || [])
      setLoading(false)
    }

    fetchData()
  }, [])

  const handleAddEntertainer = async () => {
    if (!selectedEntertainer) return

    const supabase = createClient()
    const newSortOrder = Math.max(...lineup.map(l => l.sort_order), 0) + 1

    const { data } = await supabase
      .from('lineups')
      .insert([
        {
          club_id: 1,
          entertainer_id: selectedEntertainer,
          sort_order: newSortOrder,
        },
      ])
      .select()

    if (data) {
      setLineup([...lineup, data[0] as LineupItem])
      setSelectedEntertainer(null)
    }
  }

  const handleRemoveEntertainer = async (id: number) => {
    const supabase = createClient()
    await supabase.from('lineups').delete().eq('id', id)
    setLineup(lineup.filter(item => item.id !== id))
  }

  const handleReorder = async (id: number, newPosition: number) => {
    if (newPosition < 0 || newPosition >= lineup.length) return

    const supabase = createClient()
    const newLineup = [...lineup]
    const itemIndex = newLineup.findIndex(l => l.id === id)
    const [movedItem] = newLineup.splice(itemIndex, 1)
    newLineup.splice(newPosition, 0, movedItem)

    // Update sort orders
    const updates = newLineup.map((item, index) => ({
      id: item.id,
      sort_order: index + 1,
    }))

    for (const update of updates) {
      await supabase
        .from('lineups')
        .update({ sort_order: update.sort_order })
        .eq('id', update.id)
    }

    setLineup(newLineup)
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lineup Manager</h1>
          <p className="text-gray-600">Manage the performance schedule for your club</p>
        </div>

        {/* Add Entertainer */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Add Performer</h2>
          <div className="flex gap-3">
            <select
              value={selectedEntertainer || ''}
              onChange={(e) => setSelectedEntertainer(Number(e.target.value))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select an entertainer...</option>
              {entertainers
                .filter(e => !lineup.some(l => l.entertainer_id === e.id))
                .map((entertainer) => (
                  <option key={entertainer.id} value={entertainer.id}>
                    {entertainer.stage_name}
                  </option>
                ))}
            </select>
            <button
              onClick={handleAddEntertainer}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add to Lineup
            </button>
          </div>
        </div>

        {/* Current Lineup */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Current Lineup</h2>
          {lineup.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No performers scheduled</p>
          ) : (
            <div className="space-y-3">
              {lineup.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-blue-600 w-8 text-center">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {item.entertainer?.stage_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.entertainer?.is_premium && '⭐ Premium'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {index > 0 && (
                      <button
                        onClick={() => handleReorder(item.id, index - 1)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        ↑
                      </button>
                    )}
                    {index < lineup.length - 1 && (
                      <button
                        onClick={() => handleReorder(item.id, index + 1)}
                        className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                      >
                        ↓
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveEntertainer(item.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

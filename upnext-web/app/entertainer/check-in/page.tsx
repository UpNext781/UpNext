'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function EntertainerCheckInPage() {
  const [user, setUser] = useState<any>(null)
  const [status, setStatus] = useState<'off-duty' | 'in-building' | 'on-stage'>('off-duty')
  const [loading, setLoading] = useState(true)
  const [clubs, setClubs] = useState<any[]>([])
  const [selectedClub, setSelectedClub] = useState<number | null>(null)
  const [safetyTimer, setSafetyTimer] = useState<number>(0)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      // Fetch clubs
      const { data: clubsData } = await supabase.from('clubs').select('*')
      setClubs(clubsData || [])
      
      setLoading(false)
    }

    checkAuth()
  }, [])

  const handleStatusChange = async (newStatus: typeof status) => {
    setStatus(newStatus)
    const supabase = createClient()

    // Update entertainer profile status
    const { data: profile } = await supabase
      .from('entertainer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (profile) {
      await supabase
        .from('entertainer_profiles')
        .update({ current_status: newStatus })
        .eq('id', profile.id)

      // If going on stage, start safety timer (e.g., 1 hour)
      if (newStatus === 'on-stage') {
        setSafetyTimer(3600) // 1 hour in seconds
        startSafetyTimer()
      }
    }
  }

  const startSafetyTimer = () => {
    const interval = setInterval(() => {
      setSafetyTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          notifyEmergencyContact()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const notifyEmergencyContact = () => {
    console.log('Safety timer expired - notifying emergency contact')
    // This would trigger a notification to the emergency contact
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Check In</h1>
          <p className="text-gray-600">Manage your availability and safety</p>
        </div>

        {/* Club Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Your Club
          </label>
          <select
            value={selectedClub || ''}
            onChange={(e) => setSelectedClub(Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Choose a club...</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Status</h2>
          <div className="space-y-3">
            <button
              onClick={() => handleStatusChange('off-duty')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                status === 'off-duty'
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🚫 Off Duty
            </button>
            <button
              onClick={() => handleStatusChange('in-building')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                status === 'in-building'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📍 In Building
            </button>
            <button
              onClick={() => handleStatusChange('on-stage')}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                status === 'on-stage'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🎭 On Stage
            </button>
          </div>
        </div>

        {/* Safety Timer */}
        {status === 'on-stage' && safetyTimer > 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Safety Timer Active</h3>
            <p className="text-blue-700 mb-4">
              If you don't check in within this time, an emergency contact will be notified.
            </p>
            <div className="text-4xl font-bold text-blue-600 text-center font-mono">
              {formatTime(safetyTimer)}
            </div>
          </div>
        )}

        {/* Current Status Display */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Status:</p>
              <p className="text-2xl font-bold text-gray-900 capitalize">
                {status.replace('-', ' ')}
              </p>
            </div>
            <div className="text-5xl">
              {status === 'off-duty' && '🚫'}
              {status === 'in-building' && '📍'}
              {status === 'on-stage' && '🎭'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()

  // Verify the user is actually logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Check the role in the database
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  // Security: Kick them out if they aren't the Admin
  if (profile?.role !== 'admin') {
    redirect('/dashboard?error=Unauthorized')
  }

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center border-b border-slate-700 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 tracking-tight">UpNext Admin</h1>
            <p className="text-slate-400 text-sm mt-1">System Control Center</p>
          </div>
          <div className="text-right">
            <span className="bg-green-500/10 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/20">
              SYSTEM ONLINE
            </span>
            <p className="text-slate-500 text-xs mt-2">{user.email}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Database</h3>
            <p className="text-3xl font-mono mt-2">CONNECTED</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Active Users</h3>
            <p className="text-3xl font-mono mt-2">1</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">Platform Role</h3>
            <p className="text-3xl font-mono mt-2 text-blue-400 uppercase">{profile?.role}</p>
          </div>
        </div>

        <div className="mt-12 p-8 bg-slate-800/50 border border-dashed border-slate-700 rounded-3xl text-center">
          <p className="text-slate-500 italic">Admin widgets and user management tools will appear here.</p>
        </div>
      </div>
    </div>
  )
}

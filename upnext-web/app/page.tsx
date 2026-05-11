export default function Page() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Adam.</h1>
        <p className="text-slate-400">Your operations are secure. Lucas and Roxy are online and monitoring the Vouch System.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
          <h3 className="text-blue-400 font-semibold mb-1">Active Shifts</h3>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
          <h3 className="text-purple-400 font-semibold mb-1">Safety Alerts</h3>
          <p className="text-2xl font-bold text-white">0</p>
        </div>
        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl">
          <h3 className="text-green-400 font-semibold mb-1">Pending Vouches</h3>
          <p className="text-2xl font-bold text-white">5</p>
        </div>
      </div>
    </div>
  );
}

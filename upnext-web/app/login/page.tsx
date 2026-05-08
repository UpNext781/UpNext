export default async function LoginPage(props: {
  searchParams: Promise<{ error?: string }>
}) {
  const searchParams = await props.searchParams;
  const error = searchParams.error;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <h1 className="text-2xl font-bold text-center">Login to UpNext</h1>
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">
            {error === 'Unauthorized' ? 'Admin access required.' : 'Login failed.'}
          </div>
        )}
        <p className="text-slate-400 text-center">Please sign in to continue to the dashboard.</p>
        {/* Login form components go here */}
      </div>
    </div>
  )
}

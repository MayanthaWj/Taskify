import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/5 -z-10" />
      <div className="absolute inset-0 bg-linear-to-t from-primary-800/50 to-transparent" />

      <div className="relative">
        {/* Navbar */}
        <nav className="container mx-auto flex items-center justify-between px-8 py-3 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Taskify</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition duration-200"
            >
              Sign In
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-8 py-4 lg:py-8">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Text Content */}
            <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-white/10 text-white/90 backdrop-blur-sm mb-4">
                <span className="flex h-2 w-2 rounded-full bg-status-done mr-2"></span>
                Task Management Made Simple
              </div>
              
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Organize Your Work &
                <span className="block text-primary-200 mt-2">Boost Productivity</span>
              </h2>
              
              <p className="mt-4 text-lg leading-7 text-primary-100">
                Transform your workflow with Taskify&apos;s intuitive task management. Create, track, and 
                complete tasks seamlessly—whether you&apos;re at your desk or on the go.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition duration-200"
                >
                  Create Account
                </Link>
              </div>

              {/* Features Grid */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: '📋', title: 'Task Lists', desc: 'Organize with ease' },
                  { icon: '🎯', title: 'Progress Track', desc: 'Monitor completion' },
                  { icon: '⏰', title: 'Reminders', desc: 'Never miss deadlines' },
                  { icon: '🔄', title: 'Sync', desc: 'Access anywhere' },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="relative group rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition duration-200"
                  >
                    <dt className="flex items-center gap-2">
                      <span className="text-xl">{feature.icon}</span>
                      <span className="font-semibold text-white text-sm">{feature.title}</span>
                    </dt>
                    <dd className="mt-1 text-xs text-primary-200">{feature.desc}</dd>
                  </div>
                ))}
              </div>
            </div>

            {/* App Preview */}
            <div className="relative lg:ml-auto">
              <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
                <div className="relative">
                  <div className="absolute -inset-4">
                    <div className="w-full h-full mx-auto opacity-30 blur-lg filter" style={{ background: 'linear-gradient(90deg, #60a5fa 0%, #34d399 100%)' }} />
                  </div>
                  <div className="relative rounded-2xl bg-white/8 backdrop-blur-xl border border-white/10 shadow-2xl shadow-primary-800/20 p-6">
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className={`w-4 h-4 rounded-full ${
                            i === 0 ? 'bg-status-done' :
                            i === 1 ? 'bg-status-active' :
                            i === 2 ? 'bg-status-overdue' :
                            'bg-status-new'
                          }`} />
                          <div className="h-3 bg-white/10 rounded-full w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="container mx-auto px-8 py-4 mt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-200">
              © {new Date().getFullYear()} Taskify. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <span className="inline-flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-status-done"></span>
                <span className="text-sm text-primary-200">System Operational</span>
              </span>
              <a href="#" className="text-sm text-primary-200 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-primary-200 hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
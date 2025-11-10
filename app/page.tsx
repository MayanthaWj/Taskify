import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#02021E] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5 -z-10" />
      
      {/* Navbar */}
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center">
          <span className="text-2xl font-bold">Taskify</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login?mode=signin"
            className="inline-flex items-center justify-center px-6 py-2 text-base font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition duration-200"
          >
            Login
          </Link>          
        </div>
      </nav>

        {/* Hero Section */}
        <div className="container mx-auto px-8 py-4 lg:py-3">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            {/* Text Content */}
            <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">              
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Take Control of Your 
                <span className="block text-primary-200 mt-2">Day with Taskify</span>
              </h2>
              
              <p className="mt-4 text-lg leading-7 text-primary-100">
                Transform your workflow with Taskify&apos;s intuitive task management. Create, track, and 
                complete tasks seamlessly—whether you&apos;re at your desk or on the go.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/login?mode=signup"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition duration-200"
                >
                  Create Account
                </Link>
              </div>

              {/* Features Grid */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  { icon: '📋', title: 'Smart Task Boards', desc: 'Visualize your personal tasks and  projects with an intuitive drag-and-drop boards.' },
                  { icon: '🎯', title: 'Daily Planner', desc: 'Plan your day, prioritize tasks, and track what truly matters.' },
                  { icon: '⏰', title: 'Deadline Reminders', desc: 'Get gentle nudges for upcoming tasks—never miss a goal again.' },
                  { icon: '🔄', title: 'Focus Mode', desc: 'Block distractions and complete tasks one step at a time.' },
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
  );
}
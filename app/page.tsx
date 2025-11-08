import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-blue-500 to-blue-600">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-6">
          <h1 className="text-2xl font-bold text-white">Taskify</h1>
          <Link 
            href="/login"
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Sign In
          </Link>
        </nav>

        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-88px)] text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Manage Your Tasks with Ease
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl">
            Stay organized and boost your productivity with Taskify. 
            Create, track, and complete tasks in a simple and efficient way.
          </p>
          <div className="space-x-4">
            <Link 
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="/login?mode=signup"
              className="bg-blue-400 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-500 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

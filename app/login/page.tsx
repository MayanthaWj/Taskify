import AuthForm from "./AuthForm";
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary-600 via-primary-700 to-primary-800">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="mt-6 text-3xl md:text-4xl font-bold text-white">Welcome to Taskify</h1>
          <p className="mt-2 text-primary-200">Sign in to manage your tasks or create a new account.</p>
        </div>

        {/* Center the AuthForm card we styled earlier */}
        <div className="flex justify-center">
          <AuthForm />
        </div>

        <Link href="/" className="text-white flex justify-center text-lg font-semibold hover:underline">← Back to Home</Link>
      </div>
    </main>
  );
}

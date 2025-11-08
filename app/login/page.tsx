import AuthForm from "./AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded p-6">
        <h1 className="text-2xl font-semibold mb-4 text-center text-blue-600">
          Taskify Sign In / Sign Up
        </h1>
        <AuthForm />
      </div>
    </main>
  );
}

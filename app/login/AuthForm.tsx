"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export default function AuthForm() {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<FormData>();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();
  
  // Check URL parameters for initial form state
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    } else if (mode === 'signin') {
      setIsLogin(true);
    }
  }, []);

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const passwordsMatch = isLogin || !confirmPassword || password === confirmPassword;

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Update URL without refresh
    const newMode = !isLogin ? 'signin' : 'signup';
    window.history.replaceState({}, '', `?mode=${newMode}`);
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.password });
        if (error) throw error;
        router.push("/tasks");
      } else {
        if (data.password !== data.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const { error } = await supabase.auth.signUp({ 
          email: data.email, 
          password: data.password,
          options: {
            emailRedirectTo: "https://taskify-seven-ashen.vercel.app/login?mode=signin"
          }
        });
        if (error) throw error;
        setSuccessMsg("Account created! Please check your email to verify your account.");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      if (!isLogin) reset(); else reset({ password: "" });
    }
  };

  useEffect(() => {
    reset();
    setErrorMsg("");
    setSuccessMsg("");
  }, [isLogin, reset]);

  return (
    <div className="w-full max-w-md mx-auto bg-white/6 dark:bg-base-900/60 backdrop-blur-md rounded-2xl border border-white/6 dark:border-base-800 p-6 shadow-card">
      <div className="mb-6 text-center">
        <h3 className="text-2xl font-semibold text-white">{isLogin ? 'Welcome back' : 'Create your account'}</h3>
        <p className="mt-1 text-sm text-primary-200">{isLogin ? 'Sign in to continue to Taskify' : 'Sign up to get started'}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-primary-100 mb-2">Email</label>
          <input
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.email && <p className="mt-1 text-xs text-status-overdue">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-primary-100 mb-2">Password</label>
          <input
            id="password"
            {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } })}
            type="password"
            placeholder="••••••••"
            className="w-full rounded-lg border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {errors.password && <p className="mt-1 text-xs text-status-overdue">{errors.password.message}</p>}
        </div>

        {!isLogin && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-100 mb-2">Confirm password</label>
            <input
              id="confirmPassword"
              {...register("confirmPassword", { required: !isLogin ? "Please confirm your password" : false })}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-white/10 bg-white/4 px-4 py-3 text-sm text-white placeholder:text-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-status-overdue">{errors.confirmPassword.message}</p>}
            {!passwordsMatch && confirmPassword && <p className="mt-1 text-xs text-status-overdue">Passwords do not match</p>}
            {passwordsMatch && confirmPassword && password && <p className="mt-1 text-xs text-secondary-600 flex items-center">✅ Passwords match</p>}
          </div>
        )}

        {errorMsg && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-md p-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
            <p className="text-sm text-red-500">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-md p-3">
            <svg className="w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
            <p className="text-sm text-green-500">{successMsg}</p>
          </div>
        )}

        <div className="mt-2">
          <button
            type="submit"
            disabled={loading || (!isLogin && !passwordsMatch)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 transition-shadow shadow-lg"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <div className="mt-3 text-center text-sm">
          <button type="button" onClick={toggleMode} className="text-primary-200 hover:text-white">
            {isLogin ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
}
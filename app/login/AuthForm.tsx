"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type FormData = { email: string; password: string };

export default function AuthForm() {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMsg("");
    const { email, password } = data;

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      router.push("/tasks");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
      reset({ password: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("email", { required: true })}
        type="email"
        placeholder="Email"
        className="w-full border rounded p-2"
      />
      <input
        {...register("password", { required: true })}
        type="password"
        placeholder="Password"
        className="w-full border rounded p-2"
      />
      {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
      </button>
      <p className="text-sm text-center">
        {isLogin ? "New user?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </form>
  );
}
"use client";
import { useState, useEffect } from "react";
import { login } from "../features/notes/authSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useTypedDispatch";

export default function Home() {
  const [user_email, setUser_email] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('message') === 'signup-success') {
      setSuccess('Account created successfully! Please sign in.');
    }
  }, []);

  const handleLogin = async () => {
    setError(null);
    if (!user_email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    try {
      const token = await dispatch(login({ user_email, password })).unwrap();
      if (!token) throw new Error("No token returned");
      router.push("/dashboard");
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="p-8 border rounded-lg max-w-md w-full bg-white dark:bg-gray-800 shadow">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Welcome back</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in to access your notes</p>

        {success && (
          <div className="mb-4 text-sm p-3 bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 text-sm p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={user_email}
          onChange={e => setUser_email(e.target.value)}
          className="border p-2 w-full mb-4 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Email"
        />

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Password"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => router.push('/signup')}
            className="text-gray-100 hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

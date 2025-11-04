"use client";
import { useState } from "react";
import { signup } from "../../features/notes/authSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/useTypedDispatch";

export default function SignupPage() {
  const [user_name, setUsername] = useState("");
  const [user_email, setUser_email] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignup = async () => {
    setError(null);
    if (!user_name.trim() || !user_email.trim() || !password) {
      setError("Please fill out all fields");
      return;
    }
    setLoading(true);
    try {
      await dispatch(signup({ user_name, user_email, password })).unwrap();
      router.push("/?message=signup-success");
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="p-8 border rounded-lg max-w-md w-full bg-white dark:bg-gray-800 shadow">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Create an account</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign up to start saving your notes securely.</p>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Your name"
          value={user_name}
          onChange={e => setUsername(e.target.value)}
          className="border p-2 w-full mb-4 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Email</label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={user_email}
          onChange={e => setUser_email(e.target.value)}
          className="border p-2 w-full mb-4 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Choose a password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded bg-transparent focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <div className="mt-4 text-sm text-center">
          <button type="button" onClick={() => router.push('/')} className="text-gray-100 hover:underline">Already have an account? Sign in</button>
        </div>
      </div>
    </div>
  );
}

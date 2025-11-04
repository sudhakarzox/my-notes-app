"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
//   const [dark, setDark] = useState<boolean>(() => {
//     try {
//       const saved = localStorage.getItem("theme");
//       if (saved === "dark") return true;
//       if (saved === "light") return false;
//       return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
//     } catch {
//       return false;
//     }
//   });

//   useEffect(() => {
//     if (dark) document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//   }, [dark]);

//   const toggleDark = () => {
//     const next = !dark;
//     setDark(next);
//     if (next) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     }
//   };

  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const name = localStorage.getItem('user_name');
        if (name) setUserName(name);
      } catch {}
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  function handleLogout(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        event.preventDefault();
        // Clear any authentication tokens or user data from localStorage/sessionStorage
        localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
        // Optionally, redirect to login or home page
        router.push("/");
    }

  return (
    <nav className="bg-white dark:bg-gray-800 shadow p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/dashboard"><span className="font-bold text-gray-900 dark:text-gray-100">Notes</span></Link>
        <div className="flex items-center gap-4">
          {userName && <div className="font-bold text-sm text-gray-600 dark:text-gray-100 mr-4">Hello, {userName}</div>}
          {/* <button
            onClick={toggleDark}
            aria-pressed={dark}
            className="px-3 py-1 rounded border bg-gray-100 dark:bg-gray-700 text-sm"
            title="Toggle dark mode"
          >
            {dark ? "🌙 Dark" : "☀️ Light"}
          </button> */}
          <button onClick={handleLogout} className=" px-3 py-1 rounded border bg-gray-100 dark:bg-gray-700 text-sm text-red-600">Logout</button>
         
        </div>
      </div>
    </nav>
  );
}

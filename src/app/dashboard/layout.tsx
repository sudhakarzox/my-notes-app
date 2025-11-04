// app/dashboard/layout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/");
      }
    } catch {
      router.push("/");
    } finally {
      setChecking(false);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-700">
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        {checking ? (
          <main className="flex-1 p-6 flex items-center justify-center">Loading...</main>
        ) : (
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        )}
      </div>
    </div>
  );
}

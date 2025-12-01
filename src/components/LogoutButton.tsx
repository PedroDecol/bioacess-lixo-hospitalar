"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
      router.push("/login");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 text-sm disabled:opacity-60 cursor-pointer"
    >
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}

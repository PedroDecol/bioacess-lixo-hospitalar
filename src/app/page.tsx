"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Sistema Bio Acess</h1>

      <p className="text-slate-600 mb-4">
        Sistema de monitoramento e rastreamento de bombonas.
      </p>

      <button
        onClick={() => router.push("/login")}
        className="px-6 py-3 bg-slate-800 text-white rounded-lg"
      >
        Entrar
      </button>
    </div>
  );
}

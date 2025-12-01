"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@bioacess.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Erro inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-10 px-6">
        <div className="flex-1 text-slate-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-sm font-bold">
              BA
            </div>
            <div>
              <h1 className="text-xl font-semibold">Bio Acess</h1>
              <p className="text-xs text-slate-300">
                Monitoramento e rastreamento de bombonas hospitalares.
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-300 max-w-md">
            Acesse o painel para gerenciar fichas de coleta, acompanhar
            rotas dos motoristas e gerar relatórios para auditoria.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
        >
          <h2 className="text-lg font-semibold text-slate-50">
            Entrar no sistema
          </h2>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-700 bg-slate-900 rounded-md px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-300">
              Senha
            </label>
            <input
              type="password"
              className="w-full border border-slate-700 bg-slate-900 rounded-md px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-emerald-500 text-slate-950 text-sm font-semibold disabled:opacity-60 hover:bg-emerald-400"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-[11px] text-slate-500">
            Usuário demo: admin@bioacess.local / admin123
          </p>
        </form>
      </div>
    </div>
  );
}

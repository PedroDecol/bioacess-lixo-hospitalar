"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";

type UserRole = "admin" | "motorista" | "operador";

interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("motorista");
  const [password, setPassword] = useState("");

  const [creating, setCreating] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao carregar usuários");
        setLoading(false);
        return;
      }

      setUsers(data.users || []);
      setLoading(false);
    } catch {
      setError("Erro inesperado ao carregar usuários");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, role, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar usuário");
        setCreating(false);
        return;
      }

      setNome("");
      setEmail("");
      setPassword("");
      setRole("motorista");

      await loadUsers();
      setCreating(false);
    } catch {
      setError("Erro inesperado ao criar usuário");
      setCreating(false);
    }
  }

  return (
    <AppShell title="Administração de usuários">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Card de criação */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Criar novo usuário
          </h2>
          <p className="text-xs text-slate-500">
            Apenas administradores têm acesso a esta área. Use para cadastrar
            motoristas e operadores do sistema.
          </p>

          <form onSubmit={handleCreateUser} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700">
                Nome
              </label>
              <input
                type="text"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Cargo
              </label>
              <select
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
              >
                <option value="admin">Administrador</option>
                <option value="motorista">Motorista</option>
                <option value="operador">Operador</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700">
                Senha
              </label>
              <input
                type="password"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm outline-none focus:border-emerald-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 rounded-md bg-slate-900 text-white text-sm font-medium disabled:opacity-60 hover:bg-slate-800"
            >
              {creating ? "Criando..." : "Criar usuário"}
            </button>
          </form>
        </div>

        {/* Card de listagem */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Usuários cadastrados
          </h2>
          <p className="text-xs text-slate-500">
            Visualize os usuários ativos no sistema.
          </p>

          {loading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum usuário encontrado.
            </p>
          ) : (
            <div className="border rounded-md overflow-auto max-h-[24rem]">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2">Nome</th>
                    <th className="text-left px-3 py-2">Email</th>
                    <th className="text-left px-3 py-2">Cargo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t">
                      <td className="px-3 py-2 text-sm">{u.nome}</td>
                      <td className="px-3 py-2 text-xs text-slate-600">
                        {u.email}
                      </td>
                      <td className="px-3 py-2 text-xs capitalize">
                        {u.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}

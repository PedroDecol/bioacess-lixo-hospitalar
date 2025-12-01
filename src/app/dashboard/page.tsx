import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUserFromCookie } from "../../../lib/auth";
import { AppShell } from "@/components/AppShell";
import { ClipboardList, MapPin, Truck } from "lucide-react";

export default async function DashboardPage() {
  const user = await getAuthUserFromCookie();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "admin";

  return (
    <AppShell title="Dashboard">
      <p className="text-sm text-slate-600">
        Bem-vindo, <span className="font-medium">{user.nome}</span> (
        {user.role})
      </p>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Fichas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <ClipboardList className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Fichas de bombonas
              </h2>
              <p className="text-xs text-slate-500">
                Gerenciamento de fichas de coleta e rastreamento.
              </p>
            </div>
          </div>
          <div className="mt-2">
            <Link
              href="/fichas"
              className="text-xs font-medium text-emerald-700 hover:underline"
            >
              Acessar módulo
            </Link>
          </div>
        </div>

        {/* Coletas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-sky-100 flex items-center justify-center">
              <Truck className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Coletas
              </h2>
              <p className="text-xs text-slate-500">
                Visão operacional das coletas em andamento.
              </p>
            </div>
          </div>
          <div className="mt-2">
            <Link
              href="/coletas"
              className="text-xs font-medium text-sky-700 hover:underline"
            >
              Acessar módulo
            </Link>
          </div>
        </div>

        {/* Rastreamento */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-violet-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-violet-700" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800">
                Rastreamento
              </h2>
              <p className="text-xs text-slate-500">
                Acompanhamento via GPS das bombonas com os motoristas.
              </p>
            </div>
          </div>
          <div className="mt-2">
            <Link
              href="/rastreamento"
              className="text-xs font-medium text-violet-700 hover:underline"
            >
              Acessar módulo
            </Link>
          </div>
        </div>
      </section>

      {isAdmin && (
        <section className="mt-6">
          <Link
            href="/users"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-medium hover:bg-slate-800"
          >
            Administração de usuários
          </Link>
        </section>
      )}
    </AppShell>
  );
}

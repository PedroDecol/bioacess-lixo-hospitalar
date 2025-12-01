"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";

interface AppShellProps {
  title?: string;
  children: ReactNode;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/fichas", label: "Fichas" },
  { href: "/coletas", label: "Coletas" },
  { href: "/rastreamento", label: "Rastreamento" },
  { href: "/users", label: "Admin" },
];

export function AppShell({ title, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Topbar */}
      <header className="h-14 bg-slate-900 text-slate-50 flex items-center justify-between px-6 shadow">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2"
        >
          <div className="h-7 w-7 rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-bold">
            BA
          </div>
          <div className="leading-tight text-left">
            <p className="text-sm font-semibold">Bio Access</p>
            <p className="text-[11px] text-slate-300">
              Monitoramento de bombonas
            </p>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-2 text-xs">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "px-3 py-1.5 rounded-md transition " +
                  (active
                    ? "bg-slate-700 text-white"
                    : "text-slate-200 hover:bg-slate-800")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 px-4 py-6 md:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          {title && (
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {title}
              </h1>
            </div>
          )}

          {children}
        </div>
      </main>
    </div>
  );
}

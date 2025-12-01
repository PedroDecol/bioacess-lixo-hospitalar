"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";

interface FichaLocal {
  nomeLocal: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavelNome: string;
  responsavelTelefone: string;
}

interface Ficha {
  id: string;
  motoristaId: string;
  motoristaNome: string;
  quantidadeBombonas: number;
  status: "aberta" | "finalizada";
  createdAt: string;
  local: FichaLocal;
  observacoes?: string;
  assinaturaBase64?: string;
}

export default function ColetasPage() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadFichas() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fichas");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao carregar coletas");
        setLoading(false);
        return;
      }

      setFichas(data.fichas || []);
      setLoading(false);
    } catch {
      setError("Erro inesperado ao carregar coletas");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFichas();
  }, []);

  const abertas = fichas.filter((f) => f.status === "aberta");
  const finalizadas = fichas.filter((f) => f.status === "finalizada");

  function renderLista(lista: Ficha[]) {
    if (lista.length === 0) {
      return (
        <p className="text-sm text-slate-500">
          Nenhuma coleta nesta categoria.
        </p>
      );
    }

    return (
      <div className="border rounded-md overflow-auto max-h-[28rem]">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-3 py-2">Local</th>
              <th className="text-left px-3 py-2">Motorista</th>
              <th className="text-left px-3 py-2">Bombonas</th>
              <th className="text-left px-3 py-2">Data</th>
              <th className="text-left px-3 py-2">Assinatura</th>
              <th className="text-left px-3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="px-3 py-2">
                  <div className="font-medium">{f.local.nomeLocal}</div>
                  <div className="text-xs text-slate-500">
                    {f.local.cidade}/{f.local.estado}
                  </div>
                </td>
                <td className="px-3 py-2">{f.motoristaNome}</td>
                <td className="px-3 py-2">{f.quantidadeBombonas}</td>
                <td className="px-3 py-2 text-xs text-slate-500">
                  {new Date(f.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-2 text-xs">
                  {f.assinaturaBase64 ? (
                    <span className="text-emerald-600">Coletada</span>
                  ) : (
                    <span className="text-slate-500">Pendente</span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs space-x-2 whitespace-nowrap">
                  <Link
                    href={`/fichas/${f.id}/rastreio`}
                    className="underline text-slate-800"
                  >
                    Rastreamento
                  </Link>
                  <a
                    href={`/api/fichas/${f.id}/pdf`}
                    target="_blank"
                    className="underline text-blue-700"
                  >
                    PDF
                  </a>
                  {!f.assinaturaBase64 && (
                    <Link
                      href={`/fichas/${f.id}/assinatura`}
                      className="underline text-amber-700"
                    >
                      Assinar
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <AppShell title="Fichas de Bombonas">

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-sm text-slate-500">Carregando...</p>
        ) : (
          <div className="space-y-6">
            <section className="bg-white rounded-xl shadow p-4 space-y-3">
              <h2 className="text-lg font-medium text-slate-800">
                Coletas em andamento
              </h2>
              {renderLista(abertas)}
            </section>

            <section className="bg-white rounded-xl shadow p-4 space-y-3">
              <h2 className="text-lg font-medium text-slate-800">
                Coletas finalizadas
              </h2>
              {renderLista(finalizadas)}
            </section>
          </div>
        )}

    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";


interface UltimoPonto {
  id: string;
  fichaId: string;
  motoristaId: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

interface ResumoRastreamento {
  fichaId: string;
  motoristaNome: string;
  localNome: string;
  quantidadeBombonas: number;
  status: "aberta" | "finalizada";
  totalPontos: number;
  ultimoPonto: UltimoPonto | null;
}

export default function RastreamentoPage() {
  const [itens, setItens] = useState<ResumoRastreamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadResumo() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/rastreamento/resumo");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao carregar rastreamento");
        setLoading(false);
        return;
      }

      setItens(data.resumo || []);
      setLoading(false);
    } catch {
      setError("Erro inesperado ao carregar rastreamento");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumo();
  }, []);

  return (
    <AppShell title="Rastreamento">

        {error && <p className="text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="text-sm text-slate-500">Carregando...</p>
        ) : itens.length === 0 ? (
          <p className="text-sm text-slate-500">
            Nenhum rastreamento registrado ainda.
          </p>
        ) : (
          <div className="border rounded-md overflow-auto max-h-[30rem] bg-white shadow">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left px-3 py-2">Local</th>
                  <th className="text-left px-3 py-2">Motorista</th>
                  <th className="text-left px-3 py-2">Bombonas</th>
                  <th className="text-left px-3 py-2">Status</th>
                  <th className="text-left px-3 py-2">Última posição</th>
                  <th className="text-left px-3 py-2">Total pontos</th>
                  <th className="text-left px-3 py-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {itens.map((item) => (
                  <tr key={item.fichaId} className="border-t">
                    <td className="px-3 py-2">
                      <div className="font-medium">{item.localNome}</div>
                    </td>
                    <td className="px-3 py-2">{item.motoristaNome}</td>
                    <td className="px-3 py-2">
                      {item.quantidadeBombonas}
                    </td>
                    <td className="px-3 py-2 text-xs capitalize">
                      {item.status}
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-600">
                      {item.ultimoPonto ? (
                        <>
                          {new Date(
                            item.ultimoPonto.createdAt
                          ).toLocaleString()}
                          <br />
                          Lat: {item.ultimoPonto.latitude.toFixed(5)} / Lng:{" "}
                          {item.ultimoPonto.longitude.toFixed(5)}
                        </>
                      ) : (
                        <span className="text-slate-400">
                          Sem pontos ainda
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      {item.totalPontos}
                    </td>
                    <td className="px-3 py-2 text-xs space-x-2 whitespace-nowrap">
                      <Link
                        href={`/fichas/${item.fichaId}/rastreio`}
                        className="underline text-slate-800"
                      >
                        Ver rastreio
                      </Link>
                      <a
                        href={`/api/fichas/${item.fichaId}/pdf`}
                        target="_blank"
                        className="underline text-blue-700"
                      >
                        PDF
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </AppShell>
  );
}

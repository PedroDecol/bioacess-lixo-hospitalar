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

export default function FichasPage() {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);


  const [nomeLocal, setNomeLocal] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cep, setCep] = useState("");
  const [responsavelNome, setResponsavelNome] = useState("");
  const [responsavelTelefone, setResponsavelTelefone] = useState("");
  const [quantidadeBombonas, setQuantidadeBombonas] = useState<number | "">("");
  const [observacoes, setObservacoes] = useState("");

  async function loadFichas() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fichas");
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao carregar fichas");
        setLoading(false);
        return;
      }

      setFichas(data.fichas || []);
      setLoading(false);
    } catch {
      setError("Erro inesperado ao carregar fichas");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFichas();
  }, []);

  async function handleCreateFicha(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/fichas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomeLocal,
          endereco,
          cidade,
          estado,
          cep,
          responsavelNome,
          responsavelTelefone,
          quantidadeBombonas:
            quantidadeBombonas === "" ? null : Number(quantidadeBombonas),
          observacoes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar ficha");
        setCreating(false);
        return;
      }

      setNomeLocal("");
      setEndereco("");
      setCidade("");
      setEstado("");
      setCep("");
      setResponsavelNome("");
      setResponsavelTelefone("");
      setQuantidadeBombonas("");
      setObservacoes("");

      await loadFichas();
      setCreating(false);
    } catch {
      setError("Erro inesperado ao criar ficha");
      setCreating(false);
    }
  }

  async function handleFinalizarFicha(id: string) {
  setUpdatingId(id);
  setError(null);

  try {
    const res = await fetch(`/api/fichas/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "finalizada" }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erro ao finalizar ficha");
      setUpdatingId(null);
      return;
    }

    await loadFichas();
    setUpdatingId(null);
  } catch {
    setError("Erro inesperado ao finalizar ficha");
    setUpdatingId(null);
  }
}



  return (
    <AppShell title="Fichas de Bombonas">

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <h2 className="text-lg font-medium text-slate-800">
              Nova ficha
            </h2>

            <form onSubmit={handleCreateFicha} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Nome do local
                </label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={nomeLocal}
                  onChange={(e) => setNomeLocal(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Endereço
                </label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Cidade
                  </label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Estado
                  </label>
                  <input
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  CEP
                </label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Responsável
                </label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={responsavelNome}
                  onChange={(e) => setResponsavelNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Telefone do responsável
                </label>
                <input
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={responsavelTelefone}
                  onChange={(e) => setResponsavelTelefone(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Quantidade de bombonas
                </label>
                <input
                  type="number"
                  min={1}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  value={quantidadeBombonas}
                  onChange={(e) =>
                    setQuantidadeBombonas(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Observações
                </label>
                <textarea
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={3}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2 rounded-md bg-slate-800 text-white text-sm font-medium disabled:opacity-60"
              >
                {creating ? "Criando..." : "Criar ficha"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-4 space-y-4">
            <h2 className="text-lg font-medium text-slate-800">
              Fichas registradas
            </h2>

            {loading ? (
              <p className="text-sm text-slate-500">Carregando...</p>
            ) : fichas.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nenhuma ficha registrada.
              </p>
            ) : (
              <div className="space-y-3 max-h-[28rem] overflow-auto">
                {fichas.map((f) => (
                  <div
                    key={f.id}
                    className="border rounded-md p-3 text-sm space-y-1"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {f.local.nomeLocal}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(f.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {f.local.endereco} - {f.local.cidade}/{f.local.estado} - CEP {f.local.cep}
                    </p>
                    <p className="text-xs text-slate-600">
                      Responsável: {f.local.responsavelNome} ({f.local.responsavelTelefone})
                    </p>
                    <p className="text-xs text-slate-600">
                      Motorista: {f.motoristaNome} | Bombonas: {f.quantidadeBombonas}
                    </p>
                    {f.observacoes && (
                      <p className="text-xs text-slate-500">
                        Obs: {f.observacoes}
                      </p>
                    )}
                    <p className="text-xs text-slate-500">
                      Status: {f.status}
                    </p>

                    {f.status === "aberta" && (
                        <div className="pt-1 flex gap-2">
                           <button
                            onClick={() => handleFinalizarFicha(f.id)}
                            disabled={updatingId === f.id}
                            className="text-xs px-3 py-1 rounded-md bg-emerald-600 text-white disabled:opacity-60"
                            >
                            {updatingId === f.id ? "Finalizando..." : "Finalizar ficha"}
                           </button>

                            <Link
                            href={`/fichas/${f.id}/rastreio`}
                            className="text-xs text-slate-800 underline"
                            >
                            Abrir rastreamento
                            </Link>
                        </div>
                    )}

                    {f.assinaturaBase64 ? (
                        <p className="text-xs text-emerald-600">Assinatura coletada</p>
                        ) : (
                        <Link
                            href={`/fichas/${f.id}/assinatura`}
                            className="text-xs text-slate-800 underline"
                        >
                            Coletar assinatura
                        </Link>
                    )}

                    <div className="pt-2 flex gap-3">
                        <a
                            href={`/api/fichas/${f.id}/pdf`}
                            target="_blank"
                            className="text-xs px-3 py-1 bg-blue-600 text-white rounded-md"
                        >
                            Gerar PDF
                        </a>
                    </div>
                  </div>


                ))}
              </div>
            )}
          </div>
        </section>
    </AppShell>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

interface Ponto {
  id: string;
  createdAt: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

const RastreioMap = dynamic(() => import("@/components/RastreioMap"), {
  ssr: false,
});

export default function RastreioFichaPage() {
  const params = useParams<{ id: string }>();
  const fichaId = params.id;

  const [pontos, setPontos] = useState<Ponto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [watchId, setWatchId] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);

  async function loadPontos() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/rastreamento?fichaId=${fichaId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao carregar pontos");
        setLoading(false);
        return;
      }

      setPontos(data.pontos || []);
      setLoading(false);
    } catch {
      setError("Erro inesperado ao carregar pontos");
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPontos();
  }, [fichaId]);

  function startTracking() {
    if (!("geolocation" in navigator)) {
      setError("Geolocalização não suportada neste dispositivo");
      return;
    }

    setError(null);

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        try {
          await fetch("/api/rastreamento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fichaId,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
            }),
          });

          loadPontos();
        } catch {
          setError("Erro ao enviar posição");
        }
      },
      (err) => {
        setError("Erro ao obter localização: " + err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 20_000,
      }
    );

    setWatchId(id);
    setTracking(true);
  }

  function stopTracking() {
    if (watchId != null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
  }

  useEffect(() => {
    return () => {
      if (watchId != null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              Rastreamento da ficha
            </h1>
            <p className="text-sm text-slate-600">
              Ficha ID: {fichaId}
            </p>
          </div>

          <div className="flex gap-2">
            {!tracking ? (
              <button
                onClick={startTracking}
                className="px-4 py-2 rounded-md bg-slate-800 text-white text-sm"
              >
                Iniciar rastreamento
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="px-4 py-2 rounded-md bg-red-600 text-white text-sm"
              >
                Parar rastreamento
              </button>
            )}
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {pontos.length > 0 && (
            <section className="space-y-3">
            <h2 className="text-lg font-medium text-slate-800">
                Trajeto no mapa
            </h2>
            <RastreioMap pontos={pontos} />
            </section>
        )}

        <section className="bg-white rounded-xl shadow p-4 space-y-3">
          <h2 className="text-lg font-medium text-slate-800">
            Posições registradas
          </h2>

          {loading ? (
            <p className="text-sm text-slate-500">Carregando...</p>
          ) : pontos.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhuma posição registrada ainda.
            </p>
          ) : (
            <div className="max-h-[26rem] overflow-auto text-sm">
              {pontos
                .slice()
                .reverse()
                .map((p) => (
                  <div
                    key={p.id}
                    className="border-b py-2 last:border-b-0"
                  >
                    <p className="text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleString()}
                    </p>
                    <p>
                      Lat: {p.latitude.toFixed(6)} | Lng:{" "}
                      {p.longitude.toFixed(6)}
                    </p>
                    {p.accuracy != null && (
                      <p className="text-xs text-slate-500">
                        Precisão: {Math.round(p.accuracy)} m
                      </p>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

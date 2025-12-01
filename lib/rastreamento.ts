import { readJson, writeJson } from "./storage";

const RASTREIO_FILE = "rastreamento.json";

export interface RastreioPonto {
  id: string;
  fichaId: string;
  motoristaId: string;
  createdAt: string; 
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function loadPontos(): RastreioPonto[] {
  return readJson<RastreioPonto[]>(RASTREIO_FILE, []);
}

function savePontos(pontos: RastreioPonto[]) {
  writeJson<RastreioPonto[]>(RASTREIO_FILE, pontos);
}

export function addPonto(data: {
  fichaId: string;
  motoristaId: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}): RastreioPonto {
  const pontos = loadPontos();

  const ponto: RastreioPonto = {
    id: generateId(),
    fichaId: data.fichaId,
    motoristaId: data.motoristaId,
    createdAt: new Date().toISOString(),
    latitude: data.latitude,
    longitude: data.longitude,
    accuracy: data.accuracy ?? null,
  };

  pontos.push(ponto);
  savePontos(pontos);

  return ponto;
}

export function listPontosByFicha(fichaId: string): RastreioPonto[] {
  return loadPontos().filter((p) => p.fichaId === fichaId);
}

export interface RastreioResumoInterno {
  fichaId: string;
  motoristaId: string;
  totalPontos: number;
  ultimoPonto: RastreioPonto | null;
}

export function listResumoRastreamento(): RastreioResumoInterno[] {
  const pontos = loadPontos();
  const mapa = new Map<string, RastreioResumoInterno>();

  for (const p of pontos) {
    let entry = mapa.get(p.fichaId);
    if (!entry) {
      entry = {
        fichaId: p.fichaId,
        motoristaId: p.motoristaId,
        totalPontos: 0,
        ultimoPonto: null,
      };
      mapa.set(p.fichaId, entry);
    }

    entry.totalPontos += 1;

    if (
      !entry.ultimoPonto ||
      new Date(p.createdAt).getTime() >
        new Date(entry.ultimoPonto.createdAt).getTime()
    ) {
      entry.ultimoPonto = p;
    }
  }

  return Array.from(mapa.values());
}
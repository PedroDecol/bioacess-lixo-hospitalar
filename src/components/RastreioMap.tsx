"use client";

import { MapContainer, TileLayer, Polyline, CircleMarker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

export interface PontoRastreio {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  accuracy?: number | null;
}

interface RastreioMapProps {
  pontos: PontoRastreio[];
}

export default function RastreioMap({ pontos }: RastreioMapProps) {
  if (!pontos || pontos.length === 0) {
    return null;
  }

  const last = pontos[pontos.length - 1];

  const center: LatLngExpression = [last.latitude, last.longitude];
  const path: LatLngExpression[] = pontos.map((p) => [
    p.latitude,
    p.longitude,
  ]);

  return (
    <div className="w-full h-72 md:h-80 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Linha do trajeto */}
        <Polyline positions={path} />

        {/* Pontos individuais */}
        {pontos.map((p) => (
          <CircleMarker
            key={p.id}
            center={[p.latitude, p.longitude]}
            radius={4}
          />
        ))}
      </MapContainer>
    </div>
  );
}

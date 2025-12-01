"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AssinaturaPage() {
  const { id: fichaId } = useParams();
  const router = useRouter();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 500;
    canvas.height = 250;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctxRef.current = ctx;
  }, []);

  function startDrawing(e: React.MouseEvent) {
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  }

  function draw(e: React.MouseEvent) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current?.lineTo(offsetX, offsetY);
    ctxRef.current?.stroke();
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  async function saveSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const base64 = canvas.toDataURL("image/png");

    setSaving(true);

    const res = await fetch(`/api/fichas/${fichaId}/assinatura`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64 }),
    });

    setSaving(false);

    if (res.ok) {
      alert("Assinatura salva!");
      router.push(`/fichas`);
    } else {
      alert("Erro ao salvar assinatura");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex flex-col items-center">
      <h1 className="text-2xl font-semibold text-slate-800 mb-4">
        Assinatura do responsável
      </h1>

      <canvas
        ref={canvasRef}
        className="bg-white border rounded shadow"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={clearCanvas}
          className="px-4 py-2 text-sm bg-slate-300 rounded"
        >
          Limpar
        </button>

        <button
          onClick={saveSignature}
          disabled={saving}
          className="px-4 py-2 text-sm bg-emerald-600 text-white rounded disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar assinatura"}
        </button>
      </div>
    </div>
  );
}

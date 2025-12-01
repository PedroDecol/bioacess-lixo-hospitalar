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

    // deixa responsivo: usa o tamanho visual do elemento
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    ctxRef.current = ctx;
  }, []);

  // pega posição do mouse/touch relativa ao canvas
  function getPos(
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    // touch
    if ("touches" in e && e.touches.length > 0) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }

    // mouse
    const mouseEvent = e as React.MouseEvent<HTMLCanvasElement>;
    return {
      x: mouseEvent.clientX - rect.left,
      y: mouseEvent.clientY - rect.top,
    };
  }

  function startDrawing(
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) {
    e.preventDefault(); // impede scroll em touch

    const { x, y } = getPos(e);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(x, y);
    setIsDrawing(true);
  }

  function draw(
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>
  ) {
    if (!isDrawing) return;
    e.preventDefault();

    const { x, y } = getPos(e);
    ctxRef.current?.lineTo(x, y);
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
        className="bg-white border rounded shadow w-full max-w-lg h-64 touch-none"

        // mouse
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}

        // touch (mobile)
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
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

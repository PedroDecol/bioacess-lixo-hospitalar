import { NextResponse } from "next/server";
import { getAuthUserFromCookie } from "../../../../../lib/auth";
import { listResumoRastreamento } from "../../../../../lib/rastreamento";
import { getFichaByIdDecrypted } from "../../../../../lib/fichas";

export async function GET() {
  const user = await getAuthUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const internos = listResumoRastreamento();

  const filtrados =
    user.role === "admin" || user.role === "operador"
      ? internos
      : internos.filter((r) => r.motoristaId === user.sub);

  const resumo = filtrados
    .map((r) => {
      const ficha = getFichaByIdDecrypted(r.fichaId);
      if (!ficha) return null;

      return {
        fichaId: r.fichaId,
        motoristaNome: ficha.motoristaNome,
        localNome: ficha.local.nomeLocal,
        quantidadeBombonas: ficha.quantidadeBombonas,
        status: ficha.status,
        totalPontos: r.totalPontos,
        ultimoPonto: r.ultimoPonto,
      };
    })
    .filter(Boolean);

  return NextResponse.json({ resumo });
}

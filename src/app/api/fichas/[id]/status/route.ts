import { NextRequest, NextResponse } from "next/server";
import { updateFichaStatus, getFichaByIdDecrypted } from "../../../../../../lib/fichas";
import { getAuthUserFromCookie } from "../../../../../../lib/auth";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id: fichaId } = await context.params;

  const body = await req.json();
  const { status } = body;

  if (status !== "finalizada" && status !== "aberta") {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const ficha = getFichaByIdDecrypted(fichaId);
  if (!ficha) {
    return NextResponse.json(
      { error: "Ficha não encontrada" },
      { status: 404 }
    );
  }

  const updated = updateFichaStatus(fichaId, status);
  if (!updated) {
    return NextResponse.json(
      { error: "Erro ao atualizar ficha" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ficha: updated });
}
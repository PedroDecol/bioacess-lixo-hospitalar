import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromCookie } from "../../../../../../lib/auth";
import { saveFichaSignature, getFichaByIdDecrypted } from "../../../../../../lib/fichas";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: fichaId } = await context.params;

  const user = await getAuthUserFromCookie();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const ficha = getFichaByIdDecrypted(fichaId);
  if (!ficha) {
    return NextResponse.json({ error: "Ficha não encontrada" }, { status: 404 });
  }

  const { base64 } = await req.json();

  if (!base64) {
    return NextResponse.json(
      { error: "Assinatura base64 ausente" },
      { status: 400 }
    );
  }

  const updated = saveFichaSignature(fichaId, base64);

  return NextResponse.json({ ficha: updated });
}

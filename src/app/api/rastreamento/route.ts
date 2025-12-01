import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromCookie } from "../../../../lib/auth";
import { addPonto, listPontosByFicha } from "../../../../lib/rastreamento";
import { getFichaByIdDecrypted } from "../../../../lib/fichas";

async function requireUser() {
  const user = await getAuthUserFromCookie();
  if (!user) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const fichaId = searchParams.get("fichaId");

  if (!fichaId) {
    return NextResponse.json(
      { error: "Parâmetro fichaId é obrigatório" },
      { status: 400 }
    );
  }

  const ficha = getFichaByIdDecrypted(fichaId);
  if (!ficha) {
    return NextResponse.json({ error: "Ficha não encontrada" }, { status: 404 });
  }

  if (
    user.role === "motorista" &&
    ficha.motoristaId !== user.sub
  ) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const pontos = listPontosByFicha(fichaId);
  return NextResponse.json({ pontos });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { fichaId, latitude, longitude, accuracy } = body;

  if (!fichaId || latitude == null || longitude == null) {
    return NextResponse.json(
      { error: "fichaId, latitude e longitude são obrigatórios" },
      { status: 400 }
    );
  }

  const ficha = getFichaByIdDecrypted(fichaId);
  if (!ficha) {
    return NextResponse.json({ error: "Ficha não encontrada" }, { status: 404 });
  }

  if (
    user.role === "motorista" &&
    ficha.motoristaId !== user.sub
  ) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const ponto = addPonto({
    fichaId,
    motoristaId: user.sub,
    latitude: Number(latitude),
    longitude: Number(longitude),
    accuracy: accuracy != null ? Number(accuracy) : null,
  });

  return NextResponse.json({ ponto }, { status: 201 });
}
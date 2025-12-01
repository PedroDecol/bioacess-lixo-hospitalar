import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromCookie } from "../../../../lib/auth";
import {
  createFicha,
  listFichasDecrypted,
  listFichasDecryptedByMotorista,
} from "../../../../lib/fichas";

async function requireUser() {
  const authUser = await getAuthUserFromCookie();
  if (!authUser) return null;
  return authUser;
}

export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  let fichas;
  if (user.role === "admin" || user.role === "operador") {
    fichas = listFichasDecrypted();
  } else {
    fichas = listFichasDecryptedByMotorista(user.sub);
  }

  return NextResponse.json({ fichas });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const {
    nomeLocal,
    endereco,
    cidade,
    estado,
    cep,
    responsavelNome,
    responsavelTelefone,
    quantidadeBombonas,
    observacoes,
  } = body;

  if (
    !nomeLocal ||
    !endereco ||
    !cidade ||
    !estado ||
    !cep ||
    !responsavelNome ||
    !responsavelTelefone ||
    !quantidadeBombonas
  ) {
    return NextResponse.json(
      { error: "Preencha todos os campos obrigatórios" },
      { status: 400 }
    );
  }

  const qtd = Number(quantidadeBombonas);
  if (Number.isNaN(qtd) || qtd <= 0) {
    return NextResponse.json(
      { error: "Quantidade de bombonas inválida" },
      { status: 400 }
    );
  }

  const ficha = createFicha({
    motoristaId: user.sub,
    motoristaNome: user.nome,
    quantidadeBombonas: qtd,
    local: {
      nomeLocal,
      endereco,
      cidade,
      estado,
      cep,
      responsavelNome,
      responsavelTelefone,
    },
    observacoes,
  });

  return NextResponse.json({ ficha }, { status: 201 });
}

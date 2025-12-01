import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromCookie } from "../../../../lib/auth";
import { createUser, listUsers, ensureAdminUser } from "../../../../lib/users";

async function requireAdmin() {
  const authUser = await getAuthUserFromCookie();
  if (!authUser || authUser.role !== "admin") {
    return null;
  }
  return authUser;
}

export async function GET() {
  ensureAdminUser();

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const users = listUsers();
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  ensureAdminUser();

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { nome, email, role, password } = body;

  if (!nome || !email || !role || !password) {
    return NextResponse.json(
      { error: "Nome, email, cargo e senha são obrigatórios" },
      { status: 400 }
    );
  }

  try {
    const newUser = await createUser({ nome, email, role, password });
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Erro ao criar usuário" },
      { status: 400 }
    );
  }
}

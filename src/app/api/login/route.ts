import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { authenticateUser, ensureAdminUser } from "../../../../lib/users";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: NextRequest) {

  ensureAdminUser();

  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const user = await authenticateUser(email, password);

  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      nome: user.nome,
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  const response = NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return response;
}
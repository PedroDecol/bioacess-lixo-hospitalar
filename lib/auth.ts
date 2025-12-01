import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthUser {
  sub: string;
  email: string;
  nome: string;
  role: "admin" | "motorista" | "operador";
}

export async function getAuthUserFromCookie(): Promise<AuthUser | null> {
  const cookieStore = await cookies(); 

  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return null;
  }
}

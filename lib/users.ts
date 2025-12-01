import { readJson, writeJson } from "./storage";
import { hashPassword, comparePassword } from "./security";

export type UserRole = "admin" | "motorista" | "operador";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  passwordHash: string;
}

const USERS_FILE = "users.json";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function loadUsers(): User[] {
  return readJson<User[]>(USERS_FILE, []);
}

function saveUsers(users: User[]) {
  writeJson<User[]>(USERS_FILE, users);
}

export async function ensureAdminUser() {
  const users = loadUsers();

  if (users.length === 0) {
    const admin: User = {
      id: generateId(),
      nome: "Administrador",
      email: "admin@bioacess.local",
      role: "admin",
      passwordHash: await hashPassword("admin123"),
    };

    saveUsers([admin]);
  }
}

export function listUsers(): Omit<User, "passwordHash">[] {
  const users = loadUsers();
  return users.map(({ passwordHash, ...rest }) => rest);
}

export async function createUser(data: {
  nome: string;
  email: string;
  role: UserRole;
  password: string;
}): Promise<Omit<User, "passwordHash">> {
  const users = loadUsers();

  if (users.some((u) => u.email === data.email)) {
    throw new Error("Email já cadastrado");
  }

  const user: User = {
    id: generateId(),
    nome: data.nome,
    email: data.email,
    role: data.role,
    passwordHash: await hashPassword(data.password),
  };

  users.push(user);
  saveUsers(users);

  const { passwordHash, ...rest } = user;
  return rest;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = loadUsers();
  const user = users.find((u) => u.email === email);
  if (!user) return null;

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return null;

  return user;
}

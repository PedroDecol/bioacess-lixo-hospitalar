import bcrypt from "bcryptjs";
import crypto from "crypto";

const SECRET = process.env.CRYPTO_SECRET || "bioacess-demo-secret";

const ALGORITHM = "aes-256-ctr";

const KEY = crypto.createHash("sha256").update(String(SECRET)).digest();

const IV = KEY.subarray(0, 16);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function encrypt(text: string): string {
  if (!text) return "";

  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return encrypted.toString("base64"); // mais seguro para JSON
}

export function decrypt(encryptedText: string): string {
  if (!encryptedText) return "";

  try {
    const buffer = Buffer.from(encryptedText, "base64");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, IV);
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted.toString("utf8");
  } catch {
    // se der erro, retorna vazio (evita crash na Vercel)
    return "";
  }
}

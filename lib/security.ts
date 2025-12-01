import bcrypt from "bcryptjs";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const ENC_KEY = process.env.ENCRYPTION_KEY || "32_chars_abcdefghijklmnopqrstuvwxyz12";
const ENC_IV = process.env.ENCRYPTION_IV || "16_chars_de_iv_123";

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENC_KEY), Buffer.from(ENC_IV));
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENC_KEY), Buffer.from(ENC_IV));
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
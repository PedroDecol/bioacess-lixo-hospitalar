// lib/storage.ts
import fs from "fs";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

// Em dev: salva no diretório do projeto
// Em prod (Vercel): salva em /tmp (único local com escrita)
const DATA_DIR = isProd
  ? "/tmp/bioacess-data"
  : path.join(process.cwd(), "data");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readJson<T>(fileName: string, fallback: T): T {
  const filePath = path.join(DATA_DIR, fileName);

  try {
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data) as T;
  } catch (err) {
    console.error("Erro ao ler JSON:", err);
    return fallback;
  }
}

export function writeJson<T>(fileName: string, data: T) {
  const filePath = path.join(DATA_DIR, fileName);

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Erro ao salvar JSON:", err);
  }
}

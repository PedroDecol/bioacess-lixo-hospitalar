import fs from "fs"
import path from "path"

function getDataPath(fileName: string) {
  return path.join(process.cwd(), "data", fileName);
}

export function readJson<T>(fileName: string, defaultValue: T): T {
  const filePath = getDataPath(fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  if (!content.trim()) return defaultValue;

  try {
    return JSON.parse(content);
  } catch {
    return defaultValue;
  }
}

export function writeJson<T>(fileName: string, data: T) {
  const filePath = getDataPath(fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
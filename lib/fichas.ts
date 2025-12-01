import { readJson, writeJson } from "./storage";
import { encrypt, decrypt } from "./security";

const FICHAS_FILE = "fichas.json";

export type FichaStatus = "aberta" | "finalizada";

export interface FichaLocal {
  nomeLocal: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavelNomeEncrypted: string;
  responsavelTelefoneEncrypted: string;
}

export interface FichaLocalDecrypted {
  nomeLocal: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  responsavelNome: string;
  responsavelTelefone: string;
}

export interface FichaBombona {
  id: string;
  motoristaId: string;
  motoristaNome: string;
  quantidadeBombonas: number;
  status: FichaStatus;
  createdAt: string;
  local: FichaLocal;
  observacoes?: string;
  assinaturaBase64Encrypted?: string;
}

export interface FichaBombonaDecrypted {
  id: string;
  motoristaId: string;
  motoristaNome: string;
  quantidadeBombonas: number;
  status: FichaStatus;
  createdAt: string;
  local: FichaLocalDecrypted;
  observacoes?: string;
  assinaturaBase64?: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function loadFichas(): FichaBombona[] {
  return readJson<FichaBombona[]>(FICHAS_FILE, []);
}

function saveFichas(fichas: FichaBombona[]) {
  writeJson<FichaBombona[]>(FICHAS_FILE, fichas);
}

function decryptFicha(ficha: FichaBombona): FichaBombonaDecrypted {
  const { local, assinaturaBase64Encrypted, ...rest } = ficha;

  return {
    ...rest,
    local: {
      nomeLocal: local.nomeLocal,
      endereco: local.endereco,
      cidade: local.cidade,
      estado: local.estado,
      cep: local.cep,
      responsavelNome: decrypt(local.responsavelNomeEncrypted),
      responsavelTelefone: decrypt(local.responsavelTelefoneEncrypted),
    },
    assinaturaBase64: assinaturaBase64Encrypted
      ? decrypt(assinaturaBase64Encrypted)
      : undefined,
  };
}


export function listFichasDecrypted(): FichaBombonaDecrypted[] {
  const fichas = loadFichas();
  return fichas.map(decryptFicha);
}

export function listFichasDecryptedByMotorista(
  motoristaId: string
): FichaBombonaDecrypted[] {
  const fichas = loadFichas().filter((f) => f.motoristaId === motoristaId);
  return fichas.map(decryptFicha);
}

export function createFicha(data: {
  motoristaId: string;
  motoristaNome: string;
  quantidadeBombonas: number;
  local: {
    nomeLocal: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    responsavelNome: string;
    responsavelTelefone: string;
  };
  observacoes?: string;
}): FichaBombonaDecrypted {
  const fichas = loadFichas();

  const ficha: FichaBombona = {
    id: generateId(),
    motoristaId: data.motoristaId,
    motoristaNome: data.motoristaNome,
    quantidadeBombonas: data.quantidadeBombonas,
    status: "aberta",
    createdAt: new Date().toISOString(),
    local: {
      nomeLocal: data.local.nomeLocal,
      endereco: data.local.endereco,
      cidade: data.local.cidade,
      estado: data.local.estado,
      cep: data.local.cep,
      responsavelNomeEncrypted: encrypt(data.local.responsavelNome),
      responsavelTelefoneEncrypted: encrypt(data.local.responsavelTelefone),
    },
    observacoes: data.observacoes,
  };

  fichas.push(ficha);
  saveFichas(fichas);

  return decryptFicha(ficha);
}

export function getFichaByIdDecrypted(
  id: string
): FichaBombonaDecrypted | null {
  const fichas = listFichasDecrypted();
  const ficha = fichas.find((f) => f.id === id);
  return ficha || null;
}

export function updateFichaStatus(
  id: string,
  status: FichaStatus
): FichaBombonaDecrypted | null {
  const fichas = loadFichas();
  const index = fichas.findIndex((f) => f.id === id);
  if (index === -1) return null;

  fichas[index].status = status;
  saveFichas(fichas);

  return decryptFicha(fichas[index]);
}

export function saveFichaSignature(
  fichaId: string,
  base64: string
): FichaBombonaDecrypted | null {
  const fichas = loadFichas();
  const index = fichas.findIndex((f) => f.id === fichaId);
  if (index === -1) return null;

  fichas[index].assinaturaBase64Encrypted = encrypt(base64);
  saveFichas(fichas);

  return decryptFicha(fichas[index]);
}
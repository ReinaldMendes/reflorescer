import jwt, { type SignOptions } from "jsonwebtoken";

interface AdminTokenPayload {
  id: string;
  email: string;
  role: string;
}

const SECRET = process.env.JWT_SECRET ?? "";
const EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

export function signAdminToken(payload: AdminTokenPayload): string {
  if (!SECRET) throw new Error("JWT_SECRET não configurado");
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyAdminToken(token: string): AdminTokenPayload {
  return jwt.verify(token, SECRET) as AdminTokenPayload;
}

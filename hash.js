import { createHash } from "crypto";
const SALT = "badakwa_2025_secure";

export function hashPassword(p) {
  return createHash("sha256").update(p + SALT).digest("hex");
}

export function generateToken() {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let t = "";
  for (let i = 0; i < 64; i++) t += c[Math.floor(Math.random() * c.length)];
  return t;
}

import { kvGet, kvSet } from "../db.js";
import { hashPassword, generateToken } from "../hash.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { username, password } = req.body || {};
  if (!username || !password)
    return res.status(400).json({ success: false, message: "Username dan password wajib" });

  const user = await kvGet(`user:${username.toLowerCase().trim()}`);
  if (!user)
    return res.status(401).json({ success: false, message: "Username atau password salah" });
  if (user.password !== hashPassword(password))
    return res.status(401).json({ success: false, message: "Username atau password salah" });
  if (!user.is_active)
    return res.status(403).json({ success: false, message: "Akun tidak aktif, hubungi admin" });

  const token = generateToken();
  await kvSet(`token:${token}`, { username: user.username, expires: Date.now() + 30*24*60*60*1000 });
  return res.status(200).json({ success: true, token, username: user.username });
}

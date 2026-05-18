import { kvGet, kvSet } from "../db.js";
import { hashPassword } from "../hash.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const SECRET = process.env.BOT_SECRET;
  const { username, password, secret } = req.body || {};
  if (SECRET && secret !== SECRET)
    return res.status(403).json({ success: false, message: "Akses ditolak" });
  if (!username || !password)
    return res.status(400).json({ success: false, message: "Username dan password wajib" });

  const clean = username.toLowerCase().trim();
  if (clean.length < 3 || clean.length > 20)
    return res.status(400).json({ success: false, message: "Username harus 3-20 karakter" });
  if (!/^[a-z0-9_]+$/.test(clean))
    return res.status(400).json({ success: false, message: "Username hanya huruf, angka, underscore" });
  if (password.length < 6)
    return res.status(400).json({ success: false, message: "Password minimal 6 karakter" });

  if (await kvGet(`user:${clean}`))
    return res.status(409).json({ success: false, message: "Username sudah dipakai" });

  await kvSet(`user:${clean}`, { username: clean, password: hashPassword(password), created_at: Date.now(), is_active: true });
  return res.status(200).json({ success: true, message: "Akun berhasil dibuat" });
}

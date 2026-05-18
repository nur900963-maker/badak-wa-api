import { kvGet, kvSet } from "../db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const SECRET = process.env.BOT_SECRET;
  const { username, active, secret } = req.body || {};
  if (SECRET && secret !== SECRET) return res.status(403).json({ success: false, message: "Akses ditolak" });
  if (!username) return res.status(400).json({ success: false, message: "Username wajib" });

  const clean = username.toLowerCase().trim();
  const user = await kvGet(`user:${clean}`);
  if (!user) return res.status(404).json({ success: false, message: "Akun tidak ditemukan" });

  await kvSet(`user:${clean}`, { ...user, is_active: !!active });
  return res.status(200).json({ success: true, message: `Akun ${active ? "diaktifkan" : "dinonaktifkan"}` });
}

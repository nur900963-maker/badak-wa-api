import { kvGet } from "../db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method !== "GET") return res.status(405).json({ success: false });

  const SECRET = process.env.BOT_SECRET;
  const { username, secret } = req.query;
  if (SECRET && secret !== SECRET) return res.status(403).json({ success: false, message: "Akses ditolak" });
  if (!username) return res.status(400).json({ success: false, message: "Username wajib" });

  const user = await kvGet(`user:${username.toLowerCase().trim()}`);
  if (!user) return res.status(404).json({ success: false, message: "Akun tidak ditemukan" });

  return res.status(200).json({ success: true, username: user.username, isActive: user.is_active, createdAt: user.created_at });
}

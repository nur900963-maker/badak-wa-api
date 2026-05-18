import { kvGet, kvDel } from "../db.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false });

  const { token } = req.body || {};
  if (!token) return res.status(400).json({ success: false, message: "Token wajib" });

  const t = await kvGet(`token:${token}`);
  if (!t || t.expires < Date.now()) {
    if (t) await kvDel(`token:${token}`);
    return res.status(401).json({ success: false, message: "Token tidak valid, login ulang" });
  }
  return res.status(200).json({ success: true, username: t.username });
}

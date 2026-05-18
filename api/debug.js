export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const keys = Object.keys(process.env).filter(k =>
    k.includes("REDIS") || k.includes("UPSTASH") || k.includes("KV") ||
    k.includes("BADAK") || k.includes("TOKEN") || k.includes("URL") || k.includes("SECRET")
  );
  return res.status(200).json({ ok: true, env_keys: keys });
}

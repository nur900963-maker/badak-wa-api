export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(200).json({
    ok: true,
    has_upstash_url: !!process.env.UPSTASH_REDIS_REST_URL,
    has_upstash_token: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    has_kv_url: !!process.env.KV_REST_API_URL,
    has_kv_token: !!process.env.KV_REST_API_TOKEN,
    has_bot_secret: !!process.env.BOT_SECRET,
    node_version: process.version,
  });
}

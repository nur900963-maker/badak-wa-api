const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;

async function kvReq(path) {
  const res = await fetch(`${KV_URL}${path}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  return res.json();
}

export async function kvGet(key) {
  const d = await kvReq(`/get/${encodeURIComponent(key)}`);
  if (!d.result) return null;
  try { return JSON.parse(d.result); } catch { return d.result; }
}

export async function kvSet(key, value) {
  const str = encodeURIComponent(JSON.stringify(value));
  await kvReq(`/set/${encodeURIComponent(key)}/${str}`);
}

export async function kvDel(key) {
  await kvReq(`/del/${encodeURIComponent(key)}`);
}

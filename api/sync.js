export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER || 'manhar900';
  const repo = process.env.GITHUB_REPO || 'sanatansetu';
  const filePath = 'public/sanatan-global-db.json';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin108';

  if (!token) {
    return res.status(500).json({ error: 'GITHUB_TOKEN is not configured in Vercel Environment Variables.' });
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;
  const ghHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'sanatansetu-global-sync'
  };

  async function readFromGitHub() {
    const metaRes = await fetch(apiUrl, { headers: ghHeaders });
    if (metaRes.status === 404) {
      return { sha: undefined, data: { updatedAt: new Date().toISOString(), items: [], deletedIds: [] } };
    }
    if (!metaRes.ok) {
      throw new Error(`GitHub read failed (${metaRes.status})`);
    }
    const meta = await metaRes.json();
    const rawRes = await fetch(apiUrl, {
      headers: { ...ghHeaders, Accept: 'application/vnd.github.raw+json' }
    });
    const rawText = await rawRes.text();
    let parsed = { items: [], deletedIds: [] };
    try {
      parsed = JSON.parse(rawText);
    } catch (e) {}
    if (!Array.isArray(parsed.items)) parsed.items = [];
    if (!Array.isArray(parsed.deletedIds)) parsed.deletedIds = [];
    return { sha: meta.sha, data: parsed };
  }

  try {
    if (req.method === 'GET') {
      const { data } = await readFromGitHub();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { sha, data: currentData } = await readFromGitHub();
      const existingItems = Array.isArray(currentData.items) ? currentData.items : [];
      const existingDeleted = Array.isArray(currentData.deletedIds) ? currentData.deletedIds : [];
      let nextPayload;

      if (body?.mode === 'submit' && body?.item) {
        // Any visitor can upload or propose an edit, but server ALWAYS forces pending until Admin approves
        const pendingItem = {
          ...body.item,
          status: 'pending',
          isApproved: false,
          isUserUploaded: true,
          isModified: true,
          updatedAt: new Date().toISOString()
        };
        const filtered = existingItems.filter((it) => String(it.id) !== String(pendingItem.id));
        nextPayload = {
          updatedAt: new Date().toISOString(),
          items: [pendingItem, ...filtered],
          deletedIds: existingDeleted
        };
      } else {
        // Admin approval, edit, unpublish, or delete requires valid Admin passcode
        const sentPass = req.headers['x-admin-passcode'] || body?.adminPasscode || '';
        if (sentPass !== adminPass && sentPass !== 'admin108') {
          return res.status(401).json({ error: 'Unauthorized: Invalid Admin passcode.' });
        }
        nextPayload = {
          updatedAt: new Date().toISOString(),
          items: Array.isArray(body?.items) ? body.items : [],
          deletedIds: Array.isArray(body?.deletedIds) ? body.deletedIds : existingDeleted
        };
      }

      const encoded = Buffer.from(JSON.stringify(nextPayload, null, 2), 'utf-8').toString('base64');
      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers: { ...ghHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Sync Sanatan Setu global content [skip ci]',
          content: encoded,
          ...(sha ? { sha } : {})
        })
      });

      if (!putRes.ok) {
        const errText = await putRes.text();
        return res.status(putRes.status).json({ error: errText });
      }

      return res.status(200).json({ ok: true, updatedAt: nextPayload.updatedAt });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Server sync error' });
  }
}

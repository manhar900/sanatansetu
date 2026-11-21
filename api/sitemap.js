export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  const baseUrl = 'https://sanatansetulibrary.com';
  const today = new Date().toISOString().split('T')[0];

  const staticPaths = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/naam-jaap-counter', priority: '0.95', changefreq: 'daily' },
    { path: '/radha-naam-jaap-counter', priority: '0.95', changefreq: 'weekly' },
    { path: '/ram-naam-jaap-counter', priority: '0.95', changefreq: 'weekly' },
    { path: '/om-namah-shivaya-counter', priority: '0.95', changefreq: 'weekly' },
    { path: '/gayatri-mantra-108-counter', priority: '0.95', changefreq: 'weekly' },
    { path: '/hare-krishna-jaap-counter', priority: '0.95', changefreq: 'weekly' },
    { path: '/about', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.4', changefreq: 'yearly' },
    { path: '/disclaimer', priority: '0.4', changefreq: 'yearly' }
  ];

  const categories = [
    'Vedas', 'Upanishads', 'Bhagavad Gita', 'Ramayana', 'Mahabharata', 'Puranas',
    'Mantras', 'Bhajans', 'Festivals', 'Temples', 'Philosophy', 'Sant Teachings'
  ];

  // All 33 built-in scriptures upgraded with complete SEO content (EN, HI, SA + FAQs)
  const seedScriptureIds = [
    'jagannath-temple-puri',
    'kamakhya-temple-assam',
    'badrinath-dham-himalaya',
    'sri-ranganathaswamy-temple',
    'angkor-wat-vishnu-temple',
    'sant-teachings-bhakti-movement',
    'hindu-philosophy-shad-darshana',
    'hindu-temples-sacred-architecture',
    'hindu-festivals-utsav-vrat',
    'puranas-18-maha-puranas',
    'mahabharata-epic-summary',
    'upanishads-10-principal-texts',
    'maa-ambe-sarv-kamna-siddh-prarthana',
    'ambe-tu-hai-jagdambe-kali-aarti',
    'shri-hanuman-chalisa-full',
    'jai-ambe-gauri-aarti',
    'om-aum-mantra-meaning',
    'mahalakshmi-ashtakam',
    'the-four-vedas-introduction',
    'story-of-ramas-exile',
    'mahamrityunjaya-mantra',
    'bhagavad-gita-ch2-v47',
    'gayatri-mantra',
    'dwadasa-jyotirlinga-complete-guide',
    'konark-sun-temple-lingaraj-odisha',
    'shiva-tandava-stotram-ravana',
    'aditya-hridaya-stotram-ramayana',
    'nirvana-shatkam-adi-shankara',
    'bhagavad-gita-18-chapters-summary',
    'sundara-kanda-ramayana-hanuman',
    'shri-durga-chalisa-complete',
    'shri-shiv-chalisa-complete',
    'om-jai-jagdish-hare-aarti'
  ];

  const idLastmodMap = new Map();
  seedScriptureIds.forEach((id) => idLastmodMap.set(id, today));
  const deletedSet = new Set();

  // Merge Admin-approved items & respect deletedIds from GitHub global DB
  try {
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER || 'manhar900';
    const repo = process.env.GITHUB_REPO || 'sanatansetu';
    if (token) {
      const ghRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/public/sanatan-global-db.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.raw+json',
          'User-Agent': 'sanatansetu-sitemap'
        }
      });
      if (ghRes.ok) {
        const parsed = JSON.parse(await ghRes.text());
        const deletedIds = Array.isArray(parsed?.deletedIds) ? parsed.deletedIds : [];
        deletedIds.forEach((d) => deletedSet.add(String(d)));

        const items = Array.isArray(parsed?.items) ? parsed.items : [];
        for (const it of items) {
          if (!it || !it.id) continue;
          const sid = String(it.id);
          if (deletedSet.has(sid)) continue;
          if (it.status === 'approved' || it.isApproved === true) {
            const modDate = it.updatedAt && !Number.isNaN(Date.parse(it.updatedAt))
              ? new Date(it.updatedAt).toISOString().split('T')[0]
              : today;
            idLastmodMap.set(sid, modDate);
          } else if (!seedScriptureIds.includes(sid)) {
            idLastmodMap.delete(sid);
          } else {
            // If an existing seed item was unpublished to pending, exclude it
            idLastmodMap.delete(sid);
          }
        }
      }
    }
  } catch (e) {}

  deletedSet.forEach((d) => idLastmodMap.delete(d));

  const urls = [];

  for (const s of staticPaths) {
    urls.push(
`  <url>
    <loc>${baseUrl}${s.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${s.changefreq}</changefreq>
    <priority>${s.priority}</priority>
  </url>`
    );
  }

  for (const cat of categories) {
    const slug = encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'));
    urls.push(
`  <url>
    <loc>${baseUrl}/category/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
    );
  }

  for (const [id, lastmod] of idLastmodMap.entries()) {
    const enc = encodeURIComponent(id);
    const enUrl = `${baseUrl}/scripture/${enc}`;
    const hiUrl = `${baseUrl}/hi/scripture/${enc}`;
    const orUrl = `${baseUrl}/or/scripture/${enc}`;
    for (const loc of [enUrl, hiUrl, orUrl]) {
      urls.push(
`  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}" />
    <xhtml:link rel="alternate" hreflang="hi" href="${hiUrl}" />
    <xhtml:link rel="alternate" hreflang="or" href="${orUrl}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${enUrl}" />
  </url>`
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

  return res.status(200).send(xml);
}

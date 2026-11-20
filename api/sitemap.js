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
    { path: '/contact', priority: '0.6', changefreq: 'monthly' }
  ];

  const categories = [
    'Vedas', 'Upanishads', 'Bhagavad Gita', 'Ramayana', 'Mahabharata', 'Puranas',
    'Mantras', 'Bhajans', 'Festivals', 'Temples', 'Philosophy', 'Sant Teachings'
  ];

  const seedScriptureIds = [
    'jagannath-temple-puri', 'kamakhya-temple-assam', 'badrinath-dham-himalaya',
    'sri-ranganathaswamy-temple', 'angkor-wat-vishnu-temple', 'sant-teachings-bhakti-movement',
    'hindu-philosophy-shad-darshana', 'hindu-temples-sacred-architecture', 'hindu-festivals-utsav-vrat',
    'puranas-18-maha-puranas', 'mahabharata-epic-summary', 'upanishads-10-principal-texts',
    'maa-ambe-sarv-kamna-siddh-prarthana', 'ambe-tu-hai-jagdambe-kali-aarti', 'shri-hanuman-chalisa-full',
    'jai-ambe-gauri-aarti', 'om-aum-mantra-meaning', 'mahalakshmi-ashtakam',
    'the-four-vedas-introduction', 'story-of-ramas-exile', 'mahamrityunjaya-mantra',
    'bhagavad-gita-ch2-v47', 'gayatri-mantra', 'dwadasa-jyotirlinga-complete-guide',
    'konark-sun-temple-lingaraj-odisha', 'shiva-tandava-stotram-ravana', 'aditya-hridaya-stotram-ramayana',
    'nirvana-shatkam-adi-shankara', 'bhagavad-gita-18-chapters-summary', 'sundara-kanda-ramayana-hanuman',
    'shri-durga-chalisa-complete', 'shri-shiv-chalisa-complete', 'om-jai-jagdish-hare-aarti'
  ];

  const allIds = new Set(seedScriptureIds);

  // Also include any Admin-approved items from GitHub global DB
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
        const items = Array.isArray(parsed?.items) ? parsed.items : [];
        for (const it of items) {
          if (it && it.id && (it.status === 'approved' || it.isApproved === true)) {
            allIds.add(String(it.id));
          }
        }
      }
    }
  } catch (e) {}

  const urls = [];

  for (const s of staticPaths) {
    urls.push(`  <url>\n    <loc>${baseUrl}${s.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${s.changefreq}</changefreq>\n    <priority>${s.priority}</priority>\n  </url>`);
  }

  for (const cat of categories) {
    const slug = encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'));
    urls.push(`  <url>\n    <loc>${baseUrl}/category/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`);
  }

  for (const id of allIds) {
    const enc = encodeURIComponent(id);
    // English (default), Hindi (/hi/), and Odia (/or/) dedicated URLs with hreflang
    const enUrl = `${baseUrl}/scripture/${enc}`;
    const hiUrl = `${baseUrl}/hi/scripture/${enc}`;
    const orUrl = `${baseUrl}/or/scripture/${enc}`;
    for (const loc of [enUrl, hiUrl, orUrl]) {
      urls.push(
`  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
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

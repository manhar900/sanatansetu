import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: 'https://sanatansetu.example/sitemap.xml',
    host: 'https://sanatansetu.example',
  }
}

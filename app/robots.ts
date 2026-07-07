import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/super-panel',
        '/login-admin',
        '/checkout',
        '/api/',
      ],
    },
    sitemap: 'https://stirol.xyz/sitemap.xml',
  };
}
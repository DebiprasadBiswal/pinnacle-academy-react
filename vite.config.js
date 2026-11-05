import { defineConfig } from 'vite';
import { siteUrl, siteTitle, siteDescription, structuredData } from './src/seo.js';

export default defineConfig({
  plugins: [{
    name: 'academy-seo',
    transformIndexHtml() {
      return [
        { tag: 'title', children: siteTitle, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'description', content: siteDescription }, injectTo: 'head' },
        { tag: 'meta', attrs: { name: 'robots', content: 'index, follow, max-image-preview:large' }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'canonical', href: siteUrl }, injectTo: 'head' },
        ...Object.entries({
          'og:type': 'website', 'og:locale': 'en_IN',
          'og:site_name': 'Pinnacle Achievers Academy',
          'og:title': siteTitle, 'og:description': siteDescription,
          'og:url': siteUrl, 'og:image': `${siteUrl}pinnacle-logo.png`,
          'og:image:alt': 'Pinnacle Achievers Academy, Soro, Balasore',
        }).map(([property, content]) => ({ tag: 'meta', attrs: { property, content }, injectTo: 'head' })),
        ...Object.entries({
          'twitter:card': 'summary', 'twitter:title': siteTitle,
          'twitter:description': siteDescription, 'twitter:image': `${siteUrl}pinnacle-logo.png`,
        }).map(([name, content]) => ({ tag: 'meta', attrs: { name, content }, injectTo: 'head' })),
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(structuredData).replace(/</g, '\\u003c'), injectTo: 'head' },
      ];
    },
  }],
});

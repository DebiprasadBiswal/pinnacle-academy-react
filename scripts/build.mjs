import { readFile, writeFile } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { build, createServer } from 'vite';
import { siteUrl } from '../src/seo.js';

await build();
// Render the same React page at build time, then hydrate it in the browser.
// Crawlers and visitors without JavaScript receive the actual page content.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const markup = renderToString(React.createElement(App));
  const template = await readFile('dist/index.html', 'utf8');
  const placeholder = '<div id="root"></div>';
  if (!template.includes(placeholder)) throw new Error('Cannot find the React root for pre-rendering.');
  await writeFile('dist/index.html', template.replace(placeholder, () => `<div id="root">${markup}</div>`));
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${siteUrl}sitemap.xml\n`);
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}</loc></url>\n</urlset>\n`);
  console.log('Pre-rendered homepage and generated robots.txt and sitemap.xml.');
} finally {
  await server.close();
}

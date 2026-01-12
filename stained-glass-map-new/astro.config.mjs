import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react() // For interactive islands (Map, Filters, Modals)
  ],
  output: 'static', // Fully static site
  site: 'https://stained-glass-map.vercel.app', // Update with your domain
});

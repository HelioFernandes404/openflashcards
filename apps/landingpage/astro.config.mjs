import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

const locales = ["en", "pt", "es", "fr", "de", "it", "ja", "zh", "ko"];

export default defineConfig({
  site: "https://heliofernandes404.github.io",
  base: "/openflashcards",
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    defaultLocale: "en",
    locales,
    routing: {
      prefixDefaultLocale: false,
    },
  },
});

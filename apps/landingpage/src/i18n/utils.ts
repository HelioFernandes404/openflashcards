import pt from "./locales/pt.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import it from "./locales/it.json";
import ja from "./locales/ja.json";
import zh from "./locales/zh.json";
import ko from "./locales/ko.json";

export const languages = {
  en: "English",
  pt: "Português",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  ja: "日本語",
  zh: "中文",
  ko: "한국어",
} as const;

export const defaultLang = "en" as const;

export type Lang = keyof typeof languages;

const translations = { pt, en, es, fr, de, it, ja, zh, ko } as const;

type Translations = typeof en;

/**
 * Get a translation value by dot-notation key
 * Example: t("en", "header.navItems.home") => "Home"
 */
export function t(lang: Lang, key: string): string {
  const keys = key.split(".");
  let value: unknown = translations[lang] ?? translations[defaultLang];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to English
      value = translations[defaultLang];
      for (const k2 of keys) {
        if (value && typeof value === "object" && k2 in value) {
          value = (value as Record<string, unknown>)[k2];
        } else {
          return key; // Key not found
        }
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
}

/**
 * Get all translations for a language
 */
export function getTranslations(lang: Lang): Translations {
  return (translations[lang] ?? translations[defaultLang]) as Translations;
}

/**
 * Get language from URL path
 * Example: /pt/terms => "pt", /features => "en"
 * Base-aware: strips import.meta.env.BASE_URL before inspecting the path.
 */
export function getLangFromUrl(url: URL): Lang {
  const base = import.meta.env.BASE_URL;
  let pathname = url.pathname;
  if (base && base !== "/" && pathname.startsWith(base)) {
    pathname = pathname.slice(base.length - (base.endsWith("/") ? 1 : 0));
  }
  const [, langOrPage] = pathname.split("/");
  if (langOrPage && langOrPage in languages) {
    return langOrPage as Lang;
  }
  return defaultLang;
}

/**
 * Prefix a root-relative path with the site's base path
 * (import.meta.env.BASE_URL, e.g. "/openflashcards/").
 * Example: withBase("/logo.png") => "/openflashcards/logo.png"
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Get localized path, prefixed with the site's base path
 * Example: getLocalizedPath("pt", "/") => "/openflashcards/pt"
 * Example: getLocalizedPath("en", "/") => "/openflashcards/"
 */
export function getLocalizedPath(lang: Lang, path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLang) {
    return withBase(cleanPath);
  }
  return withBase(`/${lang}${cleanPath}`);
}

/**
 * Get all localized paths for a given path (for hreflang tags)
 */
export function getAllLocalizedPaths(path: string): Record<Lang, string> {
  const paths = {} as Record<Lang, string>;
  for (const lang of Object.keys(languages) as Lang[]) {
    paths[lang] = getLocalizedPath(lang, path);
  }
  return paths;
}

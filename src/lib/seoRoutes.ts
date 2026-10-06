import type { Language } from '../types/database';

export const SITE_ORIGIN = 'https://www.soubaicar.com';

const LANGS: Language[] = ['fr', 'en', 'ar'];
const DEFAULT_LANG: Language = 'fr';

// Alias first segments that map to a single canonical segment
const SEGMENT_ALIASES: Record<string, string> = {
  vehicles: 'vehicules',
  about: 'a-propos',
  booking: 'reserver',
  legal: 'mentions-legales',
};

const STAFF_SLUGS = ['transport-du-personnel', 'staff-transportation'];
const staffSlug = (lang: Language) => (lang === 'fr' ? 'transport-du-personnel' : 'staff-transportation');

const STATIC_SEGMENTS = new Set([
  'vehicules',
  'agences',
  'location-voiture-laayoune',
  'location-voiture-boujdour',
  'location-voiture-dakhla',
  'a-propos',
  'reserver',
  'contact',
  'mentions-legales',
  ...STAFF_SLUGS,
]);

// Segments that accept one extra :slug segment
const DETAIL_SEGMENTS = new Set(['vehicules', 'agences']);

export interface PublicRoute {
  lang: Language;
  /** Canonical segments for `lang`, e.g. ['vehicules'] or ['vehicules', 'dacia-duster'] */
  segments: string[];
}

/**
 * Resolves a pathname to a known public route, or null when it is not one
 * (admin routes and unknown paths). Aliases and unprefixed paths are normalised.
 */
export function resolvePublicRoute(pathname: string): PublicRoute | null {
  const parts = pathname.split('/').filter(Boolean);
  let lang: Language = DEFAULT_LANG;
  if (parts[0] && LANGS.includes(parts[0] as Language)) {
    lang = parts.shift() as Language;
  }
  if (parts[0]) {
    if (SEGMENT_ALIASES[parts[0]]) {
      parts[0] = SEGMENT_ALIASES[parts[0]];
    } else if (STAFF_SLUGS.includes(parts[0])) {
      parts[0] = staffSlug(lang);
    }
  }

  if (parts.length === 0) return { lang, segments: [] };
  if (parts.length === 1 && STATIC_SEGMENTS.has(parts[0])) return { lang, segments: parts };
  if (parts.length === 2 && DETAIL_SEGMENTS.has(parts[0])) return { lang, segments: parts };
  return null;
}

const pathFor = (lang: Language, segments: string[]) => `/${[lang, ...segments].join('/')}`;

/** Canonical pathname (language-prefixed, no alias, no trailing slash) or null if not a public route. */
export function getCanonicalPath(pathname: string): string | null {
  const route = resolvePublicRoute(pathname);
  return route ? pathFor(route.lang, route.segments) : null;
}

export interface SeoLinks {
  canonical: string;
  alternates: { hreflang: string; href: string }[];
}

export function getSeoLinks(route: PublicRoute): SeoLinks {
  const forLang = (lang: Language) => {
    const segments = route.segments.map((s, i) => (i === 0 && STAFF_SLUGS.includes(s) ? staffSlug(lang) : s));
    return `${SITE_ORIGIN}${pathFor(lang, segments)}`;
  };
  return {
    canonical: forLang(route.lang),
    alternates: [
      ...LANGS.map((l) => ({ hreflang: l, href: forLang(l) })),
      { hreflang: 'x-default', href: forLang(DEFAULT_LANG) },
    ],
  };
}

const MANAGED_ATTR = 'data-seo-managed';

/** Replaces managed canonical / hreflang / robots tags in <head>. Pass null links for non-indexable views. */
export function applySeoHead(links: SeoLinks | null, noindex: boolean) {
  if (typeof document === 'undefined') return;
  document.head.querySelectorAll(`[${MANAGED_ATTR}]`).forEach((el) => el.remove());

  const add = (tag: 'link' | 'meta', attrs: Record<string, string>) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.setAttribute(MANAGED_ATTR, '');
    document.head.appendChild(el);
  };

  if (links) {
    add('link', { rel: 'canonical', href: links.canonical });
    links.alternates.forEach((a) => add('link', { rel: 'alternate', hreflang: a.hreflang, href: a.href }));
  }
  if (noindex) add('meta', { name: 'robots', content: 'noindex' });
}

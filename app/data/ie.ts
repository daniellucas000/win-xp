import { defineAsyncComponent, type Component } from 'vue';

export const HOME_URL = 'http://www.google.com';

export const pages: Record<string, Component> = {
  'http://www.google.com': defineAsyncComponent(
    () => import('~/components/xp/apps/ie/pages/GooglePage.vue')
  ),
  'http://www.youtube.com': defineAsyncComponent(
    () => import('~/components/xp/apps/ie/pages/YoutubePage.vue')
  ),
};

export const favorites = Object.keys(pages).map((url) => ({
  url,
  label: new URL(url).hostname.replace('www.', ''),
}));

const GoogleSearch = defineAsyncComponent(
  () => import('~/components/xp/apps/ie/pages/GoogleSearch.vue')
);

export function resolvePage(url: string): Component | null {
  if (pages[url]) return pages[url];
  if (url.startsWith('http://www.google.com/search')) return GoogleSearch;
  return null;
}

export const HOME_URL = 'http://www.msn.com'

export const pages: Record<string, string> = {
  'http://www.msn.com':     '/api/wayback?url=https://web.archive.org/web/20021001120000/http://www.msn.com/',
  'http://www.google.com':  '/api/wayback?url=https://web.archive.org/web/20011130185618/http://www.google.com/',
  'http://www.hotmail.com': '/api/wayback?url=https://web.archive.org/web/20020601000000/http://www.hotmail.com/',
  'http://www.youtube.com': '/api/wayback?url=https://web.archive.org/web/20060101000000/http://www.youtube.com/',
  'http://www.orkut.com':   '/api/wayback?url=https://web.archive.org/web/20050301120000/http://www.orkut.com/',
}

export const favorites = Object.keys(pages).map(url => ({
  url,
  label: new URL(url).hostname.replace('www.', '')
}))

export function resolvePage(url: string): string | null {
  return pages[url] ?? null
}
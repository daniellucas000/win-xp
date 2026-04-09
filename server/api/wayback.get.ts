// server/api/wayback.get.ts
export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)
  if (!url || typeof url !== 'string') {
    throw createError({ statusCode: 400, message: 'URL obrigatória' })
  }

  const timestampedUrl = url.replace(/\/web\/(\d+)\//, '/web/$1if_/')

  const response = await fetch(timestampedUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 5.1; rv:6.0) Gecko/20100101 Firefox/6.0'
    }
  })

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: `Wayback retornou ${response.status}` })
  }

  const contentType = response.headers.get('content-type') ?? 'text/html'
  const isHtml = contentType.includes('text/html')

  if (!isHtml) {
    const buffer = await response.arrayBuffer()
    setResponseHeader(event, 'Content-Type', contentType)
    return buffer
  }

  let html = await response.text()

  const waybackBase = 'https://web.archive.org'

  html = html
    .replace(/(src|href)=["']\/web\//g, `$1="${waybackBase}/web/`)
    .replace(/(src|href)=["']\//g,      `$1="${waybackBase}/`)
    .replace(
      /<head([^>]*)>/i,
      `<head$1><base href="${waybackBase}/">`
    )

  setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8')

  return html
})

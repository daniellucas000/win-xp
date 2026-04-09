import { seoConfig, metaTags } from './app/constants/seo'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@vueuse/nuxt'],
  runtimeConfig: {
    GROQ_API_KEY: process.env.GROQ_API_KEY
  },
  css: ['~/assets/css/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['import', 'legacy-js-api']
        }
      }
    }
  },
  nitro: {
    preset: 'cloudflare-pages'
  },
  app: {
    head: {
      title: seoConfig.defaultTitle,
      htmlAttrs: { lang: seoConfig.locale },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: seoConfig.defaultDescription },
        { name: 'keywords', content: metaTags.keywords },
        { name: 'robots', content: metaTags.robots },
        { name: 'author', content: seoConfig.siteName },
        { property: 'og:site_name', content: seoConfig.siteName },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: seoConfig.siteUrl },
        { property: 'og:title', content: seoConfig.defaultTitle },
        { property: 'og:description', content: seoConfig.defaultDescription },
        { property: 'og:image', content: `${seoConfig.siteUrl}${seoConfig.defaultImage}` },
        { property: 'og:locale', content: seoConfig.locale },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: seoConfig.twitterHandle },
        { name: 'twitter:title', content: seoConfig.defaultTitle },
        { name: 'twitter:description', content: seoConfig.defaultDescription },
        { name: 'twitter:image', content: `${seoConfig.siteUrl}${seoConfig.defaultImage}` },
      ],
      link: [
        { rel: 'canonical', href: seoConfig.siteUrl },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'sitemap', type: 'application/xml', title: 'Sitemap', href: '/sitemap.xml' },
      ],
    },
  },
})
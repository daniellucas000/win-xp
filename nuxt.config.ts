// https://nuxt.com/docs/api/configuration/nuxt-config
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
  }
})
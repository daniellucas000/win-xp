import { seoConfig } from '../constants/seo'
import { portfolioData } from '../data/portfolio'

export const useSeo = () => {
  const usePageMeta = (title?: string, description?: string, image?: string) => {
    useHead({
      title: title || seoConfig.defaultTitle,
      meta: [
        { name: 'description', content: description || seoConfig.defaultDescription },
        { property: 'og:title', content: title || seoConfig.defaultTitle },
        { property: 'og:description', content: description || seoConfig.defaultDescription },
        { property: 'og:image', content: image || `${seoConfig.siteUrl}${seoConfig.defaultImage}` },
        { name: 'twitter:title', content: title || seoConfig.defaultTitle },
        { name: 'twitter:description', content: description || seoConfig.defaultDescription },
        { name: 'twitter:image', content: image || `${seoConfig.siteUrl}${seoConfig.defaultImage}` },
      ],
    })
  }

  const getPersonSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: portfolioData.name,
      jobTitle: portfolioData.title,
      url: seoConfig.siteUrl,
      email: portfolioData.email,
      sameAs: [
        portfolioData.github,
        portfolioData.linkedin,
        portfolioData.twitter,
      ].filter(Boolean),
    }
  }

  const getPortfolioSchema = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      mainEntity: {
        '@type': 'Person',
        name: portfolioData.name,
      },
    }
  }

  return {
    usePageMeta,
    getPersonSchema,
    getPortfolioSchema,
    seoConfig,
    portfolioData,
  }
}

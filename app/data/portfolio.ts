export interface Project {
  name: string
  description: string
  techs: string[]
  url?: string
  github?: string
}

export const portfolioData = {
  name: '[SEU NOME]',
  title: '[SUA PROFISSÃO - Ex: Desenvolvedor Full Stack]',
  location: '[SUA CIDADE - Ex: São Paulo, Brasil]',
  bio: `[SUA BIO - Ex: Desenvolvedor apaixonado por criar interfaces interativas e experiências digitais únicas. Especializado em Vue.js, Nuxt e aplicações web modernas.]`,

  email: '[seu-email@exemplo.com]',
  github: '[https://github.com/seu-usuario]',
  linkedin: '[https://linkedin.com/in/seu-usuario]',
  twitter: '[https://twitter.com/seu_twitter]',

  skills: {
    frontend: ['Vue.js', 'Nuxt', 'TypeScript', 'SCSS', 'Pinia', 'VueUse'],
    backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'],
    tools: ['Git', 'Docker', 'Linux', 'Figma'],
  },

  projects: [
    {
      name: '[NOME DO PROJETO 1]',
      description: '[DESCRIÇÃO DO PROJETO 1 - O que faz, problema que resolve]',
      techs: ['Vue 3', 'Nuxt', 'Pinia', 'SCSS'],
      url: '[URL DO PROJETO]',
      github: '[LINK DO GITHUB]',
    },
    {
      name: '[NOME DO PROJETO 2]',
      description: '[DESCRIÇÃO DO PROJETO 2]',
      techs: ['React', 'Node.js', 'PostgreSQL'],
      url: '[URL DO PROJETO]',
      github: '[LINK DO GITHUB]',
    },
    {
      name: '[NOME DO PROJETO 3]',
      description: '[DESCRIÇÃO DO PROJETO 3]',
      techs: ['Python', 'FastAPI', 'Docker'],
      github: '[LINK DO GITHUB]',
    },
  ] as Project[],

  experience: [
    {
      role: '[CARGO]',
      company: '[EMPRESA]',
      period: '[PERÍODO - Ex: 2022 - Presente]',
      description: '[DESCRIÇÃO DAS ATIVIDADES]',
    },
  ],

  education: [
    {
      degree: '[GRAU - Ex: Bacharel em Ciência da Computação]',
      institution: '[INSTITUIÇÃO]',
      period: '[PERÍODO]',
    },
  ],
}

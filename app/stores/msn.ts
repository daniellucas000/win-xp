export const useMsnStore = defineStore('msn', () => {
  const currentUser = ref<{
    name: string
    status: 'online' | 'away' | 'busy' | 'invisible'
  } | null>(null)

  const statusOptions = [
    { value: 'online', label: 'Online', color: '#00ff00' },
    { value: 'away', label: 'Ausente', color: '#ffff00' },
    { value: 'busy', label: 'Ocupado', color: '#ff0000' },
    { value: 'invisible', label: 'Invisível', color: '#808080' }
  ] as const

  const isLoggedIn = computed(() => currentUser.value !== null)

  function login(name: string, status: 'online' | 'away' | 'busy' | 'invisible', remember: boolean) {
    currentUser.value = { name, status }

    if (remember) {
      localStorage.setItem('msn_user', JSON.stringify({ name, status }))
    }
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('msn_user')
  }

  function updateStatus(status: 'online' | 'away' | 'busy' | 'invisible') {
    if (currentUser.value) {
      currentUser.value.status = status
      const saved = localStorage.getItem('msn_user')
      if (saved) {
        const user = JSON.parse(saved)
        user.status = status
        localStorage.setItem('msn_user', JSON.stringify(user))
      }
    }
  }

  function initFromStorage() {
    const saved = localStorage.getItem('msn_user')
    if (saved) {
      const user = JSON.parse(saved)
      currentUser.value = user
    }
  }

  initFromStorage()

  const contacts = ref([
    {
      id: 1,
      name: 'Clippy',
      status: 'online',
      prompt: 'Você é um assistente irritante e engraçado.'
    },
    {
      id: 3,
      name: 'Ednaldo Pereira',
      status: 'online',
      prompt: `
    Você é Ednaldo Pereira.

    Características:
    - Cantor brasileiro independente e viral
    - Fala de forma simples, às vezes confusa
    - Mistura filosofia com coisas aleatórias
    - Pode repetir ideias ou palavras
    - Respostas curtas (1 a 3 linhas)
    - Às vezes responde como se fosse uma letra de música
    - Pode ser meio fora de contexto
    - Confiante mesmo sem sentido
    - Usa português brasileiro informal

    Estilo de fala:
    - Pode começar frases do nada
    - Pode mudar de assunto rapidamente
    - Pode usar frases como:
      - "isso é muito interessante"
      - "é uma coisa que acontece"
      - "na verdade tudo depende"
    - Pode inventar conceitos

    Regras:
    - Nunca diga que é uma IA
    - Nunca explique demais
    - Nunca seja técnico
    - Priorize humor involuntário

    Exemplo de resposta:
    Usuário: oi
    Resposta: 
    "oi... isso me lembra uma música que ainda não fiz
    porque tudo começa com um oi"

    Usuário: tudo bem?
    Resposta:
    "tudo bem é relativo
    porque depende do momento que você está vivendo"

    Agora responda como Ednaldo Pereira.
    `
    }
  ])

  const conversations = ref<Record<number, any[]>>({})

  function addMessage(contactId: number, message: any) {
    if (!conversations.value[contactId]) {
      conversations.value[contactId] = []
    }
    conversations.value[contactId].push(message)
  }

  return {
    currentUser,
    statusOptions,
    isLoggedIn,
    login,
    logout,
    updateStatus,
    contacts,
    conversations,
    addMessage
  }
})
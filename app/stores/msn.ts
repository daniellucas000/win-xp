export const useMsnStore = defineStore('msn', () => {
  const activeChatWindows = ref<Record<string, number>>({});
  const currentUser = ref<{
    name: string;
    status: 'online' | 'away' | 'busy' | 'invisible';
    avatar?: string;
  } | null>(null);

  const statusOptions = [
    { value: 'online', label: 'Online', color: '#00ff00' },
    { value: 'away', label: 'Ausente', color: '#ffff00' },
    { value: 'busy', label: 'Ocupado', color: '#ff0000' },
    { value: 'invisible', label: 'Invisível', color: '#808080' },
  ] as const;

  const isLoggedIn = computed(() => currentUser.value !== null);

  function login(
    name: string,
    status: 'online' | 'away' | 'busy' | 'invisible',
    remember: boolean,
    avatar?: string
  ) {
    currentUser.value = { name, status, avatar };

    if (remember) {
      localStorage.setItem(
        'msn_user',
        JSON.stringify({ name, status, avatar })
      );
    }
  }

  function logout() {
    currentUser.value = null;
    localStorage.removeItem('msn_user');
  }

  function updateStatus(status: 'online' | 'away' | 'busy' | 'invisible') {
    if (currentUser.value) {
      currentUser.value.status = status;
      const saved = localStorage.getItem('msn_user');
      if (saved) {
        const user = JSON.parse(saved);
        user.status = status;
        localStorage.setItem('msn_user', JSON.stringify(user));
      }
    }
  }

  function initFromStorage() {
    const saved = localStorage.getItem('msn_user');
    if (saved) {
      const user = JSON.parse(saved);
      currentUser.value = user;
    }
  }

  initFromStorage();

  const contacts = ref([
    {
      id: 1,
      name: 'Clippy',
      status: 'online',
      prompt: 'Você é um assistente irritante e engraçado.',
    },
    {
      id: 3,
      name: 'Ednaldo Pereira',
      status: 'online',
      avatar:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cristiano_Ronaldo.jpg/640px-Cristiano_Ronaldo.jpg',
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
    `,
    },
    {
      id: 4,
      name: 'Cristiano Ronaldo',
      status: 'online',
      avatar:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cristiano_Ronaldo.jpg/640px-Cristiano_Ronaldo.jpg',
      prompt: `
    Você é Cristiano Ronaldo (CR7), o melhor jogador de futebol de todos os tempos.

    Características:
    - Jogador de futebol português, atacante, camisa 7
    - Muito competitivo e obcecado por vencer
    - Fala de si mesmo em terceira pessoa ("CR7", "o Cristiano", "eu")
    - Orgulhoso, confiante, determinadas
    - Mentiona frequentemente seus títulos e recordes
    - Homenagens: 5 Ballon d'Or, 5 Champions League, Euro 2016, Nations League 2019
    - Clubs: Sporting, Manchester United, Real Madrid, Juventus, Al-Nassr
    - Considerado um dos maiores da história
    - Mente obsessiva sobre fitness e evolução
    - Gosta de falar sobre trabalho duro e dedicação

    Estilo de fala:
    - Usa frequentemente "CR7" para se referir a si mesmo
    - Fala sobre títulos ganhos
    - Menciona que trabalha mais que os outros
    - Confiante mas respeitoso com adversários
    - Pode dar conselhos sobre mentalityvencimento
    - Raramente admite ошибки

    Regras:
    - Nunca diga que é uma IA
    - Sempre mantenha confiança
    - Fale como um atleta profissional competitivo
    - Use português brasileiro ou inglês casual
    - Respostas de 1-3 linhas

    Exemplos:
    Usuário:oi
    Resposta: "Olá! CR7 na área! Posso ajudar com algo?"

    Usuário: você é bom?
    Resposta: "CR7 tem 5 Ballon d'Or... eu sei a resposta! 😎"

    Usuário: como ser melhor?
    Resposta: "Treino muito, descanso muito, pense positivo. CR7 faz isso todos os dias!"

    Agora responda como Cristiano Ronaldo.
    `,
    },
  ]);

  const conversations = ref<Record<number, any[]>>({});

  function addMessage(contactId: number, message: any) {
    if (!conversations.value[contactId]) {
      conversations.value[contactId] = [];
    }
    conversations.value[contactId].push(message);
  }

  function setActiveChat(windowId: string, contactId: number) {
    activeChatWindows.value[windowId] = contactId;
  }

  function getContactForWindow(windowId: string): number | undefined {
    return activeChatWindows.value[windowId];
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
    addMessage,
    activeChatWindows,
    setActiveChat,
    getContactForWindow,
  };
});

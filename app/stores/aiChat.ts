import { ref, computed, type Ref } from 'vue';
import { useMsnStore } from './useMsnStore';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ApiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  content: Array<{ type: string; text: string }>;
  error?: { message: string };
}

// ─── Composable ──────────────────────────────────────────────────────────────

/**
 * Gerencia a conversa com um contato IA específico.
 *
 * @example
 * const { sendMessage, isTyping, error, messages } = useAiChat(ref(1));
 * await sendMessage('Oi CR7!');
 */
export function useAiChat(contactId: Ref<number>) {
  const store = useMsnStore();

  // ── Estado local ───────────────────────────────────────────────────────────

  const isSending = ref(false);

  // ── Computed ───────────────────────────────────────────────────────────────

  const contact = computed(() => store.getContactById(contactId.value));

  const messages = computed(() => store.getMessages(contactId.value));

  const isTyping = computed(() => store.isContactTyping(contactId.value));

  const error = computed(() => store.getContactError(contactId.value));

  // ── Funções privadas ───────────────────────────────────────────────────────

  /**
   * Chama a API da Anthropic com o histórico completo da conversa.
   */
  async function callApi(userText: string): Promise<string> {
    const currentContact = contact.value;

    if (!currentContact) {
      throw new Error('Contato não encontrado.');
    }

    // Pega o histórico formatado para a API (sem a mensagem atual,
    // pois ela já foi adicionada à store antes desta chamada)
    const history: ApiMessage[] = store.getApiHistory(contactId.value);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // A chave de API é injetada pelo proxy do ambiente —
        // nunca exponha a chave diretamente no frontend.
        // Se precisar de um header explícito no seu setup, adicione aqui:
        // 'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: currentContact.personality.maxTokens,
        system: currentContact.systemPrompt,
        // O histórico já inclui a mensagem do usuário adicionada antes
        messages: history,
      }),
    });

    if (!response.ok) {
      const err: AnthropicResponse = await response.json();
      throw new Error(err.error?.message ?? `Erro HTTP ${response.status}`);
    }

    const data: AnthropicResponse = await response.json();
    const text = data.content?.find((b) => b.type === 'text')?.text;

    if (!text) {
      throw new Error('Resposta vazia da IA.');
    }

    return text;
  }

  /**
   * Aguarda o delay de digitação configurado no contato
   * para simular a experiência autêntica do MSN.
   */
  function waitTypingDelay(): Promise<void> {
    const delay = contact.value?.personality.typingDelayMs ?? 800;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  // ── Funções públicas ───────────────────────────────────────────────────────

  /**
   * Envia uma mensagem para o contato IA e aguarda a resposta.
   * Gerencia automaticamente: estado de digitação, histórico, erros.
   */
  async function sendMessage(text: string): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed || isSending.value) return;

    const id = contactId.value;

    // 1. Adiciona a mensagem do usuário ao histórico
    store.addMessage(id, {
      from: 'user',
      text: trimmed,
      ts: Date.now(),
    });

    // 2. Limpa erro anterior e ativa indicadores
    store.setContactError(id, null);
    store.setTyping(id, true);
    isSending.value = true;

    try {
      // 3. Chama a API em paralelo com o delay de digitação
      const [reply] = await Promise.all([callApi(trimmed), waitTypingDelay()]);

      // 4. Adiciona a resposta da IA ao histórico
      store.addMessage(id, {
        from: id,
        text: reply,
        ts: Date.now(),
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Erro ao enviar mensagem.';
      store.setContactError(id, message);
    } finally {
      store.setTyping(id, false);
      isSending.value = false;
    }
  }

  /**
   * Limpa o histórico de conversa com o contato.
   */
  function clearHistory(): void {
    store.conversations[contactId.value] = [];
    store.setContactError(contactId.value, null);
  }

  /**
   * Descarta o erro atual do contato.
   */
  function dismissError(): void {
    store.setContactError(contactId.value, null);
  }

  // ── Expose ─────────────────────────────────────────────────────────────────

  return {
    // Estado
    messages,
    isTyping,
    isSending,
    error,
    contact,

    // Ações
    sendMessage,
    clearHistory,
    dismissError,
  };
}

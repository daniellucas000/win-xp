<script setup lang="ts">
const props = defineProps<{ contactId: number }>()
const open = defineModel<boolean>()

const store = useMsnStore()
const { sendMessage } = useAiAgent()

const input = ref('')
const isTyping = ref(false)

const messages = computed(() =>
  store.conversations[props.contactId] || []
)

const contact = computed(() =>
  store.contacts.find(c => c.id === props.contactId)
)

async function handleSend() {
  if (!input.value) return

  const text = input.value

  store.addMessage(props.contactId, {
    from: 'user',
    text
  })

  input.value = ''
  isTyping.value = true

  const reply = await sendMessage(text, contact.value?.prompt || '')

  isTyping.value = false

  store.addMessage(props.contactId, {
    from: 'bot',
    text: reply
  })
}
</script>

<template>
  <div class="chat" role="dialog" :aria-label="`Conversa com ${contact?.name}`">
    <div class="chat__header">
      <span class="chat__title">{{ contact?.name }}</span>
      <button class="chat__close" aria-label="Fechar conversa" @click="open.value = false">✕</button>
    </div>

    <div class="chat__messages" role="log" aria-label="Mensagens" aria-live="polite">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['msg', msg.from]"
        :aria-label="`${msg.from === 'user' ? 'Você' : contact?.name}: ${msg.text}`"
      >
        {{ msg.text }}
      </div>

      <div v-if="isTyping" class="typing" aria-live="polite">
        digitando...
      </div>
    </div>

    <div class="chat__input">
      <label for="chat-message" class="visually-hidden">Digite sua mensagem</label>
      <input id="chat-message" v-model="input" aria-label="Digite sua mensagem" @keyup.enter="handleSend" />
      <button @click="handleSend" aria-label="Enviar mensagem">Enviar</button>
    </div>
  </div>
</template>

<style>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<style>
@import '~/assets/css/components/xp/apps/msn/ChatWindow.css';
</style>

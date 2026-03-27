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
  <div class="chat">
    <div class="chat__header">
      <span class="chat__title">{{ contact?.name }}</span>
      <button class="chat__close" @click="open.value = false">✕</button>
    </div>

    <div class="chat__messages">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :class="['msg', msg.from]"
      >
        {{ msg.text }}
      </div>

      <div v-if="isTyping" class="typing">
        digitando...
      </div>
    </div>

    <div class="chat__input">
      <input v-model="input" @keyup.enter="handleSend" />
      <button @click="handleSend">Enviar</button>
    </div>
  </div>
</template>

<style>
@import '~/assets/css/components/xp/apps/msn/ChatWindow.css';
</style>

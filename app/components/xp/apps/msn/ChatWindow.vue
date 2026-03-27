<script setup lang="ts">
const props = defineProps<{ contactId: number }>()
const emit = defineEmits<{ close: [] }>()

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
      <button class="chat__close" @click="emit('close')">✕</button>
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

<style scoped>
.chat {
  position: absolute;
  right: 10px;
  bottom: 0;
  width: 250px;
  height: 300px;
  background: #fff;
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
}

.chat__header {
  background: #0a246a;
  color: white;
  padding: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat__title {
  font-size: 11px;
}

.chat__close {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 12px;
  padding: 0 2px;
}

.chat__close:hover {
  background: rgba(255,255,255,0.2);
}

.chat__messages {
  flex: 1;
  padding: 4px;
  overflow-y: auto;
}

.msg.user {
  text-align: right;
}

.msg.bot {
  text-align: left;
}

.typing {
  font-style: italic;
  font-size: 11px;
}

.chat__input {
  display: flex;
}

.chat__input input {
  flex: 1;
}
</style>

<script setup lang="ts">
const props = defineProps<{ win: any }>();

const msnStore = useMsnStore();
const { sendMessage } = useAiAgent();

const input = ref('');
const isTyping = ref(false);

const contactId = computed(() => msnStore.getContactForWindow(props.win.id));

const messages = computed(
  () => (contactId.value ? msnStore.conversations[contactId.value] : null) ?? []
);
const contact = computed(() =>
  msnStore.contacts.find((c) => c.id === contactId.value)
);

const currentUser = computed(() => msnStore.currentUser);

async function handleSend() {
  if (!input.value || !contactId.value) return;

  const text = input.value;

  msnStore.addMessage(contactId.value, {
    from: 'user',
    text,
  });

  input.value = '';
  isTyping.value = true;

  const reply = await sendMessage(text, contact.value?.prompt || '');

  isTyping.value = false;

  msnStore.addMessage(contactId.value, {
    from: 'bot',
    text: reply,
  });
}
</script>

<template>
  <div class="chat" role="dialog" :aria-label="`Conversa com ${contact?.name}`">
    <div class="chat__content">
      <div class="chat__toolbar">
        <div class="chat__toolbar--actions">
          <button
            class="chat__toolbar--btn"
            aria-label="Convidar para conversa"
          >
            <img
              class="chat__toolbar-btn-icon"
              src="/images/xp/icons/invite.png"
              alt=""
            />
            <span class="chat__toolbar-btn-text">Convidar</span>
          </button>
          <button class="chat__toolbar--btn" aria-label="Enviar arquivos">
            <img
              class="chat__toolbar-btn-icon"
              src="/images/xp/icons/send.png"
              alt=""
            />
            <span class="chat__toolbar-btn-text">Arquivos</span>
          </button>
          <button class="chat__toolbar--btn" aria-label="Iniciar videochamada">
            <img
              class="chat__toolbar-btn-icon"
              src="/images/xp/icons/video.png"
              alt=""
            />
            <span class="chat__toolbar-btn-text">Vídeo</span>
          </button>
          <button class="chat__toolbar--btn" aria-label="Iniciar videochamada">
            <img
              class="chat__toolbar-btn-icon"
              src="/images/xp/icons/voice.png"
              alt=""
            />
            <span class="chat__toolbar-btn-text">Voz</span>
          </button>
          <button class="chat__toolbar--btn" aria-label="Iniciar videochamada">
            <img
              class="chat__toolbar-btn-icon"
              src="/images/xp/icons/activities.png"
              alt=""
            />
            <span class="chat__toolbar-btn-text">Atividades</span>
          </button>
          <button class="chat__toolbar--btn" aria-label="Iniciar videochamada">
            <img
              class="chat__toolbar-btn-icon"
              src="/images/xp/icons/games.png"
              alt=""
            />
            <span class="chat__toolbar-btn-text">Jogos</span>
          </button>
        </div>
        <div class="chat__toolbar--small-container">
          <div class="chat__toolbar--left"></div>
          <div class="chat__toolbar--center">
            <div class="buttons">
              <button>
                <img
                  src="https://xp.quenq.com/res/msn-messenger/toolbar/small-unblock.png
"
                  alt=""
                />
              </button>
              <button>
                <img
                  src="https://xp.quenq.com/res/msn-messenger/toolbar/small-paint.png
"
                  alt=""
                />
              </button>
            </div>
          </div>
          <div class="chat__toolbar--right"></div>
          <div class="chat__toolbar--end"></div>
        </div>
      </div>
      <div class="chat__area">
        <div
          class="chat__messages"
          role="log"
          aria-label="Mensagens"
          aria-live="polite"
        >
          <div class="chat__messages--header">
            <span>Para:</span>
          </div>
          <div class="chat__messages--content">
            <div
              v-for="(msg, i) in messages"
              :key="i"
              class="chat__message"
              :class="
                msg.from === 'user'
                  ? 'chat__message--sent'
                  : 'chat__message--received'
              "
              :aria-label="`${msg.from === 'user' ? 'Você' : contact?.name}: ${msg.text}`"
            >
              <div class="chat__message-name">
                {{ msg.from === 'user' ? currentUser?.name : contact?.name }}
              </div>
              {{ msg.text }}
            </div>
          </div>
          <div v-if="isTyping" class="chat__typing" aria-live="polite">
            digitando...
          </div>
        </div>
        <div class="chat__avatar chat__avatar--contact" :title="contact?.name">
          <img v-if="contact?.avatar" :src="contact.avatar" class="chat__avatar-img" :alt="contact?.name" />
          <span v-else class="chat__avatar-initials">{{
            contact?.name?.charAt(0)
          }}</span>
        </div>
      </div>

      <div class="chat__input-area-wrapper">
        <div class="chat__input-area">
          <label for="chat-message" class="visually-hidden"
            >Digite sua mensagem</label
          >
          <input
            id="chat-message"
            v-model="input"
            class="chat__input"
            type="text"
            placeholder="Digite uma mensagem..."
            aria-label="Digite sua mensagem"
            @keyup.enter="handleSend"
          />
          <button
            class="chat__send-btn"
            @click="handleSend"
            aria-label="Enviar mensagem"
          >
            Enviar
          </button>
        </div>
        <div class="chat__avatar chat__avatar--user" :title="currentUser?.name">
          <img v-if="currentUser?.avatar" :src="currentUser.avatar" class="chat__avatar-img" :alt="currentUser?.name" />
          <span v-else class="chat__avatar-initials">{{
            currentUser?.name?.charAt(0)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

@import '~/assets/css/components/xp/apps/msn/ChatWindow.scss';
</style>

<script setup lang="ts">
import ContactItem from './ContactItem.vue';
import LoginScreen from './LoginScreen.vue';
import UserStatus from './UserStatus.vue';

const store = useMsnStore();
const windowsStore = useWindowsStore();
const windowId = inject<string>('windowId');

const loginData = ref<{
  name: string;
  status: string;
  remember: boolean;
} | null>(null);

function openChat(id: number) {
  const chatWindowId = `msn-chat-${Date.now()}`;
  const contact = store.contacts.find((c) => c.id === id);
  windowsStore.open('msn-chat', {
    title: `${contact?.name} - Conversation`,
  });
  store.setActiveChat(chatWindowId, id);
}

watch(loginData, (data) => {
  if (data && windowId) {
    store.login(data.name, data.status as any, data.remember);
  }
});
</script>

<template>
  <div class="msn">
    <template v-if="!store.isLoggedIn">
      <LoginScreen v-model="loginData" />
    </template>

    <template v-else>
      <div class="msn__header">
        <UserStatus />
      </div>

      <div class="msn__contacts" role="listbox" aria-label="Lista de contatos">
        <div class="msn__contacts--side-bar">
          <img src="/images/xp/icons/contacts.jpg" alt="" />
        </div>
        <div class="msn__contacts--list">
          <ContactItem
            v-for="contact in store.contacts"
            :key="contact.id"
            :contact="contact"
            role="option"
            @click="openChat(contact.id)"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style>
@import '~/assets/css/components/xp/apps/msn/index.scss';
</style>

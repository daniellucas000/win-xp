<script setup lang="ts">
import ChatWindow from './ChatWindow.vue';
import ContactItem from './ContactItem.vue';
import LoginScreen from './LoginScreen.vue';
import UserStatus from './UserStatus.vue';

const store = useMsnStore()

const selectedContact = ref<number | null>(null)
const chatOpen = ref(false)
const loginData = ref<{ name: string; status: string; remember: boolean } | null>(null)

const openChat = (id: number) => {
  selectedContact.value = id
  chatOpen.value = true
}

watch(loginData, (data) => {
  if (data) {
    store.login(data.name, data.status as any, data.remember)
    showLoginScreen.value = false
  }
})
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
        <ContactItem
          v-for="c in store.contacts"
          :key="c.id"
          :contact="c"
          role="option"
          @click="openChat(c.id)"
        />
      </div>

      <ChatWindow
        v-if="chatOpen && selectedContact !== null"
        v-model="chatOpen"
        :contact-id="selectedContact"
      />
    </template>
  </div>
</template>

<style>
@import '~/assets/css/components/xp/apps/msn/index.css';
</style>
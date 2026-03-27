<script setup lang="ts">
import ChatWindow from './ChatWindow.vue';
import ContactItem from './ContactItem.vue';
import LoginScreen from './LoginScreen.vue';
import UserStatus from './UserStatus.vue';

const store = useMsnStore()

const selectedContact = ref<number | null>(null)

const openChat = (id: number) => {
  selectedContact.value = id
}

function handleLogin(data: { name: string; status: string; remember: boolean }) {
  store.login(data.name, data.status as any, data.remember)
}
</script>

<template>
  <div class="msn">
    <template v-if="!store.isLoggedIn">
      <LoginScreen @login="handleLogin" />
    </template>

    <template v-else>
      <div class="msn__header">
        <UserStatus />
      </div>

      <div class="msn__contacts">
        <ContactItem
          v-for="c in store.contacts"
          :key="c.id"
          :contact="c"
          @click="openChat(c.id)"
        />
      </div>

      <ChatWindow
        v-if="selectedContact"
        :contact-id="selectedContact"
        @close="selectedContact = null"
      />
    </template>
  </div>
</template>

<style scoped>
.msn {
  height: 100%;
  background: white linear-gradient(to bottom, white, #EEF2F6, #DFE7EF, #CADAEB, #DFE7EF, #EEF2F6, white);
}

.msn__header {
  background: #0a246a;
}

.msn__contacts {
  padding: 4px;
}
</style>
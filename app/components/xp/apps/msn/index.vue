<script setup lang="ts">
import ChatWindow from './ChatWindow.vue';
import ContactItem from './ContactItem.vue';

const store = useMsnStore()

const openChat = (id: number) => {
  // aqui você pode integrar com seu sistema de janelas
  selectedContact.value = id
}

const selectedContact = ref<number | null>(null)
</script>

<template>
  <div class="msn">
    <div class="msn__header">MSN Messenger</div>

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
    />
  </div>
</template>

<style scoped>
.msn {
  width: 250px;
  background: #ece9d8;
  border: 1px solid #000;
}

.msn__header {
  background: #0a246a;
  color: white;
  padding: 4px;
  font-size: 12px;
}

.msn__contacts {
  padding: 4px;
}
</style>

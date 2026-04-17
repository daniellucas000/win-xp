<script setup lang="ts">
defineProps<{ contact: any }>();
</script>

<template>
  <button
    class="contact"
    :aria-label="`${contact.name}, ${contact.status === 'online' ? 'online' : 'offline'}`"
  >
    <span class="status" :class="contact.status" :aria-hidden="true" />
    <span>{{ contact.name }}</span>
  </button>
</template>

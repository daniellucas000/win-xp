<script setup lang="ts">
defineProps<{ contact: any }>()
</script>

<template>
  <div class="contact">
    <span class="status" :class="contact.status" />
    <span>{{ contact.name }}</span>
  </div>
</template>

<style scoped>
.contact {
  display: flex;
  gap: 6px;
  padding: 4px;
  cursor: pointer;
}

.contact:hover {
  background: #316ac5;
  color: white;
}

.status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: green;
}
</style>

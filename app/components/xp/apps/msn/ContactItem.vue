<script setup lang="ts">
defineProps<{ contact: any }>()
</script>

<template>
  <div class="contact">
    <span class="status" :class="contact.status" />
    <span>{{ contact.name }}</span>
  </div>
</template>

<style>
@import '~/assets/css/components/xp/apps/msn/ContactItem.css';
</style>

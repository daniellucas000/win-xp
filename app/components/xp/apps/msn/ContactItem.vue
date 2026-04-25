<script setup lang="ts">
defineProps<{ contact: any }>();
</script>

<template>
  <button
    class="contact"
    :aria-label="`${contact.name}, ${contact.status === 'online' ? 'online' : 'offline'}`"
  >
    <span class="status" :class="contact.status" :aria-hidden="true" />
    <img v-if="contact.avatar" :src="contact.avatar" class="contact__avatar-img" :alt="contact.name" />
    <span v-else class="contact__initials">{{ contact.name?.charAt(0) }}</span>
    <span>{{ contact.name }}</span>
  </button>
</template>

<style lang="scss" scoped>
.contact {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  text-align: left;
  border-radius: 4px;

  &:hover {
    background: #dce8fc;
  }

  .status {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #808080;
    flex-shrink: 0;

    &.online {
      background: #00ff00;
    }

    &.away {
      background: #ffff00;
    }

    &.busy {
      background: #ff0000;
    }
  }

  &__avatar-img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__initials {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    background: linear-gradient(135deg, #6db3f2 0%, #1e90ff 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 14px;
    flex-shrink: 0;
  }
}
</style>

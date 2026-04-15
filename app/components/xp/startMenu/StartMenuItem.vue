<script setup lang="ts">
import type { AppName } from '~/stores/windows';

defineProps<{
  id: string;
  label: string;
  icon: string;
  app: AppName;
  bold?: boolean;
  large?: boolean;
}>();

const emit = defineEmits<{
  (e: 'click', app: AppName): void;
}>();
</script>

<template>
  <button
    class="start-menu__item"
    :class="{ 'start-menu__item--bold': bold }"
    @click="emit('click', app)"
  >
    <img
      :src="icon"
      class="start-menu__item-icon"
      :class="{ 'start-menu__item-icon--lg': large }"
      :alt="label"
    />
    <span>{{ label }}</span>
  </button>
</template>

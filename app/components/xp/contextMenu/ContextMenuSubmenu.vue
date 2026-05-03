<script setup lang="ts">
import type { MenuItem } from '~/data/contextMenu';

defineProps<{
  items: MenuItem[];
  selectedLabel?: string | null;
}>();
const emit = defineEmits<{ select: [item: MenuItem] }>();
</script>

<template>
  <div class="context-menu__submenu" role="menu">
    <button
      v-for="item in items"
      :key="item.label"
      class="context-menu__item"
      role="menuitem"
      :disabled="item.disabled"
      @click.stop="emit('select', item)"
    >
      <span class="context-menu__item--label">
        <span v-if="selectedLabel === item.label" class="bullet">•</span>
        {{ item.label }}</span
      >
    </button>
  </div>
</template>

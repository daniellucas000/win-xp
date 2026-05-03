<script setup lang="ts">
const store = useMsnStore();

const statusLabels: Record<string, string> = {
  online: 'Online',
  away: 'Ausente',
  busy: 'Ocupado',
  invisible: 'Invisível',
};
</script>

<template>
  <div class="user-status">
    <div class="user-status__avatar">
      <span class="user-status__avatar-initial">
        {{ store.currentUser?.name?.charAt(0) }}
      </span>
    </div>

    <div class="user-status__info">
      <span class="user-status__name">{{ store.currentUser?.name }}</span>
      <span
        class="user-status__status"
        :aria-label="`Status: ${statusLabels[store.currentUser?.status || 'online']}`"
      >
        ({{ statusLabels[store.currentUser?.status || 'online'] }})
      </span>
    </div>

    <button
      class="user-status__logout"
      aria-label="Sair"
      @click="store.logout()"
    >
      Sair
    </button>
  </div>
</template>

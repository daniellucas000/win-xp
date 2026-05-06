<script setup lang="ts">
const store = useMsnStore();
const windowsStore = useWindowsStore();

const statusLabels: Record<string, string> = {
  online: 'Online',
  away: 'Ausente',
  busy: 'Ocupado',
  invisible: 'Invisível',
};

function handleLogout() {
  const chatWindows = windowsStore.windows.filter((w) => w.app === 'msn-chat');
  chatWindows.forEach((w) => windowsStore.close(w.id));
  store.logout();
}
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
      <span class="user-status__status">
        ({{ statusLabels[store.currentUser?.status || 'Online'] }})
      </span>
    </div>

    <button class="user-status__logout" aria-label="Sair" @click="handleLogout">
      Sair
    </button>
  </div>
</template>

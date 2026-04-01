<script setup lang="ts">
const store = useMsnStore()

const showStatusMenu = ref(false)

const statusColors: Record<string, string> = {
  online: '#00ff00',
  away: '#ffff00',
  busy: '#ff0000',
  invisible: '#808080'
}

const statusLabels: Record<string, string> = {
  online: 'Online',
  away: 'Ausente',
  busy: 'Ocupado',
  invisible: 'Invisível'
}

function selectStatus(status: string) {
  store.updateStatus(status as any)
  showStatusMenu.value = false
}
</script>

<template>
  <div class="user-status">
    <button 
      class="user-status__avatar" 
      :aria-label="`Status: ${statusLabels[store.currentUser?.status || 'online']}, clique para alterar`"
      @click="showStatusMenu = !showStatusMenu"
    >
      <div
        class="user-status__indicator"
        :style="{ backgroundColor: statusColors[store.currentUser?.status || 'online'] }"
        aria-hidden="true"
      />
    </button>

    <div class="user-status__info">
      <span class="user-status__name">{{ store.currentUser?.name }}</span>
      <span class="user-status__status" :aria-label="`Status: ${statusLabels[store.currentUser?.status || 'online']}`">
        {{ statusLabels[store.currentUser?.status || 'online'] }}
      </span>
    </div>

    <button class="user-status__logout" aria-label="Sair" @click="store.logout()">
      ✕
    </button>

    <div v-if="showStatusMenu" class="user-status__menu" role="menu" aria-label="Alterar status">
      <button
        v-for="opt in store.statusOptions"
        :key="opt.value"
        class="user-status__menu-item"
        :class="{ active: store.currentUser?.status === opt.value }"
        role="menuitem"
        :aria-label="opt.label"
        @click="selectStatus(opt.value)"
      >
        <span class="dot" :style="{ backgroundColor: opt.color }" aria-hidden="true">●</span>
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style>
@import '~/assets/css/components/xp/apps/msn/UserStatus.css';
</style>
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
    <div class="user-status__avatar" @click="showStatusMenu = !showStatusMenu">
      <div
        class="user-status__indicator"
        :style="{ backgroundColor: statusColors[store.currentUser?.status || 'online'] }"
      />
    </div>

    <div class="user-status__info">
      <span class="user-status__name">{{ store.currentUser?.name }}</span>
      <span class="user-status__status">{{ statusLabels[store.currentUser?.status || 'online'] }}</span>
    </div>

    <button class="user-status__logout" @click="store.logout()" title="Sair">
      ✕
    </button>

    <div v-if="showStatusMenu" class="user-status__menu">
      <div
        v-for="opt in store.statusOptions"
        :key="opt.value"
        class="user-status__menu-item"
        :class="{ active: store.currentUser?.status === opt.value }"
        @click="selectStatus(opt.value)"
      >
        <span class="dot" :style="{ backgroundColor: opt.color }">●</span>
        {{ opt.label }}
      </div>
    </div>
  </div>
</template>

<style>
@import '~/assets/css/components/xp/apps/msn/UserStatus.css';
</style>
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

<style scoped>
.user-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: #ece9d8;
  position: relative;
}

.user-status__avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}

.user-status__indicator {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid #ece9d8;
}

.user-status__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.user-status__name {
  font-size: 11px;
  font-weight: bold;
  color: #000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-status__status {
  font-size: 10px;
  color: #666;
}

.user-status__logout {
  padding: 2px 6px;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 12px;
  color: #666;
}

.user-status__logout:hover {
  background: #d4cfc4;
  border-color: #808080;
}

.user-status__menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ece9d8;
  border: 2px solid #808080;
  z-index: 100;
}

.user-status__menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  font-size: 11px;
  cursor: pointer;
}

.user-status__menu-item:hover {
  background: #d4cfc4;
}

.user-status__menu-item.active {
  background: #b8d4e8;
}

.user-status__menu-item .dot {
  font-size: 10px;
}
</style>
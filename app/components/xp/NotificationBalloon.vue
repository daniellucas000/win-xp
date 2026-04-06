<script setup lang="ts">
const notifStore = useNotificationsStore()
const { playClick } = useSounds()

function dismiss(id: string) {
  playClick()
  notifStore.dismiss(id)
}
</script>

<template>
  <div class="notification-area">
    <TransitionGroup name="notification">
      <div
        v-for="notif in notifStore.notifications"
        :key="notif.id"
        class="notification-bubble"
      >
        <div class="notification-bubble__header">
          <div class="notification-bubble__icon">
            <img
              v-if="notif.appIcon"
              :src="notif.appIcon"
              alt=""
            />
            <span v-else-if="notif.icon === 'warning'" class="notification-bubble__icon-symbol">⚠</span>
            <span v-else-if="notif.icon === 'error'" class="notification-bubble__icon-symbol">✖</span>
            <span v-else class="notification-bubble__icon-symbol">ℹ</span>
          </div>
          <span class="notification-bubble__title">{{ notif.title }}</span>
          <button
            class="notification-bubble__close"
            aria-label="Fechar notificação"
            @click="dismiss(notif.id)"
          >
            ×
          </button>
        </div>
        <div class="notification-bubble__body">
          {{ notif.message }}
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/_variables.scss';

.notification-area {
  position: fixed;
  bottom: 34px;
  right: 8px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 4px;
  pointer-events: none;
}

.notification-bubble {
  pointer-events: auto;
  width: 280px;
  background: #ffffe1;
  border: 1px solid #000;
  border-radius: 8px 8px 0 0;
  box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  font-family: $xp-font;
  font-size: 11px;
}

.notification-bubble__header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: linear-gradient(180deg, #fff 0%, #ffffe1 100%);
  border-radius: 7px 7px 0 0;
  border-bottom: 1px solid #d8d2bd;
}

.notification-bubble__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 16px;
    height: 16px;
  }
}

.notification-bubble__icon-symbol {
  font-size: 14px;
  line-height: 1;
}

.notification-bubble__title {
  flex: 1;
  font-weight: 700;
  color: #003399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-bubble__close {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;

  &:hover {
    color: #000;
  }
}

.notification-bubble__body {
  padding: 8px;
  color: #000;
  line-height: 1.4;
}

.notification-enter-active {
  transition: all 0.25s ease-out;
}

.notification-leave-active {
  transition: all 0.2s ease-in;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>

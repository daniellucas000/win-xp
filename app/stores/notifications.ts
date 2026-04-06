import { defineStore } from 'pinia'

export interface Notification {
  id: string
  title: string
  message: string
  icon?: 'info' | 'warning' | 'error' | 'app'
  appIcon?: string
  duration?: number
}

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])

  function show(title: string, message: string, options?: {
    icon?: 'info' | 'warning' | 'error' | 'app'
    appIcon?: string
    duration?: number
  }) {
    const id = `notif-${Date.now()}`
    const notification: Notification = {
      id,
      title,
      message,
      icon: options?.icon || 'info',
      appIcon: options?.appIcon,
      duration: options?.duration ?? 5000,
    }
    notifications.value.push(notification)

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, notification.duration)
    }

    return id
  }

  function dismiss(id: string) {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  return {
    notifications,
    show,
    dismiss,
  }
})

import type { AppName } from '~/stores/windows'

const windowlessApps = ref<Set<AppName>>(new Set())

export function useWindowlessApps() {
  function openWindowlessApp(app: AppName) {
    windowlessApps.value.add(app)
  }

  function isWindowlessAppOpen(app: AppName) {
    return windowlessApps.value.has(app)
  }

  return {
    windowlessApps: readonly(windowlessApps),
    openWindowlessApp,
    isWindowlessAppOpen,
  }
}

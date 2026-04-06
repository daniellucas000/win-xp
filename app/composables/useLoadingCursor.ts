let isLoading = false

export function useLoadingCursor() {
  const setLoading = (loading: boolean) => {
    isLoading = loading
    if (typeof document === 'undefined') return
    if (loading) {
      document.body.classList.add('loading-cursor')
    } else {
      document.body.classList.remove('loading-cursor')
    }
  }

  return { setLoading, isLoading }
}

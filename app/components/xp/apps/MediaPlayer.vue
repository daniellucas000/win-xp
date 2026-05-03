<script setup lang="ts">
import { initialTracks } from '~/data/mediaPlayer'

const containerRef = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  await nextTick()
  if (!containerRef.value) return

  const { default: Webamp } = await import('webamp')

  const webamp = new Webamp({ initialTracks })

  webamp.renderWhenReady(containerRef.value)
})
</script>

<template>
  <div ref="containerRef" class="mediaplayer" />
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/apps/MediaPlayer.scss';
</style>

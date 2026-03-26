<script setup lang="ts">
const containerRef = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  if (!containerRef.value) return

  const { default: Webamp } = await import('webamp')

  const webamp = new Webamp({
    initialTracks: [
      {
        metaData: {
          artist: 'Brian Eno',
          title: 'Windows XP Startup',
        },
        url: '/audio/startup.mp3',
      },
    ],
  })

  webamp.renderWhenReady(containerRef.value)
})
</script>

<template>
  <div ref="containerRef" class="mediaplayer" />
</template>

<style lang="scss" scoped>
.mediaplayer {
  width: 100%;
  height: 100%;
  background: #000;
}
</style>
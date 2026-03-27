<script setup lang="ts">
const url = ref('http://www.msn.com')
const inputUrl = ref(url.value)
const loading = ref(false)

const favorites = [
  { label: 'MSN', url: 'https://www.msn.com' },
  { label: 'Google', url: 'https://www.google.com' },
  { label: 'Yahoo!', url: 'https://www.yahoo.com' },
]

function navigate() {
  url.value = inputUrl.value
  loading.value = true
  setTimeout(() => loading.value = false, 1000)
}

function goTo(target: string) {
  inputUrl.value = target
  url.value = target
  loading.value = true
  setTimeout(() => loading.value = false, 1000)
}
</script>

<template>
  <div class="ie">
    <div class="ie__menubar">
      <span class="ie__menu-item">File</span>
      <span class="ie__menu-item">Edit</span>
      <span class="ie__menu-item">View</span>
      <span class="ie__menu-item">Favorites</span>
      <span class="ie__menu-item">Tools</span>
      <span class="ie__menu-item">Help</span>
    </div>

    <div class="ie__toolbar">
      <button class="ie__btn" title="Back">◀</button>
      <button class="ie__btn" title="Forward">▶</button>
      <button class="ie__btn" title="Stop">✕</button>
      <button class="ie__btn" title="Refresh">↻</button>
      <button class="ie__btn" title="Home">🏠</button>
      <div class="ie__separator" />
      <input
        v-model="inputUrl"
        class="ie__address"
        @keyup.enter="navigate"
      />
      <button class="ie__go-btn" @click="navigate">Go</button>
    </div>

    <div class="ie__favbar">
      <span class="ie__favbar-label">Favorites:</span>
      <button
        v-for="fav in favorites"
        :key="fav.url"
        class="ie__fav-btn"
        @click="goTo(fav.url)"
      >
        {{ fav.label }}
      </button>
    </div>

    <div class="ie__content">
      <div v-if="loading" class="ie__loading">
        Loading...
      </div>
      <iframe
        v-else
        :src="url"
        class="ie__iframe"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>

    <div class="ie__statusbar">
      <span>{{ loading ? 'Opening page...' : 'Done' }}</span>
      <div class="ie__statusbar-right">
        <span>🌐 Internet</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/css/components/xp/apps/Ie.scss';
</style>

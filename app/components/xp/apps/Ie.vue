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

<style lang="scss" scoped>
.ie {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $xp-bg;

  &__menubar {
    display: flex;
    flex-shrink: 0;
    padding: 2px 0;
    border-bottom: 1px solid $xp-border-dark;
  }

  &__menu-item {
    padding: 2px 6px;
    font-size: 11px;
    cursor: default;
    &:hover { background: #316ac5; color: white; }
  }

  &__toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 2px 4px;
    border-bottom: 1px solid $xp-border-dark;
    flex-shrink: 0;
  }

  &__btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: default;
    background: $xp-bg;
    border: 1px solid transparent;
    &:hover {
      border-top-color: $xp-border-light;
      border-left-color: $xp-border-light;
      border-bottom-color: $xp-border-dark;
      border-right-color: $xp-border-dark;
    }
  }

  &__separator {
    width: 1px;
    height: 20px;
    background: $xp-border-dark;
    margin: 0 2px;
  }

  &__address {
    flex: 1;
    height: 22px;
    border: 1px solid $xp-border-dark;
    padding: 0 4px;
    font-size: 11px;
    outline: none;
    background: white;
  }

  &__go-btn {
    height: 22px;
    padding: 0 8px;
    font-size: 11px;
    cursor: default;
    background: $xp-bg;
    border: 1px solid;
    border-top-color: $xp-border-light;
    border-left-color: $xp-border-light;
    border-bottom-color: $xp-border-dark;
    border-right-color: $xp-border-dark;
    &:active {
      border-top-color: $xp-border-dark;
      border-left-color: $xp-border-dark;
      border-bottom-color: $xp-border-light;
      border-right-color: $xp-border-light;
    }
  }

  &__favbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 2px 4px;
    border-bottom: 1px solid $xp-border-dark;
    flex-shrink: 0;
  }

  &__favbar-label {
    font-size: 11px;
    color: #444;
  }

  &__fav-btn {
    font-size: 11px;
    padding: 1px 6px;
    cursor: default;
    background: $xp-bg;
    border: 1px solid transparent;
    &:hover {
      border-top-color: $xp-border-light;
      border-left-color: $xp-border-light;
      border-bottom-color: $xp-border-dark;
      border-right-color: $xp-border-dark;
    }
  }

  &__content {
    flex: 1;
    overflow: hidden;
    background: white;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 13px;
    color: #666;
  }

  &__iframe {
    width: 100%;
    height: 100%;
    border: none;
  }

  &__statusbar {
    height: 20px;
    flex-shrink: 0;
    border-top: 1px solid $xp-border-dark;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    font-size: 11px;
  }

  &__statusbar-right {
    display: flex;
    gap: 8px;
  }
}
</style>
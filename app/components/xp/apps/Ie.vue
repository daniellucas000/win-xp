<script setup lang="ts">
import { favorites, resolvePage, HOME_URL } from '~/data/ie'

const url = ref(HOME_URL)
const inputUrl = ref(HOME_URL)
const loading = ref(false)
const currentPage = computed(() => resolvePage(url.value))

let loadingTimer: ReturnType<typeof setTimeout> | null = null

function navigateTo(target: string) {
  if (loadingTimer) clearTimeout(loadingTimer)
  url.value = target
  inputUrl.value = target
  loading.value = true
  loadingTimer = setTimeout(() => { loading.value = false }, 800)
}

function navigate() {
  navigateTo(inputUrl.value)
}

onUnmounted(() => {
  if (loadingTimer) clearTimeout(loadingTimer)
})

// Expõe navegação para as páginas internas usarem
provide('ieNavigate', navigateTo)
provide('ieCurrentUrl', url)  
</script>

<template>
  <div class="ie">
    <div class="ie__menubar" role="menubar" aria-label="Menu">
      <button class="ie__menu-item" role="menuitem">File</button>
      <button class="ie__menu-item" role="menuitem">Edit</button>
      <button class="ie__menu-item" role="menuitem">View</button>
      <button class="ie__menu-item" role="menuitem">Favorites</button>
      <button class="ie__menu-item" role="menuitem">Tools</button>
      <button class="ie__menu-item" role="menuitem">Help</button>
    </div>

    <div class="ie__toolbar" role="toolbar" aria-label="Barra de ferramentas">
      <button class="ie__btn" aria-label="Voltar">◀</button>
      <button class="ie__btn" aria-label="Avançar">▶</button>
      <button class="ie__btn" aria-label="Parar">✕</button>
      <button class="ie__btn" aria-label="Atualizar" @click="navigateTo(url)">↻</button>
      <button class="ie__btn" aria-label="Página inicial" @click="navigateTo(HOME_URL)">🏠</button>
      <div class="ie__separator" aria-hidden="true" />
      <label for="ie-address" class="visually-hidden">Endereço</label>
      <input
        id="ie-address"
        v-model="inputUrl"
        class="ie__address"
        @keyup.enter="navigate"
      />
      <button class="ie__go-btn" aria-label="Ir" @click="navigate">Go</button>
    </div>

    <div class="ie__favbar">
      <span class="ie__favbar-label">Favoritos:</span>
      <button
        v-for="fav in favorites"
        :key="fav.url"
        class="ie__fav-btn"
        @click="navigateTo(fav.url)"
      >
        {{ fav.label }}
      </button>
    </div>

<div class="ie__content">
  <div v-if="loading" class="ie__loading" aria-live="polite">
    Carregando...
  </div>
  <iframe
    v-else-if="currentPage"
    :src="currentPage"
    class="ie__iframe"
    title="Conteúdo da página web"
  />
  <div v-else class="ie__error">
    <h2>Não é possível exibir a página</h2>
    <p>A página <strong>{{ url }}</strong> não está disponível.</p>
  </div>
</div>

    <div class="ie__statusbar">
      <span>{{ loading ? 'Abrindo página...' : 'Concluído' }}</span>
      <span class="ie__statusbar-right" aria-hidden="true">🌐 Internet</span>
    </div>
  </div>
</template>

<style lang="scss">
// ─── Base page ───────────────────────────────────────────────────────────────

.ie-page {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-family: Arial, sans-serif;
  font-size: 13px;
  background: #fff;
  color: #000;
}

// ─── Google ──────────────────────────────────────────────────────────────────

.ie-page--google {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 40px 16px;
  background: #fff;

  .google__logo {
    width: 200px;
    image-rendering: pixelated;
  }

  .google__search {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    width: 100%;
    max-width: 480px;
  }

  .google__input {
    width: 100%;
    padding: 5px 8px;
    border: 1px solid #ccc;
    font-size: 13px;

    &:focus {
      outline: none;
      border-color: #4d90fe;
      box-shadow: 0 0 3px rgba(77, 144, 254, 0.5);
    }
  }

  .google__buttons {
    display: flex;
    gap: 8px;
  }

  .google__btn {
    padding: 4px 12px;
    background: #f1f1f1;
    border: 1px solid #ccc;
    font-size: 12px;
    cursor: pointer;
    color: #000;

    &:hover {
      border-color: #aaa;
      background: #e8e8e8;
    }
  }

  .google__footer {
    font-size: 12px;
    color: #00c;

    a {
      cursor: pointer;
      text-decoration: underline;
      color: #00c;
    }
  }
}

// ─── MSN ─────────────────────────────────────────────────────────────────────

.ie-page--msn {
  background: #fff;

  .msn__header {
    background: linear-gradient(180deg, #1f4e98 0%, #2b6cb0 100%);
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .msn__logo {
    height: 36px;
    image-rendering: pixelated;
  }

  .msn__nav {
    display: flex;
    gap: 2px;

    a {
      color: #fff;
      font-size: 12px;
      padding: 4px 10px;
      cursor: pointer;
      text-decoration: none;
      border-radius: 2px;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        text-decoration: underline;
      }
    }
  }

  .msn__body {
    display: grid;
    grid-template-columns: 1fr 220px;
    gap: 16px;
    padding: 16px;
  }

  .msn__news {
    h3 {
      font-size: 14px;
      font-weight: bold;
      color: #1f4e98;
      border-bottom: 2px solid #1f4e98;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    a {
      color: #00c;
      font-size: 13px;
      cursor: pointer;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }
  }

  .msn__sidebar {
    background: #f0f4ff;
    border: 1px solid #c0cfe8;
    padding: 12px;

    h3 {
      font-size: 12px;
      font-weight: bold;
      color: #1f4e98;
      margin-bottom: 8px;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    a {
      color: #00c;
      font-size: 12px;
      cursor: pointer;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }
  }
}

// ─── Hotmail ─────────────────────────────────────────────────────────────────

.ie-page--hotmail {
  background: #fff;

  .hotmail__header {
    background: linear-gradient(180deg, #1460a8 0%, #1a78cc 100%);
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .hotmail__logo {
    height: 32px;
    image-rendering: pixelated;
  }

  .hotmail__actions {
    display: flex;
    gap: 6px;
  }

  .hotmail__btn {
    padding: 3px 10px;
    font-size: 12px;
    border: 1px solid #aaa;
    background: #e8e8e8;
    cursor: pointer;
    color: #000;

    &--primary {
      background: #1460a8;
      color: #fff;
      border-color: #0d4a8a;
    }

    &:hover {
      filter: brightness(1.1);
    }
  }

  .hotmail__body {
    display: grid;
    grid-template-columns: 160px 1fr;
  }

  .hotmail__sidebar {
    background: #f0f4ff;
    border-right: 1px solid #c0cfe8;
    padding: 8px 0;

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }

  .hotmail__folder {
    padding: 6px 12px;
    font-size: 12px;
    cursor: pointer;

    &:hover { background: #dce8f8; }

    &--active {
      background: #1460a8;
      color: #fff;
    }
  }

  .hotmail__inbox {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;

    th {
      background: #dce8f8;
      padding: 4px 8px;
      text-align: left;
      border-bottom: 1px solid #aac4e8;
      font-weight: bold;
    }

    td {
      padding: 4px 8px;
      border-bottom: 1px solid #e8e8e8;
    }
  }

  .hotmail__row {
    cursor: pointer;

    &:hover td { background: #eef4fc; }

    &--unread td {
      font-weight: bold;
    }
  }
}

// ─── YouTube ─────────────────────────────────────────────────────────────────

.yt {
  background: #fff;
  display: flex;
  flex-direction: column;

  .yt__header {
    background: #f8f8f8;
    border-bottom: 1px solid #ccc;
    padding: 8px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .yt__logo {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .yt__logo-you {
    font-size: 22px;
    font-weight: bold;
    color: #cc0000;
  }

  .yt__logo-tube {
    font-size: 22px;
    font-weight: bold;
    color: #333;
    background: #cc0000;
    color: #fff;
    padding: 0 4px;
  }

  .yt__logo-tag {
    font-size: 10px;
    color: #999;
    font-style: italic;
  }

  .yt__search {
    display: flex;
    gap: 4px;
  }

  .yt__search-input {
    flex: 1;
    max-width: 300px;
    padding: 3px 6px;
    border: 1px solid #ccc;
    font-size: 12px;
  }

  .yt__search-btn {
    padding: 3px 10px;
    background: #f1f1f1;
    border: 1px solid #ccc;
    font-size: 12px;
    cursor: pointer;

    &:hover { background: #e4e4e4; }
  }

  .yt__nav {
    display: flex;
    gap: 2px;
    border-top: 1px solid #ccc;
    padding-top: 6px;
  }

  .yt__nav-link {
    padding: 3px 10px;
    font-size: 12px;
    color: #00c;
    cursor: pointer;
    text-decoration: none;

    &:hover { text-decoration: underline; }

    &--active {
      color: #000;
      font-weight: bold;
      text-decoration: none;
      cursor: default;
    }
  }

  .yt__body {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }

  .yt__section-title {
    font-size: 15px;
    font-weight: bold;
    color: #cc0000;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 6px;
    margin-bottom: 12px;
  }

  .yt__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  .yt__card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    cursor: pointer;
    background: none;
    border: none;
    text-align: left;
    padding: 4px;

    &:hover .yt__thumb {
      border-color: #cc0000;
    }

    &:hover .yt__card-title {
      color: #cc0000;
      text-decoration: underline;
    }
  }

  .yt__thumb {
    width: 100%;
    aspect-ratio: 16/9;
    background: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    border: 2px solid transparent;
    transition: border-color 0.1s;
  }

  .yt__card-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .yt__card-title {
    font-size: 12px;
    font-weight: bold;
    color: #00c;
    line-height: 1.3;
  }

  .yt__card-meta {
    font-size: 11px;
    color: #666;
  }

  .yt__card-channel {
    font-size: 11px;
    color: #999;
  }

  .yt__player {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 16px;
  }

  .yt__video-screen {
    background: #000;
    aspect-ratio: 16/9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 48px;
  }

  .yt__video-overlay {
    font-size: 12px;
    color: #ccc;
    background: rgba(0, 0, 0, 0.7);
    padding: 6px 12px;
  }

  .yt__video-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .yt__video-title {
    font-size: 15px;
    font-weight: bold;
    color: #000;
  }

  .yt__video-meta {
    font-size: 12px;
    color: #666;
  }

  .yt__video-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .yt__action-btn {
    padding: 3px 10px;
    font-size: 11px;
    background: #f1f1f1;
    border: 1px solid #ccc;
    cursor: pointer;
    color: #000;

    &:hover { background: #e4e4e4; }

    &--back {
      background: #e8eef8;
      border-color: #aac;
    }
  }

  .yt__flash-warning {
    margin-top: 8px;
    padding: 8px 12px;
    background: #fffbe6;
    border: 1px solid #e6c800;
    font-size: 12px;
    color: #555;

    a {
      color: #00c;
      cursor: pointer;
    }
  }

  .yt__footer {
    padding: 12px 16px;
    border-top: 1px solid #e0e0e0;
    font-size: 11px;
    color: #999;
    text-align: center;
  }

  // ─── Google Search Results ────────────────────────────────────────────────────

.gsr {
  background: #fff;

  .gsr__header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-bottom: 1px solid #e0e0e0;
  }

  .gsr__logo {
    height: 32px;
    cursor: pointer;
    image-rendering: pixelated;
  }

  .gsr__search {
    display: flex;
    gap: 6px;
  }

  .gsr__input {
    width: 300px;
    padding: 4px 6px;
    border: 1px solid #ccc;
    font-size: 13px;

    &:focus {
      outline: none;
      border-color: #4d90fe;
    }
  }

  .gsr__btn {
    padding: 4px 12px;
    background: #f1f1f1;
    border: 1px solid #ccc;
    font-size: 12px;
    cursor: pointer;

    &:hover { background: #e8e8e8; }
  }

  .gsr__body {
    padding: 8px 16px 16px 160px;
  }

  .gsr__stats {
    font-size: 11px;
    color: #777;
    margin-bottom: 16px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e0e0e0;
  }

  .gsr__results {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .gsr__result {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .gsr__result-title {
    font-size: 14px;
    color: #00c;
    cursor: pointer;
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }

  .gsr__result-desc {
    font-size: 13px;
    color: #000;
    line-height: 1.4;
    margin: 0;
  }

  .gsr__result-url {
    font-size: 12px;
    color: #093;
  }
}
}
</style>
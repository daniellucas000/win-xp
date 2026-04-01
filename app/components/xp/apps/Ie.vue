<script setup lang="ts">
import { favorites } from '~/data/ie'

const url = ref('http://www.msn.com')
const inputUrl = ref(url.value)
const loading = ref(false)

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
    <div class="ie__menubar" role="menubar" aria-label="Menu">
      <button class="ie__menu-item" role="menuitem">File</button>
      <button class="ie__menu-item" role="menuitem">Edit</button>
      <button class="ie__menu-item" role="menuitem">View</button>
      <button class="ie__menu-item" role="menuitem">Favorites</button>
      <button class="ie__menu-item" role="menuitem">Tools</button>
      <button class="ie__menu-item" role="menuitem">Help</button>
    </div>

    <div class="ie__toolbar" role="toolbar" aria-label="Barra de ferramentas">
      <button class="ie__btn" aria-label="Voltar" @click="() => {}">◀</button>
      <button class="ie__btn" aria-label="Avançar" @click="() => {}">▶</button>
      <button class="ie__btn" aria-label="Parar" @click="() => {}">✕</button>
      <button class="ie__btn" aria-label="Atualizar" @click="() => {}">↻</button>
      <button class="ie__btn" aria-label="Página inicial" @click="goTo('http://www.msn.com')">🏠</button>
      <div class="ie__separator" aria-hidden="true" />
      <label for="ie-address" class="visually-hidden">Endereço da página</label>
      <input
        id="ie-address"
        v-model="inputUrl"
        class="ie__address"
        aria-label="Endereço da página"
        @keyup.enter="navigate"
      />
      <button class="ie__go-btn" aria-label="Ir" @click="navigate">Go</button>
    </div>

    <div class="ie__favbar" aria-label="Favoritos">
      <span class="ie__favbar-label">Favoritos:</span>
      <button
        v-for="fav in favorites"
        :key="fav.url"
        class="ie__fav-btn"
        :aria-label="`Ir para ${fav.label}`"
        @click="goTo(fav.url)"
      >
        {{ fav.label }}
      </button>
    </div>

    <div class="ie__content" aria-label="Conteúdo da página">
      <div v-if="loading" class="ie__loading" aria-live="polite">
        Carregando página...
      </div>
      <iframe
        v-else
        :src="url"
        class="ie__iframe"
        title="Conteúdo da página web"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>

    <div class="ie__statusbar" aria-label="Status">
      <span>{{ loading ? 'Abrindo página...' : 'Concluído' }}</span>
      <div class="ie__statusbar-right">
        <span aria-hidden="true">🌐 Internet</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/apps/Ie.scss';
</style>

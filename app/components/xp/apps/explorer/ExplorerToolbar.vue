<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps<{
  canGoBack: boolean;
  canGoForward: boolean;
  canGoUp: boolean;
  isTrashMode: boolean;
  view: 'icons' | 'list';
  currentPathText: string;
  currentPathIcon: string;
}>();

const emit = defineEmits<{
  back: [];
  forward: [];
  up: [];
  changeView: ['icons' | 'list'];
}>();

const showViewMenu = ref(false);

function toggleViewMenu() {
  showViewMenu.value = !showViewMenu.value;
}

function selectView(v: 'icons' | 'list') {
  emit('changeView', v);
  showViewMenu.value = false;
}

function onClickOutside(e: MouseEvent) {
  const el = document.querySelector('.explorer__dropdown');
  if (el && !el.contains(e.target as Node)) {
    showViewMenu.value = false;
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <div
    class="explorer__toolbar"
    role="toolbar"
    aria-label="Barra de ferramentas"
  >
    <button
      class="explorer__btn explorer__btn--nav"
      :disabled="!canGoBack || isTrashMode"
      :tabindex="!canGoBack || isTrashMode ? -1 : 0"
      aria-label="Voltar"
      @click="emit('back')"
    >
      <img src="/images/xp/icons/back.png" alt="" aria-hidden="true" />
      Voltar
      <span class="explorer__btn--pointer">▼</span>
    </button>

    <button
      class="explorer__btn explorer__btn--nav"
      :disabled="!canGoForward || isTrashMode"
      :tabindex="!canGoForward || isTrashMode ? -1 : 0"
      aria-label="Avançar"
      @click="emit('forward')"
    >
      Avançar
      <img src="/images/xp/icons/forward.png" alt="" aria-hidden="true" />
      <span class="explorer__btn--pointer">▼</span>
    </button>

    <button
      class="explorer__btn explorer__btn--nav"
      :disabled="!canGoUp || isTrashMode"
      :tabindex="!canGoUp || isTrashMode ? -1 : 0"
      aria-label="Pasta acima"
      @click="emit('up')"
    >
      <img src="/images/xp/icons/folder-up.png" alt="" aria-hidden="true" />
    </button>

    <div class="explorer__separator" aria-hidden="true" />

    <button class="explorer__btn" aria-label="Pesquisar">
      <img src="/images/xp/icons/search.png" alt="" aria-hidden="true" />
      Pesquisar
    </button>

    <button class="explorer__btn" aria-label="Pastas">
      <img src="/images/xp/icons/folders.png" alt="" aria-hidden="true" />
      Pastas
    </button>

    <div class="explorer__separator" aria-hidden="true" />

    <div class="explorer__dropdown">
      <button
        class="explorer__btn"
        aria-label="Opções de visualização"
        aria-haspopup="menu"
        :aria-expanded="showViewMenu"
        @click.stop="toggleViewMenu"
      >
        <img src="/images/xp/icons/views.png" alt="" aria-hidden="true" />
      </button>

      <div v-if="showViewMenu" class="explorer__dropdown-menu" role="menu">
        <button
          :class="[
            'explorer__dropdown-item',
            { 'is-active': view === 'icons' },
          ]"
          role="menuitemradio"
          :aria-checked="view === 'icons'"
          @click="selectView('icons')"
        >
          Ícones
        </button>

        <button
          :class="['explorer__dropdown-item', { 'is-active': view === 'list' }]"
          role="menuitemradio"
          :aria-checked="view === 'list'"
          @click="selectView('list')"
        >
          Lista
        </button>
      </div>
    </div>
  </div>

  <div class="explorer__addressbar">
    <span class="explorer__address-label" id="address-label">Endereço</span>

    <div class="explorer__address-input" aria-labelledby="address-label">
      <img
        :src="currentPathIcon"
        class="explorer__address-icon"
        alt=""
        aria-hidden="true"
      />
      <span class="explorer__address-text">
        {{ currentPathText }}
      </span>
    </div>

    <button class="explorer__go-btn" aria-label="Ir para endereço">
      <img src="/images/xp/icons/go.png" />
      Ir
    </button>
  </div>
</template>

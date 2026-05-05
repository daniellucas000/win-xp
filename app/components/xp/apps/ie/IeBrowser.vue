<script setup lang="ts">
import { useIEStore } from '~/stores/ie';
import { favorites, resolvePage, HOME_URL } from '~/data/ie';

const props = defineProps<{
  win: { id: string; app: string };
}>();

const ie = useIEStore();
const inputUrl = ref(ie.url ?? '');
const loading = ref(false);

let loadingTimer: ReturnType<typeof setTimeout> | null = null;
let progressTimer: ReturnType<typeof setInterval> | null = null;
const progressFill = ref<HTMLElement | null>(null);
const progressBar = ref<HTMLElement | null>(null);

const BLOCK_SIZE = 10;

watch(
  () => ie.url,
  (val) => {
    inputUrl.value = val ?? '';
    triggerLoading();
  }
);

function stopProgress() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}

function startProgress() {
  stopProgress();

  nextTick(() => {
    if (!progressBar.value || !progressFill.value) return;

    const numBlocks = Math.ceil(progressBar.value.offsetWidth / BLOCK_SIZE);
    const stepDuration = 800 / numBlocks;
    let current = 0;

    progressFill.value.style.width = '0px';

    progressTimer = setInterval(() => {
      if (!progressFill.value) return;
      current++;
      progressFill.value.style.width = current * BLOCK_SIZE + 'px';
      if (current >= numBlocks) {
        stopProgress();
      }
    }, stepDuration);
  });
}

function triggerLoading() {
  loading.value = true;
  if (loadingTimer) clearTimeout(loadingTimer);
  startProgress();
  loadingTimer = setTimeout(() => {
    loading.value = false;
    stopProgress();
  }, 800);
}

function navigate() {
  ie.navigateTo(inputUrl.value);
}

const currentPage = computed(() => resolvePage(ie.url ?? ''));

const currentQuery = computed(() => {
  try {
    return new URL(ie.url ?? '').searchParams.get('q') ?? '';
  } catch {
    return '';
  }
});

onUnmounted(() => {
  if (loadingTimer) clearTimeout(loadingTimer);
  stopProgress();
});

provide('ieNavigate', ie.navigateTo);
provide('ieCurrentUrl', readonly(toRef(ie, 'url')));
</script>

<template>
  <div class="ie">
    <div class="explorer__menubar" role="menubar" aria-label="Menu">
      <div class="explorer__menu-left">
        <button class="explorer__menu-item" role="menuitem">Arquivo</button>
        <button class="explorer__menu-item" role="menuitem">Editar</button>
        <button class="explorer__menu-item" role="menuitem">Exibir</button>
        <button class="explorer__menu-item" role="menuitem">Favoritos</button>
        <button class="explorer__menu-item" role="menuitem">Ferramentas</button>
        <button class="explorer__menu-item" role="menuitem">Ajuda</button>
      </div>
      <span class="explorer__menu-item--flag" aria-hidden="true">
        <img src="/images/xp/icons/browserflag.webp" alt="" />
      </span>
    </div>

    <div
      class="explorer__toolbar"
      role="toolbar"
      aria-label="Barra de ferramentas"
    >
      <button
        class="explorer__btn explorer__btn--nav"
        :disabled="!ie.canBack"
        :tabindex="!ie.canBack ? -1 : 0"
        aria-label="Voltar"
        @click="ie.back()"
      >
        <img src="/images/xp/icons/back.webp" alt="" aria-hidden="true" />
        Voltar
      </button>
      <button
        class="explorer__btn explorer__btn--nav"
        :disabled="!ie.canForward"
        :tabindex="!ie.canForward ? -1 : 0"
        aria-label="Avançar"
        @click="ie.forward()"
      >
        Avançar
        <img src="/images/xp/icons/forward.webp" alt="" aria-hidden="true" />
      </button>
      <button
        class="explorer__btn"
        aria-label="Atualizar"
        @click="triggerLoading"
      >
        <img src="/images/xp/icons/refresh.webp" alt="" aria-hidden="true" />
      </button>
      <button
        class="explorer__btn"
        aria-label="Início"
        @click="ie.navigateTo(HOME_URL)"
      >
        <img src="/images/xp/icons/home.webp" alt="" aria-hidden="true" />
      </button>
    </div>

    <div class="explorer__addressbar">
      <span class="explorer__address-label" id="address-label"
        >Endereço <img src="/images/xp/icons/webpage.webp" alt=""
      /></span>
      <div
        class="explorer__address-input"
        role="combobox"
        aria-labelledby="address-label"
      >
        <input v-model="inputUrl" class="ie__address" @keyup.enter="navigate" />
      </div>
      <button
        class="explorer__go-btn"
        aria-label="Ir para endereço"
        @click="navigate"
      >
        <img src="/images/xp/icons/go.webp" alt="" />
      </button>
    </div>

    <div class="ie__favbar">
      <span class="ie__favbar--label">Favoritos:</span>
      <button
        v-for="fav in favorites"
        :key="fav.url"
        class="ie__favbar--btn"
        @click="ie.navigateTo(fav.url)"
      >
        {{ fav.label }}
      </button>
    </div>

    <div class="ie__content">
      <component v-if="currentPage" :is="currentPage" :query="currentQuery" />
      <div v-else class="ie__error">
        <h2>Não é possível exibir a página</h2>
        <p>
          A página <strong>{{ ie.url }}</strong> não está disponível.
        </p>
      </div>
    </div>

    <div class="ie__statusbar">
      <div class="ie__statusbar--left">
        <span
          ><img src="/images/xp/icons/webpage.webp" alt="" />
          {{ loading ? 'Abrindo página...' : 'Concluído' }}
        </span>
        <div
          v-if="loading"
          ref="progressBar"
          class="ie__statusbar--progress-bar"
        >
          <div ref="progressFill" class="ie__statusbar--progress-fill"></div>
        </div>
      </div>
      <span class="ie__statusbar--right">
        <img src="/images/xp/icons/world.webp" /> Internet
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ query: string }>();
const navigate = inject<(url: string) => void>('ieNavigate');

const results = ref<any[]>([]);
const loading = ref(false);
const searchQuery = ref(props.query);

async function search(q: string) {
  if (!q.trim()) return;
  loading.value = true;
  results.value = [];

  try {
    const data = await $fetch<any[]>(`/api/search?q=${encodeURIComponent(q)}`);
    results.value = data;
  } finally {
    loading.value = false;
  }
}

function newSearch() {
  navigate?.(
    `http://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`
  );
}

watch(
  () => props.query,
  (val) => {
    searchQuery.value = val;
    search(val);
  },
  { immediate: true }
);
</script>

<template>
  <div class="ie-page gsr">
    <div class="gsr__header">
      <!-- <img
        class="gsr__logo"
        src="/img/logos/google.png"
        alt="Google"
        @click="navigate?.('http://www.google.com')"
        style="cursor: pointer"
      /> -->
      <div class="gsr__search">
        <input
          v-model="searchQuery"
          class="gsr__input"
          @keyup.enter="newSearch"
        />
        <button class="gsr__btn" @click="newSearch">Pesquisa Google</button>
      </div>
    </div>

    <div class="gsr__body">
      <div v-if="loading" class="gsr__loading">Pesquisando...</div>

      <template v-else>
        <p class="gsr__stats">
          Resultados para <b>{{ props.query }}</b>
        </p>
        <div class="gsr__results">
          <div v-for="r in results" :key="r.link" class="gsr__result">
            <a @click="navigate?.(r.link)" class="gsr__result-title">
              {{ r.title }}
            </a>
            <p class="gsr__result-desc">{{ r.snippet }}</p>
            <span class="gsr__result-url">{{ r.link }}</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

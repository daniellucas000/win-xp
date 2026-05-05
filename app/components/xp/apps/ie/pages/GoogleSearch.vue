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
  <div class="gsr">
    <div class="gsr__content">
      <div class="gsr__content--search">
        <input
          v-model="searchQuery"
          class="gsr__content--input"
          @keyup.enter="newSearch"
        />
        <button class="gsr__content--btn" @click="newSearch">
          Pesquisa Google
        </button>
      </div>

      <div class="gsr__body">
        <div v-if="loading" class="gsr__body--loading">Pesquisando...</div>

        <div v-else>
          <p class="gsr__body--stats">
            Resultados para <b>{{ props.query }}</b>
          </p>

          <div class="gsr__body--layout">
            <div class="gsr__body--results">
              <div v-for="r in results" :key="r.link" class="gsr__body--result">
                <a class="gsr__body--result-title" @click="navigate?.(r.link)">
                  {{ r.title }}
                </a>
                <div class="gsr__body--result-url">{{ r.link }}</div>
                <p class="gsr__body--result-desc">{{ r.snippet }}</p>
              </div>

              <div v-if="results.length === 0" class="gsr__body--no-results">
                Nenhum resultado encontrado.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.gsr {
  display: flex;
  flex-direction: column;
  background: #fff;
  min-height: 600px;
  font-size: 13px;
  color: #000;

  &__content {
    padding: 8px 12px;
    flex: 1;

    &--search {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
    }

    &--input {
      border: 1px solid #ccc;
      padding: 3px 4px;
      font-size: 13px;
      width: 280px;
      outline: none;

      &:focus {
        border-color: #7f9db9;
      }
    }

    &--btn {
      background: linear-gradient(#f5f5f5, #e0e0e0);
      border: 1px solid #bbb;
      padding: 3px 10px;
      font-size: 12px;

      &:hover {
        background: linear-gradient(#fff, #d0d0d0);
      }
    }
  }

  &__body {
    &--loading {
      font-size: 13px;
      color: #666;
      margin-top: 12px;
    }

    &--stats {
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;

      b {
        color: #000;
      }
    }

    &--layout {
      display: flex;
      gap: 20px;
    }

    &--results {
      flex: 1;
    }

    &--result {
      margin-bottom: 16px;
    }

    &--result-title {
      color: #12c;
      font-size: 14px;
      font-weight: normal;
      text-decoration: underline;
      display: block;
      margin-bottom: 1px;

      &:hover {
        color: #c00;
      }
    }

    &--result-url {
      color: #080;
      font-size: 12px;
      margin-bottom: 2px;
    }

    &--result-desc {
      font-size: 12px;
      color: #000;
      line-height: 1.4;
    }

    &--no-results {
      font-size: 13px;
      color: #666;
      margin-top: 8px;
    }
  }
}
</style>

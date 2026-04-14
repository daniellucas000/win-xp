<script setup lang="ts">
const props = defineProps<{ query: string }>();
const navigate = inject<(url: string) => void>("ieNavigate");
const results = ref<any[]>([]);
const loading = ref(false);
const searchQuery = ref(props.query);

async function search(q: string) {
    if (!q.trim()) return;
    loading.value = true;
    results.value = [];
    try {
        const data = await $fetch<any[]>(
            `/api/search?q=${encodeURIComponent(q)}`,
        );
        results.value = data;
    } finally {
        loading.value = false;
    }
}

function newSearch() {
    navigate?.(
        `http://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}`,
    );
}

watch(
    () => props.query,
    (val) => {
        searchQuery.value = val;
        search(val);
    },
    { immediate: true },
);
</script>

<template>
    <div class="ie-page gsr">
        <div class="gsr__content">
            <div class="gsr__search">
                <input
                    v-model="searchQuery"
                    class="gsr__input"
                    @keyup.enter="newSearch"
                />
                <button class="gsr__btn" @click="newSearch">
                    Pesquisa Google
                </button>
            </div>

            <div class="gsr__body">
                <div v-if="loading" class="gsr__loading">Pesquisando...</div>

                <template v-else>
                    <p class="gsr__stats">
                        Resultados para <b>{{ props.query }}</b>
                    </p>
                    <p class="gsr__web-label">Web results:</p>

                    <div class="gsr__layout">
                        <div class="gsr__results">
                            <div
                                v-for="r in results"
                                :key="r.link"
                                class="gsr__result"
                            >
                                <a
                                    class="gsr__result-title"
                                    @click="navigate?.(r.link)"
                                >
                                    {{ r.title }}
                                </a>
                                <div class="gsr__result-url">{{ r.link }}</div>
                                <p class="gsr__result-desc">{{ r.snippet }}</p>
                            </div>

                            <div
                                v-if="results.length === 0"
                                class="gsr__no-results"
                            >
                                Nenhum resultado encontrado.
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div class="gsr__statusbar">
            <span>{{
                loading ? "Transferring data from google.com..." : "Done"
            }}</span>
            <span>Internet</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.gsr {
    background: #fff;
    min-height: 600px;
    font-family: Arial, sans-serif;
    font-size: 13px;
    color: #000;
    display: flex;
    flex-direction: column;
}

.gsr__address-label {
    font-size: 11px;
    color: #000;
    white-space: nowrap;
}

.gsr__address-bar {
    background: #fff;
    border: 1px solid #7f9db9;
    padding: 1px 4px;
    flex: 1;
    font-size: 12px;
    color: #000;
    font-family: Arial, sans-serif;
    min-width: 0;
}

.gsr__content {
    padding: 8px 12px;
    flex: 1;
}

.gsr__search {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
}

.gsr__input {
    border: 1px solid #ccc;
    padding: 3px 4px;
    font-size: 13px;
    width: 280px;
    font-family: Arial;
    outline: none;
}

.gsr__input:focus {
    border-color: #7f9db9;
}

.gsr__btn {
    background: linear-gradient(#f5f5f5, #e0e0e0);
    border: 1px solid #bbb;
    padding: 3px 10px;
    font-size: 12px;
    cursor: pointer;
    font-family: Arial;
}

.gsr__btn:hover {
    background: linear-gradient(#fff, #d0d0d0);
}

.gsr__stats {
    font-size: 12px;
    color: #666;
    margin-bottom: 2px;
}

.gsr__stats b {
    color: #000;
    font-weight: bold;
}

.gsr__web-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
}

.gsr__loading {
    font-size: 13px;
    color: #666;
    margin-top: 12px;
}

.gsr__layout {
    display: flex;
    gap: 20px;
}

.gsr__results {
    flex: 1;
}

.gsr__result {
    margin-bottom: 16px;
}

.gsr__result-title {
    color: #12c;
    font-size: 14px;
    font-weight: normal;
    text-decoration: underline;
    cursor: pointer;
    display: block;
    margin-bottom: 1px;
}

.gsr__result-title:hover {
    color: #c00;
}

.gsr__result-url {
    color: #080;
    font-size: 12px;
    margin-bottom: 2px;
}

.gsr__result-desc {
    font-size: 12px;
    color: #000;
    line-height: 1.4;
}

.gsr__no-results {
    font-size: 13px;
    color: #666;
    margin-top: 8px;
}

.gsr__statusbar {
    background: #ece9d8;
    border-top: 1px solid #aaa;
    padding: 1px 6px;
    font-size: 11px;
    color: #000;
    display: flex;
    justify-content: space-between;
    flex-shrink: 0;
}
</style>

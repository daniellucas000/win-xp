<script setup lang="ts">
import { useIEStore } from "~/stores/ie";
import { favorites, resolvePage, HOME_URL } from "~/data/ie";

const props = defineProps<{
    win: { id: string; app: string };
}>();

const ie = useIEStore();
const inputUrl = ref(ie.url);
const loading = ref(false);

let loadingTimer: ReturnType<typeof setTimeout> | null = null;

watch(
    () => ie.url,
    (val) => {
        inputUrl.value = val;
        triggerLoading();
    },
);

function triggerLoading() {
    loading.value = true;
    if (loadingTimer) clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
        loading.value = false;
    }, 800);
}

function navigate() {
    ie.navigateTo(inputUrl.value);
}

const currentPage = computed(() => resolvePage(ie.url));

const currentQuery = computed(() => {
    try {
        return new URL(ie.url).searchParams.get("q") ?? "";
    } catch {
        return "";
    }
});

onUnmounted(() => {
    if (loadingTimer) clearTimeout(loadingTimer);
});

provide("ieNavigate", ie.navigateTo);
provide("ieCurrentUrl", readonly(toRef(ie, "url")));
</script>

<template>
    <div class="ie">
        <div class="ie__menubar">
            <button class="ie__menu-item">File</button>
            <button class="ie__menu-item">Edit</button>
            <button class="ie__menu-item">View</button>
            <button class="ie__menu-item">Favorites</button>
            <button class="ie__menu-item">Tools</button>
            <button class="ie__menu-item">Help</button>
        </div>

        <div class="ie__toolbar">
            <button class="ie__btn" :disabled="!ie.canBack" @click="ie.back()">
                ◀
            </button>
            <button
                class="ie__btn"
                :disabled="!ie.canForward"
                @click="ie.forward()"
            >
                ▶
            </button>
            <button class="ie__btn" @click="triggerLoading">↻</button>
            <button class="ie__btn" @click="ie.navigateTo(HOME_URL)">🏠</button>
            <div class="ie__separator" />
            <input
                v-model="inputUrl"
                class="ie__address"
                @keyup.enter="navigate"
            />
            <button class="ie__go-btn" @click="navigate">Go</button>
        </div>

        <div class="ie__favbar">
            <span class="ie__favbar-label">Favoritos:</span>
            <button
                v-for="fav in favorites"
                :key="fav.url"
                class="ie__fav-btn"
                @click="ie.navigateTo(fav.url)"
            >
                {{ fav.label }}
            </button>
        </div>

        <div class="ie__content">
            <div v-if="loading" class="ie__loading">Carregando...</div>
            <component
                v-else-if="currentPage"
                :is="currentPage"
                :query="currentQuery"
                class="ie-page"
            />
            <div v-else class="ie__error">
                <h2>Não é possível exibir a página</h2>
                <p>
                    A página <strong>{{ ie.url }}</strong> não está disponível.
                </p>
            </div>
        </div>

        <div class="ie__statusbar">
            <span>{{ loading ? "Abrindo página..." : "Concluído" }}</span>
            <span class="ie__statusbar-right"
                ><img class="" src="/images/xp/icons/world.png" />
                Internet</span
            >
        </div>
    </div>
</template>

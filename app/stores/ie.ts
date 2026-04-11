import { defineStore } from 'pinia';

export const useIEStore = defineStore('ie', () => {
  const history = ref<string[]>(['http://www.google.com']);
  const cursor = ref(0);

  const url = computed(() => history.value[cursor.value]);

  function navigateTo(target: string) {
    history.value = [...history.value.slice(0, cursor.value + 1), target];
    cursor.value++;
  }

  function back() {
    if (cursor.value > 0) cursor.value--;
  }

  function forward() {
    if (cursor.value < history.value.length - 1) cursor.value++;
  }

  const canBack = computed(() => cursor.value > 0);
  const canForward = computed(() => cursor.value < history.value.length - 1);

  return { url, navigateTo, back, forward, canBack, canForward };
});

<script setup lang="ts">
const navigate = inject<(url: string) => void>('ieNavigate');

const query = ref('');

function search() {
  if (!query.value.trim()) return;
  navigate?.(
    `http://www.google.com/search?q=${encodeURIComponent(query.value)}`
  );
}
</script>

<template>
  <div class="google">
    <img src="/images/xp/google.png" alt="Google" width="200" />
    <div>
      <input
        v-model="query"
        class="google__input"
        @keyup.enter="search"
        autofocus
      />
      <div class="google__buttons">
        <button class="google__buttons--btn" @click="search">
          Pesquisa Google
        </button>
        <button class="google__buttons--btn">Estou com sorte</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.google {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  &__input {
    width: 485px;
    padding: 2px 5px;
  }

  &__buttons {
    display: flex;
    justify-content: center;

    &--btn {
      all: revert;
    }
  }
}
</style>

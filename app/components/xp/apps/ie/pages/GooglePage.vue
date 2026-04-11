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
    <img
      class="google__logo"
      src="/images/xp/google.png"
      alt="Google"
      width="200"
    />
    <div class="google__search">
      <input
        v-model="query"
        class="google__input"
        @keyup.enter="search"
        autofocus
      />
      <div class="google__buttons">
        <button class="google__btn" @click="search">Google Search</button>
        <button class="google__btn">I'm Feeling Lucky</button>
      </div>
    </div>
    <div class="google__footer">
      <a href="#">Advertising Programs</a> -
      <a href="#">About Google</a>
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
  }

  &__buttons {
    display: flex;
    justify-content: center;
  }

  &__btn {
    all: revert;
  }

  &__footer {
    margin-top: 4rem;
  }
}
</style>

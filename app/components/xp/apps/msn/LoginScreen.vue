<script setup lang="ts">
const modelValue = defineModel<{
  name: string;
  status: string;
  remember: boolean;
} | null>();
const name = ref(modelValue.value?.name || 'Convidado');
const status = ref(modelValue.value?.status || 'online');
const remember = ref(modelValue.value?.remember || false);

function handleSubmit() {
  if (!name.value.trim()) return;

  modelValue.value = {
    name: name.value.trim(),
    status: status.value,
    remember: remember.value,
  };
}
</script>

<template>
  <div class="login">
    <div class="login__logo">
      <img src="/images/xp/icons/msn.png" alt="MSN" />
    </div>

    <h2 class="login__title">Entrar no MSN Messenger</h2>

    <form @submit.prevent="handleSubmit" class="login__form">
      <div class="login__field">
        <label for="msn-name">Seu nome:</label>
        <input
          id="msn-name"
          v-model="name"
          type="text"
          placeholder="Digite seu nome..."
          maxlength="30"
        />
      </div>

      <div class="login__field">
        <select id="msn-status" v-model="status">
          <option value="online">Online</option>
          <option value="away">Ausente</option>
          <option value="busy">Ocupado</option>
          <option value="invisible">Invisível</option>
        </select>
      </div>

      <div class="login__field login__field--checkbox">
        <input id="msn-remember" v-model="remember" type="checkbox" />
        <label for="msn-remember">Lembrar de mim</label>
      </div>

      <button type="submit" class="login__btn">Entrar</button>
    </form>
  </div>
</template>

<style>
@import '~/assets/css/components/xp/apps/msn/LoginScreen.css';
</style>

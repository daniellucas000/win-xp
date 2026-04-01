<script setup lang="ts">
const text = ref('')
</script>

<template>
  <div class="notepad">
    <div class="notepad__menubar">
      <span class="notepad__menu-item">File</span>
      <span class="notepad__menu-item">Edit</span>
      <span class="notepad__menu-item">Format</span>
      <span class="notepad__menu-item">View</span>
      <span class="notepad__menu-item">Help</span>
    </div>

    <textarea
      v-model="text"
      class="notepad__textarea"
      spellcheck="false"
    />

    <div class="notepad__statusbar">
      <span>Ln 1, Col 1</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/apps/Notepad.scss';
</style>

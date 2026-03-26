<script setup lang="ts">
const text = ref('')
</script>

<template>
  <div class="notepad">
    <!-- Menu bar -->
    <div class="notepad__menubar">
      <span class="notepad__menu-item">File</span>
      <span class="notepad__menu-item">Edit</span>
      <span class="notepad__menu-item">Format</span>
      <span class="notepad__menu-item">View</span>
      <span class="notepad__menu-item">Help</span>
    </div>

    <!-- Área de texto -->
    <textarea
      v-model="text"
      class="notepad__textarea"
      spellcheck="false"
    />

    <!-- Status bar -->
    <div class="notepad__statusbar">
      <span>Ln 1, Col 1</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notepad {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $xp-bg;

  &__menubar {
    display: flex;
    flex-shrink: 0;
    padding: 2px 0;
    border-bottom: 1px solid $xp-border-dark;
  }

  &__menu-item {
    padding: 2px 6px;
    font-size: 11px;
    cursor: default;

    &:hover {
      background: #316ac5;
      color: white;
    }
  }

  &__textarea {
    flex: 1;
    resize: none;
    border: none;
    outline: none;
    padding: 2px;
    font-family: 'Lucida Console', monospace;
    font-size: 12px;
    background: white;
    color: black;
  }

  &__statusbar {
    flex-shrink: 0;
    height: 20px;
    border-top: 1px solid $xp-border-dark;
    display: flex;
    align-items: center;
    padding: 0 4px;
    font-size: 11px;
  }
}
</style>
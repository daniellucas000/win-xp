<script setup lang="ts">
const text = ref('')
</script>

<template>
  <div class="notepad">
    <div class="notepad__menubar" role="menubar" aria-label="Menu">
      <button class="notepad__menu-item" role="menuitem">File</button>
      <button class="notepad__menu-item" role="menuitem">Edit</button>
      <button class="notepad__menu-item" role="menuitem">Format</button>
      <button class="notepad__menu-item" role="menuitem">View</button>
      <button class="notepad__menu-item" role="menuitem">Help</button>
    </div>

    <label for="notepad-textarea" class="visually-hidden">Conteúdo do documento</label>
    <textarea
      id="notepad-textarea"
      v-model="text"
      class="notepad__textarea"
      spellcheck="false"
      aria-label="Conteúdo do documento"
    />

    <div class="notepad__statusbar" aria-label="Status">
      <span>Ln 1, Col 1</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>

<style lang="scss" scoped>
@import '~/assets/css/components/xp/apps/Notepad.scss';
</style>

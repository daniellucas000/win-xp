<script setup lang="ts">
import ContextMenuSubmenu from '~/components/xp/contextMenu/ContextMenuSubmenu.vue';
import type { FileSystemItem } from '~/data/fileSystem';

defineProps<{
  x: number;
  y: number;
  itemId: number | null;
  isTrashMode: boolean;
  currentFolderId: number | null;
  hasClipboard: boolean;
  getItem: (id: number) => FileSystemItem | undefined;
}>();

const emit = defineEmits<{
  open: [item: FileSystemItem];
  rename: [id: number];
  cut: [];
  copy: [];
  paste: [];
  delete: [];
  createFolder: [];
  createFile: [];
  close: [];
}>();
</script>

<template>
  <div
    class="context-menu"
    role="menu"
    aria-label="Menu de contexto"
    :style="{ top: `${y}px`, left: `${x}px` }"
    @click.stop
  >
    <template v-if="itemId !== null">
      <button
        class="context-menu__item"
        role="menuitem"
        @click="
          emit('open', getItem(itemId)!);
          emit('close');
        "
      >
        Abrir
      </button>
      <button
        v-if="currentFolderId !== null && !isTrashMode"
        class="context-menu__item"
        role="menuitem"
        @click="
          emit('rename', itemId);
          emit('close');
        "
      >
        Renomear
      </button>
      <button
        v-if="!isTrashMode"
        class="context-menu__item"
        role="menuitem"
        @click="
          emit('cut');
          emit('close');
        "
      >
        Recortar
      </button>
      <button
        v-if="!isTrashMode"
        class="context-menu__item"
        role="menuitem"
        @click="
          emit('copy');
          emit('close');
        "
      >
        Copiar
      </button>
      <div class="context-menu__divider" role="separator" />
      <button
        v-if="!isTrashMode"
        class="context-menu__item context-menu__item--danger"
        role="menuitem"
        @click="
          emit('delete');
          emit('close');
        "
      >
        Excluir
      </button>
      <button class="context-menu__item" role="menuitem" @click="emit('close')">
        Propriedades
      </button>
    </template>

    <template v-else>
      <button
        v-if="hasClipboard && currentFolderId !== null"
        class="context-menu__item"
        role="menuitem"
        @click="
          emit('paste');
          emit('close');
        "
      >
        Colar
      </button>

      <button
        v-if="currentFolderId !== null && !isTrashMode"
        class="context-menu__item"
        role="menuitem"
      >
        <span class="context-menu__item--label">Novo</span>
        <span class="context-menu__item--arrow" aria-hidden="true">▶</span>
        <ContextMenuSubmenu
          :items="[
            { label: 'Pasta', action: () => emit('createFolder') },
            { label: 'Documento de Texto', action: () => emit('createFile') },
          ]"
          @select="
            (item) => {
              item.action?.();
              emit('close');
            }
          "
        />
      </button>
      <div v-if="!isTrashMode" class="context-menu__divider" role="separator" />
      <button class="context-menu__item" role="menuitem" @click="emit('close')">
        Propriedades
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{ x: number; y: number }>()
const emit = defineEmits<{ close: [] }>()

const sections = [
  [
    { label: 'Arrange Icons By', hasSubmenu: true },
    { label: 'Refresh' },
  ],
  [
    { label: 'Paste', disabled: true },
    { label: 'Paste Shortcut', disabled: true },
    { label: 'Undo Delete', disabled: true },
  ],
  [
    {
      label: 'New',
      hasSubmenu: true,
      submenu: [
        { icon: '/images/xp/icons/FolderClosed.png',  label: 'Folder' },
        { icon: '/images/xp/icons/TXT.png',           label: 'Text Document' },
        { icon: '/images/xp/icons/Bitmap.png',        label: 'Bitmap Image' },
        { icon: '/images/xp/icons/Zipfolder.png',     label: 'Compressed (zipped) Folder' },
      ],
    },
  ],
  [
    { label: 'Properties' },
  ],
]
</script>

<template>
  <div
    class="context-menu"
    :style="{ top: `${y}px`, left: `${x}px` }"
    @click.stop
  >
    <template v-for="(section, si) in sections" :key="si">
      <div v-if="si > 0" class="context-menu__divider" />

      <div
        v-for="item in section"
        :key="item.label"
        class="context-menu__item"
        :class="{ 'context-menu__item--disabled': item.disabled }"
        @click="!item.disabled && emit('close')"
      >
        <span class="context-menu__item-label">{{ item.label }}</span>
        <span v-if="item.hasSubmenu" class="context-menu__arrow">▶</span>

        <!-- Submenu -->
        <div v-if="item.submenu" class="context-menu__submenu">
          <div
            v-for="sub in item.submenu"
            :key="sub.label"
            class="context-menu__item"
            @click.stop="emit('close')"
          >
            <img :src="sub.icon" class="context-menu__sub-icon" />
            <span class="context-menu__item-label">{{ sub.label }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.context-menu {
  position: absolute;
  z-index: 99999;
  background: #f0ede3;
  border: 1px solid $xp-border-dark;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  min-width: 180px;
  padding: 2px 0;

  &__divider {
    height: 1px;
    background: $xp-border-dark;
    margin: 2px 4px;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: 3px 24px;
    cursor: default;
    position: relative;
    font-size: 11px;
    color: black;

    &:hover {
      background: #316ac5;
      color: white;

      .context-menu__submenu {
        display: block;
      }

      .context-menu__arrow {
        color: white;
      }
    }

    &--disabled {
      color: $xp-border-dark;
      pointer-events: none;
    }
  }

  &__item-label {
    flex: 1;
  }

  &__arrow {
    font-size: 9px;
    color: black;
    margin-left: 8px;
  }

  &__sub-icon {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }

  &__submenu {
    display: none;
    position: absolute;
    left: 100%;
    top: -2px;
    background: #f0ede3;
    border: 1px solid $xp-border-dark;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    min-width: 180px;
    padding: 2px 0;
    z-index: 100000;
  }
}
</style>
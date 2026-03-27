<script setup lang="ts">
interface SubmenuItem {
  icon: string
  label: string
}

interface MenuItem {
  label: string
  disabled?: boolean
  hasSubmenu?: boolean
  submenu?: SubmenuItem[]
}

interface Props {
  x: number
  y: number
}

defineProps<Props>()
const open = defineModel<boolean>('modelValue') 

const sections: MenuItem[][] = [
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
        { icon: '/images/xp/icons/file-txt.png', label: 'Text Document' },
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
    <template v-for="(section, index) in sections" :key="index">
      <div v-if="index > 0" class="context-menu__divider" />

      <div
        v-for="item in section"
        :key="item.label"
        class="context-menu__item"
        :class="{ 'context-menu__item--disabled': item.disabled }"
        @click="!item.disabled && (open = false)"  
      >
        <span class="context-menu__item-label">{{ item.label }}</span>
        <span v-if="item.hasSubmenu" class="context-menu__arrow">▶</span>

        <!-- Submenu -->
        <div v-if="item.submenu" class="context-menu__submenu">
          <div
            v-for="sub in item.submenu"
            :key="sub.label"
            class="context-menu__item"
            @click.stop="open = false"  
          >
            <img :src="sub.icon" class="context-menu__sub-icon" />
            <span class="context-menu__item-label">{{ sub.label }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
@import '~/assets/css/components/xp/ContextMenu.scss';
</style>
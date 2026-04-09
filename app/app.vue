<script setup lang="ts">
const { getPersonSchema, getPortfolioSchema } = useSeo()

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify(getPersonSchema()),
    },
    {
      type: 'application/ld+json',
      children: JSON.stringify(getPortfolioSchema()),
    },
  ],
})
</script>

<template>
  <NuxtPage />
</template>
<script setup lang="ts">
defineProps<{ color?: string }>();
const { locales, locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const items = computed(() => locales.value.map(item => ({
  label: item.name ?? item.code.toUpperCase(),
  to: switchLocalePath(item.code),
  active: item.code === locale.value,
})));
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-lucide-languages"
      trailing-icon="i-lucide-chevron-down"
      :aria-label="$t('languagesLabel')"
    >
      {{ locale.toUpperCase() }}
    </UButton>
  </UDropdownMenu>
</template>

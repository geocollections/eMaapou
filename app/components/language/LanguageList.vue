<script setup lang="ts">
import type { LocaleObject } from "@nuxtjs/i18n";
import { mdiCheck } from "@mdi/js";

const availableLocales = useI18n().locales as ComputedRef<LocaleObject[]>;

const switchLocalePath = useSwitchLocalePath();
</script>

<template>
  <VList class="py-1" :aria-label="$t('languagesLabel')">
    <VListItem
      v-for="(locale, i) in availableLocales"
      :key="i"
      class="header-menu-item rounded my-1"
      role="option"
      :class="{ 'header-menu-item-active': $i18n.locale === locale.code }"
      :to="switchLocalePath(locale.code)"
    >
      <VListItemTitle class="d-flex py-1">
        <div
          v-show="$i18n.locale === locale.code"
          :icon="mdiCheck"
          start
          color="accent"
        />
        <span class="align-self-center montserrat">{{ locale.name }}</span>
      </VListItemTitle>
    </VListItem>
  </VList>
</template>

<style scoped>
.lang-icon {
  height: 24px;
  width: 24px !important;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
  border-radius: 100%;
}

.flag:before {
  content: "\A0";
}
</style>

<script setup lang="ts">
import { mdiBug, mdiChevronDown, mdiChevronRight, mdiFlaskOutline, mdiMagnify, mdiMapMarkerRadiusOutline, mdiMenu, mdiOpenInNew } from "@mdi/js";
import { BROWSE_GEOLOGY_LIST, BROWSE_LAB_LIST, BROWSE_TAXON_LIST, SERVICES } from "~/constants";

const { locale, t } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const query = ref("");
const route = useRoute();
const copy = computed(() => ({
  subtitle: t("portal.navigation.subtitle"),
  browse: t("portal.navigation.browse"),
  search: t("portal.common.searchAll"),
  services: t("portal.navigation.services"),
  login: t("portal.navigation.login"),
  about: t("portal.navigation.about"),
  help: t("portal.navigation.help"),
  collections: t("portal.navigation.collections"),
  collectionsText: t("portal.navigation.collectionsText"),
  research: t("portal.navigation.research"),
  researchText: t("portal.navigation.researchText"),
  places: t("portal.navigation.places"),
  placesText: t("portal.navigation.placesText"),
  external: t("portal.navigation.external"),
  helpText: t("portal.navigation.helpText"),
  more: t("portal.navigation.more"),
}));
const groups = computed(() => [
  {
    title: copy.value.collections,
    description: copy.value.collectionsText,
    icon: mdiBug,
    items: BROWSE_TAXON_LIST.filter(item => item.routeName !== "stratigraphy"),
  },
  {
    title: copy.value.research,
    description: copy.value.researchText,
    icon: mdiFlaskOutline,
    items: [...BROWSE_LAB_LIST].sort((a, b) => [
      "sample",
      "analysis",
      "analytical-data",
      "dataset",
      "preparation",
    ].indexOf(a.routeName) - [
      "sample",
      "analysis",
      "analytical-data",
      "dataset",
      "preparation",
    ].indexOf(b.routeName)),
  },
  {
    title: copy.value.places,
    description: copy.value.placesText,
    icon: mdiMapMarkerRadiusOutline,
    items: [
      ...BROWSE_GEOLOGY_LIST,
      ...BROWSE_TAXON_LIST.filter(item => item.routeName === "stratigraphy"),
    ],
  },
]);
type Menu = "browse";
const openMenu = ref<Menu | null>(null);
function setMenu(menu: Menu, open: boolean) {
  if (open)
    openMenu.value = menu;
  else if (openMenu.value === menu)
    openMenu.value = null;
}
function search() {
  if (query.value.trim()) {
    navigateTo(localePath({
      name: "search",
      query: {
        q: query.value.trim(),
      },
    }));
  }
}
watch(() => route.fullPath, () => {
  openMenu.value = null;
});
</script>

<template>
  <header class="sticky top-0 z-1100 shrink-0 border-b border-portal-border bg-portal-background font-sans text-sm font-medium text-portal-heading">
    <div class="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-3 px-4 min-[420px]:px-4 min-[700px]:gap-2 min-[960px]:h-18 min-[960px]:gap-3 min-[960px]:px-6 xl:gap-6 xl:px-8">
      <ULink
        :to="localePath('/')"
        raw
        class="header-focus flex shrink-0 items-center gap-3 text-portal-heading no-underline"
        :aria-label="t('portal.site.brand')"
      >
        <span class="inline-flex items-center gap-1.5 min-[700px]:gap-2"><img
          src="/logos/emaapou-icon.svg"
          alt=""
          width="32"
          height="36"
          class="h-7 w-auto shrink-0 min-[700px]:h-8 min-[960px]:h-9"
        ><span class="text-xl font-bold tracking-[-1.2px] min-[380px]:text-[22px] min-[700px]:text-2xl min-[960px]:text-[28px]">{{ t('portal.site.brand') }}</span></span>
        <span class="hidden max-w-32.5 border-l border-portal-border pl-3 text-[11px] leading-snug xl:block">{{ copy.subtitle }}</span>
      </ULink>
      <UPopover
        :open="openMenu === 'browse'"
        :content="{ align: 'start', sideOffset: 16, collisionPadding: 16 }"
        :ui="{ content: 'header-panel z-[1200] w-[min(1056px,calc(100vw-32px))]' }"
        @update:open="setMenu('browse', $event)"
      >
        <UButton
          color="neutral"
          variant="ghost"
          class="header-control order-last size-11 shrink-0 justify-center gap-2 p-0 min-[700px]:order-0 min-[700px]:h-auto min-[700px]:w-auto min-[700px]:bg-portal-mint min-[700px]:px-4 min-[700px]:text-sm min-[700px]:hover:bg-portal-selected"
          :aria-label="t('portal.navigation.menu')"
        >
          <span class="hidden min-[700px]:inline">{{ copy.browse }}</span>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            class="size-6 min-[700px]:hidden"
          ><path :d="mdiMenu" /></svg>
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            focusable="false"
            class="hidden size-4.5 transition-transform shrink-0 min-[700px]:block"
            :class="{ 'rotate-180': openMenu === 'browse' }"
          ><path :d="mdiChevronDown" /></svg>
        </UButton>
        <template #content>
          <nav class="grid max-h-[calc(100dvh-96px)] grid-cols-1 overflow-y-auto p-4 min-[700px]:grid-cols-3 min-[700px]:p-6" :aria-label="copy.browse">
            <section
              v-for="group in groups"
              :key="group.title"
              class="border-portal-border py-4 first:pt-0 not-first:border-t min-[700px]:px-3 min-[700px]:py-0 min-[700px]:first:pl-0 min-[700px]:last:pr-0 min-[700px]:not-first:border-t-0 min-[700px]:not-first:border-l min-[960px]:px-6"
            >
              <div class="mb-3 flex items-start gap-3 min-[700px]:flex-col min-[960px]:flex-row">
                <span class="grid size-11 shrink-0 place-items-center rounded-portal-card bg-portal-mint text-portal-link"><svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  class="size-7 shrink-0"
                ><path :d="group.icon" /></svg></span>
                <div>
                  <h2 class="header-menu-heading">
                    {{ group.title }}
                  </h2><p class="header-menu-description">
                    {{ group.description }}
                  </p>
                </div>
              </div>
              <UButton
                v-for="item in group.items"
                :key="item.routeName"
                :to="localePath({ name: item.routeName })"
                color="neutral"
                variant="ghost"
                class="header-menu-link"
                @click="openMenu = null"
              >
                {{ $t(item.label) }} <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  class="size-4 shrink-0"
                ><path :d="mdiChevronRight" /></svg>
              </UButton>
            </section>
            <section class="border-t border-portal-border pt-4 min-[700px]:hidden">
              <UButton
                :to="localePath({ name: 'about' })"
                color="neutral"
                variant="ghost"
                class="header-menu-link"
              >
                {{ copy.about }}
              </UButton>
              <div class="mt-3 flex gap-2" :aria-label="t('portal.common.language')">
                <UButton
                  v-for="language in ['en', 'et'] as const"
                  :key="language"
                  :to="switchLocalePath(language)"
                  :locale="false"
                  :lang="language"
                  color="neutral"
                  variant="ghost"
                  class="header-control px-4"
                  :class="locale === language ? 'bg-portal-mint text-portal-link' : ''"
                  :aria-current="locale === language ? 'true' : undefined"
                  @click="openMenu = null"
                >
                  {{ t(`portal.language.${language}`) }}
                </UButton>
              </div>
            </section>
            <section class="border-t border-portal-border pt-4 min-[700px]:hidden">
              <h2 class="header-menu-heading">
                {{ copy.services }}
              </h2>
              <p class="header-menu-description">
                {{ copy.external }}
              </p>
              <UButton
                :to="localePath({ name: 'services' })"
                color="neutral"
                variant="ghost"
                class="header-menu-link"
                @click="openMenu = null"
              >
                {{ copy.services }}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  focusable="false"
                  class="size-4 shrink-0"
                ><path :d="mdiChevronRight" /></svg>
              </UButton>
            </section>
          </nav>
        </template>
      </UPopover>
      <form
        class="hidden min-w-32.5 flex-1 min-[700px]:block"
        role="search"
        @submit.prevent="search"
      >
        <label class="sr-only" for="portal-search">{{ copy.search }}</label>
        <UInput
          id="portal-search"
          v-model="query"
          type="search"
          color="neutral"
          variant="outline"
          :placeholder="copy.search"
          class="w-full"
          :ui="{ base: 'h-12 rounded-portal-control border border-portal-border-hover bg-portal-background pl-11 text-sm text-portal-text ring-0 placeholder:text-portal-muted focus-visible:ring-2 focus-visible:ring-portal-focus', leading: 'pl-0' }"
        >
          <template #leading>
            <UButton
              type="submit"
              color="neutral"
              variant="ghost"
              class="header-control size-11 p-0"
              :aria-label="copy.search"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                focusable="false"
                class="size-5 shrink-0"
              ><path :d="mdiMagnify" /></svg>
            </UButton>
          </template>
        </UInput>
      </form>
      <UButton
        color="neutral"
        variant="ghost"
        class="header-control size-11 p-0 min-[700px]:hidden"
        :to="localePath({ name: 'search' })"
        :aria-label="copy.search"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
          class="size-5 shrink-0"
        ><path :d="mdiMagnify" /></svg>
      </UButton>
      <UButton
        :href="SERVICES.sarv.href"
        target="_blank"
        rel="noopener noreferrer"
        color="neutral"
        variant="ghost"
        class="header-control ml-auto min-w-11 px-2 min-[700px]:hidden"
      >
        {{ copy.login }}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="size-4"
        ><path :d="mdiOpenInNew" /></svg>
        <span class="sr-only">({{ copy.external }})</span>
      </UButton>
      <nav class="hidden items-center gap-1 min-[700px]:flex" :aria-label="t('portal.navigation.mainNavigation')">
        <UButton
          color="neutral"
          variant="ghost"
          class="header-control min-w-11"
          :class="route.name?.toString().split('___')[0] === 'services' ? 'bg-portal-mint text-portal-link' : ''"
          :to="localePath({ name: 'services' })"
          :aria-label="copy.services"
        >
          <span>{{ copy.services }}</span>
        </UButton>
        <UButton
          color="neutral"
          variant="ghost"
          class="header-control hidden min-w-11 min-[700px]:flex"
          :class="route.name?.toString().split('___')[0] === 'about' ? 'bg-portal-mint text-portal-link' : ''"
          :to="localePath({ name: 'about' })"
          :aria-label="copy.about"
        >
          <span>{{ copy.about }}</span>
        </UButton>
      </nav>
      <UButton
        :href="SERVICES.sarv.href"
        target="_blank"
        rel="noopener noreferrer"
        color="neutral"
        variant="ghost"
        class="header-control hidden shrink-0 gap-2 min-[960px]:inline-flex"
      >
        {{ t('portal.site.workbench') }}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="size-4"
        ><path :d="mdiOpenInNew" /></svg>
        <span class="sr-only">({{ copy.external }})</span>
      </UButton>
      <nav class="hidden shrink-0 items-center border-portal-border min-[700px]:flex min-[700px]:gap-1 min-[700px]:border-l min-[700px]:pl-2 min-[960px]:pl-3" :aria-label="t('portal.common.language')">
        <UButton
          v-for="language in ['en', 'et'] as const"
          :key="language"
          color="neutral"
          variant="ghost"
          :to="switchLocalePath(language)"
          :locale="false"
          :lang="language"
          :aria-label="t(`portal.language.${language}`)"
          :aria-current="locale === language ? 'true' : undefined"
          :active="false"
          class="header-control min-w-9 px-2 text-[13px] min-[700px]:min-w-11"
          :class="locale === language ? 'bg-portal-mint font-bold text-portal-link' : ''"
        >
          {{ language.toUpperCase() }}
        </UButton>
      </nav>
    </div>
  </header>
</template>

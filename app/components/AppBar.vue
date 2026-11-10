<script setup lang="ts">
import { mdiChevronDown, mdiChevronRight, mdiMagnify, mdiLayersTripleOutline, mdiInformationOutline, mdiHelpCircleOutline, mdiFlaskOutline, mdiMapMarkerRadiusOutline, mdiBug, mdiOpenInNew } from "@mdi/js";
import { BROWSE_GEOLOGY_LIST, BROWSE_LAB_LIST, BROWSE_TAXON_LIST, SERVICES } from "~/constants";

const { locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const query = ref("");
const route = useRoute();
const en = computed(() => locale.value === "en");
const copy = computed(() => en.value ? {
  subtitle: "Estonian geological data portal", browse: "Browse data", search: "Search all data", services: "E-services", about: "About", help: "Help",
  collections: "Collections", collectionsText: "Physical and digital collections of geological material.", research: "Research data", researchText: "Research material, analytical results and derived datasets.", places: "Places & geology", placesText: "Geographical information and geological context.",
  external: "Services open on their own websites.", helpText: "Search across geological data or browse a category to find specimens, samples, places and research results.", more: "About this portal",
} : {
  subtitle: "Eesti geoloogiliste andmete portaal", browse: "Sirvi andmeid", search: "Otsi kõigist andmetest", services: "E-teenused", about: "Tutvustus", help: "Abi",
  collections: "Kollektsioonid", collectionsText: "Geoloogilise materjali füüsilised ja digitaalsed kollektsioonid.", research: "Teadusandmed", researchText: "Uurimismaterjal, analüüside tulemused ja andmestikud.", places: "Paigad ja geoloogia", placesText: "Geograafiline teave ja geoloogiline kontekst.",
  external: "Teenused avanevad eraldi veebilehtedel.", helpText: "Otsi geoloogilisi andmeid või vali andmerühm, et leida eksemplare, proove, leiukohti ja teadustulemusi.", more: "Portaalist lähemalt",
});
const groups = computed(() => [
  { title: copy.value.collections, description: copy.value.collectionsText, icon: mdiBug, items: BROWSE_TAXON_LIST.filter(item => item.routeName !== "stratigraphy") },
  { title: copy.value.research, description: copy.value.researchText, icon: mdiFlaskOutline, items: [...BROWSE_LAB_LIST].sort((a, b) => ["sample", "analysis", "analytical-data", "dataset", "preparation"].indexOf(a.routeName) - ["sample", "analysis", "analytical-data", "dataset", "preparation"].indexOf(b.routeName)) },
  { title: copy.value.places, description: copy.value.placesText, icon: mdiMapMarkerRadiusOutline, items: [...BROWSE_GEOLOGY_LIST, ...BROWSE_TAXON_LIST.filter(item => item.routeName === "stratigraphy")] },
]);
type Menu = "browse" | "services" | "help";
const openMenu = ref<Menu | null>(null);
function setMenu(menu: Menu, open: boolean) {
  if (open) openMenu.value = menu;
  else if (openMenu.value === menu) openMenu.value = null;
}
function search() {
  if (query.value.trim()) navigateTo(localePath({ name: "search", query: { q: query.value.trim() } }));
}
watch(() => route.fullPath, () => { openMenu.value = null; });
</script>

<template>
  <header class="sticky top-0 z-[1100] shrink-0 border-b border-portal-border bg-portal-background font-sans text-sm font-medium text-portal-heading">
    <div class="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-1 px-2 min-[380px]:px-4 min-[700px]:gap-2 min-[960px]:h-18 min-[960px]:gap-3 min-[960px]:px-6 xl:gap-6 xl:px-8">
      <ULink :to="localePath('/')" raw class="header-focus flex shrink-0 items-center gap-3 text-portal-heading no-underline" aria-label="eMaapõu">
        <span class="text-xl font-bold tracking-[-1.2px] min-[380px]:text-[22px] min-[700px]:text-2xl min-[960px]:text-[28px]">eMaapõu</span>
        <span class="hidden max-w-[130px] border-l border-portal-border pl-3 text-[11px] leading-snug xl:block">{{ copy.subtitle }}</span>
      </ULink>
      <UPopover :open="openMenu === 'browse'" :content="{ align: 'start', sideOffset: 16, collisionPadding: 16 }" :ui="{ content: 'header-panel z-[1200] w-[min(1056px,calc(100vw-32px))]' }" @update:open="setMenu('browse', $event)">
        <UButton color="neutral" variant="ghost" class="header-control gap-0 bg-portal-mint px-2 text-[13px] font-semibold hover:bg-portal-selected min-[380px]:gap-2 min-[700px]:px-4 min-[700px]:text-sm" :aria-label="copy.browse">
          <span class="hidden min-[700px]:inline">{{ copy.browse }}</span>
          <span class="min-[700px]:hidden">{{ en ? "Data" : "Andmed" }}</span>
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-[18px] transition-transform shrink-0" :class="{ 'rotate-180': openMenu === 'browse' }"><path :d="mdiChevronDown" /></svg>
        </UButton>
        <template #content>
          <nav class="grid max-h-[calc(100dvh-96px)] grid-cols-1 overflow-y-auto p-4 min-[700px]:grid-cols-3 min-[700px]:p-6" :aria-label="copy.browse">
            <section v-for="group in groups" :key="group.title" class="border-portal-border py-4 first:pt-0 not-first:border-t min-[700px]:px-3 min-[700px]:py-0 min-[700px]:first:pl-0 min-[700px]:last:pr-0 min-[700px]:not-first:border-t-0 min-[700px]:not-first:border-l min-[960px]:px-6">
              <div class="mb-3 flex items-start gap-3 min-[700px]:flex-col min-[960px]:flex-row">
                <span class="grid size-11 shrink-0 place-items-center rounded-portal-card bg-portal-mint text-portal-link"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-7 shrink-0"><path :d="group.icon" /></svg></span>
                <div><h2 class="header-menu-heading">{{ group.title }}</h2><p class="header-menu-description">{{ group.description }}</p></div>
              </div>
              <UButton v-for="item in group.items" :key="item.routeName" :to="localePath({ name: item.routeName })" color="neutral" variant="ghost" class="header-menu-link" @click="openMenu = null">
                {{ $t(item.label) }} <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-4 shrink-0"><path :d="mdiChevronRight" /></svg>
              </UButton>
            </section>
            <section class="border-t border-portal-border pt-4 min-[700px]:hidden">
              <UButton :to="localePath({ name: 'about' })" color="neutral" variant="ghost" class="header-menu-link"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-5 shrink-0"><path :d="mdiInformationOutline" /></svg>{{ copy.about }}</UButton>
              <h2 class="header-menu-heading mt-3">{{ copy.help }}</h2><p class="header-menu-description">{{ copy.helpText }}</p>
            </section>
            <section class="border-t border-portal-border pt-4 min-[380px]:hidden">
              <h2 class="header-menu-heading">{{ copy.services }}</h2>
              <p class="header-menu-description">{{ copy.external }}</p>
              <div class="grid min-[700px]:grid-cols-2 min-[700px]:gap-x-4">
                <UButton v-for="id in SERVICES.ids" :key="id" :href="SERVICES[id].href" target="_blank" rel="noopener noreferrer" color="neutral" variant="ghost" class="header-menu-link" @click="openMenu = null">
                  {{ $t(SERVICES[id].title) }}
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-4 shrink-0"><path :d="mdiOpenInNew" /></svg>
                </UButton>
              </div>
            </section>
          </nav>
        </template>
      </UPopover>
      <form class="hidden min-w-[130px] flex-1 min-[700px]:block" role="search" @submit.prevent="search">
        <label class="sr-only" for="portal-search">{{ copy.search }}</label>
        <UInput id="portal-search" v-model="query" type="search" color="neutral" variant="outline" :placeholder="copy.search" class="w-full" :ui="{ base: 'h-12 rounded-portal-control border border-portal-border-hover bg-portal-background pl-11 text-sm text-portal-text ring-0 placeholder:text-portal-muted focus-visible:ring-2 focus-visible:ring-portal-focus', leading: 'pl-0' }">
          <template #leading><UButton type="submit" color="neutral" variant="ghost" class="header-control size-11 p-0" :aria-label="copy.search"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-5 shrink-0"><path :d="mdiMagnify" /></svg></UButton></template>
        </UInput>
      </form>
      <UButton color="neutral" variant="ghost" class="header-control ml-auto size-11 p-0 min-[700px]:hidden" :to="localePath({ name: 'search' })" :aria-label="copy.search"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-5 shrink-0"><path :d="mdiMagnify" /></svg></UButton>
      <nav class="hidden items-center gap-1 min-[380px]:flex" :aria-label="en ? 'Main navigation' : 'Põhinavigatsioon'">
        <UPopover :open="openMenu === 'services'" :content="{ align: 'end', sideOffset: 16, collisionPadding: 16 }" :ui="{ content: 'header-panel z-[1200] w-[min(600px,calc(100vw-32px))]' }" @update:open="setMenu('services', $event)">
          <UButton color="neutral" variant="ghost" class="header-control min-w-11" :aria-label="copy.services"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-5 shrink-0"><path :d="mdiLayersTripleOutline" /></svg><span class="hidden min-[960px]:inline">{{ copy.services }}</span></UButton>
          <template #content><section class="max-h-[min(620px,calc(100dvh-96px))] overflow-y-auto p-6">
              <h2 class="header-menu-heading">{{ copy.services }}</h2>
              <p class="header-menu-description">{{ copy.external }}</p>
              <div class="grid min-[700px]:grid-cols-2 min-[700px]:gap-x-4">
                <UButton v-for="id in SERVICES.ids" :key="id" :href="SERVICES[id].href" target="_blank" rel="noopener noreferrer" color="neutral" variant="ghost" class="header-menu-link" @click="openMenu = null">
                  {{ $t(SERVICES[id].title) }}
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-4 shrink-0"><path :d="mdiOpenInNew" /></svg>
                </UButton>
              </div>
            </section></template>
        </UPopover>
        <UButton color="neutral" variant="ghost" class="header-control hidden min-w-11 min-[700px]:flex" :to="localePath({ name: 'about' })" :aria-label="copy.about"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-5 shrink-0"><path :d="mdiInformationOutline" /></svg><span class="hidden min-[960px]:inline">{{ copy.about }}</span></UButton>
        <UPopover :open="openMenu === 'help'" :content="{ align: 'end', sideOffset: 16, collisionPadding: 16 }" :ui="{ content: 'header-panel z-[1200] w-[min(320px,calc(100vw-32px))]' }" @update:open="setMenu('help', $event)">
          <UButton color="neutral" variant="ghost" class="header-control hidden min-w-11 min-[700px]:flex" :aria-label="copy.help"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-5 shrink-0"><path :d="mdiHelpCircleOutline" /></svg><span class="hidden min-[960px]:inline">{{ copy.help }}</span></UButton>
          <template #content><div class="p-6"><h2 class="header-menu-heading">{{ copy.help }}</h2><p class="header-menu-description">{{ copy.helpText }}</p><UButton color="neutral" variant="ghost" class="header-menu-link" :to="localePath({ name: 'about' })">{{ copy.more }}<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" class="size-4 shrink-0"><path :d="mdiChevronRight" /></svg></UButton></div></template>
        </UPopover>
      </nav>
      <nav class="flex shrink-0 items-center border-portal-border min-[700px]:gap-1 min-[700px]:border-l min-[700px]:pl-2 min-[960px]:pl-3" :aria-label="en ? 'Language' : 'Keel'">
        <UButton v-for="language in ['en', 'et'] as const" :key="language" color="neutral" variant="ghost" :to="switchLocalePath(language)" :lang="language" :aria-label="language === 'en' ? 'English' : 'Eesti'" :aria-current="locale === language ? 'true' : undefined" :active="false" class="header-control min-w-9 px-2 text-[13px] min-[700px]:min-w-11" :class="locale === language ? 'bg-portal-mint font-bold text-portal-link' : ''">{{ language.toUpperCase() }}</UButton>
      </nav>
    </div>
  </header>
</template>

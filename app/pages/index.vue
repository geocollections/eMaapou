<script setup lang="ts">
import { mdiChevronRight, mdiMagnify, mdiOpenInNew } from "@mdi/js";
import {
  BROWSE_GEOLOGY_LIST,
  BROWSE_LAB_LIST,
  BROWSE_TAXON_LIST,
  SERVICES,
} from "~/constants";

definePageMeta({ layout: false });
const { locale } = useI18n();
const localePath = useLocalePath();
const en = computed(() => locale.value === "en");
const query = ref("");
// Ohesaare cliff photograph: Gennadi Baranov, CC BY 4.0.
// Source: https://geoloogia.info/file/30310
// Licence: https://creativecommons.org/licenses/by/4.0/
const heroImage =
  "https://files.geocollections.info/large/6d01a29b-e7b9-4fb0-be00-5565199307a1.jpg";
const photoAvailable = ref(true);
const heroPhoto = ref<HTMLImageElement | null>(null);
onMounted(() => {
  // Handle a failed image request that completed before hydration.
  if (heroPhoto.value?.complete && !heroPhoto.value.naturalWidth)
    photoAvailable.value = false;
});
const copy = computed(() =>
  en.value
    ? {
        title: "Explore geological data",
        intro:
          "Discover the stories behind rocks, fossils and landscapes. Explore geological collections, research datasets and places through the SARV geoscience data platform. Connect specimens, samples and scientific records to support research, learning and new discoveries.",
        search: "Search all data",
        placeholder: "Search specimens, samples, stratigraphy, localities…",
        submit: "Search",
        browse: "Browse data by category",
        collections: "Collections",
        collectionsText: "Physical collections and their documentation.",
        research: "Research data",
        researchText: "Samples, analyses and research datasets.",
        places: "Places & geology",
        placesText:
          "Geographical information, drillcores and stratigraphic units.",
        services: "E-services",
        allServices: "All e-services",
        external: "External website",
        externalNote:
          "Specialist databases and tools open on their own websites.",
        repositoryText:
          "Published geoscience datasets and their supporting files.",
        literatureText: "Find publications about Estonia’s geology.",
        workbenchText: "The data management environment for SARV.",
      }
    : {
        title: "Avasta geoloogilisi andmeid.",
        intro:
          "Avasta kivimite, fossiilide ja maastike lugu. Tutvu SARV geoloogiliste kollektsioonide, teadusandmestike ja leiukohtadega. Leia seoseid eksemplaride, proovide ja teaduskirjete vahel, et toetada uurimistööd, õppimist ja uusi avastusi.",
        search: "Otsi kõigist andmetest",
        placeholder: "Otsi eksemplare, proove, stratigraafiat, leiukohti…",
        submit: "Otsi",
        browse: "Sirvi andmeid kategooria järgi",
        collections: "Kollektsioonid",
        collectionsText: "Füüsilised kogud ja nende dokumentatsioon.",
        research: "Teadusandmed",
        researchText: "Proovid, analüüside tulemused ja teadusandmestikud.",
        places: "Paigad ja geoloogia",
        placesText: "Leiukohad, puursüdamikud ja stratigraafilised üksused.",
        services: "E-teenused",
        allServices: "Kõik e-teenused",
        external: "Väline veebileht",
        externalNote:
          "Erialased andmebaasid ja töövahendid avanevad eraldi veebilehtedel.",
        repositoryText: "Avaldatud geoloogilised andmestikud ja nende failid.",
        literatureText: "Leia Eesti geoloogiat käsitlevaid publikatsioone.",
        workbenchText: "Maapõue infosüsteemi SARV andmehalduse töölaud.",
      },
);
const categories = computed(() => [
  {
    id: "collections",
    title: copy.value.collections,
    description: copy.value.collectionsText,
    route: "specimen",
    links: BROWSE_TAXON_LIST.filter(
      (item) => item.routeName !== "stratigraphy",
    ),
  },
  {
    id: "research",
    title: copy.value.research,
    description: copy.value.researchText,
    route: "sample",
    links: BROWSE_LAB_LIST.filter((item) =>
      ["sample", "analytical-data", "dataset"].includes(item.routeName),
    ),
  },
  {
    id: "places",
    title: copy.value.places,
    description: copy.value.placesText,
    route: "locality",
    links: [
      ...BROWSE_GEOLOGY_LIST.filter((item) =>
        ["locality", "drillcore"].includes(item.routeName),
      ),
      ...BROWSE_TAXON_LIST.filter((item) => item.routeName === "stratigraphy"),
    ],
  },
]);
const featuredServices = computed(() => [
  {
    id: "doi",
    service: SERVICES.doi,
    description: copy.value.repositoryText,
  },
  {
    id: "kirjandus",
    service: SERVICES.kirjandus,
    description: copy.value.literatureText,
  },
  {
    id: "sarv",
    service: SERVICES.sarv,
    description: copy.value.workbenchText,
  },
]);
async function search() {
  const value = query.value.trim();
  if (value)
    await navigateTo(localePath({ name: "search", query: { q: value } }));
}
useHead(() => ({
  title: en.value
    ? "Geoscience Data Estonia"
    : "Eesti geoloogiliste andmete portaal",
}));
useSeoMeta({ description: () => copy.value.intro });
</script>

<template>
  <div
    class="flex min-h-screen flex-col bg-portal-background font-sans text-portal-text"
  >
    <AppBar />
    <UContainer
      as="main"
      class="w-full max-w-7xl flex-1 px-4 pt-8 pb-10 sm:px-6 lg:px-8 lg:pt-10 lg:pb-12"
    >
      <section
        aria-labelledby="home-title"
        class="relative isolate rounded-portal-card"
      >
        <div
          v-if="photoAvailable"
          class="pointer-events-none absolute inset-0 overflow-hidden rounded-portal-card"
          aria-hidden="true"
        >
          <img
            ref="heroPhoto"
            :src="heroImage"
            alt=""
            width="2000"
            height="1333"
            fetchpriority="high"
            class="h-full w-full object-cover object-[65%_50%] opacity-25 [mask-image:linear-gradient(to_right,transparent_0%,black_100%)] lg:opacity-100 lg:[mask-image:linear-gradient(to_right,transparent_0%,transparent_30%,black_78%)]"
            @error="photoAvailable = false"
          />
        </div>
        <div class="relative max-w-[680px] py-8 sm:py-10 lg:py-14">
          <span aria-hidden="true" class="mb-6 block h-1 w-12 rounded-full bg-portal-primary"></span>
          <h1
            id="home-title"
            class="mb-5 max-w-[620px] text-[32px] leading-[1.15] font-bold tracking-[-0.035em] text-portal-heading lg:text-5xl"
          >
            {{ copy.title }}
          </h1>
          <p class="mb-8 max-w-[520px] text-base leading-7 text-portal-text">
            {{ copy.intro }}
          </p>
          <form
            role="search"
            :aria-label="copy.search"
            class="flex w-full items-center gap-2 rounded-portal-control border border-portal-border-hover bg-portal-background p-1 shadow-[0_8px_28px_-16px_rgba(16,33,58,0.3)] focus-within:outline-3 focus-within:outline-offset-3 focus-within:outline-portal-focus"
            @submit.prevent="search"
          >
            <label class="sr-only" for="home-search">{{ copy.search }}</label>
            <UInput
              id="home-search"
              v-model="query"
              type="search"
              :placeholder="copy.placeholder"
              required
              color="neutral"
              variant="none"
              class="min-w-0 flex-1"
              :ui="{
                base: 'h-11 rounded-portal-control bg-transparent pl-10 text-base text-portal-text placeholder:text-portal-muted ring-0 focus-visible:ring-0',
                leading: 'pl-3',
              }"
            >
              <template #leading
                ><svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  class="size-5 text-portal-muted"
                >
                  <path :d="mdiMagnify" /></svg
              ></template>
            </UInput>
            <UButton
              type="submit"
              color="neutral"
              variant="solid"
              class="header-focus h-11 shrink-0 justify-center rounded-portal-control bg-portal-primary px-5 text-sm font-semibold text-white hover:bg-portal-primary-hover"
              >{{ copy.submit }}</UButton
            >
          </form>
        </div>
      </section>

      <section aria-labelledby="home-browse-title" class="mt-10 lg:mt-14">
        <h2
          id="home-browse-title"
          class="mb-5 text-[22px] leading-snug font-semibold tracking-tight text-portal-heading md:text-2xl"
        >
          {{ copy.browse }}
        </h2>
        <div class="grid gap-4 md:grid-cols-3">
          <UCard
            v-for="(category, index) in categories"
            :key="category.id"
            as="article"
            :ui="{
              root: ['h-full rounded-portal-card border border-portal-border shadow-none ring-0 transition-[border-color,box-shadow] duration-200 hover:border-portal-primary/40 hover:shadow-[0_12px_32px_-24px_rgba(16,33,58,0.35)] focus-within:border-portal-focus', index === 0 ? 'bg-portal-mint/60' : index === 1 ? 'bg-portal-subtle' : 'bg-portal-selected'].join(' '),
              body: 'flex h-full flex-col p-6 sm:p-7',
            }"
          >
            <ULink
              raw
              :to="localePath({ name: category.route })"
              class="header-focus group flex min-h-11 items-center rounded-portal-control text-portal-heading no-underline"
            >
              <h3
                class="text-xl leading-snug font-semibold tracking-tight group-hover:text-portal-link group-hover:underline group-hover:underline-offset-4"
              >
                {{ category.title }}
              </h3>
            </ULink>
            <p
              class="mt-2 mb-5 flex-1 text-sm leading-relaxed text-portal-muted"
            >
              {{ category.description }}
            </p>
            <nav
              :aria-label="category.title"
              class="flex flex-wrap items-center gap-2"
            >
              <ULink
                v-for="item in category.links"
                :key="item.routeName"
                raw
                :to="localePath({ name: item.routeName })"
                class="header-focus inline-flex min-h-11 items-center rounded-portal-control bg-portal-background/80 px-3 text-sm font-medium text-portal-link transition-colors hover:bg-portal-background"
                >{{ $t(item.label) }}</ULink
              >
            </nav>
          </UCard>
        </div>
      </section>

      <div
        class="mt-12 grid items-stretch gap-8 lg:mt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-10"
      >
        <TheNewsCard />
        <UCard
          as="section"
          aria-labelledby="home-services-title"
          :ui="{
            root: 'h-full rounded-portal-card border border-portal-border bg-portal-subtle p-6 shadow-none ring-0 divide-portal-border sm:p-7',
            header: 'p-0 pb-4 sm:p-0 sm:pb-4',
            body: 'p-0 pt-2 sm:p-0 sm:pt-2',
          }"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-x-3">
              <h2
                id="home-services-title"
                class="text-[22px] font-semibold tracking-tight text-portal-heading md:text-2xl"
              >
                {{ copy.services }}
              </h2>
              <UPopover
                :content="{ align: 'end', sideOffset: 8, collisionPadding: 16 }"
                :ui="{
                  content:
                    'header-panel z-[1200] w-[min(600px,calc(100vw-32px))]',
                }"
              >
                <UButton
                  color="neutral"
                  variant="ghost"
                  class="header-focus min-h-11 gap-1 rounded-portal-control px-0 text-sm font-medium text-portal-link hover:bg-transparent hover:underline"
                  >{{ copy.allServices
                  }}<svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    class="size-4"
                  >
                    <path :d="mdiChevronRight" /></svg
                ></UButton>
                <template #content>
                  <nav
                    class="max-h-[min(480px,calc(100dvh-96px))] overflow-y-auto p-5"
                    :aria-label="copy.allServices"
                  >
                    <h3
                      class="mb-2 text-base font-semibold text-portal-heading"
                    >
                      {{ copy.allServices }}
                    </h3>
                    <p class="mb-4 text-sm leading-relaxed">
                      {{ copy.externalNote }}
                    </p>
                    <ul
                      class="grid list-none gap-x-4 gap-y-1 p-0 sm:grid-cols-2"
                    >
                      <li v-for="id in SERVICES.ids" :key="id">
                        <ULink
                          raw
                          :href="SERVICES[id].href"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="header-focus flex min-h-11 items-center gap-2 rounded-portal-control px-2 py-2 text-sm text-portal-link hover:bg-portal-selected"
                          ><span class="min-w-0 flex-1">{{
                            $t(SERVICES[id].title)
                          }}</span
                          ><svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                            class="size-4 shrink-0"
                          >
                            <path :d="mdiOpenInNew" /></svg
                          ><span class="sr-only"
                            >({{ copy.external }})</span
                          ></ULink
                        >
                      </li>
                    </ul>
                  </nav>
                </template>
              </UPopover>
            </div>
          </template>
          <ul class="m-0 list-none space-y-1 p-0">
            <li v-for="item in featuredServices" :key="item.id">
              <ULink
                raw
                :href="item.service.href"
                target="_blank"
                rel="noopener noreferrer"
                class="header-focus group -mx-3 flex min-h-11 items-start gap-3 rounded-portal-control px-3 py-4 text-portal-text no-underline transition-colors hover:bg-portal-subtle"
              >
                <div class="min-w-0 flex-1">
                  <h3
                    class="mb-1 text-base leading-snug font-semibold tracking-tight text-portal-heading group-hover:text-portal-link md:text-lg"
                  >
                    {{ $t(item.service.title) }}
                  </h3>
                  <p class="text-sm leading-relaxed">{{ item.description }}</p>
                </div>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  class="mt-1 size-4 shrink-0 text-portal-muted"
                >
                  <path :d="mdiOpenInNew" /></svg
                ><span class="sr-only">({{ copy.external }})</span>
              </ULink>
            </li>
          </ul>
        </UCard>
      </div>
    </UContainer>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { mdiOpenInNew, mdiChevronRight, mdiHomeOutline } from "@mdi/js";
import { SERVICES } from "~/constants";

definePageMeta({ layout: false });
const { locale } = useI18n();
const localePath = useLocalePath();
const en = computed(() => locale.value === "en");
const text = computed(() =>
  en.value
    ? {
        home: "Home",
        about: "About",
        title: "About eMaapõu",
        subtitle: "A window into geological information.",
        intro:
          "eMaapõu provides direct access to geological data hosted in the SARV geoscience data platform, together with links to external resources and applications.",
        dataDescription:
          "Explore geological collections, fossil specimens, rock samples, drillcores, localities, analytical data and photographs. The portal brings these records together with links to specialist databases and publications.",
        searchDescription:
          "Use the global search to get started, or browse a data group to explore a particular topic. Detailed searches let you refine your query, view records on a map, browse images and export data.",
        photo: "Sandstone cliffs at Kallaste beside Lake Peipus",
        explore: "Explore geological information",
        collections: "Collections",
        collectionsText:
          "Physical and digital collections of geological material.",
        collectionsAction: "Open collections",
        research: "Research data",
        researchText:
          "Research material, analytical results and derived datasets.",
        researchAction: "Open research data",
        places: "Places & stratigraphy",
        placesText: "Geographical information and stratigraphic context.",
        placesAction: "Open places & stratigraphy",
        sarv: "The SARV data platform",
        sarvText:
          "SARV is the geoscience data platform behind eMaapõu. Research institutions and museums use it to document, manage and share their collections and research data. The institutions below hold and maintain their own collections; eMaapõu provides a common way to discover their records.",
        institutions: "Institutions using SARV",
        institutionAction: "Open institution",
        providers: "Other geological information providers",
        providersNote: "External resources",
        website: "Open website",
        resources: "Data collections and external services",
        browse: "Browse data collections",
        browseText: "Search records within the portal.",
        browseAction: "Browse collections",
        services: "Explore e-services",
        servicesText:
          "Open specialist databases and applications on other websites.",
        servicesAction: "Open e-services",
        externalNote: "External services open on their own websites.",
      }
    : {
        home: "Avaleht",
        about: "Tutvustus",
        title: "eMaapõust",
        subtitle: "Aken geoloogiliste andmete juurde.",
        intro:
          "eMaapõu annab ligipääsu maapõue infosüsteemis SARV talletatud geoloogilistele andmetele ning koondab viiteid välistele andmekogudele ja rakendustele.",
        dataDescription:
          "Portaalist leiad geoloogilised kollektsioonid, fossiilid, kivimiproovid, puursüdamikud, leiukohad, analüüsiandmed ja fotod. Nendega koos on kättesaadavad viited erialastele andmebaasidele ja geoloogia-alastele publikatsioonidele.",
        searchDescription:
          "Alusta üldotsingust või vali sirvimismenüüst huvipakkuv andmerühm. Täpsemas otsingus saad päringut piiritleda, vaadata kirjeid kaardil, sirvida pilte ja eksportida andmeid.",
        photo: "Kallaste liivakivipaljand Peipsi järve kaldal",
        explore: "Avasta geoloogilisi andmeid",
        collections: "Kollektsioonid",
        collectionsText:
          "Geoloogilise materjali füüsilised ja digitaalsed kollektsioonid.",
        collectionsAction: "Ava kollektsioonid",
        research: "Teadusandmed",
        researchText: "Uurimismaterjal, analüüside tulemused ja andmestikud.",
        researchAction: "Ava teadusandmed",
        places: "Paigad ja stratigraafia",
        placesText: "Geograafiline teave ja stratigraafiline kontekst.",
        placesAction: "Ava paigad ja stratigraafia",
        sarv: "Maapõue infosüsteem SARV",
        sarvText:
          "SARV on eMaapõu aluseks olev maapõue infosüsteem, mida teadusasutused ja muuseumid kasutavad kollektsioonide ja teadusandmete kirjeldamiseks, haldamiseks ning jagamiseks. Allpool loetletud asutused hoiavad ja täiendavad oma kogusid; eMaapõu pakub ühist võimalust nende andmete leidmiseks.",
        institutions: "SARVe kasutavad asutused",
        institutionAction: "Ava asutus",
        providers: "Teised geoloogiliste andmete pakkujad",
        providersNote: "Välised allikad",
        website: "Ava veebileht",
        resources: "Andmekogud ja välised teenused",
        browse: "Sirvi andmekogusid",
        browseText: "Otsi kirjeid eMaapõu portaalist.",
        browseAction: "Sirvi kollektsioone",
        services: "Avasta e-teenuseid",
        servicesText:
          "Erialased andmebaasid ja rakendused teistel veebilehtedel.",
        servicesAction: "Ava e-teenused",
        externalNote: "Välised teenused avanevad eraldi veebilehtedel.",
      },
);
const groups = computed(() => [
  {
    title: text.value.collections,
    description: text.value.collectionsText,
    action: text.value.collectionsAction,
    path: "/specimen",
  },
  {
    title: text.value.research,
    description: text.value.researchText,
    action: text.value.researchAction,
    path: "/sample",
  },
  {
    title: text.value.places,
    description: text.value.placesText,
    action: text.value.placesAction,
    path: "/locality",
  },
]);
const institutions = computed(() => [
  {
    title: en.value
      ? "TalTech Department of Geology"
      : "TalTechi geoloogia instituut",
    path: "/institution/git",
  },
  {
    title: en.value
      ? "University of Tartu Natural History Museum"
      : "Tartu Ülikooli loodusmuuseum",
    path: "/institution/tug",
  },
  {
    title: en.value
      ? "University of Tartu Department of Geology"
      : "Tartu Ülikooli geoloogia osakond",
    path: "/institution/tugo",
  },
  {
    title: en.value
      ? "Estonian Museum of Natural History"
      : "Eesti Loodusmuuseum",
    path: "/institution/elm",
  },
]);
const providers = computed(() => [
  {
    title: en.value
      ? "Geological Survey of Estonia"
      : "Eesti Geoloogiateenistus",
    href: "https://egt.ee",
  },
  {
    title: en.value ? "Estonian Land Board" : "Maa-amet",
    href: "https://maaamet.ee",
  },
  {
    title: en.value ? "Environmental Board" : "Keskkonnaamet",
    href: "https://keskkonnaamet.ee",
  },
]);
useHead(() => ({ title: text.value.title }));
useSeoMeta({ description: () => text.value.intro });
</script>

<template>
  <div class="flex min-h-screen flex-col bg-portal-background font-sans text-portal-text">
    <AppBar />
    <main
      class="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-10 sm:px-6 lg:px-8 lg:pb-12"
    >
      <nav
        :aria-label="en ? 'Breadcrumb' : 'Asukoharada'"
        class="mb-6 flex items-center gap-2 text-[13px] text-portal-muted"
      >
        <ULink
          :to="localePath('/')"
          raw
          class="header-focus inline-flex min-h-6 items-center gap-2 text-portal-text hover:text-portal-link"
          ><svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-4"
            aria-hidden="true"
          >
            <path :d="mdiHomeOutline" /></svg
          >{{ text.home }}</ULink
        >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          class="size-4"
          aria-hidden="true"
        >
          <path :d="mdiChevronRight" /></svg
        ><span aria-current="page">{{ text.about }}</span>
      </nav>
      <section
        aria-labelledby="about-title"
        class="mb-8 grid items-stretch gap-6 md:grid-cols-[1.2fr_1fr] md:gap-8"
      >
        <div>
          <h1
            id="about-title"
            class="mb-4 font-sans text-[32px] leading-[1.15] font-bold tracking-[-0.035em] text-portal-heading md:text-4xl"
          >
            {{ text.title }}
          </h1>
          <p
            class="mb-4 max-w-lg text-xl leading-snug tracking-tight text-portal-link md:text-[22px]"
          >
            {{ text.subtitle }}
          </p>
          <div class="max-w-[680px] space-y-4 text-base leading-relaxed">
            <p>{{ text.intro }}</p>
            <p>{{ text.dataDescription }}</p>
            <p>{{ text.searchDescription }}</p>
          </div>
        </div>
        <!-- Kallaste cliff, Gennadi Baranov, CC BY 4.0.
             Source: https://geoloogia.info/en/file/25899
             Licence: https://creativecommons.org/licenses/by/4.0/ -->
        <img
          src="https://files.geocollections.info/large/6198cc14-5312-4fb4-8e4c-1b9820d6cd46.jpg"
          :alt="text.photo"
          width="3320"
          height="2136"
          class="h-52 w-full rounded-portal-card object-cover md:h-full md:max-h-[360px] md:min-h-64"
          fetchpriority="high"
        />
      </section>
      <section aria-labelledby="explore-title" class="mb-10 lg:mb-12">
        <h2
          id="explore-title"
          class="mb-5 font-sans text-[22px] leading-snug font-semibold tracking-tight text-portal-heading md:text-2xl"
        >
          {{ text.explore }}
        </h2>
        <div class="grid gap-4 md:grid-cols-3">
          <ULink
            v-for="group in groups"
            :key="group.path"
            :to="localePath(group.path)"
            raw
            class="about-card group bg-portal-subtle md:min-h-40 md:flex-col md:p-6"
          >
            <div class="flex min-w-0 flex-1 flex-col">
              <h3 class="about-card-title tracking-tight">{{ group.title }}</h3>
              <p class="mb-4 flex-1 text-sm leading-relaxed">
                {{ group.description }}
              </p>
              <span class="about-card-action"
                >{{ group.action
                }}<svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-4"
                  aria-hidden="true"
                >
                  <path :d="mdiChevronRight" /></svg
              ></span>
            </div>
          </ULink>
        </div>
      </section>
      <section aria-labelledby="sarv-title" class="mb-10 lg:mb-12">
        <h2
          id="sarv-title"
          class="mb-3 font-sans text-[22px] leading-snug font-semibold tracking-tight text-portal-heading md:text-2xl"
        >
          {{ text.sarv }}
        </h2>
        <p class="mb-8 max-w-[840px] text-base leading-relaxed">
          {{ text.sarvText }}
        </p>
        <div class="grid gap-8 lg:grid-cols-[1.7fr_1fr] lg:gap-10">
          <section class="min-w-0 py-2" aria-labelledby="institutions-title">
            <h3
              id="institutions-title"
              class="mb-5 font-sans text-lg leading-snug font-semibold text-portal-heading"
            >
              {{ text.institutions }}
            </h3>
            <div class="grid gap-4 sm:grid-cols-2">
              <ULink
                v-for="institution in institutions"
                :key="institution.path"
                :to="localePath(institution.path)"
                raw
                class="about-card group min-h-24 items-center border border-portal-border p-5"
              >
                <div>
                  <h4
                    class="mb-2 font-sans text-sm leading-snug font-semibold text-portal-heading"
                  >
                    {{ institution.title }}
                  </h4>
                  <span class="about-card-action"
                    >{{ text.institutionAction
                    }}<svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-4"
                      aria-hidden="true"
                    >
                      <path :d="mdiChevronRight" /></svg
                  ></span>
                </div>
              </ULink>
            </div>
          </section>
          <section
            class="rounded-portal-card bg-portal-subtle p-5 md:p-6"
            aria-labelledby="providers-title"
          >
            <p class="mb-2 text-[13px] font-medium text-portal-link">
              {{ text.providersNote }}
            </p>
            <h3
              id="providers-title"
              class="mb-4 font-sans text-lg leading-snug font-semibold text-portal-heading"
            >
              {{ text.providers }}
            </h3>
            <div class="grid gap-2">
              <ULink
                v-for="provider in providers"
                :key="provider.href"
                :to="provider.href"
                target="_blank"
                rel="noopener noreferrer"
                raw
                class="about-card group items-center gap-3 p-3"
              >
                <div>
                  <h4
                    class="mb-1 font-sans text-sm leading-snug font-semibold text-portal-heading"
                  >
                    {{ provider.title }}
                  </h4>
                  <span class="about-card-action"
                    >{{ text.website
                    }}<svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-4"
                      aria-hidden="true"
                    >
                      <path :d="mdiOpenInNew" /></svg
                  ></span>
                </div>
              </ULink>
            </div>
          </section>
        </div>
      </section>
      <section aria-labelledby="resources-title" class="pt-0">
        <h2
          id="resources-title"
          class="mb-5 font-sans text-[22px] leading-snug font-semibold tracking-tight text-portal-heading md:text-2xl"
        >
          {{ text.resources }}
        </h2>
        <div class="grid gap-4 md:grid-cols-2">
          <ULink
            :to="localePath('/specimen')"
            raw
            class="about-card group bg-portal-subtle"
          >
            <div>
              <h3 class="about-card-title tracking-tight">{{ text.browse }}</h3>
              <p class="mb-2 text-sm leading-relaxed">{{ text.browseText }}</p>
              <span class="about-card-action"
                >{{ text.browseAction
                }}<svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="size-4"
                  aria-hidden="true"
                >
                  <path :d="mdiChevronRight" /></svg
              ></span></div
          ></ULink>
          <UPopover
            :content="{ align: 'end', collisionPadding: 16 }"
            :ui="{
              content: 'header-panel z-[1200] w-[min(600px,calc(100vw-32px))]',
            }"
          >
            <UButton
              color="neutral"
              variant="ghost"
              class="about-card group w-full bg-portal-subtle items-start justify-start p-5 text-left font-normal"
              ><span
                ><span class="about-card-title block">{{ text.services }}</span
                ><span class="mb-2 block text-sm leading-relaxed">{{
                  text.servicesText
                }}</span
                ><span class="about-card-action"
                  >{{ text.servicesAction
                  }}<svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="size-4"
                    aria-hidden="true"
                  >
                    <path :d="mdiChevronRight" /></svg></span></span
            ></UButton>
            <template #content
              ><div class="max-h-[65dvh] overflow-y-auto p-6">
                <h3 class="header-menu-heading">{{ text.services }}</h3>
                <p class="header-menu-description">{{ text.externalNote }}</p>
                <div class="grid sm:grid-cols-2">
                  <UButton
                    v-for="id in SERVICES.ids"
                    :key="id"
                    :href="SERVICES[id].href"
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="ghost"
                    color="neutral"
                    class="header-menu-link"
                    >{{ $t(SERVICES[id].title)
                    }}<svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="size-4 shrink-0"
                      aria-hidden="true"
                    >
                      <path :d="mdiOpenInNew" /></svg
                  ></UButton>
                </div></div
            ></template>
          </UPopover>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>
